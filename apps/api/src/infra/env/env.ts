import { z } from 'zod';

export const envSchema = z.object({
  CORS_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  NESTJS_OBSERVE_SERVICE_ID: z.string(),
  NESTJS_OBSERVE_APP_KEY: z.string(),
  NESTJS_OBSERVE_APP_SECRET: z.string(),
  PORT: z.coerce.number().optional().default(3333),
});

export type Env = z.infer<typeof envSchema>;
