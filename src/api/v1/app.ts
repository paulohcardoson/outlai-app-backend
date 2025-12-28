import { authRoutes } from "@features/auth/auth.routes";
import type { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import "@shared/providers";
import { expensesRoutes } from "@src/features/expenses/expenses.routes";
import { usersRoutes } from "@src/features/users/users.routes";

export const app = async (fastify: FastifyInstance) => {
  // Add schema validator and serializer
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Routes
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(usersRoutes, { prefix: "/users" });
  fastify.register(expensesRoutes, { prefix: "/expenses" });

  console.log("⚡️ API v1 ligada")
}
