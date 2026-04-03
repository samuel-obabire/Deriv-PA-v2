import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import type { DB } from "@repo/db";
import * as schema from "@repo/db";
import { DRIZZLE } from "./constant";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	constructor(
		@Inject(DRIZZLE)
		private readonly db: DB<typeof schema>,
	) {}

	async onModuleDestroy() {
		this.db.$client.end();
	}

	get client() {
		return this.db;
	}
}
