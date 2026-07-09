import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
	payment: ["create", "update", "configure"],
	settings: ["manage"],
	auth_provider: ["manage"],
	access_request: ["view", "approve", "reject", "revoke"],
	statement: ["view"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
	...memberAc.statements,
});

const auditor = ac.newRole({
	statement: ["view"],
	...memberAc.statements,
});

const cashier = ac.newRole({
	payment: ["create", "update"],
	statement: ["view"],
	...memberAc.statements,
});

const paymentSupervisor = ac.newRole({
	payment: ["create", "update", "configure"],
	statement: ["view"],
	...memberAc.statements,
});

const admin = ac.newRole({
	payment: ["create", "update", "configure"],
	settings: ["manage"],
	auth_provider: ["manage"],
	access_request: ["view", "approve", "reject", "revoke"],
	statement: ["view"],
	...adminAc.statements,
});

const owner = ac.newRole({
	payment: ["create", "update", "configure"],
	settings: ["manage"],
	auth_provider: ["manage"],
	access_request: ["view", "approve", "reject", "revoke"],
	statement: ["view"],
	...ownerAc.statements,
});

export type Statements = typeof statement;

type PermissionType = {
	[key in keyof Statements]?: Array<
		Statements[key] extends readonly string[] ? Statements[key][number] : never
	>;
};

type ResourcePermission = {
	[K in keyof Statements]: { resource: K; action: Statements[K][number] };
}[keyof Statements];

const roles = {
	admin,
	owner,
	member,
	cashier,
	auditor,
	"payment-supervisor": paymentSupervisor,
} as const;

export const ASSIGNABLE_ROLES = [
	"member",
	"auditor",
	"cashier",
	"payment-supervisor",
	"admin",
] as const;

type RoleNames = keyof typeof roles;

export {
	ac,
	admin,
	auditor,
	cashier,
	member,
	owner,
	type PermissionType,
	paymentSupervisor,
	type ResourcePermission,
	type RoleNames,
	roles,
};
