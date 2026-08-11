import { useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Input } from "@nudle/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { Badge } from "@nudle/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";
import { useAttendance, useCourses } from "@/hooks/useTeacherData";

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const { data: courses = [] } = useCourses();
  const { data, isLoading, error } = useAttendance(selectedCourse);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 95) return { label: "Excellent", variant: "default" as const };
    if (percentage >= 85) return { label: "Good", variant: "secondary" as const };
    if (percentage >= 75) return { label: "Fair", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  const records = (data?.records ?? []).filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading attendance…</div>;
  if (error) return <div className="p-8 text-destructive">Failed to load attendance.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Tracker</h1>
        <p className="text-muted-foreground">Monitor student attendance across your courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{data?.summary.average ?? 0}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Students at Risk</p>
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{data?.summary.atRisk ?? 0}</p>
            <p className="text-sm text-destructive mt-1">Below 80% attendance</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{data?.summary.totalClasses ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Records</CardTitle>
          <CardDescription>Aggregated from recorded class sessions</CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search students…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Late</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((row) => {
                const status = getAttendanceStatus(row.percentage);
                return (
                  <TableRow key={`${row.courseId}-${row.id}`}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.present}</TableCell>
                    <TableCell>{row.absent}</TableCell>
                    <TableCell>{row.late}</TableCell>
                    <TableCell>{row.percentage}%</TableCell>
                    <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {records.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No attendance records yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
