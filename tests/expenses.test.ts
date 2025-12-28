import "reflect-metadata";

import { ExpensesService } from "@features/expenses/expenses.service";
import { beforeEach, describe, expect, it } from "@jest/globals";
import { AppError } from "@shared/errors/AppError";
import { MockExpensesRepository } from "./mocks/expenses.repository.mock";

describe("Testando despesas", () => {
	let mockExpensesRepository: MockExpensesRepository;
	let expensesService: ExpensesService;
	const userId = "test-user-id";

	beforeEach(() => {
		mockExpensesRepository = new MockExpensesRepository();
		expensesService = new ExpensesService(mockExpensesRepository);
	});

	// Sucessos
	describe("Criar despesa", () => {
		it("Deve criar uma nova despesa", async () => {
			const expenseData = {
				userId,
				description: "Compra no supermercado",
				amount: 15000,
				category: "Alimentação",
				date: "2024-12-13",
			};

			const expense = await expensesService.createExpense(expenseData);

			expect(expense).toHaveProperty("id");
			expect(expense).toHaveProperty("userId", userId);
			expect(expense).toHaveProperty("description", "Compra no supermercado");
			expect(expense).toHaveProperty("amount", 15000);
			expect(expense).toHaveProperty("category", "Alimentação");
			expect(expense).toHaveProperty("date", "2024-12-13");
			expect(expense).toHaveProperty("createdAt");
		});
	});

	describe("Buscar despesa", () => {
		it("Deve buscar uma despesa por ID", async () => {
			const createdExpense = await expensesService.createExpense({
				userId,
				description: "Pagamento de conta",
				amount: 10000,
				category: "Contas",
				date: "2024-12-13",
			});

			const expense = await expensesService.getExpenseById(createdExpense.id);

			expect(expense).toEqual(createdExpense);
		});

		it("Deve buscar todas as despesas de um Usuário", async () => {
			await expensesService.createExpense({
				userId,
				description: "Despesa 1",
				amount: 5000,
				category: "Transporte",
				date: "2024-12-13",
			});

			await expensesService.createExpense({
				userId,
				description: "Despesa 2",
				amount: 8000,
				category: "Lazer",
				date: "2024-12-13",
			});

			const expenses = await expensesService.getExpensesByUser({ userId });

			expect(expenses).toHaveLength(2);
			expect(expenses[0]).toHaveProperty("userId", userId);
			expect(expenses[1]).toHaveProperty("userId", userId);
		});

		it("Deve retornar lista vazia quando Usuário não tem despesas", async () => {
			const expenses = await expensesService.getExpensesByUser({ userId: "outro-usuario" });

			expect(expenses).toHaveLength(0);
		});

		it("Deve buscar todas as despesas", async () => {
			await expensesService.createExpense({
				userId,
				description: "Despesa 1",
				amount: 5000,
				category: "Transporte",
				date: "2024-12-13",
			});

			await expensesService.createExpense({
				userId: "outro-usuario",
				description: "Despesa 2",
				amount: 8000,
				category: "Lazer",
				date: "2024-12-13",
			});

			const expenses = await expensesService.getAllExpenses();

			expect(expenses).toHaveLength(2);
		});
	});

	describe("Atualizar despesa", () => {
		it("Deve atualizar uma despesa existente", async () => {
			const createdExpense = await expensesService.createExpense({
				userId,
				description: "Despesa original",
				amount: 10000,
				category: "Outros",
				date: "2024-12-13",
			});

			const updatedExpense = await expensesService.updateExpense({
				id: createdExpense.id,
				description: "Despesa atualizada",
				amount: 15000,
			});

			expect(updatedExpense.description).toBe("Despesa atualizada");
			expect(updatedExpense.amount).toBe(15000);
			expect(updatedExpense.category).toBe("Outros");
			expect(updatedExpense.date).toBe("2024-12-13");
		});

		it("Deve atualizar apenas os campos fornecidos", async () => {
			const createdExpense = await expensesService.createExpense({
				userId,
				description: "Despesa original",
				amount: 10000,
				category: "Outros",
				date: "2024-12-13",
			});

			const updatedExpense = await expensesService.updateExpense({
				id: createdExpense.id,
				amount: 20000,
			});

			expect(updatedExpense.description).toBe("Despesa original");
			expect(updatedExpense.amount).toBe(20000);
		});
	});

	describe("Deletar despesa", () => {
		it("Deve deletar uma despesa existente", async () => {
			const createdExpense = await expensesService.createExpense({
				userId,
				description: "Despesa para deletar",
				amount: 10000,
				category: "Outros",
				date: "2024-12-13",
			});

			await expensesService.deleteExpense({
				id: createdExpense.id,
				userId,
			});

			await expect(
				expensesService.getExpenseById(createdExpense.id)
			).rejects.toThrow(AppError);
		});

		it("Deve bloquear tentativa de deletar despesa de outro Usuário", async () => {
			const createdExpense = await expensesService.createExpense({
				userId,
				description: "Despesa de outro Usuário",
				amount: 10000,
				category: "Outros",
				date: "2024-12-13",
			});

			await expect(
				expensesService.deleteExpense({
					id: createdExpense.id,
					userId: "outro-usuario",
				})
			).rejects.toThrow(new AppError("Não autorizado a deletar esta despesa", 403));
		});
	});

	// Erros
	describe("Erros - Criar despesa", () => {
		it("Não deve criar despesa se o repositório falhar", async () => {
			jest.spyOn(mockExpensesRepository, "create").mockResolvedValue(undefined);

			await expect(
				expensesService.createExpense({
					userId,
					description: "Despesa com erro",
					amount: 10000,
					category: "Outros",
					date: "2024-12-13",
				})
			).rejects.toThrow(new AppError("Erro ao criar despesa", 500));
		});
	});

	describe("Erros - Buscar despesa", () => {
		it("Não deve encontrar despesa com ID inexistente", async () => {
			await expect(
				expensesService.getExpenseById("id-inexistente")
			).rejects.toThrow(new AppError("Despesa não encontrada", 404));
		});
	});

	describe("Erros - Atualizar despesa", () => {
		it("Não deve atualizar despesa com ID inexistente", async () => {
			await expect(
				expensesService.updateExpense({
					id: "id-inexistente",
					description: "Nova descrição",
				})
			).rejects.toThrow(new AppError("Despesa não encontrada", 404));
		});

		it("Não deve atualizar despesa se o repositório falhar", async () => {
			const createdExpense = await expensesService.createExpense({
				userId,
				description: "Despesa original",
				amount: 10000,
				category: "Outros",
				date: "2024-12-13",
			});

			jest.spyOn(mockExpensesRepository, "update").mockResolvedValue(undefined);

			await expect(
				expensesService.updateExpense({
					id: createdExpense.id,
					description: "Nova descrição",
				})
			).rejects.toThrow(new AppError("Erro ao atualizar despesa", 500));
		});
	});

	describe("Erros - Deletar despesa", () => {
		it("Não deve deletar despesa com ID inexistente", async () => {
			await expect(
				expensesService.deleteExpense({
					id: "id-inexistente",
					userId,
				})
			).rejects.toThrow(new AppError("Despesa não encontrada", 404));
		});
	});
});
