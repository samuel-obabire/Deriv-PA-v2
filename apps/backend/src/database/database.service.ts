import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import * as schema from "@repo/db";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import postgres from "postgres";
import { DRIZZLE } from "./constant";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	constructor(
		@Inject(DRIZZLE)
		private readonly db: NodePgDatabase<typeof schema> & {
			$client: postgres.Sql;
		},
	) {}

	async onModuleDestroy() {
		await this.db.$client.end();
	}

	get client() {
		return this.db;
	}
}
