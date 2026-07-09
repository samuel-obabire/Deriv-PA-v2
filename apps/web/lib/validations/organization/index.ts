import * as z from "zod";
import { ASSIGNABLE_ROLES } from "@/lib/permissions";

export const CreateOrgSchema = z.object({
	orgName: z
		.string()
		.trim()
		.min(5, "Please enter organization name of at least 5 characters"),
});

export const SetActiveOrgSchema = z.object({
	orgId: z.string().trim().min(1, "OrgId is required"),
});

export const AddMemberSchema = z.object({
	email: z.email("Please enter a valid email address"),
	role: z.enum(ASSIGNABLE_ROLES),
});

export const UpdateMemberRoleSchema = z.object({
	memberId: z.string().trim().min(1, "Member ID is required"),
	userId: z.string().trim().min(1, "User ID is required"),
	role: z.enum(ASSIGNABLE_ROLES),
});
