import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Public, SignInService } from '@nestjs/authentication';

import {
  authenticateUserSchema,
  type AuthenticateUserRequest,
} from '@financy/contracts';
import { WrongCredentialsError } from '@/domain/finance/application/use-cases/errors/wrong-credentials-error';
import { ValidateUserUseCase } from '@/domain/finance/application/use-cases/validate-user';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const bodyValidationPipe = new ZodValidationPipe(authenticateUserSchema);

@Public()
@Controller('sessions')
export class AuthenticateController {
  constructor(
    private validateUserUseCase: ValidateUserUseCase,
    private readonly signInService: SignInService,
  ) {}

  @Post()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: AuthenticateUserRequest) {
    const { email, password } = body;

    const result = await this.validateUserUseCase.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;
    await this.signInService.signIn(user.id.toString(), {
      method: 'password',
    });
  }
}
