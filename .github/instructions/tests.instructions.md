---
applyTo: "tests/**,playwright.config.ts,lighthouserc.json"
---

# Test Instructions

## Unit Tests (Vitest)

- Unit test files live in `src/test/` and follow the `*.test.ts` naming convention
- Use `@testing-library/react` for component tests; wrap with `render()` and assert with `screen`
- Mirror the source tree: a test for `src/lib/utils.ts` goes in `src/test/utils.test.ts`
- Run: `npm run test`

## End-to-End Tests (Playwright)

- E2E test files live in `tests/` with the `.spec.ts` suffix
- Use `page.getByRole()` / `page.getByText()` locators; avoid brittle CSS selectors
- Each spec should set up its own state via API calls or `page.evaluate()` rather than relying on shared DB state
- Run: `npm run test:e2e`

## Lighthouse CI

- Config lives in `lighthouserc.json`; assertions define minimum score thresholds
- Do not lower score thresholds without team approval
- Run: `npm run lighthouse:ci`

## General Rules

- Every PR that touches logic must include at least one new or updated test
- Tests must not commit credentials or hit production endpoints; use mocks or a local Supabase instance
- Keep tests deterministic: freeze dates/timers with `vi.useFakeTimers()` where needed
