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
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
	...memberAc.statements,
});

const admin = ac.newRole({
	payment: ["create", "update"],
	...adminAc.statements,
});
const owner = ac.newRole({
	payment: ["create", "update"],
	...ownerAc.statements,
});

const cashier = ac.newRole({
	payment: ["create", "update"],
	...memberAc.statements,
});

const auditor = ac.newRole({
	...memberAc.statements,
});

// Infer the type from ac
type Statements = typeof statement;

type PermissionType = {
	[key in keyof Statements]?: Array<
		Statements[key] extends readonly string[] ? Statements[key][number] : never
	>;
};

export { ac, admin, auditor, cashier, member, owner, type PermissionType };

export const roleNames = ["auditor", "cashier", "admin"];
