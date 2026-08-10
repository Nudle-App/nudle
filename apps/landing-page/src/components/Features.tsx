import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Brain, BarChart3, Users, Zap, Shield, BookOpen } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Leverage artificial intelligence to gain deep insights into student performance and learning patterns."
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track progress and performance metrics with comprehensive dashboards and reporting tools."
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Foster collaboration between students, educators, and institutions with integrated communication tools."
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Provide immediate feedback to students with automated assessment and grading systems."
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full compliance to educational data protection standards."
  },
  {
    icon: BookOpen,
    title: "Rich Content Library",
    description: "Access thousands of curriculum-aligned resources and learning materials."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-neutral-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to transform learning experiences and drive better outcomes
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-background border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
