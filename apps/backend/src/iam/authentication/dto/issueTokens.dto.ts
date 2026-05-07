import { Permissions } from "@repo/utils";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

export const TokenPayloadSchema = z.object({
	userId: z.string().min(5),
	permissions: z.array(z.enum(Permissions)),
	organizationId: z.string().min(5),
	tokenId: z.string().min(5),
});

export class IssueTokensDto extends createZodDto(TokenPayloadSchema) {}
