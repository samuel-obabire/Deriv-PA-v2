import * as z from "zod";

export const SignUpSchema = z
	.object({
		name: z
			.string()
			.min(5, "Name is required")
			.max(50, "Name cannot exceed 50 characters"),
		email: z.email(),
		password: z.string().min(8, "password must be at least 8 characters."),
		confirmPassword: z.string(),
	})
	.refine((data) => data.confirmPassword === data.password, {
		path: ["confirmPassword"],
		error: "Passwords do not match",
	});
