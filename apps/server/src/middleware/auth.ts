import type { NextFunction, Request, Response } from "express";
import { supabaseAnon, type User } from "../lib/supabase.js";

export type AuthenticatedRequest = Request & {
  user?: User;
  accessToken?: string;
};

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!supabaseAnon) {
    res.status(503).json({ error: "Supabase is not configured on the server" });
    return;
  }

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "Missing access token" });
    return;
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }

  req.user = data.user;
  req.accessToken = token;
  next();
}
