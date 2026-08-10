import { useState } from "react";
import { Calendar, Download, Upload, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { Badge } from "@nudle/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const attendanceData = [
    { id: 1, name: "Sarah Johnson", course: "Mathematics 101", present: 28, absent: 2, late: 1, percentage: 93 },
    { id: 2, name: "Michael Chen", course: "Physics 201", present: 26, absent: 4, late: 2, percentage: 87 },
    { id: 3, name: "Emily Davis", course: "Chemistry 101", present: 30, absent: 0, late: 1, percentage: 100 },
    { id: 4, name: "James Wilson", course: "Mathematics 101", present: 25, absent: 5, late: 2, percentage: 83 },
    { id: 5, name: "Sophia Martinez", course: "Biology 101", present: 29, absent: 1, late: 1, percentage: 97 },
    { id: 6, name: "Daniel Brown", course: "Physics 201", present: 27, absent: 3, late: 1, percentage: 90 },
  ];

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 95) return { label: "Excellent", variant: "default" as const };
    if (percentage >= 85) return { label: "Good", variant: "secondary" as const };
    if (percentage >= 75) return { label: "Fair", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  const filteredData = attendanceData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Tracker</h1>
        <p className="text-muted-foreground">Monitor and manage student attendance across all courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">91.7%</p>
            <p className="text-sm text-secondary mt-1">↑ 2.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Students at Risk</p>
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-sm text-destructive mt-1">Below 80% attendance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">186</p>
            <p className="text-sm text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Attendance Records</CardTitle>
              <CardDescription>View and track attendance for all students</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Mathematics 101">Mathematics 101</SelectItem>
                <SelectItem value="Physics 201">Physics 201</SelectItem>
                <SelectItem value="Chemistry 101">Chemistry 101</SelectItem>
                <SelectItem value="Biology 101">Biology 101</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => {
                const status = getAttendanceStatus(student.percentage);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="text-center">{student.present}</TableCell>
                    <TableCell className="text-center">{student.absent}</TableCell>
                    <TableCell className="text-center">{student.late}</TableCell>
                    <TableCell className="text-center font-semibold">{student.percentage}%</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
