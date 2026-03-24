import { Inject, Injectable } from "@nestjs/common";
import * as schema from "@repo/db";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "./constant";

@Injectable()
export class DatabaseService {
	constructor(
		@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
	) {}

	get client() {
		return this.db;
	}
}
