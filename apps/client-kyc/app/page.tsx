import KycSignIn from "@/components/features/kyc/KycSignIn";
import ROUTES from "@/lib/constants/routes";

const SignInPage = async ({ searchParams }: PageProps<typeof ROUTES.HOME>) => {
	const { callbackUrl } = await searchParams;

	return (
		<KycSignIn
			callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined}
		/>
	);
};

export default SignInPage;
