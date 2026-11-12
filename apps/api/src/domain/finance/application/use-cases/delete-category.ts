import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface DeleteCategoryRequest {
  userId: string;
  categoryId: string;
}

type DeleteCategoryResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    userId,
    categoryId,
  }: DeleteCategoryRequest): Promise<DeleteCategoryResponse> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    if (!category.userId.equals(new UniqueEntityId(userId))) {
      return left(new NotAllowedError());
    }

    await this.categoriesRepository.delete(category);

    return right(null);
  }
}
