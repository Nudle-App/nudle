import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Calendar,
  FileText,
  X
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import stIgnatiusLogo from "@/assets/st-ignatius-logo.png";
import { Button } from "@nudle/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: GraduationCap, label: "Grading", path: "/grading" },
  { icon: Calendar, label: "Attendance", path: "/attendance" },
  { icon: FileText, label: "Report Cards", path: "/report-cards" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ isOpen, mobileOpen, onMobileClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-card border-r border-border flex flex-col h-screen fixed left-0 top-0 shadow-fluent z-50 transition-all duration-200",
        // Mobile behavior: slide in/out based on mobileOpen
        !mobileOpen && "-translate-x-full lg:translate-x-0",
        // Desktop behavior: always visible unless isOpen is false
        mobileOpen && "translate-x-0",
        !isOpen && "lg:-translate-x-full"
      )}>
      <div className="p-6 border-b border-border bg-background/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={stIgnatiusLogo} alt="St Ignatius College" className="h-12 w-auto" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMobileClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded transition-all duration-150",
              "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            activeClassName="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm font-semibold"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@nudle.edu</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
