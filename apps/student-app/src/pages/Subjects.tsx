import { Button } from "@nudle/ui/button";
import { Badge } from "@nudle/ui/badge";
import { BookOpen, FileText, Sparkles } from "lucide-react";

const subjects = [
  {
    id: 1,
    name: "General Science",
    teacher: "Dr. M. Sibanda",
    average: 87.33,
    materials: 12,
    description: "Biology, Chemistry, and Physics fundamentals",
  },
  {
    id: 2,
    name: "French",
    teacher: "Ms. L. Moyo",
    average: 85,
    materials: 8,
    description: "French language and culture",
  },
  {
    id: 3,
    name: "Mathematics",
    teacher: "Mr. T. Ncube",
    average: 78,
    materials: 15,
    description: "Algebra, Geometry, and Calculus",
  },
  {
    id: 4,
    name: "English Literature",
    teacher: "Mrs. P. Chikwanha",
    average: 72,
    materials: 10,
    description: "Literature analysis and creative writing",
  },
];

export default function Subjects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Subjects</h1>
        <p className="page-subtitle mt-1">
          Access course materials and AI-powered study tools
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No subjects yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Subjects will appear once you are enrolled.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="surface-card p-6 hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight mb-1">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                </div>
                <Badge variant="secondary" className="rounded-full shrink-0">
                  {subject.average}% avg
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>

              <div className="flex items-center gap-4 mb-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  {subject.materials} materials
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Materials
                </Button>
                <Button size="sm" className="flex-1 rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Summary
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
