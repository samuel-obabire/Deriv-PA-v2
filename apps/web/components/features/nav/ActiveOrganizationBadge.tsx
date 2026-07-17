"use client";

import { Spinner } from "@repo/ui";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActiveOrganization } from "@/lib/auth-client";
import ROUTES from "@/lib/constants/routes";

const ActiveOrganizationBadge = () => {
	const { data: activeOrganization, isPending } = useActiveOrganization();

	const router = useRouter();

	const navigate = () => {
		router.push(ROUTES.ORGANIZATION);
	};

	if (isPending) {
		return (
			<div className="flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1.5">
				<Spinner className="size-4" />
			</div>
		);
	}

	if (!activeOrganization) return null;

	const initial = activeOrganization.name?.[0]?.toUpperCase();

	return (
		<button type="button" onClick={navigate}>
			<div className="flex items-center gap-2.5 rounded-full border border-border bg-accent/30 py-1.5 pl-1.5 pr-3.5 transition-colors hover:bg-accent">
				<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
					{initial ? (
						<span className="text-12-semibold">{initial}</span>
					) : (
						<Building2 className="size-3.5" />
					)}
				</div>

				<div className="flex min-w-0 flex-col leading-tight">
					<span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
						Org
					</span>
					<span className="text-14-medium truncate max-w-40 text-foreground">
						{activeOrganization.name}
					</span>
				</div>
			</div>
		</button>
	);
};

export default ActiveOrganizationBadge;
