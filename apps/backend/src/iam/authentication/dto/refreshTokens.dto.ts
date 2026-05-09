import { RefreshTokensSchema } from "@repo/utils";
import { createZodDto } from "nestjs-zod";

export class RefreshTokensDto extends createZodDto(RefreshTokensSchema) {}
