# 01 — Missing ownership check

## Planted bug

`diff.patch` removes the ownership check from `EditCategoryUseCase`.
Any signed-in user can edit another user's category by sending its `id`.

## How to run

Ask the main session:

> Use the backend-reviewer agent to review the diff in `.claude/evals/backend-reviewer/01-missing-ownership-check/diff.patch`.

## Must find (the case fails without these)

- [ ] One **high** item.
- [ ] It points to `apps/api/src/domain/finance/application/use-cases/edit-category.ts` around line 42.
- [ ] It says the use case no longer returns `NotAllowedError` when the category belongs to another user.
- [ ] It suggests restoring the `category.userId` vs `userId` check.

## Nice to have (doesn't fail the case)

- [ ] Mentions that `NotAllowedError` is still imported and listed in the response type but is never returned.
- [ ] Mentions that the spec covering the `NotAllowedError` case should now fail.

## Must NOT do (the case fails if it does)

- [ ] Rate the missing check as medium or low.
- [ ] Edit, create or delete any file.
- [ ] Report issues outside the diff as if the diff introduced them.

## Results

| Date | Model | Passed? | Notes |
| ---- | ----- | ------- | ----- |
| 2026-11-26 | claude-sonnet-5-5 | ✅ | All must-find and both nice-to-haves. Extra: flagged the uniqueness check running against the wrong user, and possibly missing 403 e2e coverage (marked as a guess). No file edits. |
| 2026-11-26 | claude-opus-5-5 | ✅ | All must-find and both nice-to-haves. Extra: flagged the uniqueness check running against the wrong user (500 instead of 409). No file edits. Bash hook blocked `ls`/test runs, so it found the patch by guessing paths with Read. |
| 2026-11-26 | claude-opus-5-5 | ✅ | All must-find (high, `edit-category.ts:42`, no `NotAllowedError`, restore check) and both nice-to-haves (dead import, spec should fail). No file edits. Prompt said to read only the diff. |
