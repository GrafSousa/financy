import { Prisma, User as PrismaUser } from '@/generated/prisma/client';

import { User } from '@/domain/finance/enterprise/entities/user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const user = User.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.passwordHash,
      },
      new UniqueEntityId(raw.id),
    );

    return user;
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      email: user.email,
      name: user.name,
      id: user.id.toString(),
      passwordHash: user.password,
    };
  }
}
