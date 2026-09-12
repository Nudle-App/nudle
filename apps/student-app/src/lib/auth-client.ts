import { createAuthClient } from "better-auth/react";

export const authBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});
