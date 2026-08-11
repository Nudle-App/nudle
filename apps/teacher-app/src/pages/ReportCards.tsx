import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { useReportCards } from "@/hooks/useTeacherData";

const ReportCards = () => {
  const { data, isLoading, error } = useReportCards();

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading report cards…</div>;
  if (error) return <div className="p-8 text-destructive">Failed to load report cards.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Report Cards</h1>
        <p className="text-muted-foreground">Grade averages computed from real submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-lg">Student-course rows</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{data?.kpis.reports ?? 0}</p></CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-lg">Overall average</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold text-primary">{data?.kpis.average || "—"}</p></CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardHeader><CardTitle className="text-lg">Pending grades</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold text-destructive">{data?.kpis.pending ?? 0}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance by student</CardTitle>
          <CardDescription>Averages across graded submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Average</TableHead>
                <TableHead>Graded</TableHead>
                <TableHead>Pending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.students ?? []).map((row) => (
                <TableRow key={`${row.studentId}-${row.courseId}`}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.average ?? "—"}</TableCell>
                  <TableCell>{row.gradedCount}</TableCell>
                  <TableCell>{row.pendingCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(data?.students?.length ?? 0) === 0 && (
            <p className="text-center text-muted-foreground py-8">No report data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCards;
