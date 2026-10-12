import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
});

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
