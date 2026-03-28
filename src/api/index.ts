import "reflect-metadata";
import { AppError } from "@shared/errors/AppError";
import "@shared/providers";

import { app as apiV1 } from "@api/v1/app";
import { env } from "@config/env";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
	jsonSchemaTransform,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

export const fastify = Fastify();

const app = fastify.withTypeProvider<ZodTypeProvider>();

// Health check
app.get("/health", async () => {
	return { status: "OK" };
});

// Error handling
app.setErrorHandler((error, _request, reply) => {
	// biome-ignore lint/suspicious/noExplicitAny: <Its okay>
	if ((error as any).validation) {
		return reply.status(400).send({
			error: "Validation Error",
			// biome-ignore lint/suspicious/noExplicitAny: <Its okay>
			details: (error as any).validation,
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.code as number).send({ error: error.message });
	}

	return reply.status(500).send({
		error: error instanceof Error ? error.message : "Internal Server Error",
	});
});

const addPlugins = async () => {
	// Cookies and CORS
	await app.register(fastifyCookie);
	await app.register(fastifyCors, {
		origin: env.WEB_APP_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	});

	// Swagger Documentation
	await app.register(fastifySwagger, {
		openapi: {
			info: {
				title: "OutlAI API",
				description: "Documentação da API do app utilizando Fastify e Swagger",
				version: "1.0.0",
			},
		},
		transform: jsonSchemaTransform,
	});
	await app.register(fastifySwaggerUi, {
		routePrefix: "/docs",
	});
};
const addAPIv1 = async () => {
	await app.register(apiV1, { prefix: "/api/v1" });
};

const start = async () => {
	await addPlugins();
	await addAPIv1();

	await app.listen({ port: env.APP_PORT, host: "0.0.0.0" });
};

try {
	start().then(() => {
		console.log(`🚀 Server funcionando`);
	});
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
