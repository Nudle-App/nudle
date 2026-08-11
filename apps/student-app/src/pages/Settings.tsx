import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Label } from "@nudle/ui/label";
import { Button } from "@nudle/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/auth");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle mt-1">Customize your learning experience</p>
      </div>

      <Card className="surface-card border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose light, dark, or match your system</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm font-medium">Theme</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Applies across the student portal
            </p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card className="surface-card border-border/80 shadow-card">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Signed in as {user?.email ?? "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => navigate("/account")}
          >
            View profile
          </Button>
        </CardContent>
      </Card>

      <Card className="surface-card border-destructive/30 shadow-card">
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
          <CardDescription>End your session on this device</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="rounded-full gap-2"
            onClick={() => void handleSignOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
