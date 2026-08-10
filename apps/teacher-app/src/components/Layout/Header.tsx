import { Search, Bell, Bot, Menu, LogOut } from "lucide-react";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { Badge } from "@nudle/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@nudle/ui/popover";
import { Separator } from "@nudle/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@nudle/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";

interface HeaderProps {
  onAskNudle: () => void;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onAskNudle, onToggleSidebar, onToggleMobileSidebar, sidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
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
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                3
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Notifications</h4>
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">New assignment submitted</p>
                    <p className="text-xs text-muted-foreground">Sarah Johnson submitted Math Assignment 3</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">Grade review requested</p>
                    <p className="text-xs text-muted-foreground">Michael Chen requested review for Quiz 5</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">Course material updated</p>
                    <p className="text-xs text-muted-foreground">New lecture notes added to Physics 101</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
              <Separator />
              <Button variant="ghost" className="w-full" size="sm">
                View all notifications
              </Button>
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
              <AlertDialogAction onClick={handleSignOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
