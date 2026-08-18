import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Button } from "@nudle/ui/button";
import { ProfileMenu } from "@/components/Layout/ProfileMenu";
import klevaMark from "@/assets/kleva-mark.svg";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: GraduationCap, label: "Grading", path: "/grading" },
  { icon: Calendar, label: "Attendance", path: "/attendance" },
  { icon: FileText, label: "Report Cards", path: "/report-cards" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
];

interface SidebarProps {
  isOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ isOpen, mobileOpen, onMobileClose }: SidebarProps) => {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          "w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-200",
          !mobileOpen && "-translate-x-full lg:translate-x-0",
          mobileOpen && "translate-x-0",
          !isOpen && "lg:-translate-x-full",
        )}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={klevaMark} alt="Kleva" className="h-8 w-8 shrink-0" />
            <div>
              <p className="text-sm font-semibold tracking-tight">Kleva</p>
              <p className="text-xs text-muted-foreground">Teacher</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onMobileClose} className="lg:hidden rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-colors",
                "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm"
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <ProfileMenu variant="sidebar" align="start" side="top" />
        </div>
      </aside>
    </>
  );
};
