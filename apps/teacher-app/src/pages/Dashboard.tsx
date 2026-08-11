import { BookOpen, Users, CheckCircle, AlertCircle } from "lucide-react";
import { KPICard } from "@/components/Dashboard/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Progress } from "@nudle/ui/progress";
import { Badge } from "@nudle/ui/badge";
import { useDashboard } from "@/hooks/useTeacherData";

const Dashboard = () => {
  const { data, isLoading, error } = useDashboard();

  const kpiData = [
    {
      title: "Total Courses",
      value: data?.kpis.totalCourses ?? 0,
      icon: BookOpen,
      trend: { value: "", positive: true },
    },
    {
      title: "Enrolled Students",
      value: data?.kpis.enrolledStudents ?? 0,
      icon: Users,
      trend: { value: "", positive: true },
    },
    {
      title: "Completed Assessments",
      value: data?.kpis.completedAssessments ?? 0,
      icon: CheckCircle,
      trend: { value: "", positive: true },
    },
    {
      title: "Pending Tasks",
      value: data?.kpis.pendingTasks ?? 0,
      icon: AlertCircle,
      trend: { value: "", positive: false },
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Failed to load dashboard. Sign in and ensure the API is running.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Student Progress Overview</CardTitle>
            <CardDescription>Assessment completion rates by course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(data?.progress?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">No courses yet. Create one to get started.</p>
            ) : (
              data!.progress.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.course}</span>
                    <span className="text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Recent grading queue
            </CardTitle>
            <CardDescription>Assignments waiting for your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentActivity?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">No pending submissions.</p>
            ) : (
              data!.recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                  <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>
                    {item.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
