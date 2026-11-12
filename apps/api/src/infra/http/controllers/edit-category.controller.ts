import { EditCategoryUseCase } from '@/domain/finance/application/use-cases/edit-category';
import { User } from '@/domain/finance/enterprise/entities/user';
import { CurrentUser } from '@nestjs/authentication';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  type EditCategoryRequest,
  editCategorySchema,
} from '@financy/contracts';
import { CategoryAlreadyExistsError } from '@/domain/finance/application/use-cases/errors/category-already-exists-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

const bodyValidationPipe = new ZodValidationPipe(editCategorySchema);

@Controller('category/:id')
export class EditCategoryController {
  constructor(private editCategoryUseCase: EditCategoryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') categoryId: string,
    @CurrentUser() user: User,
    @Body(bodyValidationPipe) body: EditCategoryRequest,
  ) {
    const result = await this.editCategoryUseCase.execute({
      id: categoryId,
      userId: user.id.toString(),
      ...body,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        case CategoryAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
