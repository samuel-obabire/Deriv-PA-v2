import { createZodDto } from "nestjs-zod";
import * as z from "zod";

import { TokenPayloadSchema } from "./issueTokens.dto";

const RefreshTokensSchema = z.object({
	refreshToken: z.string().min(5),
	payload: TokenPayloadSchema,
});

export class RefreshTokensDto extends createZodDto(RefreshTokensSchema) {}
