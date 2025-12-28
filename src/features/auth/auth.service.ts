import crypto from "node:crypto";
import { env } from "@config/env";
import { AppError } from "@shared/errors/AppError";
import type { CacheServiceProvider } from "@shared/providers/cache/interface/CacheServiceProvider";
import type { EmailCodeVerificationTemplateVariables, MailTemplateServiceProvider } from "@shared/providers/mail-templating/interfaces/MailTemplateServiceProvider";
import type { MailServiceProvider } from "@shared/providers/mailing/interface/MailServiceProvider";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import type { UsersRepository } from "../users/users.repository";
import type { CheckPasswordDTO, EmailVerificationCache, LoginDTO, LoginResponse, RegisterDTO, SendVerificationEmailDTO, VerifyEmailDTO } from "./types";

@injectable()
export class AuthService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepository,

    @inject("CacheServiceProvider")
    private cacheServiceProvider: CacheServiceProvider,

    @inject("MailServiceProvider")
    private mailService: MailServiceProvider,

    @inject("MailTemplateServiceProvider")
    private mailTemplateService: MailTemplateServiceProvider,
  ) { }

  async login(data: LoginDTO): Promise<LoginResponse> {
    const user = await this.usersRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    if (!user.isEmailVerified) {
      throw new AppError("Email não verificado. Por favor, verifique seu email antes de fazer login.", 401);
    }

    const isPasswordValid = await this.checkPassword({
      hashedPassword: user.password,
      password: data.password,
    })

    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    return { token };
  }

  async register(data: RegisterDTO): Promise<void> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Usuário com este email já existe", 409);
    }

    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate verification code
    const verificationToken = crypto.randomBytes(16).toString('hex');

    // Add code to cache with expiration time of 15 minutes
    await this.cacheServiceProvider.set<EmailVerificationCache>(`user-email-verification-token:${newUser.id}`, verificationToken, 15 * 60);

    // Send verification email
    await this.sendVerificationEmail({
      email: newUser.email,
      name: newUser.name,
      userId: newUser.id,
      token: verificationToken,
    })
  }

  async checkPassword(data: CheckPasswordDTO): Promise<boolean> {
    return await bcrypt.compare(data.password, data.hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, env.PASSWORD_SALT_ROUNDS);
  }

  async verifyEmail(data: VerifyEmailDTO): Promise<void> {
    const verificationToken = await this.cacheServiceProvider.get<EmailVerificationCache>(`user-email-verification-token:${data.userId}`);

    if (!verificationToken) {
      throw new AppError("Token de Verificação inválido ou expirado", 400);
    }

    if (data.token !== verificationToken) {
      throw new AppError("Token de Verificação inválido", 400);
    }

    await this.cacheServiceProvider.delete(`user-email-verification-token:${data.userId}`);
    await this.usersRepository.verifyUserEmail(data.userId)
  }

  async resendEmailVerification(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email já verificado", 400);
    }

    // Check if there's already a verification code in cache
    const existingToken = await this.cacheServiceProvider.get<EmailVerificationCache>(`user-email-verification-token:${user.id}`);

    if (existingToken) {
      throw new AppError("Um token de verificação já foi enviado. Por favor, verifique seu email.", 429);
    }

    // Generate verification code
    const verificationToken = crypto.randomBytes(16).toString('hex');

    // Add code to cache with expiration time of 15 minutes
    await this.cacheServiceProvider.set<EmailVerificationCache>(`user-email-verification-token:${user.id}`, verificationToken, 15 * 60);

    // Send verification email
    await this.sendVerificationEmail({
      email: user.email,
      name: user.name,
      userId: user.id,
      token: verificationToken,
    });
  }

  async sendVerificationEmail(data: SendVerificationEmailDTO): Promise<void> {
    await this.mailService.sendMail({
      to: data.email,
      subject: "Verificação de Email",
      html: await this.mailTemplateService.format<EmailCodeVerificationTemplateVariables>({
        name: "email-verification.njk",
        variables: {
          name: data.name,
          app_url: env.APP_URL,
          token: data.token,
          userId: data.userId,
          currentYear: new Date().getFullYear(),
          expirationTime: 15,
        },
      }),
    })
  }
}
