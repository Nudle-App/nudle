import { BookOpen, Users, CheckCircle, AlertCircle } from "lucide-react";
import { KPICard } from "@/components/Dashboard/KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Progress } from "@nudle/ui/progress";
import { Badge } from "@nudle/ui/badge";

const Dashboard = () => {
  const kpiData = [
    { title: "Total Courses", value: 24, icon: BookOpen, trend: { value: "12%", positive: true } },
    { title: "Enrolled Students", value: 342, icon: Users, trend: { value: "8%", positive: true } },
    { title: "Completed Assessments", value: 156, icon: CheckCircle, trend: { value: "23%", positive: true } },
    { title: "Pending Tasks", value: 8, icon: AlertCircle, trend: { value: "5%", positive: false } },
  ];

  const recentActivity = [
    { title: "Introduction to Biology - Module 3", status: "Grading Needed", priority: "high" },
    { title: "Advanced Mathematics - Quiz 5", status: "Completed", priority: "low" },
    { title: "Physics 101 - Lab Report", status: "In Review", priority: "medium" },
  ];

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
            <CardDescription>Average completion rates by course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { course: "Introduction to Biology", progress: 85 },
              { course: "Advanced Mathematics", progress: 72 },
              { course: "Physics 101", progress: 68 },
              { course: "Chemistry Basics", progress: 91 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.course}</span>
                  <span className="text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>Intelligent recommendations for your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-accent border border-border">
              <p className="text-sm font-medium mb-2">📊 Performance Alert</p>
              <p className="text-sm text-muted-foreground">
                5 students in Biology Module 3 are showing signs of struggle. Consider scheduling review sessions.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent border border-border">
              <p className="text-sm font-medium mb-2">✨ Suggestion</p>
              <p className="text-sm text-muted-foreground">
                Grade distribution in Math Quiz 5 suggests the difficulty level was appropriate. Similar format recommended.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent border border-border">
              <p className="text-sm font-medium mb-2">🎯 Engagement Tip</p>
              <p className="text-sm text-muted-foreground">
                Students are most active between 2-4 PM. Consider scheduling important announcements during this window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Tasks and assessments requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-accent transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.status}</p>
                </div>
                <Badge 
                  variant={
                    activity.priority === "high" ? "destructive" : 
                    activity.priority === "medium" ? "default" : 
                    "secondary"
                  }
                >
                  {activity.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
