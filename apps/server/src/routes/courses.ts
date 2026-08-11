import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { assertCourseTeacher } from "../lib/access.js";

export const coursesRouter = Router();

coursesRouter.get("/courses", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const roles = await db("user_roles").where({ user_id: userId }).pluck("role");

    let coursesQuery = db("courses").select("*").orderBy("created_at", "desc");

    if (roles.includes("teacher") || roles.includes("admin")) {
      coursesQuery = coursesQuery.where({ teacher_id: userId });
    } else {
      const enrolledIds = await db("enrollments").where({ student_id: userId }).pluck("course_id");
      if (enrolledIds.length === 0) {
        res.json([]);
        return;
      }
      coursesQuery = coursesQuery.whereIn("id", enrolledIds);
    }

    const courses = await coursesQuery;
    const teacherIds = [...new Set(courses.map((c) => c.teacher_id))];
    const teachers =
      teacherIds.length > 0
        ? await db("user").select("id", "name", "email").whereIn("id", teacherIds)
        : [];
    const teacherMap = new Map(teachers.map((t) => [t.id, t]));

    const counts = await db("enrollments")
      .select("course_id")
      .count<{ course_id: string; count: string }[]>("* as count")
      .whereIn(
        "course_id",
        courses.map((c) => c.id),
      )
      .groupBy("course_id");
    const countMap = new Map(counts.map((c) => [c.course_id, Number(c.count)]));

    res.json(
      courses.map((course) => ({
        ...course,
        students: countMap.get(course.id) ?? 0,
        instructor: teacherMap.get(course.teacher_id)?.name ?? "Teacher",
      })),
    );
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load courses",
    });
  }
});

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "draft"]).optional(),
  thumbnail: z.string().optional(),
});

coursesRouter.post("/courses", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = courseSchema.parse(req.body);

    const hasTeacher = await db("user_roles")
      .where({ user_id: req.user!.id, role: "teacher" })
      .first();
    if (!hasTeacher) {
      await db("user_roles").insert({ user_id: req.user!.id, role: "teacher" });
    }

    const [data] = await db("courses")
      .insert({
        teacher_id: req.user!.id,
        title: body.title.trim(),
        description: body.description ?? "",
        status: body.status ?? "active",
        thumbnail: body.thumbnail ?? "📚",
      })
      .returning("*");

    res.status(201).json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to create course",
    });
  }
});

coursesRouter.patch("/courses/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = courseSchema.partial().parse(req.body);
    await assertCourseTeacher(req.params.id, req.user!.id);

    const patch: Record<string, unknown> = { updated_at: db.fn.now() };
    if (body.title !== undefined) patch.title = body.title.trim();
    if (body.description !== undefined) patch.description = body.description;
    if (body.status !== undefined) patch.status = body.status;
    if (body.thumbnail !== undefined) patch.thumbnail = body.thumbnail;

    const [data] = await db("courses").where({ id: req.params.id }).update(patch).returning("*");
    res.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    const status = (err as { status?: number }).status ?? 500;
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to update course",
    });
  }
});

coursesRouter.delete("/courses/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await assertCourseTeacher(req.params.id, req.user!.id);
    await db("courses").where({ id: req.params.id }).del();
    res.status(204).send();
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to delete course",
    });
  }
});

coursesRouter.get(
  "/courses/:id/enrollments",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      await assertCourseTeacher(req.params.id, req.user!.id);
      const rows = await db("enrollments as e")
        .join("user as u", "u.id", "e.student_id")
        .where("e.course_id", req.params.id)
        .orderBy("e.created_at")
        .select(
          "e.id",
          "e.student_id",
          "e.created_at",
          "u.id as profile_id",
          "u.email",
          "u.name",
        );

      res.json(
        rows.map((r) => ({
          id: r.id,
          student_id: r.student_id,
          created_at: r.created_at,
          profiles: { id: r.profile_id, email: r.email, full_name: r.name },
        })),
      );
    } catch (err) {
      const status = (err as { status?: number }).status ?? 500;
      res.status(status).json({
        error: err instanceof Error ? err.message : "Failed to load enrollments",
      });
    }
  },
);

const enrollSchema = z.object({
  student_id: z.string().min(1),
});

coursesRouter.post(
  "/courses/:id/enrollments",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = enrollSchema.parse(req.body);
      await assertCourseTeacher(req.params.id, req.user!.id);

      const [row] = await db("enrollments")
        .insert({
          course_id: req.params.id,
          student_id: body.student_id,
        })
        .returning("*");

      const student = await db("user").where({ id: body.student_id }).first();
      res.status(201).json({
        ...row,
        profiles: student
          ? { id: student.id, email: student.email, full_name: student.name }
          : null,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.flatten() });
        return;
      }
      const status = (err as { status?: number }).status ?? 500;
      res.status(status).json({
        error: err instanceof Error ? err.message : "Failed to enroll student",
      });
    }
  },
);

coursesRouter.delete(
  "/courses/:id/enrollments/:enrollmentId",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      await assertCourseTeacher(req.params.id, req.user!.id);
      await db("enrollments")
        .where({ id: req.params.enrollmentId, course_id: req.params.id })
        .del();
      res.status(204).send();
    } catch (err) {
      const status = (err as { status?: number }).status ?? 500;
      res.status(status).json({
        error: err instanceof Error ? err.message : "Failed to remove enrollment",
      });
    }
  },
);

const assignmentSchema = z.object({
  title: z.string().min(1),
  due_at: z.string().datetime().nullable().optional(),
});

coursesRouter.get(
  "/courses/:id/assignments",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await db("assignments")
        .where({ course_id: req.params.id })
        .orderBy("created_at", "desc");
      res.json(data);
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load assignments",
      });
    }
  },
);

coursesRouter.post(
  "/courses/:id/assignments",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const body = assignmentSchema.parse(req.body);
      await assertCourseTeacher(req.params.id, req.user!.id);

      const [assignment] = await db("assignments")
        .insert({
          course_id: req.params.id,
          title: body.title.trim(),
          due_at: body.due_at ?? null,
        })
        .returning("*");

      const enrolled = await db("enrollments")
        .where({ course_id: req.params.id })
        .select("student_id");

      if (enrolled.length > 0) {
        await db("submissions").insert(
          enrolled.map((e) => ({
            assignment_id: assignment.id,
            student_id: e.student_id,
            status: "pending",
          })),
        );
      }

      res.status(201).json(assignment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.flatten() });
        return;
      }
      const status = (err as { status?: number }).status ?? 500;
      res.status(status).json({
        error: err instanceof Error ? err.message : "Failed to create assignment",
      });
    }
  },
);
