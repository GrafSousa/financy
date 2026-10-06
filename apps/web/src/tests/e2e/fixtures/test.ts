import { test as base } from '@playwright/test';
import { E2EDatabase } from '../database';
import { e2eEnv } from '../env';

type MyFixtures = {
  cleanDatabase: void;
};

interface WorkerFixtures {
  database: E2EDatabase;
}

export const test = base.extend<MyFixtures, WorkerFixtures>({
  database: [
    async ({}, use) => {
      const database = E2EDatabase.create({
        connectionString: e2eEnv.DATABASE_URL,
        databaseName: e2eEnv.POSTGRES_DB,
      });

      await database.validate();

      await use(database);

      await database.close();
    },
    {
      scope: 'worker',
    },
  ],

  cleanDatabase: [
    async ({ database }, use) => {
      await database.clean();

      await use();
    },
    {
      auto: true,
    },
  ],
});

export { expect } from '@playwright/test';
