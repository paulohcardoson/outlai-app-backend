import { requireAuth } from "@shared/hooks/auth";
import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { schemas } from "./schemas";
import { UsersController } from "./users.controller";

export const usersRoutes = async (app: FastifyInstance) => {
	const usersController = container.resolve(UsersController);

	// Get current user
	app.get(
		"/me",
		{
			preHandler: requireAuth,
		},
		async (request, reply) => usersController.me(request, reply),
	);

	// Update user
	app.put(
		"/me",
		{
			schema: schemas.update,
			preHandler: requireAuth,
		},
		async (request, reply) => usersController.update(request, reply),
	);

	// Delete user
	app.delete(
		"/me",
		{
			schema: schemas.delete,
			preHandler: requireAuth,
		},
		async (request, reply) => usersController.delete(request, reply),
	);
};
