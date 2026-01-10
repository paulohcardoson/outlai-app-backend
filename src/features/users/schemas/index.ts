import { z } from "zod";

export const schemas = {
	update: {
		body: z.object({
			name: z.string().optional(),
			email: z.email().optional(),
		}),
		response: {
			200: z.object({
				id: z.uuid(),
				name: z.string().nullable(),
				email: z.email(),
				createdAt: z.date().nullable(),
			}),
		},
	},
	delete: {
		body: z.object({
			password: z.string(),
		}),
		response: {
			204: z.undefined(),
		},
	},
};

export type UpdateRequestBody = z.infer<typeof schemas.update.body>;
export type DeleteRequestBody = z.infer<typeof schemas.delete.body>;
