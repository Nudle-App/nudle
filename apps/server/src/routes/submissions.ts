import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

export const submissionsRouter = Router();

submissionsRouter.get("/submissions", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const courseId = typeof req.query.courseId === "string" ? req.query.courseId : undefined;
    const teacherId = req.user!.id;

    let query = db("submissions as s")
      .join("assignments as a", "a.id", "s.assignment_id")
      .join("courses as c", "c.id", "a.course_id")
      .join("user as u", "u.id", "s.student_id")
      .where("c.teacher_id", teacherId)
      .select(
        "s.id",
        "s.grade",
        "s.feedback",
        "s.status",
        "s.student_id",
        "s.assignment_id",
        "s.updated_at",
        "u.name",
        "u.email",
        "a.title as assignment",
        "a.course_id",
        "c.title as course",
      )
      .orderBy("s.updated_at", "desc");

    if (courseId) {
      query = query.andWhere("a.course_id", courseId);
    }

    const rows = await query;
    res.json(
      rows.map((row) => ({
        id: row.id,
        grade: row.grade === null ? null : Number(row.grade),
        feedback: row.feedback,
        status: row.status,
        student_id: row.student_id,
        assignment_id: row.assignment_id,
        name: row.name,
        email: row.email,
        assignment: row.assignment,
        course: row.course,
        courseId: row.course_id,
        updated_at: row.updated_at,
      })),
    );
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load submissions",
    });
  }
});

const gradeSchema = z.object({
  grade: z.number().min(0).max(100).nullable().optional(),
  feedback: z.string().optional(),
  status: z.enum(["pending", "graded"]).optional(),
});

submissionsRouter.patch(
  "/submissions/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = gradeSchema.parse(req.body);

      const owned = await db("submissions as s")
        .join("assignments as a", "a.id", "s.assignment_id")
        .join("courses as c", "c.id", "a.course_id")
        .where("s.id", req.params.id)
        .andWhere("c.teacher_id", req.user!.id)
        .first("s.id");

      if (!owned) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const nextStatus =
        body.status ??
        (body.grade !== undefined && body.grade !== null ? "graded" : undefined);

      const patch: Record<string, unknown> = { updated_at: db.fn.now() };
      if (body.grade !== undefined) patch.grade = body.grade;
      if (body.feedback !== undefined) patch.feedback = body.feedback;
      if (nextStatus) patch.status = nextStatus;

      const [data] = await db("submissions").where({ id: req.params.id }).update(patch).returning("*");
      res.json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.flatten() });
        return;
      }
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to update submission",
      });
    }
  },
);
