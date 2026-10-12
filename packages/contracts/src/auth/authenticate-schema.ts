import { z } from 'zod';

export const authenticateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type AuthenticateUserRequest = z.infer<typeof authenticateUserSchema>;

export type AuthenticateUserResponse = {
  accessToken: string;
};
