import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { asProfile } from "../lib/access.js";

export const meRouter = Router();

type Preferences = { theme: "light" | "dark" | "system" };

const defaultPreferences: Preferences = { theme: "system" };

function normalizePreferences(raw: unknown): Preferences {
  if (!raw || typeof raw !== "object") return { ...defaultPreferences };
  const theme = (raw as { theme?: string }).theme;
  if (theme === "light" || theme === "dark" || theme === "system") {
    return { theme };
  }
  return { ...defaultPreferences };
}

meRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const roles = await db("user_roles")
      .where({ user_id: req.user!.id })
      .pluck("role");

    const row = await db("user")
      .where({ id: req.user!.id })
      .first("id", "email", "name", "image", "preferences");

    res.json({
      id: req.user!.id,
      email: row?.email ?? req.user!.email,
      profile: row
        ? asProfile({
            id: row.id,
            name: row.name,
            email: row.email,
            image: row.image,
          })
        : asProfile(req.user!),
      roles,
      preferences: normalizePreferences(row?.preferences),
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load current user",
    });
  }
});

const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

meRouter.patch("/me/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = preferencesSchema.parse(req.body);
    const row = await db("user").where({ id: req.user!.id }).first("preferences");
    const current = normalizePreferences(row?.preferences);
    const next = { ...current, ...body };

    await db("user")
      .where({ id: req.user!.id })
      .update({
        preferences: JSON.stringify(next),
        updated_at: db.fn.now(),
      });

    res.json({ preferences: next });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to update preferences",
    });
  }
});
