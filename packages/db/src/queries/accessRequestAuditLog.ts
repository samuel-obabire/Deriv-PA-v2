import { accessRequestAuditLog } from "../db/schema";
import type { InsertAccessRequestAuditLog } from "../db/schema/accessRequestAuditLog";
import type { DB } from "../types";

export const createAccessRequestAuditLog = async (
	data: InsertAccessRequestAuditLog,
	db: DB,
) => {
	const [created] = await db
		.insert(accessRequestAuditLog)
		.values(data)
		.returning();

	if (!created) throw new Error("Failed to create audit log entry");

	return created;
};
