import { Public, SignInService } from '@nestjs/authentication';
import {
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

@Public()
@Controller('sign-out')
export class SignOutController {
  constructor(private readonly signInService: SignInService) {}

  @HttpCode(204)
  @Post()
  async handle() {
    if (!(await this.signInService.signOut())) {
      throw new UnauthorizedException();
    }
  }
}
