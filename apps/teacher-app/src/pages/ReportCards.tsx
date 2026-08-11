import { Badge } from "@nudle/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { useReportCards } from "@/hooks/useTeacherData";

const ReportCards = () => {
  const { data, isLoading, error } = useReportCards();

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading report cards…</div>;
  if (error) return <div className="p-8 text-destructive">Failed to load report cards.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Report Cards</h1>
        <p className="page-subtitle mt-1">Grade averages computed from real submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="surface-card p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Student-course rows</p>
          <p className="text-4xl font-semibold tracking-tight">{data?.kpis.reports ?? 0}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Overall average</p>
          <p className="text-4xl font-semibold tracking-tight">{data?.kpis.average || "—"}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Pending grades</p>
          <p className="text-4xl font-semibold tracking-tight text-destructive">{data?.kpis.pending ?? 0}</p>
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Performance by student</h2>
          <p className="page-subtitle mt-0.5">Averages across graded submissions</p>
        </div>
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
                <TableCell>
                  {row.average != null ? (
                    <Badge variant="secondary" className="rounded-full font-medium">
                      {row.average}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{row.gradedCount}</TableCell>
                <TableCell>
                  {row.pendingCount > 0 ? (
                    <Badge variant="outline" className="rounded-full">
                      {row.pendingCount}
                    </Badge>
                  ) : (
                    row.pendingCount
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(data?.students?.length ?? 0) === 0 && (
          <p className="text-center text-muted-foreground py-8">No report data yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReportCards;
