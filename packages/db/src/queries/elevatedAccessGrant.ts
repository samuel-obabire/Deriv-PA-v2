import { and, desc, eq, gt } from "drizzle-orm";
import { elevatedAccessGrant, user } from "../db/schema";
import type { InsertElevatedAccessGrant } from "../db/schema/elevatedAccessGrant";
import type { DB } from "../types";

export const getElevatedAccessGrantById = async (id: string, db: DB) => {
	const [grant] = await db
		.select()
		.from(elevatedAccessGrant)
		.where(eq(elevatedAccessGrant.id, id));

	return grant ?? null;
};

export const getElevatedAccessGrantBySessionId = async (
	sessionId: string,
	organizationId: string,
	db: DB,
) => {
	const [grant] = await db
		.select()
		.from(elevatedAccessGrant)
		.where(
			and(
				eq(elevatedAccessGrant.sessionId, sessionId),
				eq(elevatedAccessGrant.organizationId, organizationId),
			),
		);

	return grant ?? null;
};

export const getActiveElevatedAccessGrant = async (
	sessionId: string,
	organizationId: string,
	db: DB,
) => {
	const [grant] = await db
		.select()
		.from(elevatedAccessGrant)
		.where(
			and(
				eq(elevatedAccessGrant.sessionId, sessionId),
				eq(elevatedAccessGrant.organizationId, organizationId),
				eq(elevatedAccessGrant.isGranted, true),
				gt(elevatedAccessGrant.expiresAt, new Date()),
			),
		);

	return grant ?? null;
};

export const getPendingAccessRequestsByOrg = async (
	organizationId: string,
	db: DB,
) =>
	db
		.select({
			id: elevatedAccessGrant.id,
			targetUserId: elevatedAccessGrant.targetUserId,
			createdAt: elevatedAccessGrant.createdAt,
			userName: user.name,
			userEmail: user.email,
		})
		.from(elevatedAccessGrant)
		.innerJoin(user, eq(user.id, elevatedAccessGrant.targetUserId))
		.where(
			and(
				eq(elevatedAccessGrant.organizationId, organizationId),
				eq(elevatedAccessGrant.isGranted, false),
			),
		)
		.orderBy(desc(elevatedAccessGrant.createdAt));

export const getActiveAccessGrantsByOrg = async (
	organizationId: string,
	db: DB,
) =>
	db
		.select({
			id: elevatedAccessGrant.id,
			targetUserId: elevatedAccessGrant.targetUserId,
			expiresAt: elevatedAccessGrant.expiresAt,
			grantedAt: elevatedAccessGrant.grantedAt,
			userName: user.name,
			userEmail: user.email,
		})
		.from(elevatedAccessGrant)
		.innerJoin(user, eq(user.id, elevatedAccessGrant.targetUserId))
		.where(
			and(
				eq(elevatedAccessGrant.organizationId, organizationId),
				eq(elevatedAccessGrant.isGranted, true),
				gt(elevatedAccessGrant.expiresAt, new Date()),
			),
		)
		.orderBy(desc(elevatedAccessGrant.grantedAt));

export const createElevatedAccessGrant = async (
	data: InsertElevatedAccessGrant,
	db: DB,
) => {
	const [created] = await db
		.insert(elevatedAccessGrant)
		.values(data)
		.returning();

	if (!created) throw new Error("Failed to create access request");

	return created;
};

export const approveElevatedAccessGrant = async (
	{ id, expiresAt }: { id: string; expiresAt: Date },
	db: DB,
) => {
	const [updated] = await db
		.update(elevatedAccessGrant)
		.set({ isGranted: true, grantedAt: new Date(), expiresAt })
		.where(eq(elevatedAccessGrant.id, id))
		.returning();

	if (!updated) throw new Error("Access request not found");

	return updated;
};

export const deleteElevatedAccessGrant = async (id: string, db: DB) => {
	const [deleted] = await db
		.delete(elevatedAccessGrant)
		.where(eq(elevatedAccessGrant.id, id))
		.returning();

	return deleted ?? null;
};

// Deletes every grant the user holds in this org, across all of their
// sessions, so a revoke can't be bypassed by a second logged-in session.
export const deleteElevatedAccessGrantsForUser = async (
	{
		targetUserId,
		organizationId,
	}: { targetUserId: string; organizationId: string },
	db: DB,
) =>
	db
		.delete(elevatedAccessGrant)
		.where(
			and(
				eq(elevatedAccessGrant.targetUserId, targetUserId),
				eq(elevatedAccessGrant.organizationId, organizationId),
			),
		)
		.returning();
