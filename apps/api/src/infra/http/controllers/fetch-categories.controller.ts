import { FetchCategoriesUseCase } from '@/domain/finance/application/use-cases/fetch-categories';
import { User } from '@/domain/finance/enterprise/entities/user';
import { CategoryPresenter } from '@/infra/presenters/category-presenter';
import { CurrentUser } from '@nestjs/authentication';
import { BadRequestException, Controller, Get } from '@nestjs/common';

@Controller('category')
export class FetchCategoriesController {
  constructor(private fetchCategoriesUseCase: FetchCategoriesUseCase) {}

  @Get()
  async handle(@CurrentUser() user: User) {
    const userId = user.id.toString();

    const result = await this.fetchCategoriesUseCase.execute({ userId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { categories } = result.value;

    return {
      categories: categories.map((category) =>
        CategoryPresenter.toHTTP(category),
      ),
    };
  }
}
