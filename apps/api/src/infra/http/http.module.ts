import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/finance/application/use-cases/register-user';
import { DatabaseModule } from '@/infra/database/database.module';
import { CreateAccountController } from './controllers/create-account';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
