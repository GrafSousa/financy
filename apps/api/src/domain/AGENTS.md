# `src/domain` — Business rules

## Purpose

Where Financy's business lives: what a user, a category, an account and a transaction are, and what can be done with them. The domain is **independent of delivery and storage**: it doesn't know whether it is called over HTTP or by a queue, or whether data is in Postgres or in memory.

This is what makes use cases testable without Nest and without a database.

## Structure

```
domain/finance/
├── enterprise/entities/      # Entities: User, Category, Account, Transaction
└── application/
    ├── repositories/         # Persistence contracts (abstract classes)
    ├── cryptography/         # HashGenerator / HashComparer contracts
    └── use-cases/            # One file per use case + its *.spec.ts; errors/ for specific errors
```

- `finance` is the bounded context. A new context gets its own folder next to it, with the same `enterprise` / `application` split.
- **`enterprise`** = the entities and their invariants. **`application`** = the use cases that orchestrate entities through contracts.

## Rules

- **Allowed imports:** `core`, `@financy/contracts`, `@financy/utils` and other files of the domain. **Forbidden:** anything from `infra`, Prisma and HTTP. The only Nest import allowed is `@Injectable()` on use cases.
- The domain defines **contracts**; `infra` implements them. Never the other way around.

### Entities (`enterprise/entities`)
- Extend `Entity<Props>`. State lives in `this.props`; the `id` is a `UniqueEntityId`.
- Created **only** through `static create(props, id?)`, which applies defaults and normalizations (e.g. `Category.create` receives `Optional<CategoryProps, 'createdAt'>` and normalizes the name).
- Read through getters. Setters exist only for mutable fields and call `touch()`, which updates `updatedAt`.
- Money (`Account.balance`, `Transaction.value`) is an **integer in cents**.

### Repository contracts (`application/repositories`)
- An **`abstract class`** (not an interface), so it can also be the Nest DI token.
- Methods receive and return **domain entities**, never Prisma types.
- Current vocabulary: `create`, `save` (update), `delete`, `findById`, `findManyByUserId`, `findByParams`. Reuse it before inventing a new name.

### Use cases (`application/use-cases`)
- `XxxUseCase` class with `@Injectable()`, dependencies through the constructor (abstract contracts only) and a single `execute(request)` method.
- Local types `XxxUseCaseRequest` (usually `ContractRequest & { userId: string }`) and `XxxUseCaseResponse = Either<ErrorA | ErrorB, { ... }>`.
- **Business errors are not thrown**: return `left(new XxxError())`. Success is `right({ entity })`.
- Errors are classes that `extends Error implements UseCaseError`. Generic ones live in `core/errors`; specific ones in `use-cases/errors`.
- **Ownership is checked here**: fetch the resource, return `ResourceNotFoundError` if it doesn't exist and `NotAllowedError` if its `userId` differs from the caller's. The `userId` always comes from the session (passed in by the controller), never from the request body.

### Unit tests (`*.spec.ts`, next to the use case)
- No Nest and no database: `sut = new XxxUseCase(new InMemoryXRepository(), ...)`, with entities from the `makeX(override?, id?)` factories (in `infra/test`).
- Assert with `result.isRight()` / `isLeft()` and `expect(result.value).toBeInstanceOf(XxxError)`.
- Names: `describe('use-case: ...')`, `it('should (not) be able to ...')`.
- Every new use case covers the success path and **each** error it can return.
