import { createAuthClient } from "better-auth/react";

/** Empty = same-origin (Vite proxies /api). Set VITE_API_URL in production. */
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL,
});
