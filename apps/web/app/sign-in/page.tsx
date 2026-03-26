"use client";

import SignIn from "@/components/forms/SignIn";
import { signIn } from "@/lib/actions/auth/signin";

const SignInPage = () => {
	return (
		<div className="container flex flex-center h-screen">
			<SignIn onSubmit={signIn} />
		</div>
	);
};

export default SignInPage;
