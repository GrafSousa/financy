import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { UserFactory } from '@/infra/test/factories/make-user';
import { HashGenerator } from '@/domain/finance/application/cryptography/hash-generator';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

describe('e2e: Create category', () => {
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

  test('[POST] /category', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: await hashGenerator.hash('123456'),
    });

    const res = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@test.com',
      password: '123456',
    });

    const cookie = res.headers['set-cookie'][0].split(';')[0];

    const result = await request(app.getHttpServer())
      .post('/category')
      .set('Cookie', cookie)
      .send({
        name: 'category-name-test',
        description: 'category-description-test',
        icon: 'category-icon-test',
        color: '#7159c1',
      });

    const category = await prisma.category.findFirst({
      where: {
        name: 'category-name-test',
        userId: user.id.toString(),
      },
    });

    expect(result.statusCode).toBe(204);

    expect(category).toEqual(
      expect.objectContaining({
        name: 'category-name-test',
      }),
    );
  });
});
