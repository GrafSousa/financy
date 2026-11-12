import { Category } from '../../enterprise/entities/category';

export interface FindByParams {
  userId: string;
  name: string;
}

export abstract class CategoriesRepository {
  abstract save(category: Category): Promise<void>;
  abstract delete(category: Category): Promise<void>;
  abstract create(category: Category): Promise<void>;
  abstract findManyByUserId(userId: string): Promise<Category[]>;
  abstract findById(categoryId: string): Promise<Category | null>;
  abstract findByParams(params: FindByParams): Promise<Category | null>;
}
