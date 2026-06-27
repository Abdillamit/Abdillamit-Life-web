# Abdillamit Life — Web (PWA)

Personal life-logging platform — your digital twin. A mobile-first PWA where you
log what you did each day and the system analyses your life.

Frontend for the project. The data/AI backend lives in
[`Abdillamit-Life-back`](https://github.com/Abdillamit/Abdillamit-Life-back).

## Stack

- **Next.js 16** (App Router, React 19) + TypeScript
- **Tailwind CSS v4** — dark teal theme, mobile-first
- **Supabase Auth** (email + Google OAuth) via `@supabase/ssr`
- **Recharts** — mood chart, tag breakdown, monthly bars, activity heatmap
- **lucide-react** icons, **framer-motion**-ready animations
- **PWA** — manifest, installable, offline-first service worker

## Getting started

```bash
cp .env.local.example .env.local   # fill in Supabase + API URL
npm install --legacy-peer-deps
npm run dev
```

Environment variables:

| Var | Description |
| --- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (default `http://localhost:4000`) |

The web app authenticates with Supabase, then calls the backend with the user's
access token as a bearer. For avatar uploads, create a public Storage bucket
named `avatars`.

## Features

- **Dashboard** — greeting with "day #N of your life", streak, stats, GitHub-style
  activity heatmap, 30-day mood chart, tag pie, recent entries.
- **Journal** — infinite list with tag filters, create / view / edit / delete,
  mood picker (1–10 emoji scale), tag chips, markdown content.
- **Timeline** — life events grouped by year with typed icons.
- **Goals** — circular progress, slider updates, status filters.
- **Analytics** — entries per month, mood trend, top tags, most productive day.
- **AI Insights** — weekly digest + free-form Q&A grounded in your entries (Claude).
- **History** — full searchable action log.
- **Profile** — avatar upload, bio, birth date → days alive & % of life lived.

## Routes

`/login` · `/register` · `/dashboard` · `/journal` · `/journal/new` ·
`/journal/[id]` · `/timeline` · `/goals` · `/analytics` · `/ai-insights` ·
`/history` · `/profile`

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — type-check only

## Deploy (Vercel)

1. Vercel → **Add New → Project** → import this GitHub repo (framework auto-detected: Next.js).
2. `.npmrc` enables `legacy-peer-deps`, so the default `npm install` works.
3. Add Environment Variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` → the Render backend URL (e.g. `https://abdillamit-life-back.onrender.com`)
4. Deploy. Then add the resulting Vercel URL to the backend's `CORS_ORIGIN`
   and to Supabase **Authentication → URL Configuration** (Site URL + redirect
   `https://<vercel-url>/auth/callback`).
