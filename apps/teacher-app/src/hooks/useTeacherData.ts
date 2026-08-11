import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Course = {
  id: string;
  title: string;
  description?: string;
  status: "active" | "draft";
  thumbnail?: string;
  students: number;
  instructor: string;
  teacher_id: string;
};

export type SubmissionRow = {
  id: string;
  name: string;
  email: string;
  course: string;
  courseId: string | null;
  assignment: string;
  grade: number | null;
  status: "pending" | "graded";
  feedback?: string;
};

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get<Course[]>("/api/courses"),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; description?: string; status?: "active" | "draft"; thumbnail?: string }) =>
      api.post("/api/courses", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/courses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: () =>
      api.get<{
        kpis: {
          totalCourses: number;
          enrolledStudents: number;
          completedAssessments: number;
          pendingTasks: number;
        };
        progress: { course: string; progress: number }[];
        recentActivity: { title: string; status: string; priority: string }[];
      }>("/api/teacher/dashboard"),
  });
}

export function useSubmissions(courseId?: string) {
  const q = courseId && courseId !== "all" ? `?courseId=${courseId}` : "";
  return useQuery({
    queryKey: ["submissions", courseId ?? "all"],
    queryFn: () => api.get<SubmissionRow[]>(`/api/submissions${q}`),
  });
}

export function useGradeSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; grade: number; feedback?: string }) =>
      api.patch(`/api/submissions/${payload.id}`, {
        grade: payload.grade,
        feedback: payload.feedback ?? "",
        status: "graded",
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["submissions"] });
      void qc.invalidateQueries({ queryKey: ["teacher-dashboard"] });
      void qc.invalidateQueries({ queryKey: ["teacher-report-cards"] });
    },
  });
}

export function useAttendance(courseId?: string) {
  const q = courseId && courseId !== "all" ? `?courseId=${courseId}` : "";
  return useQuery({
    queryKey: ["attendance", courseId ?? "all"],
    queryFn: () =>
      api.get<{
        summary: { average: number; atRisk: number; totalClasses: number };
        records: {
          id: string;
          name: string;
          course: string;
          courseId: string;
          present: number;
          absent: number;
          late: number;
          percentage: number;
        }[];
      }>(`/api/attendance${q}`),
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["teacher-analytics"],
    queryFn: () =>
      api.get<{
        engagement: number;
        completion: number;
        courses: {
          id: string;
          title: string;
          students: number;
          averageGrade: number;
          completion: number;
        }[];
        insights: { type: string; title: string; body: string }[];
      }>("/api/teacher/analytics"),
  });
}

export function useReportCards() {
  return useQuery({
    queryKey: ["teacher-report-cards"],
    queryFn: () =>
      api.get<{
        students: {
          studentId: string;
          name: string;
          email: string;
          courseId: string;
          course: string;
          average: number | null;
          gradedCount: number;
          pendingCount: number;
        }[];
        kpis: { reports: number; average: number; pending: number };
      }>("/api/teacher/report-cards"),
  });
}

export function useProfiles(role?: "student" | "teacher") {
  const q = role ? `?role=${role}` : "";
  return useQuery({
    queryKey: ["profiles", role ?? "all"],
    queryFn: () =>
      api.get<{ id: string; email: string; full_name: string }[]>(`/api/profiles${q}`),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      api.get<{
        id: string;
        email?: string;
        profile: { full_name: string; email: string } | null;
        roles: string[];
      }>("/api/me"),
  });
}
