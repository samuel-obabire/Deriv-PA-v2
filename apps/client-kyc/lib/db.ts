import "server-only";

import * as schema from "@repo/db";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "./validations/env/server";

const conn = postgres(serverEnv.DATABASE_URL);

export const db = drizzle(conn, { schema });
