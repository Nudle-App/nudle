import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

export const aiRouter = Router();

const chatSchema = z.object({
  message: z.string().min(1),
});

/**
 * Proxies to the Supabase Edge Function `ai-assistant`.
 * Frontends must not call Supabase functions directly.
 */
aiRouter.post("/ai/assistant", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = chatSchema.parse(req.body);
    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey =
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !publishableKey) {
      res.status(503).json({ error: "Supabase is not configured on the server" });
      return;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
        apikey: publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: body.message }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      res.status(response.status).json({
        error:
          (payload as { error?: string }).error ??
          "AI assistant request failed",
      });
      return;
    }

    res.json(payload);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : "AI assistant request failed",
    });
  }
});
