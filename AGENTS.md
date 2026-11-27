# Financy — Monorepo technical guide

Personal finance app (users, accounts, categories and transactions) organized as a **pnpm + Turborepo** monorepo.

| Workspace            | Path                 | Main stack                                                       | Detailed guide                           |
| -------------------- | -------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| `@financy/api`       | `apps/api`           | NestJS 12, Prisma 7 (`pg` adapter), PostgreSQL 18, Zod 4, Vitest | [apps/api/AGENTS.md](apps/api/AGENTS.md) |
| `@financy/contracts` | `packages/contracts` | Zod schemas + types shared by API and Web (built with `tsup`)    | —                                        |
| `@financy/utils`     | `packages/utils`     | Shared pure functions (e.g. `normalizeString`)                   | —                                        |

## Current feature status

| Feature                                 | API | Web | Notes                                                             |
| --------------------------------------- | --- | --- | ----------------------------------------------------------------- |
| User sign-up                            | ✅  | ✅  | `POST /accounts` · `/register`                                    |
| Sign-in / sign-out (cookie session)     | ✅  | ✅  | `POST /sessions`, `POST /sign-out` · `/sign-in`                   |
| Categories (list, create, edit, delete) | ✅  | ✅  | `/category` · `/categories`                                       |
| Dashboard                               | —   | 🚧  | Page with static (mock) data                                      |
| Bank accounts and transactions          | 🚧  | —   | Only the Prisma model and domain entities; no use cases/endpoints |

## Technical reference docs

Before writing framework code, read the documentation **for the installed version**: the Next 16 and Nest 12 APIs differ from what is usually in training data.

- **Next.js 16.3**: versioned docs bundled in `apps/web/node_modules/next/dist/docs/` (mirror of https://nextjs.org/docs). Shortcuts by topic in [apps/web/AGENTS.md](apps/web/AGENTS.md#nextjs-documentation).
- **NestJS 12**: official docs at https://docs.nestjs.com. Packages without a page on the site (`@nestjs/authentication`, `@nestjs/observe`) have a README in `apps/api/node_modules/@nestjs/<package>/README.md`. Shortcuts in [apps/api/AGENTS.md](apps/api/AGENTS.md#nestjs-documentation).
- Other libs: [Prisma](https://www.prisma.io/docs) · [Zod 4](https://zod.dev) · [TanStack Query v5](https://tanstack.com/query/latest/docs/framework/react/overview) · [React Hook Form](https://react-hook-form.com) · [Base UI](https://base-ui.com/react/overview/quick-start) · [Tailwind CSS v4](https://tailwindcss.com/docs) · [tailwind-variants](https://www.tailwind-variants.org) · [Lucide](https://lucide.dev/guide/packages/lucide-react) · [Sonner](https://sonner.emilkowal.ski) · [Vitest](https://vitest.dev) · [Playwright](https://playwright.dev/docs/intro) · [Turborepo](https://turborepo.com/docs).

## Commands (run from the root)

```bash
pnpm dev                 # turbo: starts api + web + packages in watch mode
pnpm build               # builds every workspace (respects ^build)
pnpm lint                # oxlint (api) + eslint (web)
pnpm check-types         # tsc --noEmit everywhere (web runs `next typegen` first)

pnpm infra:up            # Postgres via docker compose (apps/api/compose.yaml, port 5432)
pnpm infra:down / infra:logs
pnpm db:generate         # generates the Prisma Client in apps/api/src/generated/prisma
pnpm db:migrate:dev      # creates/applies migrations

pnpm test:unit:api       # Vitest: *.spec.ts (use cases, no database)
pnpm test:unit:api:watch / test:unit:api:cov
pnpm test:e2e:api        # Vitest: *.e2e-spec.ts (Nest + Postgres, isolated schema per file)
pnpm test:e2e:web        # Playwright: own Postgres (port 5433), API and Next on port 3001
```

Node pinned in `.nvmrc`; package manager **pnpm** (version in `devEngines`). `pnpm-workspace.yaml` uses `saveExact: true`: **dependencies always use exact versions**.

## Cross-cutting conventions

- **Shared contracts**: every request payload is defined once as a Zod schema in `packages/contracts/src/<resource>/<action>-<resource>.schema.ts`, exporting `xxxSchema` and the type `XxxRequest = z.infer<...>`, and re-exported from `packages/contracts/src/index.ts` (with the `.js` extension in the import, required by `moduleResolution: NodeNext`). The API validates with `ZodValidationPipe`; the Web validates forms with `zodResolver` using the same schema.
- `packages/*` are consumed through their **build** (`dist/`, ESM + CJS via `tsup`). After changing contracts/utils, run `pnpm --filter @financy/contracts build` (or keep `pnpm dev` running). In CI the contracts are built before the e2e tests.
- **Import alias** `@/*` → `src/*` in both apps.
- **File names** in `kebab-case`; classes in `PascalCase`; suffixes state the role (`*.controller.ts`, `*.module.ts`, `*-repository.ts`, `*.spec.ts`, `*.e2e-spec.ts`). Exception: Web hooks (`useCategoryApi.ts`).
- **Tests live next to the code they test** (use case, controller or page).
- **Formatting**: single quotes and trailing commas (`.prettierrc`); in JSX, attributes use single quotes.
- **Language**: code, tests and documentation in English; UI text in Portuguese (pt-BR).
- **Authentication**: cookie session `__Host-financy-session` issued by the API (`@nestjs/authentication`). The Web sends `credentials: 'include'` and Next's `proxy.ts` reads that cookie to protect routes. There is no JWT.
- **Commits**: Conventional Commits with an `app/area` scope, e.g. `feat(api/category): ...`, `feat(web/layout): ...`, `fix(contracts): ...`, `test(api): ...`, `ci: ...`. Atomic commits: contracts first, then API, then Web, so each commit compiles on its own (watch out for Next's `typedRoutes`: a link only passes the type check if the route already exists).
- **CI** (`.github/workflows/ci.yml`): `quality` (install → `db:generate` → lint → check-types → API unit tests → build), then `api-e2e` and `web-e2e` in parallel. New environment variables must be added to the jobs.
