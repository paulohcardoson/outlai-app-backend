import { categories } from "@src/shared/consts/categories";
import { extractBase64ImageInfo } from "@src/shared/utils/extractBase64ImageInfo";
import dayjs from "dayjs";
import { z } from "zod";
import type { ExtractExpenseFromPhotoDTO } from "../types";

export const expenseResponse = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
  createdAt: z.date(),
});

export const schemas = {
  create: {
    body: z.object({
      description: z.string().min(1, "Descrição é obrigatória"),
      amount: z.float32().positive("Valor deve ser positivo").transform(val => Math.round(val * 100)),
      category: z.enum(categories, { error: "Categoria inválida" }),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
    }),
    response: {
      201: expenseResponse,
    },
  },
  getByUser: {
    querystring: z.object({
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      category: z.enum(categories).optional(),
      orderBy: z.enum(["date", "amount"]).optional(),
      orderDirection: z.enum(["asc", "desc"]).optional(),
    }).optional(),
  },
  update: {
    params: z.object({
      id: z.uuid("ID inválido"),
    }),
    body: z.object({
      description: z.string().min(1).optional(),
      amount: z.number().positive().optional().transform(val => val ? Math.round(val * 100) : undefined),
      category: z.string().min(1).optional(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
  },
  getById: {
    params: z.object({
      id: z.uuid("ID inválido"),
    }),
  },
  delete: {
    params: z.object({
      id: z.uuid("ID inválido"),
    }),
  },
  getTotalsByPeriod: {
    querystring: z.object({
      startDate: z.string().refine(
        (date) => dayjs(date, "YYYY-MM-DD", true).isValid(),
        "Data inicial deve estar no formato YYYY-MM-DD"
      ),
      endDate: z.string().refine(
        (date) => dayjs(date, "YYYY-MM-DD", true).isValid(),
        "Data final deve estar no formato YYYY-MM-DD"
      ),
    }),
  },
  extractExpenseFromPhoto: {
    body: z.object({
      uri: z.string().transform<ExtractExpenseFromPhotoDTO>(uri => extractBase64ImageInfo(uri)),
    }),
  },
};

export type CreateExpensesRequestBody = z.infer<typeof schemas.create.body>;
export type GetExpensesByUserRequestQueryParams = z.infer<typeof schemas.getByUser.querystring>;
export type UpdateExpenseRequestParams = z.infer<typeof schemas.update.params>;
export type UpdateExpenseRequestBody = z.infer<typeof schemas.update.body>;
export type GetExpenseByIdRequestParams = z.infer<typeof schemas.getById.params>;
export type DeleteExpenseRequestParams = z.infer<typeof schemas.delete.params>;
export type GetTotalsByPeriodRequestQueryParams = z.infer<typeof schemas.getTotalsByPeriod.querystring>;
export type ExtractExpenseFromPhotoRequestBody = z.infer<typeof schemas.extractExpenseFromPhoto.body>;

export const paginatedExpensesResponse = z.object({
  data: z.array(expenseResponse),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
