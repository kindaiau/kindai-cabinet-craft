# AGENTS.md

Quick checklist for AI coding agents (and humans) before opening a PR.

---

## Before Opening a PR

- [ ] `npm run lint` — zero errors (warnings acceptable)
- [ ] `npm run build` — build succeeds with no TypeScript errors
- [ ] `npm run test` — all unit tests pass
- [ ] `npm run test:e2e` — all Playwright tests pass
- [ ] `npm run lighthouse:ci` — all score thresholds met

---

## Evidence to Include in the PR Description

Paste the terminal output (or a summary) for each command above, e.g.:

```
npm run lint     → ✓ 0 errors
npm run build    → ✓ built in 4.2s
npm run test     → ✓ 12 tests passed
npm run test:e2e → ✓ 5 tests passed (Chromium)
npm run lighthouse:ci → ✓ Performance 91, Accessibility 100
```

List test files added or updated and describe what they cover.

---

## Security Review Notes

Before marking a PR ready for review, confirm:

- **Data handling** – no secrets, tokens, or PII in source code or logs
- **Authentication** – Edge Functions verify the Supabase JWT; row-level security (RLS) policies cover new tables/columns
- **Rate limiting** – high-frequency endpoints have rate-limit protection or are behind Supabase's built-in limits
- **Idempotency** – mutations that may be retried (e.g. payments, emails) are idempotent via unique constraints or deduplication keys
- **Input validation** – all untrusted inputs are parsed with a `zod` schema before use
