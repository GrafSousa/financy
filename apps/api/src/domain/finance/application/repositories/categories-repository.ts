import { Category } from '../../enterprise/entities/category';

export interface FindByParams {
  userId: string;
  name: string;
}

export abstract class CategoriesRepository {
  abstract create(category: Category): Promise<void>;
  abstract findByParams(params: FindByParams): Promise<Category | null>;
}
