import * as z from "zod";

export const TransferStatusLookupSchema = z.object({
	id: z.uuid({ error: "Enter a valid transaction id" }),
});

export type TransferStatusLookupSchema = z.infer<
	typeof TransferStatusLookupSchema
>;
