import { Search, Bell, Bot, Menu, LogOut } from "lucide-react";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nudle/ui/popover";
import { Separator } from "@nudle/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@nudle/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onAskNudle: () => void;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onAskNudle, onToggleSidebar, onToggleMobileSidebar, sidebarOpen }: HeaderProps) => {
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
    <header className="h-14 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleMobileSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSidebar}
          className="hidden lg:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses, students, or materials..." 
            className="pl-10 bg-input border-border h-9 rounded"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Notifications</h4>
              <Separator />
              <p className="text-sm text-muted-foreground py-4 text-center">
                No notifications yet
              </p>
            </div>
          </PopoverContent>
        </Popover>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of your account and redirected to the home page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void handleSignOut()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          onClick={onAskNudle}
          className="shadow-sm hover:shadow-md"
          size="default"
        >
          <Bot className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Ask Nudle</span>
        </Button>
      </div>
    </header>
  );
};
