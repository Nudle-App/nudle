import { Button } from "@nudle/ui/button";
import { ArrowRight, Play } from "lucide-react";
import nudleLogo from "@/assets/nudle-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-12">
            {/* Left side - Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
                  Smarter Learning.{" "}
                  <span className="text-primary">
                    Connected Minds.
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Empower educators and institutions with AI-driven tools for teaching, assessment, and learning analytics.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary-light transition-all shadow-medium group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 text-base font-semibold border-2 hover:bg-secondary transition-all"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary ring-2 ring-background" />
                    <div className="w-10 h-10 rounded-full bg-secondary-blue ring-2 ring-background" />
                    <div className="w-10 h-10 rounded-full bg-accent ring-2 ring-background" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">10,000+ educators</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-primary">★★★★★</span>
                  <span className="text-sm font-medium text-muted-foreground">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right side - Hero Image */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-in">
              <div className="relative w-full max-w-md">
                {/* Subtle background effect */}
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-10" />
                
                {/* Logo */}
                <img 
                  src={nudleLogo} 
                  alt="NUDLE - AI-Powered Learning Platform" 
                  className="relative w-full h-auto drop-shadow-2xl"
                />

                {/* Floating stat cards */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4">
                  <div className="bg-background border border-border rounded-lg p-4 shadow-medium backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4 shadow-medium backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-xs text-muted-foreground">Institutions</div>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-4 shadow-medium backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
