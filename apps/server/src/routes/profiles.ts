import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { createUserClient } from "../lib/supabase.js";

export const profilesRouter = Router();

profilesRouter.get("/profiles/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = createUserClient(req.accessToken!);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user!.id)
      .maybeSingle();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to load profile" });
  }
});

profilesRouter.get("/profiles", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = createUserClient(req.accessToken!);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url")
      .neq("id", req.user!.id)
      .order("full_name");

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data ?? []);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to load profiles" });
  }
});

const createProfileSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
});

profilesRouter.post("/profiles", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = createProfileSchema.parse(req.body);
    const supabase = createUserClient(req.accessToken!);

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: req.user!.id,
          email: body.email,
          full_name: body.full_name,
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to create profile" });
  }
});
