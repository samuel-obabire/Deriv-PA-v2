import * as z from "zod";

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().min(3, "password is required"),
});
