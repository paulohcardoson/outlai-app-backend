import "reflect-metadata"

// Errors
import { AppError } from "@shared/errors/AppError";

// Fastify
import Fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

// Routes
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";

// Containers
import "@shared/containers";

// Fastify plugins
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySession from "@fastify/session";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

// Redis Store for sessions
import { RedisStore } from "connect-redis";
// Env
import { env } from "./config/env";
import { redisAdapter } from "./shared/cache";

export const fastify = Fastify();

// Add schema validator and serializer
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

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

	return reply
		.status(500)
		.send({ error: error instanceof Error ? error.message : "Internal Server Error" });
});

// Plugins
app.register(fastifyCors)
app.register(fastifyCookie)
app.register(fastifySession, { secret: env.SESSION_SECRET, cookie: { secure: env.APP_MODE === "production" }, store: new RedisStore({ client: redisAdapter.client, prefix: "session:" }) });

/// Swagger
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'OutlAI API',
			description: 'Documentação da API do app utilizando Fastify e Swagger',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
	routePrefix: '/docs'
})

// Routes
app.register(authRoutes, { prefix: "/auth" });
app.register(usersRoutes, { prefix: "/users" });

try {
	console.clear();
	console.log(`🚀 Server is running on port ${env.APP_PORT}`);

	await app.listen({ port: env.APP_PORT });
} catch (err) {
	app.log.error(err);
	process.exit(1);
}

export default app;