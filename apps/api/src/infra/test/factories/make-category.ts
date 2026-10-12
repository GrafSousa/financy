import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Category,
  CategoryProps,
} from '@/domain/finance/enterprise/entities/category';

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityId,
) {
  const category = Category.create(
    {
      color: faker.color.rgb({ format: 'hex', casing: 'lower' }),
      icon: faker.image.avatar(),
      name: faker.lorem.word(),
      userId: new UniqueEntityId(),
      description: faker.lorem.words(),
      ...override,
    },
    id,
  );

  return category;
}
