# Nudle monorepo

pnpm + Turborepo workspace for the Nudle student app, teacher app, landing page, and shared API.

## Structure

```text
apps/
  student-app/   # Vite React (port 5173)
  teacher-app/   # Vite React (port 5174)
  landing-page/  # Static HTML (port 5175)
  server/        # Express + Supabase (port 3001)
packages/
  ui/            # Shared shadcn/ui library (@nudle/ui)
  typescript-config/
```

## Setup

```bash
pnpm install
cp apps/server/.env.example apps/server/.env   # server Supabase keys
```

Student and teacher apps need their own `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (see root `.env.example`). The landing page is static and needs no env.

## Develop

```bash
pnpm dev
```

Or individually:

```bash
pnpm dev:server
pnpm dev:student
pnpm dev:teacher
pnpm dev:landing
```

**Architecture:** frontends use Supabase **only for auth**. All data/AI goes through Express (`@/lib/api` attaches the Supabase access token). Local Vite apps proxy `/api` → `localhost:3001`.

## Shared UI

Import from the workspace package:

```ts
import { Button } from "@nudle/ui/button";
import { cn } from "@nudle/ui/utils";
```
