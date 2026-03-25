import * as z from "zod";

const ServerSchema = z.object({
	DATA_BASE_URL: z.string().min(3),
	BASE_URL: z.string().min(3),
});

export const serverEnv = ServerSchema.parse(process.env);
