import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";
import { AuthController } from "./auth.controller";

export const schemas = {
	loginSchema: z.object({
		email: z.email(),
		password: z.string().min(6),
	}),

	registerSchema: z.object({
		name: z.string().min(2),
		email: z.email(),
		password: z.string().min(6),
	}),

	authResponseSchema: z.object({
		user: z.object({
			id: z.uuid(),
			name: z.string().nullable(),
			email: z.email(),
			createdAt: z.date().nullable(),
		}),
		token: z.string().optional(),
	}),
};

export const authRoutes = async (app: FastifyInstance) => {
	const authController = container.resolve(AuthController);

	// Login
	app.post(
		"/login",
		{
			schema: {
				body: schemas.loginSchema,
				response: {
					200: schemas.authResponseSchema,
				},
			},
		},
		authController.login.bind(authController),
	);

	// Register
	app.post(
		"/register",
		{
			schema: {
				body: schemas.registerSchema,
				response: {
					201: schemas.authResponseSchema,
				},
			},
		},
		authController.register.bind(authController),
	);
};
