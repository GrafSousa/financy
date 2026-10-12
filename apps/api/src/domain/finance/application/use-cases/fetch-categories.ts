import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories-repository';
import { Either, right } from '@/core/either';
import { Category } from '../../enterprise/entities/category';

interface FetchCategoriesUseCaseRequest {
  userId: string;
}

type FetchCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[];
  }
>;

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    userId,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findManyByUserId(userId);

    return right({ categories });
  }
}
