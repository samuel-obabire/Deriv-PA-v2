import { desc, eq } from "drizzle-orm";
import { transaction } from "../db/schema";
import { DB } from "../types";

type GetRecentTransfersOptions = {
	limit?: number;
};

export const getRecentTransfersByOrg = async (
	organizationId: string,
	db: DB,
	{ limit = 5 }: GetRecentTransfersOptions = {},
) => {
	return db
		.select()
		.from(transaction)
		.where(eq(transaction.organizationId, organizationId))
		.orderBy(desc(transaction.createdAt))
		.limit(limit);
};
