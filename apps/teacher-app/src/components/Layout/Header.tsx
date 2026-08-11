import { Search, Bell, Bot, Menu, LogOut } from "lucide-react";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nudle/ui/popover";
import { Separator } from "@nudle/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@nudle/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onAskNudle: () => void;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header = ({
  onAskNudle,
  onToggleSidebar,
  onToggleMobileSidebar,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/auth");
  };

  return (
    <header className="h-16 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileSidebar}
            className="lg:hidden rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden lg:flex rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, students, or materials…"
              className="pl-10 h-10 rounded-full bg-card border-border/70 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full relative">
                <Bell className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-2xl" align="end">
              <div className="space-y-2">
                <h4 className="font-semibold">Notifications</h4>
                <Separator />
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No notifications yet
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <ThemeToggle compact />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out and redirected to the sign-in page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => void handleSignOut()}
                  className="rounded-full bg-destructive text-destructive-foreground"
                >
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={onAskNudle} className="rounded-full shadow-sm" size="default">
            <Bot className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ask Nudle</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
