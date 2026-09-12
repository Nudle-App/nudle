import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { userHasRole } from "../lib/access.js";

export const invitationsRouter = Router();

invitationsRouter.get("/invitations", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const email = req.user!.email.toLowerCase();
    const rows = await db("parent_invitations as i")
      .join("user as p", "p.id", "i.parent_id")
      .whereRaw("lower(i.student_email) = ?", [email])
      .where("i.status", "pending")
      .andWhere("i.expires_at", ">", db.fn.now())
      .whereNotExists(function () {
        this.select(db.raw("1"))
          .from("parent_students as ps")
          .whereRaw("ps.parent_id = i.parent_id")
          .andWhere("ps.student_id", req.user!.id);
      })
      .select(
        "i.id",
        "i.token",
        "i.relationship",
        "i.expires_at",
        "i.created_at",
        "p.name as parent_name",
      )
      .orderBy("i.created_at", "desc");

    res.json(
      rows.map((row) => ({
        id: row.id,
        token: row.token,
        relationship: row.relationship,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
        parentName: row.parent_name,
      })),
    );
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load invitations",
    });
  }
});

invitationsRouter.get("/invitations/:token", async (req, res) => {
  try {
    const invite = await loadInvite(req.params.token);
    if (!invite) {
      res.status(404).json({ error: "Invitation not found" });
      return;
    }

    const parent = await db("user").where({ id: invite.parent_id }).first("name", "email");
    res.json(publicInvite(invite, parent?.name ?? "A parent"));
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load invitation",
    });
  }
});

invitationsRouter.post(
  "/invitations/:token/accept",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const invite = await loadInvite(req.params.token);
      if (!invite) {
        res.status(404).json({ error: "Invitation not found" });
        return;
      }

      const statusError = inviteStatusError(invite);
      if (statusError) {
        res.status(statusError.status).json({ error: statusError.error });
        return;
      }

      if (req.user!.email.toLowerCase() !== invite.student_email.toLowerCase()) {
        res.status(403).json({
          error: `Sign in as ${invite.student_email} to accept this invitation`,
        });
        return;
      }

      const isStudent = await userHasRole(req.user!.id, "student");
      if (!isStudent) {
        res.status(400).json({ error: "Only a student account can accept this invitation" });
        return;
      }

      await db.transaction(async (trx) => {
        const existing = await trx("parent_students")
          .where({ parent_id: invite.parent_id, student_id: req.user!.id })
          .first();

        if (!existing) {
          await trx("parent_students").insert({
            parent_id: invite.parent_id,
            student_id: req.user!.id,
            relationship: invite.relationship,
          });
        }

        await trx("parent_invitations")
          .where({ parent_id: invite.parent_id, status: "pending" })
          .whereRaw("lower(student_email) = ?", [invite.student_email.toLowerCase()])
          .update({
            status: "accepted",
            student_id: req.user!.id,
            responded_at: trx.fn.now(),
          });
      });

      res.json({ accepted: true });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to accept invitation",
      });
    }
  },
);

invitationsRouter.post(
  "/invitations/:token/decline",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const invite = await loadInvite(req.params.token);
      if (!invite) {
        res.status(404).json({ error: "Invitation not found" });
        return;
      }

      const statusError = inviteStatusError(invite);
      if (statusError) {
        res.status(statusError.status).json({ error: statusError.error });
        return;
      }

      if (req.user!.email.toLowerCase() !== invite.student_email.toLowerCase()) {
        res.status(403).json({
          error: `Sign in as ${invite.student_email} to decline this invitation`,
        });
        return;
      }

      await db("parent_invitations")
        .where({ id: invite.id })
        .update({
          status: "declined",
          student_id: req.user!.id,
          responded_at: db.fn.now(),
        });

      res.json({ declined: true });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to decline invitation",
      });
    }
  },
);

async function loadInvite(token: string) {
  return db("parent_invitations").where({ token }).first();
}

function inviteStatusError(invite: { status: string; expires_at: Date | string }) {
  if (invite.status === "accepted") {
    return { status: 409, error: "This invitation has already been accepted" };
  }
  if (invite.status === "declined" || invite.status === "cancelled") {
    return { status: 410, error: "This invitation is no longer valid" };
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { status: 410, error: "This invitation has expired" };
  }
  return null;
}

function publicInvite(
  invite: {
    student_email: string;
    relationship: string;
    status: string;
    expires_at: Date | string;
  },
  parentName: string,
) {
  return {
    parentName,
    studentEmail: invite.student_email,
    relationship: invite.relationship,
    status: invite.status,
    expiresAt: invite.expires_at,
    expired: new Date(invite.expires_at).getTime() < Date.now(),
  };
}
