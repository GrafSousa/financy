import { Module } from '@nestjs/common';

import { PasswordHasher } from './password-hasher';
import { HashGenerator } from '@/domain/finance/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/finance/application/cryptography/hash-comparer';

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: PasswordHasher,
    },
    {
      provide: HashComparer,
      useClass: PasswordHasher,
    },
  ],
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
