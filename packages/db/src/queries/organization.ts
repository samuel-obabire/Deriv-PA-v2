import { organization } from "../db/schema";
import { DB } from "../types";

export const getAllOrganizations = async (db: DB) => {
	return db.select({ id: organization.id }).from(organization);
};
