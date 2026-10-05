import { UserAlreadyExistsError } from '@/domain/finance/application/use-cases/errors/user-already-exists-error';
import { RegisterUserUseCase } from '@/domain/finance/application/use-cases/register-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  createAccountSchema,
  type CreateAccountRequest,
} from '@financy/contracts';

const bodyValidationPipe = new ZodValidationPipe(createAccountSchema);

@Controller('accounts')
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateAccountRequest) {
    const result = await this.registerUser.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
