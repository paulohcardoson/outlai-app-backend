import z from "zod";

const enviroments = z.object({
	APP_PORT: z.coerce.number(),
	POSTGRES_DATABASE: z.url(),
	PASSWORD_SALT_ROUNDS: z.coerce.number(),
});

const env = enviroments.parse(process.env);

export { env };
