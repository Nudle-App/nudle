# @nudle/server

Shared Express API. Frontends authenticate with Supabase Auth in the browser, then call this API with `Authorization: Bearer <access_token>`.

## Env

Copy `.env.example` → `.env`:

- `PORT` (default 3001)
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (or `SUPABASE_ANON_KEY`)
- `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | no | Health check |
| GET | `/api/me` | yes | Current auth user |
| GET | `/api/profiles/me` | yes | Current profile |
| GET | `/api/profiles` | yes | Other profiles |
| POST | `/api/profiles` | yes | Create/upsert own profile |
| GET | `/api/conversations` | yes | List conversations |
| POST | `/api/conversations` | yes | Start conversation |
| GET | `/api/conversations/:id/messages` | yes | List messages |
| POST | `/api/conversations/:id/messages` | yes | Send message |
| POST | `/api/ai/assistant` | yes | Proxy to AI edge function |
