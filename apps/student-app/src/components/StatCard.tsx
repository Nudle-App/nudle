import { LucideIcon } from "lucide-react";
import { Card } from "@nudle/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "primary";
}

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) {
  const borderColors = {
    default: "border-border",
    success: "border-success/30",
    primary: "border-primary/30",
  };

  const iconColors = {
    default: "text-muted-foreground",
    success: "text-success",
    primary: "text-primary",
  };

  return (
    <Card className={`p-6 bg-gradient-card border-2 ${borderColors[variant]} shadow-card hover:shadow-glow transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-muted/50">
          <Icon className={`h-5 w-5 ${iconColors[variant]}`} />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
}
