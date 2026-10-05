import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { EnvService } from './env/env.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const envService = app.get(EnvService);

  const port = envService.get('PORT');
  const corsOrigin = envService.get('CORS_ORIGIN');

  app.enableShutdownHooks();

  app.enableCors({
    origin: corsOrigin,
  });

  await app.listen(port);
}

bootstrap();
