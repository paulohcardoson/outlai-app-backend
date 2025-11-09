import "dotenv/config";
import { env } from "@src/config/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/config/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.POSTGRES_DATABASE,
	},
});
