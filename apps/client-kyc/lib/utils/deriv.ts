import fetchHandler from "@repo/lib/handlers/fetch";
import logger from "./logger";

const DERIV_OAUTH_AUTHORIZE_URL = "https://auth.deriv.com/oauth2/auth";
const DERIV_OAUTH_TOKEN_URL = "https://auth.deriv.com/oauth2/token";
const DERIV_PAYMENT_AGENT_CLIENT_URL =
	"https://api.derivws.com/payment-agents/v1/clients/me";
const DERIV_OAUTH_SCOPE = "payment";

const base64UrlEncode = (bytes: Uint8Array) => {
	let binary = "";
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});

	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};

export const generateDerivOAuthState = () =>
	base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));

export const generateDerivPkcePair = async () => {
	const codeVerifier = base64UrlEncode(
		crypto.getRandomValues(new Uint8Array(32)),
	);
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(codeVerifier),
	);
	const codeChallenge = base64UrlEncode(new Uint8Array(digest));

	return { codeVerifier, codeChallenge };
};

type BuildDerivAuthorizeUrlParams = {
	appId: string;
	redirectUri: string;
	state: string;
	codeChallenge: string;
};

export const buildDerivAuthorizeUrl = ({
	appId,
	redirectUri,
	state,
	codeChallenge,
}: BuildDerivAuthorizeUrlParams) => {
	const params = new URLSearchParams({
		response_type: "code",
		client_id: appId,
		redirect_uri: redirectUri,
		scope: DERIV_OAUTH_SCOPE,
		state,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	});

	return `${DERIV_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
};

type ExchangeDerivAuthorizationCodeParams = {
	appId: string;
	code: string;
	codeVerifier: string;
	redirectUri: string;
};

export const exchangeDerivAuthorizationCode = async ({
	appId,
	code,
	codeVerifier,
	redirectUri,
}: ExchangeDerivAuthorizationCodeParams) => {
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: appId,
		code,
		code_verifier: codeVerifier,
		redirect_uri: redirectUri,
	});

	logger.info(body);

	const { access_token: accessToken } = await fetchHandler<{
		access_token: string;
	}>(DERIV_OAUTH_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: body.toString(),
	});

	logger.info(accessToken);

	return accessToken;
};

export const setDerivShowRealName = (accessToken: string) =>
	fetchHandler(DERIV_PAYMENT_AGENT_CLIENT_URL, {
		method: "PATCH",
		headers: { Authorization: `Bearer ${accessToken}` },
		body: JSON.stringify({ data: { show_real_name: true } }),
	});
