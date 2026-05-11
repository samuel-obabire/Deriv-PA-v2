import { RoleNames, roles, type Statements } from "@/lib/permissions";
import { sidebarConfig } from "./config";
import { SidebarGroup, SidebarPermission } from "./types";

const hasRoleStatement = (
	roleName: RoleNames,
	{ resource, action }: SidebarPermission,
): boolean => {
	const role = roles[roleName as keyof typeof roles];
	const stmts = role.statements as Partial<
		Record<keyof Statements, readonly string[]>
	>;

	return stmts[resource]?.includes(action) ?? false;
};

export const getSidebarForRole = (roleName: RoleNames): SidebarGroup[] => {
	return sidebarConfig
		.map((group) => ({
			...group,
			items: group.items.filter((item) =>
				hasRoleStatement(roleName, item.permission),
			),
		}))
		.filter((group) => group.items.length > 0);
};
