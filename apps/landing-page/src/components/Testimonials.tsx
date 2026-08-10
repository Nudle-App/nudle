import { Card, CardContent } from "@nudle/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "NUDLE has transformed how we teach and assess students. The AI insights are incredible and have helped us identify learning gaps early.",
    author: "Dr. Sarah Johnson",
    role: "Department Head",
    institution: "Stanford University"
  },
  {
    quote: "The analytics dashboard gives us real-time visibility into student performance across all programs. It's become essential to our operations.",
    author: "Michael Chen",
    role: "Dean of Students",
    institution: "MIT"
  },
  {
    quote: "As a student, having an AI assistant that understands my learning style has been game-changing. My grades have improved significantly.",
    author: "Emily Rodriguez",
    role: "Undergraduate Student",
    institution: "Harvard University"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Trusted by Leading Institutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what educators and students are saying about NUDLE
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-background border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-6 space-y-6">
                  <Quote className="h-10 w-10 text-primary/20" />
                  
                  <p className="text-base text-foreground leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.institution}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
