"use client";

import { tryCatch } from "@repo/utils";
import { Building2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type Organization } from "@/lib/auth-client";

type OrganizationSwitcherProps = {
	orgs: Organization[];
	activeOrgId?: string;
	isSwitching: boolean;
	onOrgSwitch: (orgId: string) => Promise<void>;
};

const OrganizationSwitcher = ({
	orgs,
	activeOrgId,
	onOrgSwitch,
	isSwitching,
}: OrganizationSwitcherProps) => {
	const [isPending, startTransition] = useTransition();

	const handleSwitch = async (orgId: string) => {
		if (orgId === activeOrgId) return;

		startTransition(async () => {
			const [, error] = await tryCatch(() => onOrgSwitch(orgId));

			if (error) toast.error(error.message ?? "Unable to complete request");
		});
	};

	return (
		<Select
			value={activeOrgId ?? ""}
			onValueChange={handleSwitch}
			disabled={isSwitching || isPending}
		>
			<SelectTrigger className="text-16-medium! w-full max-w-md text-left! no-ring">
				{isPending || isSwitching ? (
					<Loader2 className="size-4 animate-spin text-muted-foreground" />
				) : (
					<Building2 className="size-4 text-muted-foreground" />
				)}
				<SelectValue placeholder="Switch organization" />
			</SelectTrigger>

			<SelectContent position="popper" align="start" className="text-32-normal">
				{orgs?.map((org) => (
					<SelectItem
						key={org.id}
						value={org.id}
						className="py-2 text-16-medium!"
					>
						<span className="font-semibold leading-tight text-foreground">
							{org.name}
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default OrganizationSwitcher;
