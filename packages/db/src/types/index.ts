import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// biome-ignore lint/suspicious/noExplicitAny: allow any
export type DB<T extends Record<string, unknown> = any> =
	PostgresJsDatabase<T> & {
		$client?: postgres.Sql;
	};
