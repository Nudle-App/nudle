import { Label } from "@nudle/ui/label";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMe } from "@/hooks/useTeacherData";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle mt-1">Manage your account and appearance</p>
      </div>

      <div className="surface-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Appearance</h2>
          <p className="page-subtitle mt-0.5">Choose light, dark, or system theme</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="surface-card p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Profile Information</h2>
          <p className="page-subtitle mt-0.5">Your account details from Nudle</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} readOnly className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} readOnly className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={me?.profile?.email ?? me?.email ?? ""} readOnly className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Roles</Label>
            <Input value={(me?.roles ?? []).join(", ") || "none"} readOnly className="rounded-xl" />
          </div>
        </div>
      </div>

      <div className="surface-card p-6 border-destructive/30">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight">Sign out</h2>
          <p className="page-subtitle mt-0.5">End your current session on this device</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => void handleSignOut()}
          className="rounded-full gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
