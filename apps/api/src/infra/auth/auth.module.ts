import { Module } from '@nestjs/common';
import { SessionAuth } from './session-auth.provider.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [SessionAuth],
})
export class AuthModule {}
