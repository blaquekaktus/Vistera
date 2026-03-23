# PROJECT_STATUS.md

**Audited:** 2026-03-20
**Branch:** `claude/vr-property-platform-vr8aT`
**Node:** v22.22.0 / npm 10.9.4

---

## 1. Current Status

| Check | Result |
|---|---|
| `npm run build` | **PASS** — all 18 routes compiled, zero errors |
| TypeScript strict mode | **PASS** — no type errors |
| Required env vars documented | **PASS** — `.env.example` complete |
| Mock data fallback | **PASS** — 8 properties + 4 agents work without Supabase |
| VR tour viewer | **PASS** — canvas-based 360° renderer, no external API needed |
| Auth flows (login/register/reset) | **PASS** — complete with middleware protection |
| Database schema | **PASS** — 4 migrations cover all tables, RLS, storage |
| Seed script | **PASS** — creates 4 demo agents + 8 properties |

The codebase is clean. No TODO/FIXME blockers. No hardcoded credentials in source. Graceful degradation everywhere.

---

## 2. Blockers

Nothing in the code blocks the demo. All blockers are **infrastructure setup** — no code changes needed.

### B1 — Supabase not connected (HIGH)
Without a live Supabase project the app runs on mock data only. You cannot log in, create listings, or submit inquiries.

**Fix:** Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### B2 — Migrations not applied (HIGH)
Tables and storage buckets don't exist until migrations run.

**Fix:** Run in Supabase SQL Editor in order:
1. `supabase/migrations/001_initial_schema.sql` — all tables, enums, RLS, triggers
2. `supabase/migrations/003_inquiry_reply.sql` — adds `reply_message` column
3. `supabase/migrations/004_storage_buckets.sql` — 3 storage buckets + RLS
4. `supabase/migrations/007_increment_view_functions.sql` — RPC functions for VR/page view counters

> `002_seed_data.sql` is intentionally empty — skip it.

### B3 — No demo agent exists (HIGH)
Without seeding, there is no account to log in with.

**Fix:** After migrations, run locally:
```bash
npm run seed
```
This creates 4 agents. Login: any agent email from `src/lib/data.ts`, password: `Vistera2024!`

### B4 — Auth redirect URLs not set (MEDIUM)
Email confirmation and password reset links will 404 in production without this.

**Fix:** Supabase dashboard → Authentication → URL Configuration → add:
- `http://localhost:3000/**` (local)
- `https://<your-domain>/**` (production)

### B5 — Vercel env vars not set (MEDIUM — production only)
Deployment will build but fail at runtime without these set in the Vercel dashboard.

**Fix:** Vercel dashboard → Project → Settings → Environment Variables → add each:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-vercel-domain>` |
| `RESEND_API_KEY` | *(optional — email silently skipped if absent)* |
| `RESEND_FROM_EMAIL` | *(optional — defaults to `noreply@vistera.at`)* |

> **Important:** Do NOT use `vercel secrets` or `@secret-name` references. Set the variables
> directly in the Vercel dashboard for all environments (Production, Preview, Development).
> `NEXT_PUBLIC_*` vars must be present at **build time** — set them before triggering a deploy.

---

## 3. Unknowns

| Unknown | Risk | Notes |
|---|---|---|
| Supabase project provisioned? | HIGH | Cannot confirm without credentials |
| Migrations previously applied? | MEDIUM | Running them twice is safe (idempotent DDL) |
| `RESEND_FROM_EMAIL` domain verified in Resend? | LOW | Emails silently skip if not configured |
| Demo panorama CDN available? | LOW | `photo-sphere-viewer-data.netlify.app` — external, uncontrolled |
| Vercel deployment live? | LOW | Build passes; runtime depends on env vars |

---

## 4. Exact Next Step

**If you haven't done migrations yet:**

1. Open Supabase SQL Editor
2. Paste and run `supabase/migrations/001_initial_schema.sql`
3. Paste and run `supabase/migrations/003_inquiry_reply.sql`
4. Paste and run `supabase/migrations/004_storage_buckets.sql`
5. Paste and run `supabase/migrations/007_increment_view_functions.sql`
6. Copy `.env.example` → `.env.local`, fill in your Supabase credentials
7. Run `npm run seed`
8. Run `npm run dev`
9. Open `http://localhost:3000` — browse properties and VR tour without login
10. Go to `/login` — use a seeded agent email + `Vistera2024!`
11. Confirm dashboard, listing creation, and inquiry flow work

**If migrations are already applied:**

Skip to step 5.

---

## 5. Demo Walkthrough (once setup is complete)

| Step | URL | Auth required |
|---|---|---|
| Landing + featured properties | `/` | No |
| Browse all listings | `/properties` | No |
| Property detail | `/properties/prop-1` | No |
| VR tour | `/properties/prop-1/tour` | No |
| Agent login | `/login` | — |
| Agent dashboard | `/dashboard` | Yes |
| Create listing | `/dashboard/new-listing` | Yes |
| View inquiries + reply | `/dashboard/inquiries` | Yes |

---

## 6. What Does NOT Need to Change

- No code changes needed for demo readiness
- No refactors
- No new features
- Resend email is optional — demo works fine without it
- Three.js is installed but unused — VR viewer uses Canvas 2D, works as-is
- Mock data is production-quality — sufficient for a live demo even without seeding
