import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { asProfile } from "../lib/access.js";

export const profilesRouter = Router();

profilesRouter.get("/profiles/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  res.json(asProfile(req.user!));
});

profilesRouter.get("/profiles", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const role = typeof req.query.role === "string" ? req.query.role : undefined;

    let query = db("user").select("id", "email", "name", "image").whereNot("id", req.user!.id);

    if (role === "student" || role === "teacher" || role === "admin") {
      const ids = await db("user_roles").where({ role }).pluck("user_id");
      const filtered = ids.filter((id: string) => id !== req.user!.id);
      if (filtered.length === 0) {
        res.json([]);
        return;
      }
      query = query.whereIn("id", filtered);
    }

    const users = await query.orderBy("name");
    res.json(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.name,
        avatar_url: u.image ?? null,
      })),
    );
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load profiles",
    });
  }
});

const createProfileSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  role: z.enum(["student", "teacher"]).optional(),
});

profilesRouter.post("/profiles", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = createProfileSchema.parse(req.body);

    await db("user").where({ id: req.user!.id }).update({
      email: body.email,
      name: body.full_name,
      updated_at: db.fn.now(),
    });

    if (body.role) {
      const existing = await db("user_roles")
        .where({ user_id: req.user!.id, role: body.role })
        .first();
      if (!existing) {
        await db("user_roles").insert({ user_id: req.user!.id, role: body.role });
      }
    }

    res.status(201).json({
      id: req.user!.id,
      email: body.email,
      full_name: body.full_name,
      avatar_url: req.user!.image ?? null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to update profile",
    });
  }
});
