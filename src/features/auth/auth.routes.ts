import type { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";
import { schemas } from "./schemas";

export const authRoutes = async (app: FastifyInstance) => {
	const authController = container.resolve(AuthController);

	// Login
	app.post(
		"/login",
		{
			schema: schemas.login,
		},
		async (request, reply) => authController.login(request, reply),
	);

	// Register
	app.post(
		"/register",
		{
			schema: schemas.register,
		},
		async (request, reply) => authController.register(request, reply),
	);

	// Verify Email
	app.get(
		"/verify-email",
		{
			schema: schemas.verifyEmail,
		},
		async (request, reply) => authController.verifyEmail(request, reply),
	);

	// Resend Email Verification
	app.post(
		"/resend-verification-email",
		{
			schema: schemas.resendVerificationEmail,
		},
		async (request, reply) =>
			authController.resendVerificationEmail(request, reply),
	);

	// Send Reset Password Email
	app.post(
		"/request-password-reset",
		{
			schema: schemas.requestPasswordReset,
		},
		async (request, reply) =>
			authController.requestPasswordReset(request, reply),
	);

	// Reset Password
	app.post(
		"/reset-password",
		{
			schema: schemas.resetPassword,
		},
		async (request, reply) => authController.resetPassword(request, reply),
	);

	// Logout
	app.post(
		"/logout",
		{
			schema: schemas.logout,
		},
		async (request, reply) => authController.logout(request, reply),
	);
};
