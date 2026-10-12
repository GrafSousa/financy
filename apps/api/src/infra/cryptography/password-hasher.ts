import { PasswordHasher as NestPasswordHasher } from '@nestjs/authentication';

import { HashComparer } from '@/domain/finance/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/finance/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHasher implements HashGenerator, HashComparer {
  constructor(private passwordHasher: NestPasswordHasher) {}

  hash(plain: string): Promise<string> {
    return this.passwordHasher.hash(plain);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return this.passwordHasher.verify(plain, hash);
  }
}
