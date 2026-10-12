import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@/domain/finance/application/repositories/users-repository';
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository';
import { CategoriesRepository } from '@/domain/finance/application/repositories/categories-repository';

@Module({
  providers: [
    PrismaService,
    {
      useClass: PrismaUsersRepository,
      provide: UsersRepository,
    },
    {
      useClass: PrismaCategoriesRepository,
      provide: CategoriesRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, CategoriesRepository],
})
export class DatabaseModule {}
