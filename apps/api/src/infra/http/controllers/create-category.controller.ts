import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  createCategorySchema,
  type CreateCategoryRequest,
} from '@financy/contracts';

import { CreateCategoryUseCase } from '@/domain/finance/application/use-cases/create-category';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CategoryAlreadyExistsError } from '@/domain/finance/application/use-cases/errors/category-already-exists-error';
import { CurrentUser } from '@nestjs/authentication';
import { User } from '@/domain/finance/enterprise/entities/user';

const bodyValidationPipe = new ZodValidationPipe(createCategorySchema);

@Controller('/category')
export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryRequest,
    @CurrentUser() user: User,
  ) {
    const userId = user.id.toString();
    const result = await this.createCategoryUseCase.execute({
      ...body,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case CategoryAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
