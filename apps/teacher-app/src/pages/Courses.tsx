import { useState } from "react";
import { Plus, Search, MoreVertical, Trash } from "lucide-react";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
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
import { useCourses, useCreateCourse, useDeleteCourse } from "@/hooks/useTeacherData";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { data: courses = [], isLoading, error } = useCourses();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createCourse.mutateAsync({
        title: title.trim(),
        description,
        status: "active",
      });
      toast({ title: "Course created" });
      setTitle("");
      setDescription("");
      setIsCreateDialogOpen(false);
    } catch (err) {
      toast({
        title: "Failed to create course",
        description: err instanceof Error ? err.message : "Error",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse.mutateAsync(id);
      toast({ title: "Course deleted" });
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: err instanceof Error ? err.message : "Error",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading courses…</div>;
  if (error) {
    return (
      <div className="p-8 text-destructive">
        Failed to load courses. Sign in as a teacher and check the API.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Course Management</h1>
          <p className="page-subtitle mt-1">Create and manage your courses</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to your teaching portfolio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Computer Science"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of the course..."
                  rows={4}
                  className="rounded-xl"
                />
              </div>
              <Button
                className="w-full rounded-full"
                onClick={() => void handleCreate()}
                disabled={createCourse.isPending}
              >
                Create Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-full border-border/80 bg-card"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-muted-foreground">No courses yet. Create your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="surface-card p-6 transition-shadow duration-200 hover:shadow-md group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{course.thumbnail || "📚"}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => void handleDelete(course.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{course.students}</span> students
                </span>
                <Badge
                  variant={course.status === "active" ? "default" : "secondary"}
                  className="rounded-full capitalize"
                >
                  {course.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
