import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import { HttpModule } from './http/http.module';
import { HealthModule } from './health/health.module';
import { EnvModule } from './env/env.module';
import { envSchema } from './env/env';
import { EnvService } from './env/env.service';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthModule } from './auth/auth.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthenticationModule.forRoot({
      session: {
        absoluteTtl: '14d',
        idleTtl: '3d',
        trustedOrigins: ['http://localhost:3000'],
        cookieName: '__Host-financy-session',
      },
    }),
    HttpModule,
    HealthModule,
    EnvModule,
    AuthModule,
    ObserveModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (config: EnvService) => ({
        appKey: config.get('NESTJS_OBSERVE_APP_KEY'),
        appSecret: config.get('NESTJS_OBSERVE_APP_SECRET'),
        serviceId: config.get('NESTJS_OBSERVE_SERVICE_ID'),
      }),
    }),
  ],
})
export class AppModule {}
