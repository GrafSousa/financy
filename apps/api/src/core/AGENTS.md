# `src/core` — Shared kernel

## Purpose

Generic building blocks that any domain in the API can use. `core` knows **nothing about Financy's business** (no users, categories or money) and **nothing about frameworks** (no Nest, no Prisma, no HTTP).

If a piece of code would make sense in a completely different application, it belongs here. If it mentions a Financy concept, it belongs in `domain`.

## Contents

| Path | What it is |
| --- | --- |
| `either.ts` | `Either<L, R>` with `Left`/`Right`, the `left()`/`right()` helpers and the `isLeft()`/`isRight()` type guards. Used as the return type of every use case. |
| `entities/entity.ts` | `Entity<Props>` base class: keeps the state in `props` and an `id`. |
| `entities/unique-entity-id.ts` | `UniqueEntityId` (UUID) with `equals()` and `toString()`. |
| `errors/use-case-error.ts` | `UseCaseError` interface that every business error implements. |
| `errors/resource-not-found-error.ts`, `errors/not-allowed-error.ts` | Generic errors reused by many use cases (resource missing, user is not the owner). |
| `@types/optional.ts` | `Optional<T, K>`: makes some keys of a type optional (used by `Entity.create` props). |

## Rules

- **No dependencies** on `domain`, `infra`, Nest, Prisma or any IO library. `core` is the bottom layer: everything may import it, it imports nothing from the app.
- **No business rules.** A Financy-specific error (e.g. `CategoryAlreadyExistsError`) goes in `domain/.../use-cases/errors`, not here.
- Business errors are **returned** with `left(...)`, never thrown. `core` provides the tools for that.
- Compare ids with `id.equals(otherId)` or `id.toString() === value`, never `===` between `UniqueEntityId` instances.

## When to add something here

Only when at least two domains (or two unrelated use cases) need the same generic abstraction. When in doubt, keep it in `domain` and move it later.
