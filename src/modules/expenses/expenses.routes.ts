import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ExpensesController } from "./expenses.controller";

export const schemas = {
	expenseSchema: z.object({
		userId: z.string().uuid(),
		description: z.string(),
		amount: z.number(),
		category: z.string(),
		date: z.string(),
	}),

	expenseUpdateSchema: z.object({
		description: z.string().optional(),
		amount: z.number().optional(),
		category: z.string().optional(),
		date: z.string().optional(),
	}),

	expenseParamsSchema: z.object({
		id: z.string().uuid(),
	}),

	userIdParamsSchema: z.object({
		userId: z.string().uuid(),
	}),
};

export const expensesRoutes = async (app: FastifyInstance) => {
	const controller = new ExpensesController();

	// Create expense
	app.post(
		"/",
		{
			schema: {
				body: schemas.expenseSchema,
			},
		},
		controller.create.bind(controller),
	);

	// Get all expenses
	app.get(
		"/",
		controller.getAll.bind(controller),
	);

	// Get expense by id
	app.get(
		"/:id",
		{
			schema: {
				params: schemas.expenseParamsSchema,
			},
		},
		controller.getById.bind(controller),
	);

	// Get expenses by user id
	app.get(
		"/user/:userId",
		{
			schema: {
				params: schemas.userIdParamsSchema,
			},
		},
		controller.getByUserId.bind(controller),
	);

	// Update expense
	app.put(
		"/:id",
		{
			schema: {
				params: schemas.expenseParamsSchema,
				body: schemas.expenseUpdateSchema,
			},
		},
		controller.update.bind(controller),
	);

	// Delete expense
	app.delete(
		"/:id",
		{
			schema: {
				params: schemas.expenseParamsSchema,
			},
		},
		controller.delete.bind(controller),
	);
};
