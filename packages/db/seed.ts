import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import { Pool } from "pg";
import * as schema from "./src/index";

async function main() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL as string,
	});

	const db = drizzle(pool);

	await seed(db, { payoutRequest: schema.payoutRequest }).refine((f) => ({
		payoutRequest: {
			count: 100,
		},
	}));

	await pool.end();
}

main();
