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
import { AppError } from "./shared/errors/AppError";

// Containers
import "@shared/containers";

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
		.send({ error: error.message || "Internal Server Error" });
});

app.register(authRoutes, { prefix: "/auth" });
app.register(usersRoutes, { prefix: "/users" });

export default app;
