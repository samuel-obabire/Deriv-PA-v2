import { eq } from "drizzle-orm";
import { user } from "../db/schema";
import type { UserUpdateData } from "../db/schema/user";
import { DB } from "../types";

export const getUserByEmail = async (email: string, db: DB) => {
	const [fetchedUser] = await db
		.select()
		.from(user)
		.where(eq(user.email, email));

	return fetchedUser ?? null;
};

export const getUser = async (userId: string, db: DB) => {
	const [fetchedUser] = await db.select().from(user).where(eq(user.id, userId));

	return fetchedUser ?? null;
};

export const updateUser = async (
	{
		data,
		userId,
	}: {
		userId: string;
		data: UserUpdateData;
	},
	db: DB,
) => {
	const [updatedUser] = await db
		.update(user)
		.set(data)
		.where(eq(user.id, userId))
		.returning();

	if (!updatedUser) throw new Error("User not found");

	return updatedUser;
};
