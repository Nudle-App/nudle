import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db.js";

export const demoRequestsRouter = Router();

const demoRequestSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  organization: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000).optional(),
});

demoRequestsRouter.post("/demo-requests", async (req, res) => {
  const parsed = demoRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid demo request",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { fullName, email, organization, role, phone, message } = parsed.data;

  try {
    const [row] = await db("demo_requests")
      .insert({
        full_name: fullName,
        email: email.toLowerCase(),
        organization,
        role,
        phone: phone || null,
        message: message || null,
      })
      .returning(["id", "created_at"]);

    res.status(201).json({
      ok: true,
      id: row.id,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error("[demo-requests]", err);
    res.status(500).json({ error: "Could not save demo request" });
  }
});
