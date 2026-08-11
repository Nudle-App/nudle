import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { createUserClient } from "../lib/supabase.js";

export const conversationsRouter = Router();

conversationsRouter.get(
  "/conversations",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const supabase = createUserClient(req.accessToken!);
      const userId = req.user!.id;

      const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", userId);

      if (participantError) {
        res.status(400).json({ error: participantError.message });
        return;
      }

      const conversationIds = (participantData ?? []).map((p) => p.conversation_id);
      if (conversationIds.length === 0) {
        res.json([]);
        return;
      }

      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          conversation_participants!inner(
            user_id,
            profiles(id, email, full_name)
          )
        `,
        )
        .in("id", conversationIds)
        .order("updated_at", { ascending: false });

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.json(data ?? []);
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load conversations",
      });
    }
  },
);

const createConversationSchema = z.object({
  subject: z.string().min(1),
  recipient_id: z.string().uuid(),
});

conversationsRouter.post(
  "/conversations",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = createConversationSchema.parse(req.body);
      const supabase = createUserClient(req.accessToken!);
      const userId = req.user!.id;

      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({ subject: body.subject.trim() })
        .select()
        .single();

      if (conversationError || !conversation) {
        res.status(400).json({ error: conversationError?.message ?? "Failed to create conversation" });
        return;
      }

      const { error: participantsError } = await supabase
        .from("conversation_participants")
        .insert([
          { conversation_id: conversation.id, user_id: userId },
          { conversation_id: conversation.id, user_id: body.recipient_id },
        ]);

      if (participantsError) {
        res.status(400).json({ error: participantsError.message });
        return;
      }

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
      const supabase = createUserClient(req.accessToken!);
      const conversationId = req.params.id;

      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      const senderIds = [...new Set((messages ?? []).map((m) => m.sender_id))];
      let senders: { id: string; email: string; full_name: string }[] = [];

      if (senderIds.length > 0) {
        const { data: senderProfiles } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", senderIds);
        senders = senderProfiles ?? [];
      }

      res.json(
        (messages ?? []).map((msg) => ({
          ...msg,
          sender: senders.find((p) => p.id === msg.sender_id) ?? null,
        })),
      );
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load messages",
      });
    }
  },
);

const sendMessageSchema = z.object({
  content: z.string().min(1),
});

conversationsRouter.post(
  "/conversations/:id/messages",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = sendMessageSchema.parse(req.body);
      const supabase = createUserClient(req.accessToken!);
      const conversationId = req.params.id;
      const userId = req.user!.id;

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: body.content.trim(),
        })
        .select()
        .single();

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      res.status(201).json(data);
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
