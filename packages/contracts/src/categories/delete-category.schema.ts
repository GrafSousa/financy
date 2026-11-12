import { z } from 'zod';

export const deleteCategorySchema = z.object({
  categoryId: z.uuid(),
});

export type DeleteCategoryRequest = z.infer<typeof deleteCategorySchema>;
