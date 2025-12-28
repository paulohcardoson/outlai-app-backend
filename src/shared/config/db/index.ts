import { env } from "@config/env";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(env.POSTGRES_DATABASE);
