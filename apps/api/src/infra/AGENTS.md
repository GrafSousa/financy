# `src/infra` — Frameworks and IO

## Purpose

Everything that talks to the outside world: HTTP, database, cryptography, session, environment variables and health checks. `infra` **implements the contracts defined in `domain`** and wires them with Nest dependency injection.

Swapping Postgres for another store, or HTTP for a queue, should only touch `infra`.

## Structure

| Path | What it is |
| --- | --- |
| `main.ts`, `app.module.ts` | Bootstrap (CORS, shutdown hooks) and root module (`ConfigModule`, `AuthenticationModule`, Observe). |
| `http/` | `HttpModule`, one controller per use case, `ZodValidationPipe`. |
| `presenters/` | Entity → HTTP JSON (`XPresenter.toHTTP`). |
| `database/` | `DatabaseModule`, `PrismaService`, mappers and Prisma repositories. |
| `cryptography/` | `PasswordHasher` (adapter of `@nestjs/authentication` to the domain hash contracts). |
| `auth/` | `SessionAuth` (`SessionCookieProvider<User>`). |
| `env/` | `envSchema` (Zod), `EnvService`, `EnvModule`. |
| `health/` | Terminus: `/health/live` and `/health/ready`. |
| `test/` | Test doubles: factories, in-memory repositories, `FakeHasher`, e2e setup. |

## Rules

- `infra` may import `domain` and `core`. **`domain` never imports `infra`.**
- Business rules don't live here. A controller validates input, calls **one** use case and translates the result; nothing more.

### Database (`database/`)
- Prisma repositories live in `database/prisma/repositories/prisma-*-repository.ts`, extend the domain contract and are bound in `DatabaseModule` with `{ provide: XRepository, useClass: PrismaXRepository }` (and exported).
- Conversion only through static mappers: `PrismaXMapper.toDomain(raw)` and `toPrisma(entity)` (returns `Prisma.XUncheckedCreateInput`). Prisma types never leave `infra`.
- Every new repository also gets an `InMemoryXRepository` in `test/repositories`, with a public `items` array.
- Prisma Client is generated in `src/generated/prisma` (don't edit; `pnpm db:generate`) and imported from `@/generated/prisma/client`. `PrismaService` uses `PrismaPg` and respects `?schema=` in `DATABASE_URL` (used to isolate e2e tests).
- Tables and columns in `snake_case` via `@@map`/`@map`. Migrations: `pnpm db:migrate:dev --name <snake_case_description>`; they must be **expand-contract** (no down migrations).

### HTTP (`http/`)
- **One controller per use case** (`create-category.controller.ts`) with a single `handle()` method.
- Body validation: `const bodyValidationPipe = new ZodValidationPipe(schema)` at the top of the file and `@Body(bodyValidationPipe) body: XxxRequest`, with schema and type from `@financy/contracts`. Validation errors return 400 `{ message: 'Validation failed.', errors: z.treeifyError(...) }`.
- Authenticated user via `@CurrentUser() user: User`; pass `user.id` to the use case. Public routes use `@Public()`; every other route requires a session.
- Error mapping: `if (result.isLeft())` + `switch (error.constructor)` → `NotFoundException`, `ForbiddenException`, `ConflictException`, `UnauthorizedException`. The `default` becomes `BadRequestException`.
- Responses: commands (create, edit, delete, sign-in) use `@HttpCode(204)` with no body. Queries return objects built with `XPresenter.toHTTP(entity)`, wrapped in a plural key (`{ categories: [...] }`).
- Register the use case in `providers` and the controller in `controllers` of `HttpModule`.

### Authentication and cryptography
- `AuthenticationModule.forRoot({ session })` in `AppModule`: absolute TTL of 14 days, idle of 3 days, cookie `__Host-financy-session`.
- `SessionAuth` registers itself in `AuthenticationRegistry` and resolves the session user through `UsersRepository`.
- Sign-in: `ValidateUserUseCase` + `SignInService.signIn(userId, { method: 'password' })`. Sign-out: `SignInService.signOut()`.
- Password hashing: `PasswordHasher` adapts `@nestjs/authentication`'s hasher to `HashGenerator`/`HashComparer`. Unit tests use `FakeHasher`.

### Configuration
- Variables validated by `envSchema` (Zod) in `env/env.ts` and applied in `ConfigModule.forRoot({ validate, isGlobal: true })`. Always read through the typed `EnvService.get('KEY')`.
- New variable → `env.ts` + `.env.example` + `ci.yml`.
- Dynamic modules that depend on config use `forRootAsync({ imports: [EnvModule], inject: [EnvService], useFactory })`.

### E2E tests (`*.e2e-spec.ts`, next to the controller)
- `Test.createTestingModule({ imports: [AppModule, DatabaseModule, CryptographyModule], providers: [XFactory] })`. Data comes from `XFactory.makePrismaX()`.
- Authenticate with `POST /sessions`, reuse `res.headers['set-cookie'][0].split(';')[0]` and send requests with `supertest`.
- Names: `describe('e2e: ...')`, `test('[METHOD] /route')`.
- `test/setup-e2e.ts` creates a Postgres schema with a UUID per file, runs `prisma migrate deploy` and `DROP SCHEMA ... CASCADE` at the end. Requires `pnpm infra:up`.
