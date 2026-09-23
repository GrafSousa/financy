import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter: PrismaService.createPrismaAdapter(process.env.DATABASE_URL),
    });
  }

  private static createPrismaAdapter(databaseUrl: string | undefined) {
    if (!databaseUrl) {
      throw new Error('Please provide a DATABASE_URL environment variable.');
    }

    const url = new URL(databaseUrl);
    const schema = url.searchParams.get('schema') ?? 'public';

    return new PrismaPg({ connectionString: databaseUrl }, { schema });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
