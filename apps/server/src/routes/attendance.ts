import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";
import { assertCourseTeacher } from "../lib/access.js";

export const attendanceRouter = Router();

attendanceRouter.get("/attendance", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const courseId = typeof req.query.courseId === "string" ? req.query.courseId : undefined;

    let coursesQuery = db("courses")
      .select("id", "title")
      .where({ teacher_id: req.user!.id });
    if (courseId) coursesQuery = coursesQuery.andWhere({ id: courseId });

    const courses = await coursesQuery;
    const courseIds = courses.map((c) => c.id);

    if (courseIds.length === 0) {
      res.json({ summary: { average: 0, atRisk: 0, totalClasses: 0 }, records: [] });
      return;
    }

    const enrollments = await db("enrollments as e")
      .join("user as u", "u.id", "e.student_id")
      .whereIn("e.course_id", courseIds)
      .select("e.course_id", "e.student_id", "u.name", "u.email");

    const records = await db("attendance_records").whereIn("course_id", courseIds);
    const courseTitle = new Map(courses.map((c) => [c.id, c.title]));

    const byStudentCourse = new Map<
      string,
      {
        id: string;
        name: string;
        course: string;
        courseId: string;
        present: number;
        absent: number;
        late: number;
      }
    >();

    for (const e of enrollments) {
      byStudentCourse.set(`${e.course_id}:${e.student_id}`, {
        id: e.student_id,
        name: e.name,
        course: courseTitle.get(e.course_id) ?? "Course",
        courseId: e.course_id,
        present: 0,
        absent: 0,
        late: 0,
      });
    }

    for (const r of records) {
      const row = byStudentCourse.get(`${r.course_id}:${r.student_id}`);
      if (!row) continue;
      if (r.status === "present") row.present += 1;
      else if (r.status === "absent") row.absent += 1;
      else if (r.status === "late") row.late += 1;
    }

    const list = [...byStudentCourse.values()].map((row) => {
      const total = row.present + row.absent + row.late;
      const percentage =
        total === 0 ? 100 : Math.round(((row.present + row.late * 0.5) / total) * 100);
      return { ...row, percentage };
    });

    const avg =
      list.length === 0
        ? 0
        : Math.round(list.reduce((s, r) => s + r.percentage, 0) / list.length);
    const atRisk = list.filter((r) => r.percentage < 80).length;
    const totalClasses = new Set(records.map((r) => `${r.course_id}:${r.date}`)).size;

    res.json({
      summary: { average: avg, atRisk, totalClasses },
      records: list,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load attendance",
    });
  }
});

const upsertSchema = z.object({
  course_id: z.string().uuid(),
  student_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["present", "absent", "late"]),
});

attendanceRouter.post("/attendance", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const body = upsertSchema.parse(req.body);
    await assertCourseTeacher(body.course_id, req.user!.id);

    const [data] = await db("attendance_records")
      .insert({
        course_id: body.course_id,
        student_id: body.student_id,
        date: body.date,
        status: body.status,
      })
      .onConflict(["course_id", "student_id", "date"])
      .merge({ status: body.status })
      .returning("*");

    res.status(201).json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.flatten() });
      return;
    }
    const status = (err as { status?: number }).status ?? 500;
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to save attendance",
    });
  }
});
