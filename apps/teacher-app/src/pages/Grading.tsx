import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@nudle/ui/dialog";
import { Label } from "@nudle/ui/label";
import { Textarea } from "@nudle/ui/textarea";
import { useToast } from "@nudle/ui/use-toast";
import { useCourses, useGradeSubmission, useSubmissions } from "@/hooks/useTeacherData";

const Grading = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [gradeDraft, setGradeDraft] = useState<Record<string, string>>({});
  const [feedbackDraft, setFeedbackDraft] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: courses = [] } = useCourses();
  const { data: submissions = [], isLoading, error } = useSubmissions(selectedCourse);
  const gradeMutation = useGradeSubmission();

  const filtered = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignment.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = useMemo(() => {
    const graded = submissions.filter((s) => s.status === "graded" && s.grade != null);
    const avg =
      graded.length === 0
        ? 0
        : Math.round(graded.reduce((sum, s) => sum + Number(s.grade), 0) / graded.length);
    return {
      average: avg,
      pending: submissions.filter((s) => s.status === "pending").length,
      gradedThisWeek: graded.length,
    };
  }, [submissions]);

  const saveGrade = async (id: string) => {
    const grade = Number(gradeDraft[id]);
    if (Number.isNaN(grade)) {
      toast({ title: "Enter a valid grade", variant: "destructive" });
      return;
    }
    try {
      await gradeMutation.mutateAsync({
        id,
        grade,
        feedback: feedbackDraft[id] ?? "",
      });
      toast({ title: "Grade saved" });
    } catch (err) {
      toast({
        title: "Failed to save grade",
        description: err instanceof Error ? err.message : "Error",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading submissions…</div>;
  if (error) {
    return <div className="p-8 text-destructive">Failed to load grading data.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Grading & Assessment</h1>
        <p className="text-muted-foreground">Review and update student performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-lg">Average Grade</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{stats.average || "—"}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-lg">Pending Reviews</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-lg">Graded</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-secondary">{stats.gradedThisWeek}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>Review and grade assignments</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger><SelectValue placeholder="Filter by course" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search students or assignments…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.assignment}</TableCell>
                  <TableCell>{row.grade ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "graded" ? "default" : "secondary"}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGradeDraft((d) => ({
                              ...d,
                              [row.id]: row.grade?.toString() ?? "",
                            }));
                            setFeedbackDraft((d) => ({
                              ...d,
                              [row.id]: row.feedback ?? "",
                            }));
                          }}
                        >
                          Grade
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Grade {row.name}</DialogTitle>
                          <DialogDescription>{row.assignment}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Grade (0–100)</Label>
                            <Input
                              type="number"
                              value={gradeDraft[row.id] ?? ""}
                              onChange={(e) =>
                                setGradeDraft((d) => ({ ...d, [row.id]: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Feedback</Label>
                            <Textarea
                              value={feedbackDraft[row.id] ?? ""}
                              onChange={(e) =>
                                setFeedbackDraft((d) => ({ ...d, [row.id]: e.target.value }))
                              }
                            />
                          </div>
                          <Button onClick={() => void saveGrade(row.id)}>Save grade</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No submissions found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Grading;
