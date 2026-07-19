const CLIENT_ID = "YOUR_CLIENT_ID";
const REDIRECT_URI = "https://your-app.com/callback";

type TokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: string;
};

// --- PKCE Helper Functions ---
function generateCodeVerifier() {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

async function generateCodeChallenge(verifier: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

// Step 1: Generate PKCE values and redirect user to authorization endpoint
const codeVerifier = generateCodeVerifier();
const codeChallenge = await generateCodeChallenge(codeVerifier);
const state = crypto.randomUUID();

sessionStorage.setItem("code_verifier", codeVerifier);
sessionStorage.setItem("oauth_state", state);

const authUrl = new URL("https://auth.deriv.com/oauth2/auth");
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", "trade account_manage");
authUrl.searchParams.set("state", state);
authUrl.searchParams.set("code_challenge", codeChallenge);
authUrl.searchParams.set("code_challenge_method", "S256");

window.location.href = authUrl.toString();

// Step 3: Handle the callback
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get("code");
const returnedState = urlParams.get("state");

const savedState = sessionStorage.getItem("oauth_state");
if (returnedState !== savedState) {
	throw new Error("State mismatch: possible CSRF attack");
}

const obtainAccessToken = async (authorizationCode: string) => {
	const savedVerifier = sessionStorage.getItem("code_verifier");

	if (!savedVerifier) throw new Error("unable to verify state.");

	const tokenResponse = await fetch("https://auth.deriv.com/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			client_id: CLIENT_ID,
			code: authorizationCode,
			redirect_uri: REDIRECT_URI,
			code_verifier: savedVerifier as string,
		}),
	});

	if (!tokenResponse.ok) throw new Error("...");

	const tokenData = (await tokenResponse.json()) as TokenResponse;
	const accessToken = tokenData.access_token;
};

// const tokenData = await tokenResponse.json();
// const accessToken = tokenData.access_token;
// console.log(
// 	"Access token obtained, expires in",
// 	tokenData.expires_in,
// 	"seconds",
// );

// Step 6: Use the access token for authenticated API calls
// const response = await fetch(
// 	"https://api.derivws.com/trading/v1/options/accounts",
// 	{
// 		method: "GET",
// 		headers: {
// 			Authorization: `Bearer ${accessToken}`,
// 			"Deriv-App-ID": CLIENT_ID,
// 			"Content-Type": "application/json",
// 		},
// 	},
// );

// const result = await response.json();
// console.log("Authenticated API call successful:", result);
