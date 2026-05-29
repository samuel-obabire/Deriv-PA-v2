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
