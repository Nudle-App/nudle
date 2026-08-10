import { SidebarProvider, SidebarTrigger } from "@nudle/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Search, Bell } from "lucide-react";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-sidebar-border bg-card sticky top-0 z-10 shadow-card">
            <div className="flex items-center h-full px-4 gap-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5 text-foreground" />
              </SidebarTrigger>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search courses, assignments, or resources..." 
                    className="pl-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="hover:bg-hover">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-3 cursor-pointer hover:bg-hover rounded-md px-2 py-1 transition-colors">
                  <div className="text-right">
                    <p className="text-sm font-semibold">Tadiswa E.</p>
                    <p className="text-xs text-muted-foreground">KC4019</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">
                    TE
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
