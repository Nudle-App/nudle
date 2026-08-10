import { useState } from "react";
import { Plus, Search, Upload, MoreVertical, Edit, Trash, Download, FileText, X } from "lucide-react";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Badge } from "@nudle/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nudle/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@nudle/ui/dialog";
import { Label } from "@nudle/ui/label";
import { Textarea } from "@nudle/ui/textarea";
import { useToast } from "@nudle/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nudle/ui/table";

interface CourseFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  file: File;
}

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFiles, setCourseFiles] = useState<Record<number, CourseFile[]>>({});
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const courses = [
    {
      id: 1,
      title: "Introduction to Biology",
      instructor: "Dr. Sarah Johnson",
      students: 45,
      modules: 12,
      status: "Active",
      thumbnail: "🧬",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      instructor: "Prof. Michael Chen",
      students: 38,
      modules: 15,
      status: "Active",
      thumbnail: "📐",
    },
    {
      id: 3,
      title: "Physics 101",
      instructor: "Dr. Emily Rodriguez",
      students: 52,
      modules: 10,
      status: "Active",
      thumbnail: "⚛️",
    },
    {
      id: 4,
      title: "Chemistry Basics",
      instructor: "Prof. James Wilson",
      students: 41,
      modules: 8,
      status: "Draft",
      thumbnail: "🧪",
    },
  ];

  const handleFileUpload = (courseId: number, files: FileList | null) => {
    if (!files) return;

    const newFiles: CourseFile[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      file: file,
    }));

    setCourseFiles(prev => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), ...newFiles],
    }));

    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) uploaded successfully`,
    });
  };

  const handleFileDownload = (file: CourseFile) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
    });
  };

  const handleFileRename = (courseId: number, fileId: string) => {
    if (!newFileName.trim()) return;

    setCourseFiles(prev => ({
      ...prev,
      [courseId]: prev[courseId].map(file =>
        file.id === fileId ? { ...file, name: newFileName.trim() } : file
      ),
    }));

    setEditingFileName(null);
    setNewFileName("");

    toast({
      title: "File renamed",
      description: "File name updated successfully",
    });
  };

  const handleFileDelete = (courseId: number, fileId: string) => {
    setCourseFiles(prev => ({
      ...prev,
      [courseId]: prev[courseId].filter(file => file.id !== fileId),
    }));

    toast({
      title: "File deleted",
      description: "File removed successfully",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Course Management</h1>
          <p className="text-muted-foreground">Upload, organize, and manage your teaching materials</p>
        </div>
        
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload Materials</DialogTitle>
                <DialogDescription>
                  Upload multiple course materials at once. Supports ZIP files and folders.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF, DOCX, PPTX, ZIP files up to 100MB</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={isCreateDialogOpen ? "default" : "secondary"} 
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to your teaching portfolio
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" placeholder="e.g., Introduction to Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief overview of the course..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input id="instructor" placeholder="Instructor name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modules">Number of Modules</Label>
                    <Input id="modules" type="number" placeholder="12" />
                  </div>
                </div>
                <Button className="w-full bg-primary">Create Course</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-gradient-card hover:shadow-lg transition-all duration-200 group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-4xl mb-3">{course.thumbnail}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Students:</span>
                <span className="font-semibold">{course.students}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Modules:</span>
                <span className="font-semibold">{course.modules}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={course.status === "Active" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course.id)}>
                      Manage Files
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{course.title} - File Management</DialogTitle>
                      <DialogDescription>
                        Upload, download, rename, and delete course materials
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(course.id, e.target.files)}
                          className="hidden"
                          id={`file-upload-${course.id}`}
                        />
                        <label htmlFor={`file-upload-${course.id}`} className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm font-medium mb-1">Drop files here or click to browse</p>
                          <p className="text-xs text-muted-foreground">Supports all file types</p>
                        </label>
                      </div>

                      {courseFiles[course.id]?.length > 0 && (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {courseFiles[course.id].map((file) => (
                                <TableRow key={file.id}>
                                  <TableCell className="font-medium">
                                    {editingFileName === file.id ? (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          value={newFileName}
                                          onChange={(e) => setNewFileName(e.target.value)}
                                          className="h-8"
                                          autoFocus
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleFileRename(course.id, file.id);
                                            if (e.key === 'Escape') {
                                              setEditingFileName(null);
                                              setNewFileName("");
                                            }
                                          }}
                                        />
                                        <Button
                                          size="sm"
                                          onClick={() => handleFileRename(course.id, file.id)}
                                          className="h-8"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setEditingFileName(null);
                                            setNewFileName("");
                                          }}
                                          className="h-8"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {file.name}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>{formatFileSize(file.size)}</TableCell>
                                  <TableCell>{file.uploadDate.toLocaleDateString()}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleFileDownload(file)}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditingFileName(file.id);
                                          setNewFileName(file.name);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleFileDelete(course.id, file.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {!courseFiles[course.id]?.length && (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No files uploaded yet</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
