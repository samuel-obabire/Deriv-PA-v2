import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// biome-ignore lint/suspicious/noExplicitAny: type any needed in this case
export type DB = PostgresJsDatabase<any>;
