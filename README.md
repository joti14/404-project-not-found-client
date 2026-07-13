# 404 Project Not Found — Frontend

A 2-in-1 productivity app: a **date-based Kanban task board** with drag & drop, and a **polygon image-annotation tool** — built as a hiring assessment.

- **Live app:** [404-project-not-found-client.vercel.app](https://404-project-not-found-client.vercel.app/)
- **Backend repo:** [joti14/404-project-not-found-server](https://github.com/joti14/404-project-not-found-server)
- **Demo login:** `demo@404notfound.dev` / `Demo404!pass`

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Server state | TanStack Query v5 |
| Client state | Zustand (auth session, selected board date — nothing else) |
| Forms | React Hook Form + Zod |
| Drag & drop | @dnd-kit/core |
| Canvas | Konva + react-konva |
| HTTP | axios (single configured client) |

## Architecture

```
src/
├── app/            # Routes only — thin shells (guard + layout + feature component)
├── components/
│   ├── ui/         # Reusable, domain-free primitives (shadcn + DateSelector)
│   └── app-header  # Shared chrome for authenticated pages
├── features/       # The app itself, grouped by domain
│   ├── auth/       # login form, session provider, guard, logout
│   ├── tasks/      # Board, Column, TaskCard, TaskModal, dnd wrappers, task hooks
│   └── annotations/# gallery, upload, AnnotationCanvas, polygon layers, hooks
├── services/       # The ONLY code that knows HTTP exists (axios client + per-domain services)
├── store/          # Zustand: auth-store, date-store
├── types/          # TS mirrors of the Django serializers (snake_case kept on purpose)
└── utils/          # date helpers (local-TZ ISO), token storage
```

Rules that shaped the code:

- **Server state lives in TanStack Query, client state in Zustand — never both.** Tasks, images, and polygons are cached per query key (`["tasks", date]`, `["annotations", imageId]`) and mutated with surgical invalidation; drag & drop uses an optimistic cache write with snapshot rollback.
- **Feature-first organization.** Code used by one feature lives in that feature's folder; it is only promoted to a shared folder when a second feature needs it.
- **`DateSelector` is fully decoupled from tasks** — a controlled `value`/`onChange` component. The board and the task form both consume it; the only coupling between the date picker and the board is the tiny `date-store`.
- **Auth is UX on the client, security on the server.** The `AuthGuard` redirects politely; the actual boundary is DRF returning 401 without a valid JWT. Tokens live in localStorage (trade-off documented below); the axios interceptor attaches them; `/me` on boot restores the session across refreshes.
- **Annotations are stored as normalized (0–1) coordinates** and projected onto the current canvas size at render time — polygons stay aligned at every viewport size, and no pixel values ever reach the database.

## Villains faced (and how they were defeated)

1. **The serif ambush.** After `shadcn init`, the whole app rendered in Times New Roman. The generated `globals.css` contained a circular `--font-sans: var(--font-sans)`, and the base layer applied the font on `<html>` while the font variables lived on `<body>`. Fixed by mapping the theme tokens to `--font-geist-sans` and moving the font classes to `<html>`.
2. **Turbopack watched the wrong universe.** A stray `package-lock.json` in the user home directory made Turbopack infer the home folder as the workspace root, silently breaking change detection. Fixed by pinning `turbopack.root` in `next.config.ts`.
3. **The popover that would not die.** The current shadcn registry is built on **Base UI, not Radix**: `asChild` doesn't exist (it nested a button inside a button — invalid HTML) and closed popups wait for their CSS exit animation to finish before unmounting. In throttled/background tabs animations freeze at frame 0, so the calendar popover stayed open forever. Fixed with Base UI's `render` prop, removing open/close animations, and a `data-closed:hidden` safety net.
4. **Eternal skeletons.** TanStack Query's default `networkMode: "online"` paused failed queries whenever the browser's (unreliable) connectivity detection claimed offline — the UI showed loading skeletons forever instead of an error. Diagnosed by walking the React fiber to the QueryClient and finding `fetchStatus: "paused"`; fixed with `networkMode: "always"` so failures fail honestly into our error-and-retry UI.
5. **`npm run build` poisoned the dev server.** Both `next build` and `next dev` write to `.next/`; running them concurrently corrupted the manifest and every page returned 500. Fixed permanently by giving production builds their own `distDir`.
6. **The upload race.** Auto-selecting a freshly uploaded image lost to the "keep selection valid" effect, which saw the new image missing from the still-stale list and reset the selection. Fixed by returning the invalidation promise from `onSuccess`, so the mutation only settles after the refetched list is in cache.
7. **The UTC day-shift trap.** `Date.toISOString()` converts to UTC and changes the calendar day for anyone east of Greenwich after midnight. All date handling goes through local-timezone helpers (`utils/date.ts`).
8. **Peer dependency roulette on a clean install.** `react-konva@19.2.5` requires `react@^19.2.0`, but the project pinned `19.1.0`. Locally `npm install` glossed over it thanks to an existing lockfile; Vercel's clean-room install re-resolved the whole tree and hit `ERESOLVE`. Fixed by bumping React to `^19.2.0` — the real fix, not `--legacy-peer-deps` papering over it.
9. **The `distDir` fix that broke Vercel.** The local fix for villain #5 (separate `distDir` for production builds) keyed off `NODE_ENV === "production"` — true on Vercel too, so the build output landed in `.next-build` while Vercel only looks in `.next`, failing with "output directory not found." Fixed by also checking Vercel's own `VERCEL` env var, so the redirect only applies to local builds running alongside a dev server.

(Most were defeated with the power of documentation, browser devtools, and an AI pair-programmer.)

## Requirements

- **Node.js v22.13.1** (v20+ should work)
- npm 11+
- The [backend](https://github.com/joti14/404-project-not-found-server) running locally on port 8000

## Run it locally

```bash
git clone https://github.com/joti14/404-project-not-found-client.git
cd 404-project-not-found-client
npm install
cp .env.example .env.local        # defaults point at http://localhost:8000
npm run dev                       # http://localhost:3000
```

Log in with the demo credentials above (seed them on the backend first: `python manage.py seed_demo_user`).

Other scripts: `npm run build` (production build), `npx tsc --noEmit` (typecheck), `npx eslint src` (lint).

## Environment variables

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Django backend (no trailing slash) | `http://localhost:8000` |

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **New Project → import the repo**. Framework preset: Next.js (auto-detected).
3. Add the environment variable `NEXT_PUBLIC_API_URL = https://<your-backend-host>`.
4. Deploy. Copy the resulting `https://<app>.vercel.app` URL.
5. On the backend, add that URL to `CORS_ALLOWED_ORIGINS` and reload — otherwise every API call fails with a CORS error that the browser reports as a network failure.

## Assumptions

- The board's date filter *is* the task's due date (one date field, as the brief's field list implies).
- "Slide through the uploaded images" = a scrollable, selectable gallery beside the canvas.
- No registration flow — the brief only requires login, so a seeded demo user is provided.

## Trade-offs

- **JWT in localStorage** instead of httpOnly cookies: the frontend (Vercel) and backend (PythonAnywhere) live on different domains, where cross-site cookies mean `SameSite=None` + CSRF machinery. For an app with no sensitive data and no user-generated HTML (XSS surface), localStorage is the pragmatic call; a same-domain production app should use httpOnly cookies.
- **No token-refresh interceptor**: access tokens last 12 h — longer than any review session. Refresh-on-401 is a well-understood addition if session length ever matters.
- **Plain `<img>` for media**: backend media files are dynamic cross-origin content; `next/image` optimization would add config for no benefit here.

## Known limitations

- No pagination (per-day boards and personal image libraries stay small by nature).
- Polygons can be drawn and deleted but not edited (vertex dragging deferred by scope).
- The empty `src/hooks/` folder is intentional: no hook ever needed to be shared across two features, so per the promotion rule none were moved up.

## Future improvements

- Optimistic create/edit for tasks (drag & drop already is).
- Vertex editing + undo for annotations; polygon labels/colors.
- httpOnly-cookie auth behind a same-domain reverse proxy.
- E2E tests (Playwright) on top of the existing backend API tests.
