import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { AuthenticateUserRequest } from '@financy/contracts';

import { HashComparer } from '../cryptography/hash-comparer';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { UsersRepository } from '../repositories/users-repository';
import { User } from '../../enterprise/entities/user';

type ValidateUserResponse = Either<
  WrongCredentialsError,
  {
    user: User;
  }
>;

@Injectable()
export class ValidateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<ValidateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isSamePassword = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isSamePassword) {
      return left(new WrongCredentialsError());
    }

    return right({ user });
  }
}
