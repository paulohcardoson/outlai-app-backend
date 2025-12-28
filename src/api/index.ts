import "reflect-metadata";
import { AppError } from "@shared/errors/AppError";
import "@shared/providers";

import { app as apiV1 } from "@api/v1/app"
import { env } from "@config/env";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { jsonSchemaTransform, type ZodTypeProvider } from "fastify-type-provider-zod";

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

  return reply
    .status(500)
    .send({ error: error instanceof Error ? error.message : "Internal Server Error" });
});

// Plugins
app.register(fastifyCookie);
app.register(fastifyCors, {
  origin: env.APP_MODE === "production" ? "https://outlai.apps.paulohcardoson.me" : "http://localhost:5173",
  credentials: true,
});

// Swagger Documentation
await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'OutlAI API',
      description: 'Documentação da API do app utilizando Fastify e Swagger',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform
})
await app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

// API's
app.register(apiV1, { prefix: "/api/v1" });

try {
  await app.listen({ port: env.APP_PORT });

  console.log(`📚️ Documentação disponível em http://localhost:${env.APP_PORT}/docs`)
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

export default app;
