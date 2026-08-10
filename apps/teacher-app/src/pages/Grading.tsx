import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nudle/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@nudle/ui/dialog";
import { Label } from "@nudle/ui/label";
import { Textarea } from "@nudle/ui/textarea";
import { Progress } from "@nudle/ui/progress";

const Grading = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const students = [
    { id: 1, name: "Alice Chen", course: "Biology 101", grade: 92, status: "Graded", assignment: "Module 3 Quiz" },
    { id: 2, name: "Bob Smith", course: "Math Advanced", grade: null, status: "Pending", assignment: "Problem Set 5" },
    { id: 3, name: "Carol Davis", course: "Physics 101", grade: 88, status: "Graded", assignment: "Lab Report" },
    { id: 4, name: "David Lee", course: "Chemistry", grade: null, status: "Pending", assignment: "Final Project" },
    { id: 5, name: "Emma Wilson", course: "Biology 101", grade: 95, status: "Graded", assignment: "Module 3 Quiz" },
  ];

  const courses = [
    { id: "all", name: "All Courses" },
    { id: "Biology 101", name: "Biology 101" },
    { id: "Math Advanced", name: "Math Advanced" },
    { id: "Physics 101", name: "Physics 101" },
    { id: "Chemistry", name: "Chemistry" },
  ];

  const filteredStudents = students.filter(student => 
    (selectedCourse === "all" || student.course === selectedCourse) &&
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gradeDistribution = [
    { range: "90-100", count: 45, percentage: 35 },
    { range: "80-89", count: 52, percentage: 40 },
    { range: "70-79", count: 25, percentage: 19 },
    { range: "Below 70", count: 8, percentage: 6 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Grading & Assessment</h1>
          <p className="text-muted-foreground">Review and update student performance</p>
        </div>
        
        <Button className="gap-2 bg-gradient-primary text-white">
          <Sparkles className="h-4 w-4" />
          AI Grading Assistant
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">87.3</p>
            <p className="text-sm text-muted-foreground mt-1">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">8</p>
            <p className="text-sm text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-secondary">42</p>
            <p className="text-sm text-muted-foreground mt-1">Assignments graded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-card">
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
            <CardDescription>Review and grade recent assignments</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
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
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{student.assignment}</TableCell>
                    <TableCell>
                      {student.grade ? (
                        <span className="font-semibold">{student.grade}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Graded" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {student.grade ? "Edit" : "Grade"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Grade Assignment - {student.name}</DialogTitle>
                            <DialogDescription>
                              {student.course} - {student.assignment}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="grade">Grade (0-100)</Label>
                              <Input
                                id="grade"
                                type="number"
                                min="0"
                                max="100"
                                defaultValue={student.grade || ""}
                                placeholder="Enter grade"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="feedback">Feedback</Label>
                              <Textarea
                                id="feedback"
                                placeholder="Provide constructive feedback..."
                                rows={4}
                              />
                            </div>
                            <Button className="w-full bg-primary">Submit Grade</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Current semester overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gradeDistribution.map((range, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{range.range}</span>
                  <span className="text-muted-foreground">{range.count} students</span>
                </div>
                <Progress value={range.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">{range.percentage}%</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Grading;
