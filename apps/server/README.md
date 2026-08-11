# @nudle/server

Express API with **Neon Postgres**, **Knex** migrations, and **better-auth**.

Frontends talk to `/api/auth/*` (cookies) and the rest of `/api/*` with `credentials: "include"`.

## Env

Copy `.env.example` → `.env`:

| Var | Required | Notes |
|-----|----------|--------|
| `DATABASE_URL` | yes | Neon connection string (`?sslmode=require`) |
| `BETTER_AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | Public API URL, e.g. `http://localhost:3001` |
| `CORS_ORIGIN` / `TEACHER_ORIGIN` / `STUDENT_ORIGIN` | prod | Frontend origins (cookies) |
| `OPENAI_API_KEY` | no | Enables `/api/ai/assistant` |

## Database

Migrations live in `migrations/` and run with Knex:

```bash
pnpm --filter @nudle/server migrate
```

On deploy, `start` runs migrations then boots the server:

```bash
pnpm --filter @nudle/server build
pnpm --filter @nudle/server start   # migrate:latest && node dist/index.js
```

Create accounts via the teacher/student app sign-up flows (no demo seed).

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| * | `/api/auth/*` | cookie | better-auth |
| GET | `/api/health` | no | Health check |
| GET | `/api/me` | yes | Current user + roles |
| GET/POST | `/api/profiles` | yes | Directory (`?role=`) |
| POST | `/api/roles` | yes | Assign student/teacher |
| GET/POST | `/api/courses` | yes | Courses |
| GET | `/api/submissions` | yes | Grading list |
| GET/POST | `/api/attendance` | yes | Attendance |
| GET | `/api/teacher/*` | yes | Dashboard / analytics / report-cards |
| GET/POST | `/api/conversations` | yes | Messaging |
| POST | `/api/ai/assistant` | yes | Optional OpenAI proxy |
