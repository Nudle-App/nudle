import { Badge } from "@nudle/ui/badge";
import { Button } from "@nudle/ui/button";
import { Upload, MessageSquare, Calendar, ClipboardList } from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Science Lab Report",
    subject: "General Science",
    dueDate: "Nov 15, 2025",
    status: "pending",
    feedback: null,
  },
  {
    id: 2,
    title: "French Essay - Mon Vacances",
    subject: "French",
    dueDate: "Nov 12, 2025",
    status: "submitted",
    feedback: "Good use of vocabulary! Focus on verb conjugations next time.",
  },
  {
    id: 3,
    title: "Algebra Problem Set #4",
    subject: "Mathematics",
    dueDate: "Nov 10, 2025",
    status: "graded",
    score: 85,
    feedback: "Excellent work! You improved 12% from last term.",
  },
];

const statusStyles = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
  submitted: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/25",
  graded: "bg-success/15 text-success border-success/25",
};

export default function Assignments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Assignments</h1>
        <p className="page-subtitle mt-1">Manage your coursework and submissions</p>
      </div>

      {assignments.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No assignments yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            When teachers assign work, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="surface-card p-5 md:p-6 hover:shadow-elevated transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold tracking-tight mb-1">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-4 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Due: {assignment.dueDate}
                    </span>
                    <Badge
                      className={`rounded-full capitalize border ${statusStyles[assignment.status as keyof typeof statusStyles]}`}
                    >
                      {assignment.status}
                    </Badge>
                    {assignment.status === "graded" && (
                      <span className="font-semibold text-success">
                        {assignment.score}/100
                      </span>
                    )}
                  </div>

                  {assignment.feedback && (
                    <div className="p-4 rounded-2xl border border-border/80 bg-muted/30">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold mb-1">Feedback</p>
                          <p className="text-sm">{assignment.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  {assignment.status === "pending" && (
                    <Button size="sm" className="rounded-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="rounded-full">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
