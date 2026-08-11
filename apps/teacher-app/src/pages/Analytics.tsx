import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Progress } from "@nudle/ui/progress";
import { useAnalytics } from "@/hooks/useTeacherData";

const Analytics = () => {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading analytics…</div>;
  if (error) return <div className="p-8 text-destructive">Failed to load analytics.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Insights derived from grades and attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Present + late attendance share</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary mb-3">{data?.engagement ?? 0}%</p>
            <Progress value={data?.engagement ?? 0} className="h-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Assessment completion</CardTitle>
            <CardDescription>Share of graded submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary mb-3">{data?.completion ?? 0}%</p>
            <Progress value={data?.completion ?? 0} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>By course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data?.courses ?? []).length === 0 ? (
            <p className="text-muted-foreground text-sm">No course data yet.</p>
          ) : (
            data!.courses.map((c) => (
              <div key={c.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-muted-foreground">
                    {c.students} students · avg {c.averageGrade || "—"} · {c.completion}% graded
                  </span>
                </div>
                <Progress value={c.completion} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data?.insights ?? []).map((insight, i) => (
          <Card key={i} className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-base">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{insight.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
