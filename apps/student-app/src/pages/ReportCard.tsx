import { Card, CardContent, CardHeader, CardTitle } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";
import { Award, TrendingUp, TrendingDown } from "lucide-react";

interface CourseResult {
  courseCode: string;
  courseName: string;
  finalExam: number;
  coursework: number;
  total: number;
  grade: string;
  credits: number;
  status: "pass" | "fail" | "distinction";
}

const mockResults: CourseResult[] = [
  {
    courseCode: "MATH301",
    courseName: "Advanced Mathematics",
    finalExam: 85,
    coursework: 88,
    total: 86.5,
    grade: "A",
    credits: 4,
    status: "distinction"
  },
  {
    courseCode: "PHYS201",
    courseName: "Physics II",
    finalExam: 78,
    coursework: 82,
    total: 80,
    grade: "B+",
    credits: 4,
    status: "pass"
  },
  {
    courseCode: "CHEM202",
    courseName: "Organic Chemistry",
    finalExam: 92,
    coursework: 90,
    total: 91,
    grade: "A+",
    credits: 3,
    status: "distinction"
  },
  {
    courseCode: "ENG101",
    courseName: "English Literature",
    finalExam: 75,
    coursework: 78,
    total: 76.5,
    grade: "B",
    credits: 3,
    status: "pass"
  },
  {
    courseCode: "HIST150",
    courseName: "Modern History",
    finalExam: 88,
    coursework: 85,
    total: 86.5,
    grade: "A",
    credits: 3,
    status: "distinction"
  },
  {
    courseCode: "BIO210",
    courseName: "Biology",
    finalExam: 82,
    coursework: 80,
    total: 81,
    grade: "B+",
    credits: 4,
    status: "pass"
  }
];

export default function ReportCard() {
  const totalCredits = mockResults.reduce((sum, course) => sum + course.credits, 0);
  const weightedAverage = mockResults.reduce((sum, course) => sum + (course.total * course.credits), 0) / totalCredits;
  const gpa = (weightedAverage / 25).toFixed(2); // Simple GPA calculation

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Report Card</h1>
        <p className="text-muted-foreground">Final exam results and overall performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Average</p>
                <p className="text-2xl font-semibold text-primary">{weightedAverage.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="text-2xl font-semibold text-primary">{gpa}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-semibold text-primary">{totalCredits}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{mockResults.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Distinctions</p>
                <p className="text-2xl font-semibold text-primary">
                  {mockResults.filter(r => r.status === "distinction").length}
                </p>
              </div>
              <Award className="h-8 w-8 text-accent-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Results Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Course Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course Name</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Coursework</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Final Exam</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Grade</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Credits</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockResults.map((course, index) => (
                  <tr 
                    key={course.courseCode} 
                    className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-foreground">{course.courseCode}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">{course.courseName}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-foreground">{course.coursework}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-foreground">{course.finalExam}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-semibold text-primary">{course.total}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant={course.status === "distinction" ? "default" : "secondary"}
                        className="font-semibold"
                      >
                        {course.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-muted-foreground">{course.credits}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {course.status === "distinction" ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-accent-green" />
                            <span className="text-xs font-medium text-accent-green">Distinction</span>
                          </>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">Pass</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["A+", "A", "B+", "B"].map((grade) => {
                const count = mockResults.filter(r => r.grade === grade).length;
                const percentage = (count / mockResults.length) * 100;
                return (
                  <div key={grade} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">{grade}</span>
                      <span className="text-muted-foreground">{count} courses</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-accent-green mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Strong Performance</p>
                <p className="text-xs text-muted-foreground">
                  You achieved distinctions in {mockResults.filter(r => r.status === "distinction").length} out of {mockResults.length} courses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Top Performer</p>
                <p className="text-xs text-muted-foreground">
                  Your GPA of {gpa} places you in the top tier of students
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-semibold text-primary">i</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Consistent Excellence</p>
                <p className="text-xs text-muted-foreground">
                  Your average exam score of {weightedAverage.toFixed(1)}% shows consistent high performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
