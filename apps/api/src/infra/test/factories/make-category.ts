import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Category,
  CategoryProps,
} from '@/domain/finance/enterprise/entities/category';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper';

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

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data);

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    });

    return category;
  }
}
