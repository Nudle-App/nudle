import { LayoutDashboard, ClipboardList, BookOpen, TrendingUp, Bell, User, Settings, Calendar, GraduationCap, FileText, MessageSquare } from "lucide-react";
import stIgnatiusLogo from "@/assets/st-ignatius-logo.png";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@nudle/ui/sidebar";

const mainItems = [{
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboard
}, {
  title: "My Courses",
  url: "/courses",
  icon: GraduationCap
}, {
  title: "Assignments",
  url: "/assignments",
  icon: ClipboardList
}, {
  title: "Calendar",
  url: "/calendar",
  icon: Calendar
}, {
  title: "Subjects",
  url: "/subjects",
  icon: BookOpen
}, {
  title: "Report Card",
  url: "/report-card",
  icon: FileText
}, {
  title: "Inbox",
  url: "/inbox",
  icon: MessageSquare
}, {
  title: "AI Insights",
  url: "/insights",
  icon: TrendingUp
}];
const secondaryItems = [{
  title: "Notices",
  url: "/notices",
  icon: Bell
}, {
  title: "My Account",
  url: "/account",
  icon: User
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings
}];
export function AppSidebar() {
  const {
    open
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  return <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-3 border-b border-sidebar-border flex items-center justify-start">
          <img 
            src={stIgnatiusLogo} 
            alt="St Ignatius College" 
            className="h-16 w-auto"
          />
        </div>

        {/* Main Navigation */}
        <SidebarMenu className="p-2 space-y-1">
          {mainItems.map(item => <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all hover:bg-sidebar-accent group" activeClassName="bg-sidebar-accent border-l-4 border-primary font-semibold text-primary">
                  <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                  {open && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>)}
        </SidebarMenu>

        {/* Secondary Items */}
        <div className="mt-auto border-t border-sidebar-border">
          <SidebarMenu className="p-2 space-y-1">
            {secondaryItems.map(item => <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all hover:bg-sidebar-accent group" activeClassName="bg-sidebar-accent border-l-4 border-primary font-semibold text-primary">
                    <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                    {open && <span className="text-sm">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>;
}