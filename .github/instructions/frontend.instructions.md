---
applyTo: "**/*.ts,**/*.tsx"
---

# Frontend Instructions

## Component Rules

- Export one component per file; name the file after the component (PascalCase)
- Place page-level components in `src/pages/`, reusable UI in `src/components/`
- Use the `@/` alias for all non-relative imports (e.g. `import { Button } from "@/components/ui/button"`)

## State & Data

- Fetch server data with TanStack Query (`useQuery` / `useMutation`); avoid bare `useEffect` fetches
- Manage forms with `react-hook-form` and validate with a `zod` schema
- Keep component state minimal; lift shared state to context or query cache

## Typing

- Prefer `interface` for object shapes; `type` for unions and aliases
- Do not use `any`; use `unknown` and narrow with type guards when the shape is truly unknown
- Export shared types from `src/integrations/` or a co-located `types.ts`

## Styling

- Use Tailwind utility classes; compose with `cn()` from `@/lib/utils`
- Do not write inline `style` objects except for dynamic values unavailable in Tailwind
- Follow the design tokens defined in `tailwind.config.ts`

## Error Handling

- Wrap async operations in `try/catch`; surface user-facing errors via `sonner` toasts
- Use React Query's `onError` callback for mutation errors
