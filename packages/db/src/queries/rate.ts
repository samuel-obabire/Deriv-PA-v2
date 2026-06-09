import { eq } from "drizzle-orm";
import { InsertRate, rate } from "../db/schema";
import { DB } from "../types";

export const RATE_ID = "6c9e9d25-110c-4233-9393-7c2a9811db63";

// Todo: remove later
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

export const getOrganizationRate = async (organizationId: string, db: DB) => {
	const [currentRate] = await db
		.select()
		.from(rate)
		.where(eq(rate.organizationId, organizationId));

	return currentRate;
};

export const updateCurrentRate = async (values: InsertRate, db: DB) => {
	const [updated] = await db
		.insert(rate)
		.values({
			deposit: values.deposit,
			withdrawal: values.withdrawal,
			charge: values.charge,
			smallAmount: values.smallAmount,
			min: values.min,
			max: values.max,
			organizationId: values.organizationId,
		})
		.onConflictDoUpdate({
			target: rate.organizationId,
			set: {
				deposit: values.deposit,
				withdrawal: values.withdrawal,
				charge: values.charge,
				smallAmount: values.smallAmount,
				min: values.min,
				max: values.max,
				updatedAt: new Date(),
			},
		})
		.returning();

	if (!updated) {
		throw new Error("Failed to update");
	}

	return updated;
};
