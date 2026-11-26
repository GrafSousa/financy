# 03 — Use case without a spec

## Planted bug

`diff.patch` adds `GetCategoryUseCase` with no `get-category.spec.ts`.
The code itself is correct: it returns `ResourceNotFoundError` and `NotAllowedError`, and it checks ownership.
This case checks that the agent catches a **missing test** without inventing a bug in correct code.

## How to run

> Use the backend-reviewer agent to review the diff in `.claude/evals/backend-reviewer/03-use-case-without-spec/diff.patch`.

## Must find (the case fails without these)

- [ ] One **medium** item: `get-category.ts` has no `get-category.spec.ts` next to it.
- [ ] It lists the 3 scenarios the spec must cover: success, `ResourceNotFoundError`, `NotAllowedError`.

## Nice to have (doesn't fail the case)

- [ ] Mentions that the use case isn't registered in `HttpModule` and has no controller yet (fine if marked as "suspected" or as a question).
- [ ] Mentions the relative imports (`../repositories`, `../../enterprise`) vs the `@/` alias (low).

## Must NOT do (the case fails if it does)

- [ ] Report a **high** item (there is no security issue or bug).
- [ ] Say the ownership check is missing or wrong.
- [ ] Edit, create or delete any file (including writing the spec).

## Results

| Date | Model | Passed? | Notes |
| ---- | ----- | ------- | ----- |
| 2026-11-26 | claude-sonnet-5-5 | ✅ Yes | All must-find items (medium missing spec + 3 scenarios) and both nice-to-haves (HttpModule/controller marked suspected; relative imports, low). No high items, ownership check called correct, no files edited. Extras: `findById` check (suspected), `*UseCaseRequest/Response` naming (low), `equals` vs `toString` consistency (low). Hook blocked Bash, so the agent reviewed from the diff only. |
| 2026-11-26 | claude-sonnet-5-5 | ✅ Yes | Both must-find items met: medium for the missing spec, plus the 3 scenarios (success, `ResourceNotFoundError`, `NotAllowedError`). Nice-to-have: `HttpModule`/controller/contract/e2e marked as suspected. Imports met only in part: it flagged the relative repository import among the `@/` imports as a grouping issue (low), not as relative vs alias. No high item, ownership check called correct, no files edited. Extra: `*UseCaseRequest/Response` naming (low). |
| 2026-11-26 | claude-opus-5-5 | ✅ Yes | Both must-find (medium missing spec + 3 scenarios). Nice-to-have partial: noted no controller yet, not `HttpModule`; no relative-imports item. No high item, ownership check called correct, no files edited. Extra low: file naming (suspected). Hook blocked `ls`. |
