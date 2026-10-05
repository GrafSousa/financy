import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';

describe('e2e: Health check', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /health/live', async () => {
    const result = await request(app.getHttpServer())
      .get('/health/live')
      .send();

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      status: 'ok',
    });
  });

  test('[GET] /health/ready', async () => {
    const result = await request(app.getHttpServer())
      .get('/health/ready')
      .send();

    expect(result.statusCode).toBe(200);
    expect(result.body).toMatchObject({
      status: 'ok',
      info: {
        database: {
          status: 'up',
        },
      },
    });
  });
});
