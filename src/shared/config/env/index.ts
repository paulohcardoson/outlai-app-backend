import z from "zod";

const enviroments = z.object({
  APP_MODE: z.enum(["development", "production", "test"]).default("development"),
  APP_PORT: z.coerce.number(),
  APP_URL: z.url(),

  // PostgreSQL
  POSTGRES_DATABASE: z.url(),
  PASSWORD_SALT_ROUNDS: z.coerce.number(),

  // JWT
  JWT_SECRET: z.string(),

  // Redis
  REDIS_URL: z.url(),

  // Mailtrap
  MAILTRAP_HOST: z.string(),
  MAILTRAP_PORT: z.coerce.number(),
  MAILTRAP_USER: z.string(),
  MAILTRAP_PASS: z.string(),

  // Google Gemini
  GEMINI_API_KEY: z.string(),
});

const env = enviroments.parse(process.env);

export { env };
