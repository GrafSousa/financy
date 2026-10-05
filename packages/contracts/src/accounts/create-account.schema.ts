import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
});

export type CreateAccountRequest = z.infer<typeof createAccountSchema>;
