import { Card } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";
import { Button } from "@nudle/ui/button";
import { Upload, MessageSquare, Calendar } from "lucide-react";

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

const statusColors = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  submitted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  graded: "bg-success/20 text-success border-success/30",
};

export default function Assignments() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">Manage your coursework and submissions</p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="p-6 bg-gradient-card border-2 border-border shadow-card hover:shadow-glow transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due: {assignment.dueDate}
                  </span>
                  <Badge className={statusColors[assignment.status as keyof typeof statusColors]}>
                    {assignment.status}
                  </Badge>
                  {assignment.status === "graded" && (
                    <span className="font-semibold text-success">{assignment.score}/100</span>
                  )}
                </div>

                {assignment.feedback && (
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">AI Feedback</p>
                        <p className="text-sm text-foreground">{assignment.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {assignment.status === "pending" && (
                  <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
