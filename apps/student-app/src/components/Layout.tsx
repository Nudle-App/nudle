import { SidebarProvider, SidebarTrigger } from "@nudle/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Search, Bell } from "lucide-react";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      api.get<{
        profile: { full_name: string; email: string } | null;
        email?: string;
      }>("/api/me"),
    enabled: Boolean(user),
  });

  const name = me?.profile?.full_name || user?.name || "Student";
  const email = me?.profile?.email || user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
            <div className="flex items-center h-full px-4 md:px-8 gap-4">
              <SidebarTrigger className="rounded-full">
                <Menu className="h-5 w-5 text-foreground" />
              </SidebarTrigger>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, assignments, or resources…"
                    className="pl-10 h-10 rounded-full bg-card border-border/70 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bell className="h-4 w-4" />
                </Button>
                <ThemeToggle compact />
                <div className="hidden sm:flex items-center gap-3 rounded-full bg-card border border-border/70 px-2 py-1.5 shadow-sm">
                  <div className="text-right pl-1">
                    <p className="text-sm font-semibold leading-none">{name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[140px]">
                      {email}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                    {initial}
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto w-full p-5 md:p-8 space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
