import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { asProfile } from "../lib/access.js";

export const meRouter = Router();

meRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const roles = await db("user_roles")
      .where({ user_id: req.user!.id })
      .pluck("role");

    res.json({
      id: req.user!.id,
      email: req.user!.email,
      profile: asProfile(req.user!),
      roles,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load current user",
    });
  }
});
