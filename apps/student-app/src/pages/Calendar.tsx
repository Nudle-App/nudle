import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Badge } from "@nudle/ui/badge";

export default function Calendar() {
  const events = [
    {
      id: 1,
      title: "Assignment 1 - Availability Ends",
      course: "Test Course - Michelle Laarissa Dev_Crs CO",
      date: "MAR 31",
      time: "9:23 PM",
      type: "assignment",
    },
    {
      id: 2,
      title: "Chemistry Lab Report Due",
      course: "CHEM 1010-A01 Intro to Chemistry",
      date: "APR 5",
      time: "11:59 PM",
      type: "assignment",
    },
    {
      id: 3,
      title: "Midterm Exam - Biology",
      course: "BIO 2020 - Cell Biology",
      date: "APR 8",
      time: "2:00 PM",
      type: "exam",
    },
    {
      id: 4,
      title: "Physics Problem Set 3",
      course: "PHYS 1500 - Classical Mechanics",
      date: "APR 10",
      time: "5:00 PM",
      type: "assignment",
    },
  ];

  const assignmentsDue = events.filter((e) => e.type === "assignment").length;
  const examsDue = events.filter((e) => e.type === "exam").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Academic Calendar</h1>
        <p className="page-subtitle mt-1">
          Stay on track with all your upcoming assignments, exams, and events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-10 text-center">
              <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No upcoming events</p>
              <p className="text-sm text-muted-foreground mt-1">
                Due dates and exams will show here when scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 p-4 rounded-2xl border border-border/80 hover:bg-hover transition-colors"
                >
                  <div className="text-center min-w-[64px] rounded-2xl bg-muted px-2 py-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      {event.date.split(" ")[0]}
                    </div>
                    <div className="text-2xl font-semibold tracking-tight">
                      {event.date.split(" ")[1]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{event.course}</p>
                      </div>
                      <Badge
                        variant={event.type === "exam" ? "destructive" : "secondary"}
                        className="rounded-full capitalize shrink-0"
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="surface-card p-6">
            <h2 className="text-lg font-semibold mb-5">This Week</h2>
            <div className="space-y-5">
              <div>
                <div className="text-3xl font-semibold tracking-tight">{assignmentsDue}</div>
                <div className="text-sm text-muted-foreground mt-1">Assignments Due</div>
              </div>
              <div>
                <div className="text-3xl font-semibold tracking-tight">{examsDue}</div>
                <div className="text-sm text-muted-foreground mt-1">Upcoming Exams</div>
              </div>
              <div>
                <div className="text-3xl font-semibold tracking-tight">—</div>
                <div className="text-sm text-muted-foreground mt-1">Classes Scheduled</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
