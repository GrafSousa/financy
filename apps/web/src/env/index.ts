import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_E2E_BASE_URL: process.env.NEXT_PUBLIC_E2E_BASE_URL,
});

if (!result.success) {
  console.error(z.treeifyError(result.error));

  throw new Error('Invalid environment variables');
}

export const env = result.data;
