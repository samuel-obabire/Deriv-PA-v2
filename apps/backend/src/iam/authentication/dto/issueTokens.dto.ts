import { TokenPayloadSchema } from "@repo/utils";
import { createZodDto } from "nestjs-zod";

export class IssueTokensDto extends createZodDto(TokenPayloadSchema) {}
