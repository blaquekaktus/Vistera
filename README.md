# Vistera

A VR Proptech platform that begins with the DACH (Austria, Germany, Switzerland) Alpine market — the most underserved high-value segment for international remote buyers — as our proof of concept and initial revenue base, with the architecture and ambition to serve any international property market. Built with Next.js 14, Supabase, and Three.js.

---

## Features

- **Property listings** — search and filter by country, type, price, rooms, and listing category (sale/rent)
- **VR tours** — immersive 360° panorama viewer powered by Three.js
- **Agent dashboard** — create and manage property listings
- **Authentication** — sign up, log in, password reset, and profile management via Supabase Auth
- **Row Level Security** — Supabase RLS ensures agents only manage their own data
- **DACH focus** — supports EUR and CHF, German/English bilingual content

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Auth & DB | Supabase (Auth + Postgres) |
| VR viewer | Three.js |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/blaquekaktus/Vistera.git
cd Vistera
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
# Find these in your Supabase project: Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side admin key — never expose client-side
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Used for password-reset redirect emails (defaults to localhost:3000 in dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the database migrations

In your [Supabase dashboard](https://app.supabase.com), open **SQL Editor** and run the migration files **in order**:

```
supabase/migrations/001_initial_schema.sql   ← tables, RLS, triggers
supabase/migrations/003_inquiry_reply.sql    ← adds reply_message to inquiries
```

`001` creates all tables, enums, indexes, Row Level Security policies, and triggers (including the auto-profile trigger on sign-up). `003` adds the `reply_message` column used by the agent reply system.

> **Alternatively**, if you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and linked to your project:
> ```bash
> supabase db push
> ```

### 5. Create storage buckets

In the Supabase dashboard, go to **Storage** and create two public buckets:

| Bucket name | Public |
|---|---|
| `property-images` | ✅ |
| `panoramas` | ✅ |

Or use the Supabase CLI:

```bash
supabase storage create panoramas --public
supabase storage create property-images --public
```

### 6. Configure Auth redirect URLs

In the Supabase dashboard, go to **Authentication → URL Configuration** and add your site URL to the **Redirect URLs** list:

- Development: `http://localhost:3000/**`
- Production: `https://your-domain.com/**`

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Seed Data (Optional)

To populate the database with a demo property for development:

1. Create an agent user by signing up at `/register` with role **Agent**.
2. Copy that user's UUID from the Supabase dashboard (**Authentication → Users**).
3. Open `supabase/migrations/002_seed_data.sql`, uncomment the `INSERT` block, and replace `YOUR-AGENT-UUID` with the real UUID.
4. Run the file in the Supabase SQL Editor.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── properties/               # Listing index + detail pages
│   │   └── [id]/
│   │       └── tour/             # VR tour viewer
│   ├── dashboard/                # Agent dashboard + new listing form
│   ├── profile/                  # User profile + password reset
│   ├── login/                    # Sign in
│   ├── register/                 # Sign up
│   ├── forgot-password/          # Request password reset email
│   └── for-agents/               # Marketing page for agents
├── components/                   # Shared UI components
├── lib/
│   └── supabase/                 # Supabase browser/server/middleware clients
└── middleware.ts                 # Route protection
supabase/
└── migrations/
    ├── 001_initial_schema.sql    # Full schema + RLS + triggers
    └── 002_seed_data.sql         # Demo data (commented out by default)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

### Vercel (recommended)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add the three environment variables from `.env.example` in **Project Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://vistera.vercel.app`).
4. Deploy. Vercel auto-detects Next.js — no build config needed.

### Other platforms

The app is a standard Next.js application. Set the same three environment variables and run:

```bash
npm run build
npm run start
```

---

## User Roles

| Role | Capabilities |
|---|---|
| **Buyer** | Browse listings, view VR tours, submit inquiries |
| **Agent** | All buyer capabilities + create/manage own listings, view incoming inquiries |

Register with role **Agent** to access the dashboard at `/dashboard`.

---

## Contributing

1. Fork the repo and create a feature branch from `main`.
2. Make your changes and ensure `npm run lint` passes.
3. Open a pull request with a clear description.
