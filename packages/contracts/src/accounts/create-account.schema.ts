import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export type CreateAccountRequest = z.infer<typeof createAccountSchema>;
