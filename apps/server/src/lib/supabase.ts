import "../env.js";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const publishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !publishableKey) {
  console.warn(
    "[server] SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY) are required.",
  );
}

/** Publishable/anon client — used to validate user JWTs. */
export const supabaseAnon: SupabaseClient | null =
  supabaseUrl && publishableKey
    ? createClient(supabaseUrl, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

/** Secret/service client — privileged DB work (never expose to the browser). */
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && secretKey
    ? createClient(supabaseUrl, secretKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

/** RLS-aware client acting as the authenticated user. */
export function createUserClient(accessToken: string): SupabaseClient {
  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase is not configured on the server");
  }

  return createClient(supabaseUrl, publishableKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type { User };
