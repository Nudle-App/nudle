import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

export const rolesRouter = Router();

const assignRoleSchema = z.object({
  role: z.enum(["student", "teacher"]),
});

rolesRouter.post("/roles", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = assignRoleSchema.parse(req.body);

    const existing = await db("user_roles")
      .where({ user_id: req.user!.id, role: body.role })
      .first();

    if (existing) {
      res.status(200).json(existing);
      return;
    }

    const [row] = await db("user_roles")
      .insert({ user_id: req.user!.id, role: body.role })
      .returning("*");

    res.status(201).json(row);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to assign role",
    });
  }
});
