import { db } from "./db.js";

export async function isCourseTeacher(courseId: string, userId: string) {
  const row = await db("courses")
    .where({ id: courseId, teacher_id: userId })
    .first("id");
  return Boolean(row);
}

export async function assertCourseTeacher(courseId: string, userId: string) {
  const ok = await isCourseTeacher(courseId, userId);
  if (!ok) {
    const err = new Error("Forbidden");
    (err as Error & { status: number }).status = 403;
    throw err;
  }
}

export function asProfile(user: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.name,
    avatar_url: user.image ?? null,
  };
}
