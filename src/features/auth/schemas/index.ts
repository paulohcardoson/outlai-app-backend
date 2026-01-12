import { z } from "zod";

export const schemas = {
	login: {
		body: z.object({
			email: z.email(),
			password: z.string().min(8),
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
			password: z.string().min(8),
		}),
	},
	verifyEmail: {
		querystring: z.object({
			"user-id": z.uuid(),
			token: z.hex(),
		}),
	},
	resendVerificationEmail: {
		body: z.object({
			email: z.email(),
		}),
	},
	requestPasswordReset: {
		body: z.object({
			email: z.email(),
		}),
	},
	resetPassword: {
		body: z.object({
			userId: z.uuid(),
			token: z.hex(),
			newPassword: z.string().min(8),
		}),
	},
	logout: {
		response: {
			200: z.object({
				message: z.string(),
			}),
		},
	},
};

export type LoginRequestBody = z.infer<typeof schemas.login.body>;
export type RegisterRequestBody = z.infer<typeof schemas.register.body>;
export type VerifyEmailRequestQuery = z.infer<
	typeof schemas.verifyEmail.querystring
>;
export type ResendVerificationEmailRequestBody = z.infer<
	typeof schemas.resendVerificationEmail.body
>;
export type RequestPasswordResetRequestBody = z.infer<
	typeof schemas.requestPasswordReset.body
>;
export type ResetPasswordRequestBody = z.infer<
	typeof schemas.resetPassword.body
>;
