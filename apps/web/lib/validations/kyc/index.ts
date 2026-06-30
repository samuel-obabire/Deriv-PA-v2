import { CLIENT_CUSTOMER_TYPE } from "@repo/db/enums";
import * as z from "zod";

export const CUSTOMER_TYPES = [
	CLIENT_CUSTOMER_TYPE.EXISTING,
	CLIENT_CUSTOMER_TYPE.NEW,
] as const;

export const CreateKycInviteSchema = z.object({
	customerType: z.enum(CUSTOMER_TYPES),
});
