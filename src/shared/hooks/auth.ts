import { env } from "@config/env";
import { AppError } from "@shared/errors/AppError";
import type { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

/**
 * Hook: Require authentication
 * Verifies user has valid JWT token from cookies
 */
export async function requireAuth(
  request: FastifyRequest,
): Promise<void> {
  const token = request.cookies.Authorization;

  if (!token) {
    throw new AppError("Token não fornecido", 401);
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string };

    // Attach user ID to request for use in route handlers
    request.userId = payload.id;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expirado", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Token inválido", 401);
    }
    throw new AppError("Erro ao verificar token", 401);
  }
}
