import { Module } from "@nestjs/common";
import * as schema from "@repo/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DRIZZLE } from "./constant";

import { DatabaseService } from "./database.service";

@Module({
	providers: [
		DatabaseService,
		{
			provide: DRIZZLE,
			useFactory: () => {
				const pool = new Pool({ connectionString: process.env.DATABASE_URL });

				return drizzle(pool, { schema });
			},
		},
	],
	exports: [DRIZZLE, DatabaseService],
})
export class DatabaseModule {}
