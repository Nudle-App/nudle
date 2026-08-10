import { Card } from "@nudle/ui/card";
import { Progress } from "@nudle/ui/progress";

const subjects = [
  { name: "General Science", score: 87.33, color: "bg-success" },
  { name: "French", score: 85, color: "bg-success" },
  { name: "Mathematics", score: 78, color: "bg-primary" },
  { name: "English", score: 72, color: "bg-primary" },
];

export function TopSubjects() {
  return (
    <Card className="p-6 bg-gradient-card border-2 border-border shadow-card">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="text-success">⭐</span> Top Subjects
      </h3>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{subject.name}</span>
              <span className="text-sm font-bold text-success">{subject.score}%</span>
            </div>
            <Progress value={subject.score} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}
