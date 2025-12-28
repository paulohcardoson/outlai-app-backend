import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";
import { AuthController } from "./auth.controller";

export const schemas = {
  login: {
    body: z.object({
      email: z.email(),
      password: z.string().min(6),
    }),
    response: {
      200: z.object({
        token: z.string().optional(),
      }),
    }
  },
  register: {
    body: z.object({
      name: z.string().min(2),
      email: z.email(),
      password: z.string().min(6),
    }),
  },
  verifyEmail: {
    querystring: z.object({
      "user-id": z.uuid(),
      token: z.hex()
    })
  },
  resendEmailVerification: {
    body: z.object({
      email: z.email(),
    }),
  },
};

export const authRoutes = async (app: FastifyInstance) => {
  const authController = container.resolve(AuthController);

  // Login
  app.post(
    "/login",
    {
      schema: schemas.login,
    },
    async (request, reply) => authController.login(request, reply),
  );

  // Register
  app.post(
    "/register",
    {
      schema: schemas.register
    },
    async (request, reply) => authController.register(request, reply),
  );

  // Verify Email
  app.get(
    "/verify-email",
    {
      schema: schemas.verifyEmail,
    },
    async (request, reply) => authController.verifyEmail(request, reply),
  );

  // Resend Email Verification
  app.post(
    "/resend-email-verification",
    {
      schema: schemas.resendEmailVerification,
    },
    async (request, reply) => authController.resendEmailVerification(request, reply),
  );
};
