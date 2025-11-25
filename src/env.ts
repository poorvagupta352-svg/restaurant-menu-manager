import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SESSION_SECRET: z.string().default("change-me-in-production"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

function getEnv() {
  if (process.env.SKIP_ENV_VALIDATION === "true") {
    return process.env as unknown as z.infer<typeof envSchema>;
  }
  return envSchema.parse(process.env);
}

export const env = getEnv();
