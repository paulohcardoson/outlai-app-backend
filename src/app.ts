import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

// Routes
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";

// Errors
import { AppError } from "@shared/errors/AppError";

// Containers
import "@shared/containers";

// Fastify plugins
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyCors from "@fastify/cors";
import { env } from "./config/env";

export const fastify = Fastify({
	// logger: true,
});

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
// TODO: Configure session properly for production
app.register(fastifySession, { secret: env.SESSION_SECRET, cookie: { secure: false } });

app.register(authRoutes, { prefix: "/auth" });
app.register(usersRoutes, { prefix: "/users" });

export default app;
