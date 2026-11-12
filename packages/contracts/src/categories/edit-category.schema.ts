import { z } from 'zod';

export const editCategorySchema = z.object({
  icon: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
});

export type EditCategoryRequest = z.infer<typeof editCategorySchema>;
