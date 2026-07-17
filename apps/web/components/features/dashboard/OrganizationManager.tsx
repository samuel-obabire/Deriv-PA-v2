"use client";

import { useRouter } from "next/navigation";
import { createOrganization } from "@/lib/actions/organization/createOrganization";
import { setUserActiveOrganization } from "@/lib/actions/organization/setActiveOrganization";
import {
	organization,
	useActiveOrganization,
	useListOrganizations,
} from "@/lib/auth-client";
import CreateOrganizationForm from "./CreateOrganizationForm";
import OrganizationSwitcher from "./OrganizationSwitcher";

const OrganizationManager = () => {
	const {
		data: activeOrganization,
		isRefetching,
		refetch: refetchActiveOrg,
	} = useActiveOrganization();

	const { data: orgs, refetch: refetchOrgList } = useListOrganizations();

	const router = useRouter();

	const syncActiveOrganization = async (orgId: string) => {
		// disableSignal prevents better-auth's cookie-cached refetch of
		// activeOrganization from racing and possibly overwriting the
		// disableCookieCache refetched data.
		await organization.setActive(
			{ organizationId: orgId },
			{ disableSignal: true },
		);

		await Promise.all([
			setUserActiveOrganization({ orgId }),
			refetchOrgList({ query: { disableCookieCache: true } }),
			refetchActiveOrg({ query: { disableCookieCache: true } }),
		]);

		router.refresh();
	};

	const onOrgCreate = (newOrgId: string) => syncActiveOrganization(newOrgId);

	const onOrgSwitch = (newActiveOrgId: string) =>
		syncActiveOrganization(newActiveOrgId);

	return (
		<div className="max-[500px]:mx-auto max-w-md space-y-4">
			<OrganizationSwitcher
				orgs={orgs ?? []}
				activeOrgId={activeOrganization?.id}
				onOrgSwitch={onOrgSwitch}
				isSwitching={isRefetching}
			/>

			<CreateOrganizationForm
				onOrgCreate={onOrgCreate}
				handleOrgCreate={createOrganization}
			/>
		</div>
	);
};

export default OrganizationManager;
