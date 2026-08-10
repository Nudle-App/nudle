import { Card } from "@nudle/ui/card";
import { Button } from "@nudle/ui/button";
import { BookOpen, FileText, Video, Sparkles } from "lucide-react";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Subjects</h1>
        <p className="text-muted-foreground">Access course materials and AI-powered study tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="p-6 bg-gradient-card border-2 border-border shadow-card hover:shadow-glow transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">{subject.teacher}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-success">{subject.average}%</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {subject.materials} materials
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                View Materials
              </Button>
              <Button variant="default" size="sm" className="bg-gradient-primary flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Summary
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
