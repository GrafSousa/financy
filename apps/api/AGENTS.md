# @financy/api — Technical guide (NestJS)

HTTP API in **NestJS 12** on Express, with **Clean Architecture + DDD**. The domain doesn't depend on Nest or Prisma (the only exception is `@Injectable()` on use cases), and the infrastructure implements the domain abstractions through dependency injection.

## Layers

Each layer has its own guide with its purpose, rules and patterns. Read the guide of the layer you are changing.

| Layer | Purpose | Guide |
| --- | --- | --- |
| `src/core` | Generic kernel: `Either`, `Entity`, `UniqueEntityId`, base errors. No business rules, no frameworks. | [src/core/AGENTS.md](src/core/AGENTS.md) |
| `src/domain` | Business rules: entities, repository contracts, use cases and their unit tests. | [src/domain/AGENTS.md](src/domain/AGENTS.md) |
| `src/infra` | Frameworks and IO: HTTP, Prisma, session, cryptography, env, health, test doubles. | [src/infra/AGENTS.md](src/infra/AGENTS.md) |
| `src/generated/prisma` | Generated Prisma Client. Don't edit; `pnpm db:generate`. | — |

**Dependency rule:** `infra` → `domain` → `core`. Arrows point inward only: `core` imports nothing from the app, and `domain` never imports `infra`.

## NestJS documentation

Official docs: https://docs.nestjs.com. Sections used in this project:

| Topic | Where it applies here | Link |
| --- | --- | --- |
| Modules | `infra/*/*.module.ts` | https://docs.nestjs.com/modules |
| Controllers | `infra/http/controllers` | https://docs.nestjs.com/controllers |
| Providers / DI | use cases, repositories | https://docs.nestjs.com/providers |
| Custom providers (`provide`/`useClass`) | `DatabaseModule`, `CryptographyModule` | https://docs.nestjs.com/fundamentals/custom-providers |
| Dynamic modules (`forRoot`/`forRootAsync`) | `AppModule` | https://docs.nestjs.com/fundamentals/dynamic-modules |
| Pipes | `ZodValidationPipe` | https://docs.nestjs.com/pipes |
| Exceptions | `Either` → `HttpException` mapping | https://docs.nestjs.com/exception-filters |
| Lifecycle events | `PrismaService` (`onModuleInit`/`onModuleDestroy`), `enableShutdownHooks` | https://docs.nestjs.com/fundamentals/lifecycle-events |
| Configuration (`@nestjs/config`) | `ConfigModule.forRoot({ validate })`, `EnvService` | https://docs.nestjs.com/techniques/configuration |
| Testing (`@nestjs/testing`) | e2e with `Test.createTestingModule` | https://docs.nestjs.com/fundamentals/testing |
| Health checks (`@nestjs/terminus`) | `infra/health` | https://docs.nestjs.com/recipes/terminus |
| Prisma | `PrismaService` | https://docs.nestjs.com/recipes/prisma |
| CORS | `main.ts` | https://docs.nestjs.com/security/cors |
| CLI | `nest build/start` (`nest-cli.json`, entry `infra/main`) | https://docs.nestjs.com/cli/overview |

Recent packages without a consolidated page on the site. Read the README and the installed types:

- `@nestjs/authentication`: cookie session, `@Public()`, `@CurrentUser()`, `SignInService`, `SessionCookieProvider`, `AuthenticationRegistry`, `PasswordHasher`. See `node_modules/@nestjs/authentication/README.md` and `node_modules/@nestjs/authentication/dist/**/*.d.ts`.
- `@nestjs/observe`: instrumentation, `createObserveModule`. See `node_modules/@nestjs/observe/README.md`.

When in doubt about an API, check the `.d.ts` files in `node_modules/@nestjs/*`: they reflect the installed version.

## Current endpoints

| Method | Route | Auth | Success | Mapped errors |
| --- | --- | --- | --- | --- |
| `POST` | `/accounts` | public | 201 (no body) | 409 e-mail already used |
| `POST` | `/sessions` | public | 204 + `set-cookie` | 401 invalid credentials |
| `POST` | `/sign-out` | public | 204 | 401 no session |
| `GET` | `/category` | session | 200 `{ categories: CategoryPresenter[] }` | — |
| `POST` | `/category` | session | 204 | 404 user, 409 duplicated name |
| `PUT` | `/category/:id` | session | 204 | 404, 403 not the owner, 409 duplicated name |
| `DELETE` | `/category/:id` | session | 204 | 404, 403 not the owner |
| `GET` | `/health/live`, `/health/ready` | public | 200 | `ready` pings the database (used by Playwright) |

## Data model (Prisma)

- `User` 1:N `Category`, `Account`, `Transaction`.
- Money values (`Account.balance`, `Transaction.value`) are **`Int` in cents**.
- `Category` has `@@unique([userId, name])`. The name is stored **normalized** (`trim().toLowerCase()` via `normalizeString`); capitalization is done in the UI.
- `Transaction` references `Account` and `Category` by the composite key `[id, userId]`, which guarantees in the database that account and category belong to the same user as the transaction.
- Tables and columns in `snake_case` via `@@map`/`@map`; fields in `camelCase` in the client.
- Prisma 7 config in `prisma7.config.ts`. Current env variables: `DATABASE_URL`, `CORS_ORIGIN`, `PORT` (default 3333), `NODE_ENV`, `NESTJS_OBSERVE_SERVICE_ID/APP_KEY/APP_SECRET`.

## Checklist: new endpoint

1. Schema + type in `packages/contracts` (and export in `index.ts`). Build the contracts.
2. Method in the repository contract (`domain`) → Prisma implementation → in-memory implementation (`infra`).
3. Use case returning `Either`, specific errors and `*.spec.ts` (`domain`).
4. Controller, presenter (if it returns data) and `*.e2e-spec.ts` (`infra`).
5. Register the use case and the controller in `HttpModule`.
6. `pnpm lint && pnpm check-types && pnpm test:unit:api && pnpm test:e2e:api`.

## Tests, lint and types

- Unit tests: see [domain](src/domain/AGENTS.md#unit-tests-spects-next-to-the-use-case). E2E tests: see [infra](src/infra/AGENTS.md#e2e-tests-e2e-spects-next-to-the-controller).
- Vitest with `globals: true` (don't import `describe`/`it`/`expect`) and `vite-tsconfig-paths` for the `@/` alias.
- `oxlint --type-aware` (`.oxlintrc.json`): `no-floating-promises` is an **error**, so always `await` or handle the promise. `no-explicit-any` is off.
- TypeScript 6 with `module: nodenext`, decorators and `emitDecoratorMetadata` (required for DI by type). `strictPropertyInitialization` is off.

## Known issues found during analysis

- **Dead code**: `infra/cryptography/bcrypt-hasher.ts` isn't registered in any module (hashing is done by `@nestjs/authentication`'s `PasswordHasher`), and the `bcryptjs` dependency is only used by it.
- **Incomplete `.env.example`**: `CORS_ORIGIN`, `PORT`, `NODE_ENV` and `NESTJS_OBSERVE_SERVICE_ID`, required by `envSchema`, are missing.
- **Inconsistent ownership check**: `DeleteCategoryUseCase` uses `userId.equals(new UniqueEntityId(userId))`, while `EditCategoryUseCase` uses `toString() !== userId`. Pick one.
- **Editing can't clear fields**: `EditCategoryUseCase` only applies `description`/`icon`/`color` when they are truthy, so the description can't be cleared.
- **Inconsistent imports**: `entities/user.ts` and `category-already-exists-error.ts` use long relative paths; `auth.module.ts`, `session-auth.provider.ts` and `main.ts` use the `.js` extension. The rest of the code uses `@/` without extension.
- **Routes**: the resource is singular (`/category`), and `CreateCategoryController` declares `@Controller('/category')` with a leading slash, while the others don't. Keep it consistent or standardize in a dedicated refactor.
- The session `trustedOrigins` is hardcoded to `http://localhost:3000` in `app.module.ts`, while CORS uses `CORS_ORIGIN`. In the Web e2e tests (port 3001) this may diverge.
- `AuthenticateUserResponse` (`{ accessToken }`) in `@financy/contracts` is a JWT leftover and is unused.
- `FetchCategoriesUseCase` declares `Either<null, ...>`, but never returns `left`.
- **E2E file names**: older files are `<action>.e2e-spec.ts` (`authenticate.e2e-spec.ts`) and newer ones are `<action>.controller.e2e-spec.ts`. The edit test uses `[EDIT] /category` instead of `[PUT] /category/:id`.
