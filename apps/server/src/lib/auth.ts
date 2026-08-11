import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { db } from "./db.js";

const connectionString = process.env.DATABASE_URL;
const needsSsl =
  Boolean(connectionString?.includes("neon.tech")) ||
  Boolean(connectionString?.includes("sslmode=require"));

const pool = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";
// Teacher/student apps are on different origins (Render). Cross-site cookies
// require SameSite=None; Secure. Keep Lax on plain local http.
const crossSiteCookies =
  baseURL.startsWith("https://") || process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  // Allow any Origin that calls the API (pairs with cors origin: true).
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    return origin ? [origin] : [];
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: crossSiteCookies
      ? {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          partitioned: true,
        }
      : {
          sameSite: "lax",
          secure: false,
          httpOnly: true,
        },
  },
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Default role; apps can also POST /api/roles after signup.
          const existing = await db("user_roles").where({ user_id: user.id }).first();
          if (!existing) {
            await db("user_roles").insert({
              user_id: user.id,
              role: "student",
            });
          }
        },
      },
    },
  },
  // @better-auth/infra (dash) requires zod v4 across the whole install graph;
  // omit until the monorepo is on zod 4 — BETTER_AUTH_API_KEY alone is not enough.
});

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};
