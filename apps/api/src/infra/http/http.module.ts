import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/finance/application/use-cases/register-user';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ValidateUserUseCase } from '@/domain/finance/application/use-cases/validate-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
  ],
  providers: [RegisterUserUseCase, ValidateUserUseCase],
})
export class HttpModule {}
