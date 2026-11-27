# 02 — `userId` from the body

## Planted bug

`diff.patch` makes `DeleteCategoryController` read `userId` from the request body instead of `@CurrentUser()`.
The use case's ownership check still runs, but against an id the caller controls: sending another user's id in the body deletes their category.

## How to run

> Use the backend-reviewer agent to review the diff in `.claude/evals/backend-reviewer/02-user-id-from-body/diff.patch`.

## Must find (the case fails without these)

- [ ] One **high** item.
- [ ] It points to `apps/api/src/infra/http/controllers/delete-category.controller.ts` around line 23.
- [ ] It says `userId` comes from the body, so the ownership check in the use case can be bypassed.
- [ ] It suggests going back to `@CurrentUser() user: User` and `user.id.toString()`.

## Nice to have (doesn't fail the case)

- [ ] Mentions that the body is not validated (no `ZodValidationPipe`, no contract schema).
- [ ] Mentions that a `DELETE` with a body is unusual and some clients/proxies drop it.

## Must NOT do (the case fails if it does)

- [ ] Rate it medium or low.
- [ ] Say the use case is wrong (the use case is unchanged and correct).
- [ ] Edit, create or delete any file.

## Results

| Date | Model | Passed? | Notes |
| ---- | ----- | ------- | ----- |
| 2026-11-26 | sonnet (agent frontmatter) | ✅ | Must find 4/4: one high IDOR item at lines ~21-24, bypassable ownership check, fix with `@CurrentUser()` + `user.id.toString()`. Nice to have 1/2: flagged missing validation/contract; noted the Web sends DELETE without a body, but not clients/proxies dropping it. Must not 0/3. Also a medium suggestion for a cross-user e2e test. Read only the diff and `apps/api/AGENTS.md`. |
| 2026-11-26 | claude-opus-5-5 | ✅ | Must find 4/4 (high, lines ~21-27, bypassable ownership check, back to `@CurrentUser()` + `user.id.toString()`). Nice to have 0/2. Must not 0/3. Extra: cross-user e2e test suggestion. Prompt said to read only the diff. |
