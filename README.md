# Kleva monorepo

pnpm + Turborepo workspace for the Kleva student app, teacher app, landing page, and shared API.

## Structure

```text
apps/
  student-app/   # Vite React (port 5173)
  teacher-app/   # Vite React (port 5174)
  landing-page/  # Static HTML (port 5175)
  server/        # Express + Neon + Knex + better-auth (port 3001)
packages/
  ui/            # Shared shadcn/ui library (@nudle/ui)
  typescript-config/
```

## Setup

1. Create a [Neon](https://neon.tech) project and copy the connection string.
2. Configure the server:

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
# Set DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
pnpm --filter @nudle/server migrate
```

3. Frontends: `apps/teacher-app/.env` and `apps/student-app/.env` need `VITE_API_URL` (see root `.env.example`).

## Develop

```bash
pnpm dev
```

**Architecture:** better-auth (cookie sessions) + Express APIs over Neon via Knex. Migrations run on `pnpm start` / deploy. Sign up as a teacher in the teacher app.

## Shared UI

```ts
import { Button } from "@nudle/ui/button";
import { cn } from "@nudle/ui/utils";
```
