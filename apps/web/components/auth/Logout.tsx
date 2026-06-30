"use client";

import { Button } from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ROUTES from "@/lib/constants/routes";

const Logout = () => {
	const handleSignout = async () => {
		const [result, signOutError] = await tryCatch(() => authClient.signOut());

		if (signOutError) toast.error(signOutError.message);

		if (result?.data?.success) {
			window.location.replace(ROUTES.SIGN_IN);
		} else {
			toast.error(result?.error?.message);
		}
	};

	return (
		<Button
			onClick={handleSignout}
			variant="ghost"
			size="sm"
			className="gap-1.5 text-muted-foreground hover:text-foreground"
		>
			<LogOut className="size-3.5" />
			Sign out
		</Button>
	);
};

export default Logout;
