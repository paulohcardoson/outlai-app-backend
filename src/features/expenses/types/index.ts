import type { expenses } from "@config/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Expense = InferSelectModel<typeof expenses>;

export interface CreateExpenseDTO {
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface UpdateExpenseDTO {
  id: string;
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
}

export interface DeleteExpenseDTO {
  id: string;
  userId: string;
}

export interface GetExpensesByUserDTO {
  userId: string;
  page?: number;
  limit?: number;
  category?: string;
  orderBy?: "date" | "amount";
  orderDirection?: "asc" | "desc";
}

export interface PaginatedExpensesResponse {
  data: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetTotalsByPeriodDTO {
  userId: string;
  startDate: string;
  endDate: string;
}

export interface MonthlyTotals {
  [monthNumber: string]: number;
}

export interface ExtractExpenseFromPhotoDTO {
  mimeType: string;
  data: string;
}
