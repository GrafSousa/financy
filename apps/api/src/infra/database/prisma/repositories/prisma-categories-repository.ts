import {
  CategoriesRepository,
  FindByParams,
} from '@/domain/finance/application/repositories/categories-repository';
import { Category } from '@/domain/finance/enterprise/entities/category';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper';
import { normalizeString } from '@financy/utils';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await this.prisma.category.create({
      data,
    });
  }

  async findByParams(params: FindByParams): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        name: normalizeString(params.name),
        userId: params.userId,
      },
    });

    if (!category) {
      return null;
    }

    return PrismaCategoryMapper.toDomain(category);
  }
}
