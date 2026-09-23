import { UserAlreadyExistsError } from '@/domain/finance/application/use-cases/errors/user-already-exists-error';
import { RegisterUserUseCase } from '@/domain/finance/application/use-cases/register-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createAccountSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
});

type CreateAccountDto = z.infer<typeof createAccountSchema>;

const bodyValidationPipe = new ZodValidationPipe(createAccountSchema);

@Controller('accounts')
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateAccountDto) {
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
