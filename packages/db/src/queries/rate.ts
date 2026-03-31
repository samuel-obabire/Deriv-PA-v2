import { eq } from "drizzle-orm";
import { Rate, rate } from "../db/schema";
import { DB } from "../types";

export const RATE_ID = "6c9e9d25-110c-4233-9393-7c2a9811db63";

export const getCurrentRate = async (db: DB) => {
	const [currentRate] = await db
		.select()
		.from(rate)
		.where(eq(rate.id, RATE_ID));

	if (!currentRate) {
		throw new Error("Rate not found");
	}

	return currentRate;
};

export const updateCurrentRate = async (
	db: DB,
	values: Pick<Rate, "deposit" | "withdrawal">,
) => {
	const [updated] = await db
		.update(rate)
		.set({
			deposit: values.deposit,
			withdrawal: values.withdrawal,
		})
		.where(eq(rate.id, RATE_ID))
		.returning();

	if (!updated) {
		throw new Error("Failed to update");
	}
};
