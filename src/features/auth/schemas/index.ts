import { z } from "zod";

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
		},
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
			token: z.hex(),
		}),
	},
	resendEmailVerification: {
		body: z.object({
			email: z.email(),
		}),
	},
};

export type LoginRequestBody = z.infer<typeof schemas.login.body>;
export type RegisterRequestBody = z.infer<typeof schemas.register.body>;
export type VerifyEmailRequestQuery = z.infer<
	typeof schemas.verifyEmail.querystring
>;
export type ResendEmailVerificationRequestBody = z.infer<
	typeof schemas.resendEmailVerification.body
>;
