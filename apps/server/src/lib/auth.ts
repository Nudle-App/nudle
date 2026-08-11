import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
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

const trustedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.CORS_ORIGIN,
  process.env.TEACHER_ORIGIN,
  process.env.STUDENT_ORIGIN,
].filter(Boolean) as string[];

const isHttps = (process.env.BETTER_AUTH_URL ?? "").startsWith("https://");

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  advanced: isHttps
    ? {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
        },
      }
    : undefined,
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
  plugins: [
    ...(process.env.BETTER_AUTH_API_KEY
      ? [
          dash({
            apiKey: process.env.BETTER_AUTH_API_KEY,
          }),
        ]
      : []),
  ],
});

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};
