"use client";

import Signup from "@/components/forms/Signup";
import { signUp } from "@/lib/actions/auth/signup";

const SignupPage = () => {
	return (
		<div className="container flex flex-center h-screen">
			<Signup onSubmit={signUp} />
		</div>
	);
};

export default SignupPage;
