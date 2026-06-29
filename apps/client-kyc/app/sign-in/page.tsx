import KycSignIn from "@/components/KycSignIn";
import ROUTES from "@/lib/constants/routes";

const SignInPage = async ({
	searchParams,
}: PageProps<typeof ROUTES.SIGN_IN>) => {
	const { callbackUrl } = await searchParams;

	return (
		<KycSignIn
			callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined}
		/>
	);
};

export default SignInPage;
