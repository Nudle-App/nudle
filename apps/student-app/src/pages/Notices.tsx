import { Bell, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";

export default function Notices() {
  const announcements = [
    {
      id: 1,
      title: "Midterm Exam Schedule Released",
      message: "The midterm examination timetable for Term 3 has been published. Please check your calendar for specific dates and times.",
      date: "March 15, 2025",
      author: "Academic Office",
      type: "exam"
    },
    {
      id: 2,
      title: "Library Hours Extended",
      message: "The campus library will be open 24/7 starting next week to support students during the examination period.",
      date: "March 14, 2025",
      author: "Library Services",
      type: "info"
    },
    {
      id: 3,
      title: "Guest Lecture: AI in Modern Education",
      message: "Join us for a special lecture by Dr. Sarah Johnson on the role of artificial intelligence in transforming educational practices.",
      date: "March 12, 2025",
      author: "Computer Science Dept",
      type: "event"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Announcements</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news and important notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {announcement.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {announcement.author}
                        </div>
                      </div>
                    </div>
                    <Badge variant={announcement.type === "exam" ? "destructive" : announcement.type === "event" ? "default" : "secondary"}>
                      {announcement.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{announcement.message}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">There are no announcements to display.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/calendar" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">Academic Calendar</div>
                <div className="text-sm text-muted-foreground">View all events</div>
              </a>
              <a href="/subjects" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">Course Materials</div>
                <div className="text-sm text-muted-foreground">Access resources</div>
              </a>
              <a href="/account" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">Support</div>
                <div className="text-sm text-muted-foreground">Get help</div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
