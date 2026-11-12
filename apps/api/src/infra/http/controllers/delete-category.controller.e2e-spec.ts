import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { UserFactory } from '@/infra/test/factories/make-user';
import { HashGenerator } from '@/domain/finance/application/cryptography/hash-generator';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { CategoryFactory } from '@/infra/test/factories/make-category';

describe('e2e: Delete category', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let categoryFactory: CategoryFactory;
  let hashGenerator: HashGenerator;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [UserFactory, CategoryFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    categoryFactory = moduleRef.get(CategoryFactory);
    hashGenerator = moduleRef.get(HashGenerator);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[DELETE] /category', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: await hashGenerator.hash('123456'),
    });

    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    });

    const res = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@test.com',
      password: '123456',
    });

    const cookie = res.headers['set-cookie'][0].split(';')[0];

    const categoryId = category.id.toString();

    const result = await request(app.getHttpServer())
      .delete(`/category/${categoryId}`)
      .set('Cookie', cookie)
      .send();

    expect(result.statusCode).toBe(204);

    const categoryOnDatabase = await prisma.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    expect(categoryOnDatabase).toBe(null);
  });
});
