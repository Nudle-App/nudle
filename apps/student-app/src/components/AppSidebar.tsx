import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  TrendingUp,
  Bell,
  Calendar,
  GraduationCap,
  FileText,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@nudle/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Courses", url: "/courses", icon: GraduationCap },
  { title: "Assignments", url: "/assignments", icon: ClipboardList },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "Report Card", url: "/report-card", icon: FileText },
  { title: "Inbox", url: "/inbox", icon: MessageSquare },
  { title: "AI Insights", url: "/insights", icon: TrendingUp },
];

const secondaryItems = [{ title: "Notices", url: "/notices", icon: Bell }];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        {open && (
          <div className="px-4 py-4">
            <p className="text-sm font-semibold tracking-tight">Kleva</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        )}

        <SidebarMenu className="px-2 space-y-1">
          {mainItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-colors hover:bg-sidebar-accent"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm"
                >
                  <item.icon className="h-4 w-4" />
                  {open && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-auto border-t border-sidebar-border pt-2">
          <SidebarMenu className="px-2 space-y-1 pb-3">
            {secondaryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-full transition-colors hover:bg-sidebar-accent"
                    activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm"
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span className="text-sm">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
