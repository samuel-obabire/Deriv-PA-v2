import * as z from "zod";

import { Permissions } from "./permissions";

export const TokenPayloadSchema = z.object({
	userId: z.string().min(5),
	permissions: z.array(z.enum(Permissions)),
	organizationId: z.string().min(5),
	tokenId: z.string().min(5),
});

export const RefreshTokensSchema = z.object({
	refreshToken: z.string().min(5),
	payload: TokenPayloadSchema,
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type RefreshTokens = z.infer<typeof RefreshTokensSchema>;
