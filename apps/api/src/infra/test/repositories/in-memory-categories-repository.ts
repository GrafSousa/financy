import { normalizeString } from '@financy/utils';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  CategoriesRepository,
  FindByParams,
} from '@/domain/finance/application/repositories/categories-repository';
import { Category } from '@/domain/finance/enterprise/entities/category';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [];

  async create(category: Category): Promise<void> {
    this.items.push(category);
  }

  async findManyByUserId(userId: string): Promise<Category[]> {
    const categories = this.items.filter((item) =>
      item.userId.equals(new UniqueEntityId(userId)),
    );

    return categories;
  }

  async findByParams({ name, userId }: FindByParams): Promise<Category | null> {
    const category = this.items.find(
      (item) =>
        item.name === normalizeString(name) &&
        item.userId.equals(new UniqueEntityId(userId)),
    );

    if (!category) {
      return null;
    }

    return category;
  }
}
