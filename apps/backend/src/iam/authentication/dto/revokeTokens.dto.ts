import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const RevokeTokensSchema = z.object({
	userId: z.string().min(5),
});

export class RevokeTokensDto extends createZodDto(RevokeTokensSchema) {}
