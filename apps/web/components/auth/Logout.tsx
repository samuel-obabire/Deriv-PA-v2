"use client";

import { tryCatch } from "@repo/utils";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ROUTES from "@/lib/constants/routes";
import { Button } from "../ui/button";

const Logout = () => {
	const router = useRouter();

	const handleSignout = async () => {
		const [result, signOutError] = await tryCatch(
			authClient.signOut(),
		);

		if (signOutError) toast.error(signOutError.message);

		if (result?.data?.success) {
			router.replace(ROUTES.SIGN_IN);
		} else {
			toast.error(result?.error?.message);
		}
	};

	return (
		<Button onClick={handleSignout} variant="ghost" className="cursor-pointer">
			<LogOut className="font-bold size-6 text-primary" /> Logout
		</Button>
	);
};

export default Logout;
