import { Button } from "@nudle/ui/button";
import { CheckCircle2, Building2 } from "lucide-react";
import dashboardImage from "@/assets/dashboard-institutions.png";

const benefits = [
  "Centralized dashboard for all school operations",
  "Real-time student performance analytics",
  "Automated administrative workflows",
  "Secure data management and compliance",
  "Customizable reporting and insights",
  "Integration with existing systems"
];

const ForInstitutions = () => {
  return (
    <section id="institutions" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">For Institutions</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                  Transform Your Institution with AI
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Streamline operations, enhance teaching effectiveness, and improve student outcomes with our comprehensive platform.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary-light transition-all shadow-medium"
              >
                Request a Demo
              </Button>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="bg-neutral-gray rounded-xl p-8 shadow-elegant border border-border">
                <img 
                  src={dashboardImage} 
                  alt="Institution Dashboard Interface showing student analytics and course management" 
                  className="w-full h-auto rounded-lg shadow-lg border border-border"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-blue/5 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForInstitutions;
