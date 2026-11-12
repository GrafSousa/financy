import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteCategoryUseCase } from '@/domain/finance/application/use-cases/delete-category';
import { User } from '@/domain/finance/enterprise/entities/user';
import { CurrentUser } from '@nestjs/authentication';
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

@Controller('category/:id')
export class DeleteCategoryController {
  constructor(private deleteCategoryUseCase: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') categoryId: string, @CurrentUser() user: User) {
    const userId = user.id.toString();

    const result = await this.deleteCategoryUseCase.execute({
      categoryId,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
