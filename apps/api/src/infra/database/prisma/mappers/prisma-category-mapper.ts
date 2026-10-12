import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Category } from '@/domain/finance/enterprise/entities/category';
import { Prisma, Category as PrismaCategory } from '@/generated/prisma/client';

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory) {
    const category = Category.create(
      {
        icon: raw.icon,
        name: raw.name,
        color: raw.color,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        description: raw.description,
        userId: new UniqueEntityId(raw.userId),
      },
      new UniqueEntityId(raw.id),
    );

    return category;
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      userId: category.userId.toString(),
      icon: category.icon,
      name: category.name,
      color: category.color,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
