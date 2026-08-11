import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth, type SessionUser } from "../lib/auth.js";

export type AuthenticatedRequest = Request & {
  user?: SessionUser;
};

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
    next();
  } catch (err) {
    res.status(401).json({
      error: err instanceof Error ? err.message : "Unauthorized",
    });
  }
}
