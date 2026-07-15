import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const ClientNicknameLookupSchema = z.object({
	external_reference_id: z.string().min(1),
});

export class ClientNicknameLookupDto extends createZodDto(
	ClientNicknameLookupSchema,
) {}
