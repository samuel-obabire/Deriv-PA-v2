import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
	payment: ["create", "update"],
	settings: ["manage"],
	auth_provider: ["manage"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
	...memberAc.statements,
});

const admin = ac.newRole({
	payment: ["create", "update"],
	settings: ["manage"],
	auth_provider: ["manage"],
	...adminAc.statements,
});

const owner = ac.newRole({
	payment: ["create", "update"],
	settings: ["manage"],
	auth_provider: ["manage"],
	...ownerAc.statements,
});

const cashier = ac.newRole({
	payment: ["create", "update"],
	...memberAc.statements,
});

const auditor = ac.newRole({
	...memberAc.statements,
});

export type Statements = typeof statement;

// const roleNames = ["auditor", "cashier", "admin"] as const;

type PermissionType = {
	[key in keyof Statements]?: Array<
		Statements[key] extends readonly string[] ? Statements[key][number] : never
	>;
};

type ResourcePermission = {
	[K in keyof Statements]: { resource: K; action: Statements[K][number] };
}[keyof Statements];

const roles = { admin, owner, member, cashier, auditor } as const;

type RoleNames = keyof typeof roles;

export {
	ac,
	admin,
	auditor,
	cashier,
	member,
	owner,
	type PermissionType,
	type ResourcePermission,
	type RoleNames,
	roles,
};
