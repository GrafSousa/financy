import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { z } from 'zod';

const envFilePath = resolve(__dirname, '.env.e2e');

loadEnvFile(envFilePath);

const e2eEnvSchema = z.object({
  E2E_BASE_URL: z.url(),
  NEXT_PUBLIC_API_URL: z.url(),
  DATABASE_URL: z.url(),
  POSTGRES_DB: z.literal('financy_e2e'),
  E2E_DATABASE_CLEANUP_ENABLED: z.literal('true'),
});

export const e2eEnv = e2eEnvSchema.parse(process.env);
