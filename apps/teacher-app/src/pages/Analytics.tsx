import { Progress } from "@nudle/ui/progress";
import { Badge } from "@nudle/ui/badge";
import { useAnalytics } from "@/hooks/useTeacherData";

const Analytics = () => {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading analytics…</div>;
  if (error) return <div className="p-8 text-destructive">Failed to load analytics.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle mt-1">Insights derived from grades and attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="surface-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Engagement</h2>
            <p className="page-subtitle mt-0.5">Present + late attendance share</p>
          </div>
          <p className="text-4xl font-semibold tracking-tight mb-3">{data?.engagement ?? 0}%</p>
          <Progress value={data?.engagement ?? 0} className="h-2" />
        </div>
        <div className="surface-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Assessment completion</h2>
            <p className="page-subtitle mt-0.5">Share of graded submissions</p>
          </div>
          <p className="text-4xl font-semibold tracking-tight mb-3">{data?.completion ?? 0}%</p>
          <Progress value={data?.completion ?? 0} className="h-2" />
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">By course</h2>
        </div>
        <div className="space-y-4">
          {(data?.courses ?? []).length === 0 ? (
            <p className="text-muted-foreground text-sm">No course data yet.</p>
          ) : (
            data!.courses.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{c.title}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="secondary" className="rounded-full font-normal">
                      {c.students} students
                    </Badge>
                    <span>avg {c.averageGrade || "—"}</span>
                    <span>{c.completion}% graded</span>
                  </div>
                </div>
                <Progress value={c.completion} className="h-2" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(data?.insights ?? []).map((insight, i) => (
          <div key={i} className="surface-card p-6">
            <Badge variant="outline" className="rounded-full mb-3 capitalize">
              {insight.type}
            </Badge>
            <h3 className="text-base font-semibold tracking-tight">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{insight.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
