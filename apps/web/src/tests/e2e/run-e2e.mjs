import { loadEnvFile } from 'node:process';
import { join, resolve } from 'node:path';

import { E2ETestOrchestrator } from './orchestrator.mjs';

const e2eDirectory = import.meta.dirname;
const webDirectory = resolve(e2eDirectory, '../../..');
const monorepoRoot = resolve(webDirectory, '../..');

const envFile = join(e2eDirectory, '.env.e2e');
const composeFile = join(e2eDirectory, 'compose.e2e.yaml');

loadEnvFile(envFile);

const orchestrator = E2ETestOrchestrator.create({
  monorepoRoot,
  envFile,
  composeFile,
  playwrightArguments: process.argv.slice(2),
});

orchestrator.registerSignalHandlers();

orchestrator
  .execute()
  .then(() => {
    process.exitCode = orchestrator.getExitCode();
  })
  .catch((error) => {
    console.error(error);

    process.exitCode = orchestrator.getExitCode() || 1;
  });
