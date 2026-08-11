import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Label } from "@nudle/ui/label";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMe } from "@/hooks/useTeacherData";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { data: me } = useMe();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/auth");
  };

  const name = me?.profile?.full_name ?? "";
  const [firstName = "", ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details from Nudle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={me?.profile?.email ?? me?.email ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Roles</Label>
            <Input value={(me?.roles ?? []).join(", ") || "none"} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-destructive/30">
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => void handleSignOut()} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
