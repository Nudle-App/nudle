import { Button } from "@nudle/ui/button";
import { Sparkles, Target, TrendingUp, MessageCircle } from "lucide-react";

const studentFeatures = [
  {
    icon: Sparkles,
    title: "Personalized Learning",
    description: "AI adapts to your learning style and pace"
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set and achieve your academic goals"
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    description: "Visualize your learning journey"
  },
  {
    icon: MessageCircle,
    title: "24/7 AI Assistance",
    description: "Get help whenever you need it"
  }
];

const ForStudents = () => {
  return (
    <section id="students" className="py-24 bg-neutral-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">For Students</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Your Personal AI Learning Assistant
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience personalized learning powered by artificial intelligence
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {studentFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-background rounded-xl p-6 border border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary-light transition-all shadow-medium"
            >
              Start Learning for Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForStudents;
