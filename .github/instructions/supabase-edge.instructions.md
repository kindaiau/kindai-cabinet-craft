---
applyTo: "supabase/functions/**"
---

# Supabase Edge Function Instructions

## Runtime

- Functions run on Deno; use `import` with full URLs or `npm:` specifier – no `require()`
- Keep functions small and single-purpose; one handler per file

## Authentication & Authorization

- Verify the Supabase JWT on **every** request:
  ```ts
  const authHeader = req.headers.get("Authorization");
  const { data: { user }, error } = await supabase.auth.getUser(authHeader?.replace("Bearer ", "") ?? "");
  if (error || !user) return new Response("Unauthorized", { status: 401 });
  ```
- Never trust a `user_id` from the request body; always derive it from the verified JWT

## Input Validation

- Parse and validate the request body with `zod` before processing:
  ```ts
  const schema = z.object({ ... });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return new Response("Bad Request", { status: 400 });
  ```

## Security

- Never log or return secrets, service-role keys, or internal stack traces
- Return generic error messages to the client; log details server-side only
- Apply rate limiting where possible via Supabase's built-in rate-limit header or an upstream proxy
- Ensure mutations are idempotent where practical (use unique constraints / upsert)

## Response Format

- Return `application/json` with appropriate HTTP status codes
- CORS headers must be set explicitly for browser-facing functions:
  ```ts
  const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" };
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  ```
