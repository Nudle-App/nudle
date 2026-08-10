import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

export const meRouter = Router();

meRouter.get("/me", requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    appMetadata: user.app_metadata,
    userMetadata: user.user_metadata,
  });
});
