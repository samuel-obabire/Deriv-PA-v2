import { PayoutRequest, PayoutStatus } from "../db/schema";

export type Cursor = Pick<PayoutRequest, "createdAt" | "id">;

export type PayoutOptions = {
	date?: { from: Date; to: Date };
	searchQuery?: string;
	status?: PayoutStatus;
	limit?: number;
	cursor?: Cursor;
};
