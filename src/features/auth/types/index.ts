export interface LoginDTO {
	email: string;
	password: string;
}

export interface RegisterDTO {
	name: string;
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
}

export interface CheckPasswordDTO {
	password: string;
	hashedPassword: string;
}

export interface VerifyEmailDTO {
	userId: string;
	token: string;
}

export interface SendVerificationEmailDTO {
	email: string;
	name: string;
	userId: string;
}

export interface SendPasswordResetEmailDTO {
	email: string;
	name: string;
	userId: string;
}

export interface ResetPasswordDTO {
	userId: string;
	token: string;
	newPassword: string;
}

export type EmailVerificationCache = string;

export type PasswordResetCache = string;
