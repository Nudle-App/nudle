import { Award, Trophy, Target, BookOpen, Calendar, Clock, TrendingUp, MessageSquare, GraduationCap, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nudle/ui/card";
import { Button } from "@nudle/ui/button";
import { Badge } from "@nudle/ui/badge";
import { Progress } from "@nudle/ui/progress";
import { AIAssistant } from "@/components/AIAssistant";

export default function Dashboard() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Chemistry Lab Report Due",
      course: "CHEM 1010-A01",
      date: "Apr 5",
      time: "11:59 PM",
      type: "assignment",
    },
    {
      id: 2,
      title: "Midterm Exam - Biology",
      course: "BIO 2020",
      date: "Apr 8",
      time: "2:00 PM",
      type: "exam",
    },
    {
      id: 3,
      title: "Physics Problem Set 3",
      course: "PHYS 1500",
      date: "Apr 10",
      time: "5:00 PM",
      type: "assignment",
    },
  ];

  const recentActivity = [
    { id: 1, type: "grade", message: "New grade posted in Chemistry", time: "2 hours ago" },
    { id: 2, type: "comment", message: "Instructor commented on your essay", time: "5 hours ago" },
    { id: 3, type: "announcement", message: "New study materials available", time: "1 day ago" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, Tadiswa! 📘
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card shadow-card hover:shadow-elevated transition-shadow border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Courses Enrolled</p>
                <p className="text-3xl font-bold text-foreground mt-2">8</p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  2 new this term
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-card hover:shadow-elevated transition-shadow border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assignments Due</p>
                <p className="text-3xl font-bold text-foreground mt-2">5</p>
                <p className="text-xs text-destructive mt-1">2 due this week</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-card hover:shadow-elevated transition-shadow border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Grade Progress</p>
                <p className="text-3xl font-bold text-foreground mt-2">69.9%</p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% this month
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-card hover:shadow-elevated transition-shadow border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class Rank</p>
                <p className="text-3xl font-bold text-foreground mt-2">16/31</p>
                <p className="text-xs text-muted-foreground mt-1">Top 48%</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Events & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events */}
          <Card className="bg-card shadow-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-hover">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-hover transition-colors group"
                  >
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm font-semibold text-primary bg-primary/10 rounded-lg px-3 py-2">
                        {event.date}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{event.course}</p>
                        </div>
                        <Badge 
                          variant={event.type === "exam" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Courses */}
          <Card className="bg-card shadow-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  My Courses
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-hover">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevated transition-all cursor-pointer">
                  <div className="relative h-32 mb-3 rounded-md overflow-hidden bg-gradient-primary">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    Intro to Chemistry
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">CHEM 1010-A01</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>

                <div className="group p-4 rounded-lg border border-border hover:border-primary hover:shadow-elevated transition-all cursor-pointer">
                  <div className="relative h-32 mb-3 rounded-md overflow-hidden bg-gradient-success">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    Biochemistry & Genetics
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">BIOCHEM-MED</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Feed & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="bg-card shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-primary text-white shadow-elevated border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Need Help?</h3>
                  <p className="text-sm text-white/90">
                    Connect with tutors and join study groups
                  </p>
                </div>
              </div>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
                Start Studying
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant CTA */}
          <Card className="bg-card shadow-card border-border border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Ask Nudle AI</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get instant help with assignments, study tips, and course insights
                </p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  Open Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistant />
    </div>
  );
}
