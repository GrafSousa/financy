import { EditCategoryRequest } from '@financy/contracts';

import { Either, left, right } from '@/core/either';
import { CategoriesRepository } from '../repositories/categories-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Category } from '../../enterprise/entities/category';
import { normalizeString } from '@financy/utils';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';
import { Injectable } from '@nestjs/common';

type EditCategoryUseCaseRequest = EditCategoryRequest & {
  id: string;
  userId: string;
};

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | CategoryAlreadyExistsError,
  {
    category: Category;
  }
>;

@Injectable()
export class EditCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
    userId,
    color,
    icon,
    name,
    description,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    if (category.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    if (name !== undefined) {
      const normalizedName = normalizeString(name);

      if (normalizedName !== category.name) {
        const categoryWithSameName =
          await this.categoriesRepository.findByParams({
            name,
            userId,
          });

        if (categoryWithSameName) {
          return left(new CategoryAlreadyExistsError(normalizedName));
        }
      }

      category.name = normalizedName;
    }

    if (icon) {
      category.icon = icon;
    }

    if (color) {
      category.color = color;
    }

    if (description) {
      category.description = description;
    }

    await this.categoriesRepository.save(category);

    return right({
      category,
    });
  }
}
