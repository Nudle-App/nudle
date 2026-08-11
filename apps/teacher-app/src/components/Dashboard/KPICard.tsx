import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const KPICard = ({ title, value, icon: Icon, trend }: KPICardProps) => {
  return (
    <div className="surface-card p-6 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        {trend?.value ? (
            <p className={`text-sm ${trend.positive ? "text-muted-foreground" : "text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        ) : null}
      </div>
    </div>
  );
};
