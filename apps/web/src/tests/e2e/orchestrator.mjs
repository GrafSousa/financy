import { spawn } from 'node:child_process';

export class E2ETestOrchestrator {
  #activeProcess;
  #receivedSignal;

  constructor({
    monorepoRoot,
    envFile,
    composeFile,
    playwrightArguments = [],
  }) {
    this.monorepoRoot = monorepoRoot;
    this.envFile = envFile;
    this.composeFile = composeFile;
    this.playwrightArguments = playwrightArguments;

    this.pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

    this.dockerCommand = process.platform === 'win32' ? 'docker.exe' : 'docker';
  }

  static create(props) {
    return new E2ETestOrchestrator(props);
  }

  registerSignalHandlers() {
    process.once('SIGINT', () => {
      this.#handleSignal('SIGINT');
    });

    process.once('SIGTERM', () => {
      this.#handleSignal('SIGTERM');
    });
  }

  async execute() {
    let executionError;

    try {
      await this.#stopInfrastructure();
      await this.#startInfrastructure();
      await this.#applyMigrations();
      await this.#runTests();
    } catch (error) {
      executionError = error;
    } finally {
      try {
        await this.#stopInfrastructure();
      } catch (cleanupError) {
        if (!executionError) {
          throw cleanupError;
        }

        console.error('Failed to clean E2E infrastructure:', cleanupError);
      }
    }

    if (executionError) {
      throw executionError;
    }
  }

  getExitCode() {
    if (this.#receivedSignal === 'SIGINT') {
      return 130;
    }

    if (this.#receivedSignal === 'SIGTERM') {
      return 143;
    }

    return 0;
  }

  async #startInfrastructure() {
    await this.#runCommand(this.dockerCommand, [
      'compose',
      '--env-file',
      this.envFile,
      '--file',
      this.composeFile,
      '--project-name',
      'financy-web-e2e',
      'up',
      '--detach',
      '--wait',
    ]);
  }

  async #applyMigrations() {
    await this.#runCommand(this.pnpmCommand, [
      '--filter',
      '@financy/api',
      'exec',
      'prisma',
      'migrate',
      'deploy',
    ]);
  }

  async #runTests() {
    await this.#runCommand(this.pnpmCommand, [
      '--filter',
      '@financy/web',
      'exec',
      'playwright',
      'test',
      ...this.playwrightArguments,
    ]);
  }

  async #stopInfrastructure() {
    await this.#runCommand(this.dockerCommand, [
      'compose',
      '--env-file',
      this.envFile,
      '--file',
      this.composeFile,
      '--project-name',
      'financy-web-e2e',
      'down',
      '--volumes',
      '--remove-orphans',
    ]);
  }

  #handleSignal(signal) {
    this.#receivedSignal = signal;
    this.#activeProcess?.kill(signal);
  }

  #runCommand(command, args) {
    return new Promise((resolvePromise, rejectPromise) => {
      const child = spawn(command, args, {
        cwd: this.monorepoRoot,
        env: process.env,
        stdio: 'inherit',
      });

      this.#activeProcess = child;

      child.once('error', (error) => {
        this.#activeProcess = undefined;
        rejectPromise(error);
      });

      child.once('exit', (code, signal) => {
        this.#activeProcess = undefined;

        if (code === 0) {
          resolvePromise();
          return;
        }

        const message = signal
          ? `${command} was interrupted by ${signal}`
          : `${command} exited with code ${code}`;

        rejectPromise(new Error(message));
      });
    });
  }
}
