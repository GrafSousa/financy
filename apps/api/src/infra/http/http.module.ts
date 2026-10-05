import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/finance/application/use-cases/register-user';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccountController } from './controllers/create-account.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
