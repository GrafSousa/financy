import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { UserFactory } from '@/infra/test/factories/make-user';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { HashGenerator } from '@/domain/finance/application/cryptography/hash-generator';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

describe('e2e: Authenticate', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let hashGenerator: HashGenerator;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    hashGenerator = moduleRef.get(HashGenerator);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /sessions', async () => {
    await userFactory.makePrismaUser({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: await hashGenerator.hash('123456'),
    });

    const result = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(result.statusCode).toBe(204);

    const cookies = result.headers['set-cookie'];

    expect(cookies).toBeDefined();
    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('__Host-sid=')]),
    );
  });
});
