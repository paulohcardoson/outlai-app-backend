import { env } from "@src/config/env";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(env.POSTGRES_DATABASE);
