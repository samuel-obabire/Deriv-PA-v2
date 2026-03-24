import { Module } from "@nestjs/common";
import * as schema from "@repo/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DatabaseController } from "./database.controller";
import { DatabaseService } from "./database.service";
import { DRIZZLE } from "./constant";

@Module({
	controllers: [DatabaseController],
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
	exports: [DRIZZLE],
})
export class DatabaseModule {}
