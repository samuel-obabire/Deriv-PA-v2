"use client";

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
	const { data: activeOrganization, isRefetching } = useActiveOrganization();

	const { data: orgs, refetch } = useListOrganizations();

	const onOrgCreate = async (newOrgId: string) => {
		await Promise.all([
			organization.setActive({ organizationId: newOrgId }),
			setUserActiveOrganization({ orgId: newOrgId }),
		]);

		await refetch();
	};

	const onOrgSwitch = async (newActiveOrgId: string) => {
		await Promise.all([
			organization.setActive({ organizationId: newActiveOrgId }),
			setUserActiveOrganization({ orgId: newActiveOrgId }),
		]);
	};

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
