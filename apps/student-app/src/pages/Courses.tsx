import { BookOpen, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@nudle/ui/card";
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
      progress: 65
    },
    {
      id: 2,
      title: "UM Learn Course Exemplar Dev_Crs CO",
      category: "UM LEARN COURSE EXEMPLAR DEV_CRS CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
      progress: 80
    },
    {
      id: 3,
      title: "UM Learn for Biochemistry & Medical Genetics",
      category: "UM LEARN FOR BIOCHEM-MED GENETICS DEV_CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop",
      progress: 45
    },
    {
      id: 4,
      title: "Michelle's UM Learn Training Course",
      category: "TRAINING",
      type: "Professional Development",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop",
      progress: 90
    },
    {
      id: 5,
      title: "ELSC Revised Cardshoot Dev_Crs CO",
      category: "ELSC CARDSHOOT",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      progress: 30
    },
    {
      id: 6,
      title: "Laarissa Dev_Crs CO",
      category: "LAARISSA DEV_CRS CO",
      type: "Development Courses",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
      progress: 55
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          Access your enrolled courses, materials, and track your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge>{course.type}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {course.category}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Enter Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
