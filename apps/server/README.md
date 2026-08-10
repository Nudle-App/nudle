# @nudle/server

Shared Express API for Nudle apps. Uses Supabase Auth (JWT validation) and Supabase as the database.

## Env

Copy `.env.example` → `.env` in this directory:

- `PORT` (default 3001)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Endpoints

- `GET /api/health` — public health check
- `GET /api/me` — current user (requires `Authorization: Bearer <access_token>`)
