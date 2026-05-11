# Copilot Instructions

## Commands

```bash
npm i                  # install dependencies
npm run dev            # start dev server (port 8080)
npm run build          # production build → dist/
npm run lint           # ESLint (TypeScript + React rules)
npm run test           # Vitest unit tests
npm run test:e2e       # Playwright end-to-end tests
npm run lighthouse:ci  # Lighthouse CI performance audit
```

## Folder & Alias Conventions

- `@` resolves to `./src` (configured in `vite.config.ts` and `tsconfig.json`)
- `src/components/` – shared UI components (Radix UI + shadcn/ui)
- `src/pages/` – route-level page components
- `src/hooks/` – custom React hooks
- `src/contexts/` – React context providers
- `src/integrations/` – third-party client setup (e.g. Supabase)
- `src/lib/` – pure utility functions
- `supabase/functions/` – Deno-based Edge Functions

## Code Style (TypeScript / React)

- TypeScript strict mode; no `any` unless unavoidable and annotated with `// eslint-disable-next-line`
- Functional components only; no class components
- One component per file; filename matches exported component name
- Use React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) over class lifecycle methods
- Data fetching via TanStack Query (`@tanstack/react-query`); avoid raw `useEffect` for fetches
- Form handling via `react-hook-form` + `zod` schema validation
- Routing via `react-router-dom` v6 (`<Routes>` / `<Route>`)
- Import order: external packages → `@/` aliases → relative paths
- Use `cn()` from `@/lib/utils` for conditional Tailwind class merging

## Security Rules

- **Never commit secrets** – use environment variables; add secrets to `.gitignore` and Supabase Vault
- **Edge Functions are security boundaries** – authenticate every request via Supabase JWT; never trust client-supplied user IDs
- **Validate all untrusted inputs** – use `zod` schemas server-side and client-side; sanitise before DB writes
- Do not expose internal error details to HTTP responses; log server-side and return generic messages

## PR Format Rules

Every PR description must include:

1. **Summary** – one sentence describing the change
2. **Commands run & results** – paste the terminal output of:
   - `npm run lint`
   - `npm run build`
   - `npm run test`
3. **Tests added / updated** – list test files and what they cover
4. **Security notes** – confirm no secrets committed; note any auth/validation changes
