# 05 — Clean diff (no bug)

## What the diff does

`diff.patch` makes `EditCategoryUseCase` compare ownership with `category.userId.equals(new UniqueEntityId(userId))`, the same way `DeleteCategoryUseCase` does.
It fixes the "Inconsistent ownership check" item in `apps/api/AGENTS.md`. Behavior is unchanged and the existing spec still covers it.
This case checks that the agent **doesn't invent problems**.

## How to run

> Use the backend-reviewer agent to review the diff in `.claude/evals/backend-reviewer/05-clean-diff/diff.patch`.

## Must find (the case fails without these)

- [ ] No high or medium items.
- [ ] Ends with "No issues found" (or only low items).

## Nice to have (doesn't fail the case)

- [ ] Recognizes that the change resolves a known issue from `apps/api/AGENTS.md`.

## Must NOT do (the case fails if it does)

- [ ] Report any high or medium item.
- [ ] Ask for a new spec (the behavior didn't change).
- [ ] Edit, create or delete any file.

## Results

| Date | Model | Passed? | Notes |
| ---- | ----- | ------- | ----- |
| 2026-11-26 | sonnet | ✅ | "No issues found", no high/medium items, no new spec requested, no files edited. Recognized the fix of the AGENTS.md known issue (nice to have ✅). Couldn't read `edit-category.spec.ts` or the controller: a hook blocked its Bash call. |
| 2026-11-26 | claude-opus-5-5 | ✅ | "No issues found", no high/medium items, no new spec requested, no files edited. Missed the AGENTS.md known-issue nice-to-have (prompt said to read only the diff, so it didn't open AGENTS.md). Caveat: couldn't confirm `UniqueEntityId.equals` compares by value. |
