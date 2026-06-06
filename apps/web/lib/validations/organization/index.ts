import * as z from "zod";

export const CreateOrgSchema = z.object({
	orgName: z
		.string()
		.trim()
		.min(5, "Please enter organization name of at least 5 characters"),
});

export const SetActiveOrgSchema = z.object({
	orgId: z.string().trim().min(1, "OrgId is required"),
});

export const ASSIGNABLE_ROLES = [
	"admin",
	"member",
	"cashier",
	"auditor",
] as const;

export const AddMemberSchema = z.object({
	email: z.email("Please enter a valid email address"),
	role: z.enum(ASSIGNABLE_ROLES),
});
