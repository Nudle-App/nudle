import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { db } from "../lib/db.js";

export const teacherRouter = Router();

teacherRouter.get(
  "/teacher/dashboard",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const teacherId = req.user!.id;
      const courses = await db("courses")
        .select("id", "title", "status")
        .where({ teacher_id: teacherId });
      const courseIds = courses.map((c) => c.id);

      let enrollmentCount = 0;
      let pendingCount = 0;
      let gradedCount = 0;
      const progress: { course: string; progress: number }[] = [];
      const recentActivity: { title: string; status: string; priority: string }[] = [];

      if (courseIds.length > 0) {
        enrollmentCount = Number(
          (await db("enrollments").whereIn("course_id", courseIds).count("* as c").first())?.c ?? 0,
        );

        const assignments = await db("assignments")
          .select("id", "title", "course_id")
          .whereIn("course_id", courseIds);
        const assignmentIds = assignments.map((a) => a.id);
        const assignmentMeta = new Map(assignments.map((a) => [a.id, a]));
        const courseTitle = new Map(courses.map((c) => [c.id, c.title]));

        if (assignmentIds.length > 0) {
          const submissions = await db("submissions")
            .select("id", "status", "grade", "assignment_id", "updated_at")
            .whereIn("assignment_id", assignmentIds);

          pendingCount = submissions.filter((s) => s.status === "pending").length;
          gradedCount = submissions.filter((s) => s.status === "graded").length;

          for (const course of courses) {
            const courseAssignmentIds = assignments
              .filter((a) => a.course_id === course.id)
              .map((a) => a.id);
            const courseSubs = submissions.filter((s) =>
              courseAssignmentIds.includes(s.assignment_id),
            );
            const graded = courseSubs.filter((s) => s.status === "graded").length;
            const pct =
              courseSubs.length === 0 ? 0 : Math.round((graded / courseSubs.length) * 100);
            progress.push({ course: course.title, progress: pct });
          }

          for (const s of submissions.filter((x) => x.status === "pending").slice(0, 5)) {
            const a = assignmentMeta.get(s.assignment_id);
            recentActivity.push({
              title: `${courseTitle.get(a?.course_id ?? "") ?? "Course"} - ${a?.title ?? "Assignment"}`,
              status: "Grading Needed",
              priority: "high",
            });
          }
        } else {
          for (const course of courses) {
            progress.push({ course: course.title, progress: 0 });
          }
        }
      }

      res.json({
        kpis: {
          totalCourses: courses.length,
          enrolledStudents: enrollmentCount,
          completedAssessments: gradedCount,
          pendingTasks: pendingCount,
        },
        progress,
        recentActivity,
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load dashboard",
      });
    }
  },
);

teacherRouter.get(
  "/teacher/analytics",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const teacherId = req.user!.id;
      const courses = await db("courses").select("id", "title").where({ teacher_id: teacherId });
      const courseIds = courses.map((c) => c.id);

      if (courseIds.length === 0) {
        res.json({ engagement: 0, completion: 0, courses: [], insights: [] });
        return;
      }

      const enrollments = await db("enrollments")
        .select("course_id", "student_id")
        .whereIn("course_id", courseIds);
      const assignments = await db("assignments")
        .select("id", "course_id")
        .whereIn("course_id", courseIds);
      const assignmentIds = assignments.map((a) => a.id);
      const submissions =
        assignmentIds.length > 0
          ? await db("submissions")
              .select("assignment_id", "status", "grade", "student_id")
              .whereIn("assignment_id", assignmentIds)
          : [];
      const attendance = await db("attendance_records")
        .select("course_id", "student_id", "status")
        .whereIn("course_id", courseIds);

      const courseBars = courses.map((course) => {
        const enrolled = enrollments.filter((e) => e.course_id === course.id).length;
        const aIds = assignments.filter((a) => a.course_id === course.id).map((a) => a.id);
        const subs = submissions.filter((s) => aIds.includes(s.assignment_id));
        const graded = subs.filter((s) => s.status === "graded");
        const avgGrade =
          graded.length === 0
            ? 0
            : Math.round(
                graded.reduce((s, g) => s + Number(g.grade ?? 0), 0) / graded.length,
              );
        const completion =
          subs.length === 0 ? 0 : Math.round((graded.length / subs.length) * 100);
        return {
          id: course.id,
          title: course.title,
          students: enrolled,
          averageGrade: avgGrade,
          completion,
        };
      });

      const completion =
        submissions.length === 0
          ? 0
          : Math.round(
              (submissions.filter((s) => s.status === "graded").length / submissions.length) *
                100,
            );
      const engagement =
        attendance.length === 0
          ? 0
          : Math.round(
              (attendance.filter((a) => a.status === "present" || a.status === "late").length /
                attendance.length) *
                100,
            );

      const lowCourses = courseBars.filter((c) => c.averageGrade > 0 && c.averageGrade < 75);
      res.json({
        engagement,
        completion,
        courses: courseBars,
        insights: [
          ...(lowCourses.length
            ? [
                {
                  type: "performance",
                  title: "Performance Alert",
                  body: `${lowCourses.length} course(s) have average grades below 75%. Consider review sessions.`,
                },
              ]
            : []),
          {
            type: "engagement",
            title: "Engagement",
            body: `Overall attendance/engagement is at ${engagement}%.`,
          },
          {
            type: "completion",
            title: "Assessment completion",
            body: `${completion}% of submissions are graded across your courses.`,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load analytics",
      });
    }
  },
);

teacherRouter.get(
  "/teacher/report-cards",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const teacherId = req.user!.id;
      const courses = await db("courses").select("id", "title").where({ teacher_id: teacherId });
      const courseIds = courses.map((c) => c.id);

      if (courseIds.length === 0) {
        res.json({ students: [], kpis: { reports: 0, average: 0, pending: 0 } });
        return;
      }

      const enrollments = await db("enrollments as e")
        .join("user as u", "u.id", "e.student_id")
        .whereIn("e.course_id", courseIds)
        .select("e.course_id", "e.student_id", "u.name", "u.email");

      const assignments = await db("assignments")
        .select("id", "course_id")
        .whereIn("course_id", courseIds);
      const assignmentIds = assignments.map((a) => a.id);
      const submissions =
        assignmentIds.length > 0
          ? await db("submissions")
              .select("assignment_id", "student_id", "grade", "status")
              .whereIn("assignment_id", assignmentIds)
          : [];

      const courseTitle = new Map(courses.map((c) => [c.id, c.title]));
      const assignmentCourse = new Map(assignments.map((a) => [a.id, a.course_id]));

      const rows = enrollments.map((e) => {
        const studentSubs = submissions.filter((s) => {
          if (s.student_id !== e.student_id) return false;
          return assignmentCourse.get(s.assignment_id) === e.course_id;
        });
        const graded = studentSubs.filter((s) => s.status === "graded" && s.grade !== null);
        const average =
          graded.length === 0
            ? null
            : Math.round(
                graded.reduce((sum, s) => sum + Number(s.grade), 0) / graded.length,
              );

        return {
          studentId: e.student_id,
          name: e.name,
          email: e.email,
          courseId: e.course_id,
          course: courseTitle.get(e.course_id) ?? "Course",
          average,
          gradedCount: graded.length,
          pendingCount: studentSubs.filter((s) => s.status === "pending").length,
        };
      });

      const withAvg = rows.filter((r) => r.average !== null);
      const overallAvg =
        withAvg.length === 0
          ? 0
          : Math.round(withAvg.reduce((s, r) => s + (r.average ?? 0), 0) / withAvg.length);

      res.json({
        students: rows,
        kpis: {
          reports: rows.length,
          average: overallAvg,
          pending: rows.reduce((s, r) => s + r.pendingCount, 0),
        },
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Failed to load report cards",
      });
    }
  },
);
