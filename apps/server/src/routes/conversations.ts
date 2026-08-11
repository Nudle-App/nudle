import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

export const conversationsRouter = Router();

conversationsRouter.get(
  "/conversations",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const conversationIds = await db("conversation_participants")
        .where({ user_id: userId })
        .pluck("conversation_id");

      if (conversationIds.length === 0) {
        res.json([]);
        return;
      }

      const conversations = await db("conversations")
        .whereIn("id", conversationIds)
        .orderBy("updated_at", "desc");

      const participants = await db("conversation_participants as cp")
        .join("user as u", "u.id", "cp.user_id")
        .whereIn("cp.conversation_id", conversationIds)
        .select(
          "cp.conversation_id",
          "cp.user_id",
          "u.id as profile_id",
          "u.email",
          "u.name",
        );

      const byConv = new Map<string, unknown[]>();
      for (const p of participants) {
        const list = byConv.get(p.conversation_id) ?? [];
        list.push({
          user_id: p.user_id,
          profiles: { id: p.profile_id, email: p.email, full_name: p.name },
        });
        byConv.set(p.conversation_id, list);
      }

      res.json(
        conversations.map((c) => ({
          ...c,
          conversation_participants: byConv.get(c.id) ?? [],
        })),
      );
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load conversations",
      });
    }
  },
);

const createConversationSchema = z.object({
  subject: z.string().min(1),
  recipient_id: z.string().min(1),
});

conversationsRouter.post(
  "/conversations",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = createConversationSchema.parse(req.body);
      const userId = req.user!.id;

      const [conversation] = await db("conversations")
        .insert({ subject: body.subject.trim() })
        .returning("*");

      await db("conversation_participants").insert([
        { conversation_id: conversation.id, user_id: userId },
        { conversation_id: conversation.id, user_id: body.recipient_id },
      ]);

      res.status(201).json(conversation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.flatten() });
        return;
      }
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to create conversation",
      });
    }
  },
);

conversationsRouter.get(
  "/conversations/:id/messages",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const member = await db("conversation_participants")
        .where({ conversation_id: req.params.id, user_id: req.user!.id })
        .first();
      if (!member) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const messages = await db("messages")
        .where({ conversation_id: req.params.id })
        .orderBy("created_at", "asc");
      res.json(messages);
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load messages",
      });
    }
  },
);

const messageSchema = z.object({
  content: z.string().min(1),
});

conversationsRouter.post(
  "/conversations/:id/messages",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = messageSchema.parse(req.body);
      const member = await db("conversation_participants")
        .where({ conversation_id: req.params.id, user_id: req.user!.id })
        .first();
      if (!member) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const [message] = await db("messages")
        .insert({
          conversation_id: req.params.id,
          sender_id: req.user!.id,
          content: body.content,
        })
        .returning("*");

      await db("conversations")
        .where({ id: req.params.id })
        .update({ updated_at: db.fn.now() });

      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.flatten() });
        return;
      }
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to send message",
      });
    }
  },
);
