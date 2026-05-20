import {
	ResourcePermission,
	RoleNames,
	roles,
	type Statements,
} from "@/lib/permissions";
import { sidebarConfig } from "./config";
import { SidebarGroup } from "./types";

export const hasRoleStatement = (
	roleName: RoleNames,
	{ resource, action }: ResourcePermission,
): boolean => {
	const role = roles[roleName ?? "member"];
	if (!role) return false;
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
