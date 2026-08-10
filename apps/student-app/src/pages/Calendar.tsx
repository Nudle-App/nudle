import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";

export default function Calendar() {
  const events = [
    {
      id: 1,
      title: "Assignment 1 - Availability Ends",
      course: "Test Course - Michelle Laarissa Dev_Crs CO",
      date: "MAR 31",
      time: "9:23 PM",
      type: "assignment"
    },
    {
      id: 2,
      title: "Chemistry Lab Report Due",
      course: "CHEM 1010-A01 Intro to Chemistry",
      date: "APR 5",
      time: "11:59 PM",
      type: "assignment"
    },
    {
      id: 3,
      title: "Midterm Exam - Biology",
      course: "BIO 2020 - Cell Biology",
      date: "APR 8",
      time: "2:00 PM",
      type: "exam"
    },
    {
      id: 4,
      title: "Physics Problem Set 3",
      course: "PHYS 1500 - Classical Mechanics",
      date: "APR 10",
      time: "5:00 PM",
      type: "assignment"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Academic Calendar</h1>
        <p className="text-muted-foreground">
          Stay on track with all your upcoming assignments, exams, and events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-medium text-muted-foreground">
                      {event.date.split(" ")[0]}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {event.date.split(" ")[1]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.course}
                        </p>
                      </div>
                      <Badge variant={event.type === "exam" ? "destructive" : "default"}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Assignments Due</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">1</div>
                <div className="text-sm text-muted-foreground">Upcoming Exams</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">5</div>
                <div className="text-sm text-muted-foreground">Classes Scheduled</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
