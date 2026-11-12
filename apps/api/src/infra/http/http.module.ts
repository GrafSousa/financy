import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from '@/domain/finance/application/use-cases/register-user';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ValidateUserUseCase } from '@/domain/finance/application/use-cases/validate-user';
import { CreateCategoryController } from './controllers/create-category.controller';
import { CreateCategoryUseCase } from '@/domain/finance/application/use-cases/create-category';
import { FetchCategoriesController } from './controllers/fetch-categories.controller';
import { FetchCategoriesUseCase } from '@/domain/finance/application/use-cases/fetch-categories';
import { SignOutController } from './controllers/sign-out.controller';
import { DeleteCategoryController } from './controllers/delete-category.controller';
import { DeleteCategoryUseCase } from '@/domain/finance/application/use-cases/delete-category';
import { EditCategoryController } from './controllers/edit-category.controller';
import { EditCategoryUseCase } from '@/domain/finance/application/use-cases/edit-category';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateCategoryController,
    FetchCategoriesController,
    SignOutController,
    DeleteCategoryController,
    EditCategoryController,
  ],
  providers: [
    RegisterUserUseCase,
    ValidateUserUseCase,
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    DeleteCategoryUseCase,
    EditCategoryUseCase,
  ],
})
export class HttpModule {}
