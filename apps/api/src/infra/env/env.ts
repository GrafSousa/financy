import { z } from 'zod';

export const envSchema = z.object({
  CORS_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  NESTJS_OBSERVE_SERVICE_ID: z.string().min(1),
  NESTJS_OBSERVE_APP_KEY: z.string().min(1),
  NESTJS_OBSERVE_APP_SECRET: z.string().min(1),
  PORT: z.coerce.number().optional().default(3333),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

export type Env = z.infer<typeof envSchema>;
