import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Progress } from "@nudle/ui/progress";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Course Completion Rate",
      value: "78%",
      icon: Target,
      trend: "+5% from last month",
      color: "text-primary",
    },
    {
      title: "Average Engagement",
      value: "6.2 hrs/week",
      icon: Clock,
      trend: "+12% increase",
      color: "text-secondary",
    },
    {
      title: "Active Students",
      value: "289",
      icon: Users,
      trend: "84% of total",
      color: "text-primary",
    },
    {
      title: "Performance Trend",
      value: "+8.5%",
      icon: TrendingUp,
      trend: "Improvement this semester",
      color: "text-secondary",
    },
  ];

  const courses = [
    { name: "Biology 101", engagement: 85, completion: 78 },
    { name: "Math Advanced", engagement: 72, completion: 68 },
    { name: "Physics Lab", engagement: 91, completion: 82 },
    { name: "Chemistry Basics", engagement: 68, completion: 71 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Learning Analytics</h1>
        <p className="text-muted-foreground">Visualize and interpret academic performance data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <Card key={i} className="bg-gradient-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{metric.value}</p>
              <p className="text-sm font-medium text-muted-foreground mb-2">{metric.title}</p>
              <p className="text-xs text-secondary">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Course Engagement & Completion</CardTitle>
            <CardDescription>Track student participation and success rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {courses.map((course, i) => (
              <div key={i} className="space-y-3">
                <p className="font-medium text-foreground">{course.name}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="font-semibold">{course.engagement}%</span>
                  </div>
                  <Progress value={course.engagement} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-semibold">{course.completion}%</span>
                  </div>
                  <Progress value={course.completion} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Predictive Insights</CardTitle>
            <CardDescription>AI-powered performance predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-semibold text-destructive mb-2">⚠️ At-Risk Students</p>
              <p className="text-sm text-muted-foreground">
                5 students are at risk of falling behind in Biology 101. Early intervention recommended.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm font-semibold text-secondary mb-2">✨ High Performers</p>
              <p className="text-sm text-muted-foreground">
                12 students are excelling and ready for advanced material in Physics Lab.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-accent border border-border">
              <p className="text-sm font-semibold text-foreground mb-2">📊 Trend Analysis</p>
              <p className="text-sm text-muted-foreground">
                Overall engagement has increased 12% this month. Weekend study sessions showing positive impact.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-accent border border-border">
              <p className="text-sm font-semibold text-foreground mb-2">🎯 Recommendation</p>
              <p className="text-sm text-muted-foreground">
                Consider adding supplementary materials for Module 4 in Chemistry based on current pace.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
