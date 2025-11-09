import "reflect-metadata";

import { env } from "@config/env";
import app from "./app";

try {
	console.clear();
	console.log(`🚀 Server is running on port ${env.APP_PORT}`);

	await app.listen({ port: env.APP_PORT });
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
