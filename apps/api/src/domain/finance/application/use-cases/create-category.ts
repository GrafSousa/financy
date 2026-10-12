import { Injectable } from '@nestjs/common';
import { CreateCategoryRequest } from '@financy/contracts';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { Category } from '../../enterprise/entities/category';
import { UsersRepository } from '../repositories/users-repository';
import { CategoriesRepository } from '../repositories/categories-repository';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';

type CreateCategoryUseCaseRequest = CreateCategoryRequest & {
  userId: string;
};

type CreateCategoryResponse = Either<
  ResourceNotFoundError | CategoryAlreadyExistsError,
  { category: Category }
>;

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    name,
    icon,
    color,
    userId,
    description,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const categoryWithSameName = await this.categoriesRepository.findByParams({
      name,
      userId,
    });

    if (categoryWithSameName) {
      return left(new CategoryAlreadyExistsError(name));
    }

    const category = Category.create({
      name,
      icon,
      color,
      description,
      userId: user.id,
    });

    await this.categoriesRepository.create(category);

    return right({ category });
  }
}
