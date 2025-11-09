import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";
import { UsersController } from "./users.controller";

export const schemas = {
	userSchema: z.object({
		name: z.string().optional(),
		email: z.email(),
		password: z.string(),
	}),

	userUpdateSchema: z.object({
		name: z.string().optional(),
		email: z.email().optional(),
	}),

	userParamsSchema: z.object({
		id: z.uuid(),
	}),
};

export const usersRoutes = async (app: FastifyInstance) => {
	const usersController = container.resolve(UsersController);

	// Create user
	app.post(
		"/create",
		{
			schema: {
				body: schemas.userSchema,
			},
		},
		usersController.create.bind(usersController),
	);

	// Update user
	app.put(
		"/me",
		{
			schema: {
				params: schemas.userParamsSchema,
				body: schemas.userUpdateSchema,
				response: {
					200: z.object({
						id: z.uuid(),
						name: z.string().nullable(),
						email: z.email(),
						createdAt: z.date().nullable(),
					}),
				},
			},
		},
		usersController.update.bind(usersController),
	);

	// Delete user
	app.delete(
		"/me",
		{
			schema: {
				params: schemas.userParamsSchema,
				response: {
					204: z.undefined(),
				},
			},
		},
		usersController.delete.bind(usersController),
	);
};
