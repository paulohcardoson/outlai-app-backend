import { requireAuth } from "@shared/hooks/auth";
import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { z } from "zod";
import { ExpensesController } from "./expenses.controller";
import { expenseResponse, paginatedExpensesResponse, schemas } from "./schemas";

export type {
	CreateExpensesRequestBody,
	DeleteExpenseRequestParams,
	ExtractExpenseFromPhotoRequestBody,
	GetExpenseByIdRequestParams,
	GetExpensesByUserRequestQueryParams,
	GetTotalsByPeriodRequestQueryParams,
	UpdateExpenseRequestBody,
	UpdateExpenseRequestParams,
} from "./schemas";

export const expensesRoutes = async (app: FastifyInstance) => {
	const expensesController = container.resolve(ExpensesController);

	// Create expense
	app.post(
		"/",
		{
			schema: schemas.create,
			preHandler: requireAuth,
		},
		async (request, reply) => expensesController.create(request, reply),
	);

	// Get all expenses for the authenticated user (with pagination, filtering, and ordering)
	app.get(
		"/",
		{
			schema: {
				...schemas.getByUser,
				response: {
					200: paginatedExpensesResponse,
				},
			},
			preHandler: requireAuth,
		},
		async (request, reply) => expensesController.getByUser(request, reply),
	);

	// Get expense by ID
	app.get(
		"/:id",
		{
			schema: {
				...schemas.getById,
				response: {
					200: expenseResponse,
				},
			},
			preHandler: [requireAuth],
		},
		async (request, reply) => expensesController.getById(request, reply),
	);

	// Update expense
	app.put(
		"/:id",
		{
			schema: {
				...schemas.update,
				response: {
					200: expenseResponse,
				},
			},
			preHandler: [requireAuth],
		},
		async (request, reply) => expensesController.update(request, reply),
	);

	// Delete expense
	app.delete(
		"/:id",
		{
			schema: {
				...schemas.delete,
				response: {
					204: z.undefined(),
				},
			},
			preHandler: [requireAuth],
		},
		async (request, reply) => expensesController.delete(request, reply),
	);

	// Get totals by period (grouped by month)
	app.get(
		"/totals/period",
		{
			schema: {
				...schemas.getTotalsByPeriod,
				response: {
					200: z.record(z.string(), z.number()),
				},
			},
			preHandler: [requireAuth],
		},
		async (request, reply) =>
			expensesController.getTotalsByPeriod(request, reply),
	);

	// Use AI to return a expense ready to be sended to POST /expenses
	app.post(
		"/ai/extract-expenses-from-photo",
		{
			schema: schemas.extractExpenseFromPhoto,
			preHandler: [requireAuth],
		},
		async (request, reply) =>
			expensesController.extractExpenseFromPhoto(request, reply),
	);
};
