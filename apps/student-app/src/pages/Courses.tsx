import { BookOpen } from "lucide-react";
import { Badge } from "@nudle/ui/badge";
import { Button } from "@nudle/ui/button";

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: "(DEMO) CHEM 1010-A01 Intro to Chemistry",
      category: "BLANK DEVELOPMENT COURSE 1 CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
      progress: 65,
    },
    {
      id: 2,
      title: "UM Learn Course Exemplar Dev_Crs CO",
      category: "UM LEARN COURSE EXEMPLAR DEV_CRS CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
      progress: 80,
    },
    {
      id: 3,
      title: "UM Learn for Biochemistry & Medical Genetics",
      category: "UM LEARN FOR BIOCHEM-MED GENETICS DEV_CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop",
      progress: 45,
    },
    {
      id: 4,
      title: "Michelle's UM Learn Training Course",
      category: "TRAINING",
      type: "Professional Development",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop",
      progress: 90,
    },
    {
      id: 5,
      title: "ELSC Revised Cardshoot Dev_Crs CO",
      category: "ELSC CARDSHOOT",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      progress: 30,
    },
    {
      id: 6,
      title: "Laarissa Dev_Crs CO",
      category: "LAARISSA DEV_CRS CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
      progress: 55,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle mt-1">
          Access your enrolled courses, materials, and track your progress.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No courses enrolled</p>
          <p className="text-sm text-muted-foreground mt-1">
            Courses will appear here once you are added to a class.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="surface-card overflow-hidden hover:shadow-elevated transition-shadow"
            >
              <div className="relative h-40 overflow-hidden bg-muted">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="rounded-full bg-background/90 text-foreground border-border/80 backdrop-blur-sm">
                    {course.type}
                  </Badge>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
                    {course.category}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/80 transition-all rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <Button className="w-full rounded-full" size="sm">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Enter Course
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
