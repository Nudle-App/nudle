import { Bell, Calendar, User } from "lucide-react";
import { Badge } from "@nudle/ui/badge";
import { Link } from "react-router-dom";

export default function Notices() {
  const announcements = [
    {
      id: 1,
      title: "Midterm Exam Schedule Released",
      message:
        "The midterm examination timetable for Term 3 has been published. Please check your calendar for specific dates and times.",
      date: "March 15, 2025",
      author: "Academic Office",
      type: "exam",
    },
    {
      id: 2,
      title: "Library Hours Extended",
      message:
        "The campus library will be open 24/7 starting next week to support students during the examination period.",
      date: "March 14, 2025",
      author: "Library Services",
      type: "info",
    },
    {
      id: 3,
      title: "Guest Lecture: AI in Modern Education",
      message:
        "Join us for a special lecture by Dr. Sarah Johnson on the role of artificial intelligence in transforming educational practices.",
      date: "March 12, 2025",
      author: "Computer Science Dept",
      type: "event",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle mt-1">
          Stay updated with the latest news and important notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <article key={announcement.id} className="surface-card p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight mb-2">
                      {announcement.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {announcement.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {announcement.author}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      announcement.type === "exam"
                        ? "destructive"
                        : announcement.type === "event"
                          ? "default"
                          : "secondary"
                    }
                    className="rounded-full capitalize shrink-0"
                  >
                    {announcement.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">{announcement.message}</p>
              </article>
            ))
          ) : (
            <div className="surface-card py-12 text-center px-6">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No announcements</p>
              <p className="text-sm text-muted-foreground mt-1">
                There are no announcements to display.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <section className="surface-card p-5">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-1">
              <Link
                to="/calendar"
                className="block p-3 rounded-2xl hover:bg-hover transition-colors"
              >
                <div className="font-medium">Academic Calendar</div>
                <div className="text-sm text-muted-foreground">View all events</div>
              </Link>
              <Link
                to="/subjects"
                className="block p-3 rounded-2xl hover:bg-hover transition-colors"
              >
                <div className="font-medium">Course Materials</div>
                <div className="text-sm text-muted-foreground">Access resources</div>
              </Link>
              <Link
                to="/account"
                className="block p-3 rounded-2xl hover:bg-hover transition-colors"
              >
                <div className="font-medium">Support</div>
                <div className="text-sm text-muted-foreground">Get help</div>
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
