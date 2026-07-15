import { eq } from "drizzle-orm";
import { derivClientNickname } from "../db/schema";
import type { DB } from "../types";

export const upsertDerivClientNickname = async (
	{
		externalReferenceId,
		nickname,
	}: { externalReferenceId: string; nickname: string },
	db: DB,
) => {
	const [record] = await db
		.insert(derivClientNickname)
		.values({ externalReferenceId, nickname })
		.onConflictDoUpdate({
			target: derivClientNickname.externalReferenceId,
			set: { nickname, updatedAt: new Date() },
		})
		.returning();

	return record;
};

export const getDerivClientNicknameByExternalReferenceId = async (
	externalReferenceId: string,
	db: DB,
) => {
	const [record] = await db
		.select()
		.from(derivClientNickname)
		.where(eq(derivClientNickname.externalReferenceId, externalReferenceId));

	return record ?? null;
};
