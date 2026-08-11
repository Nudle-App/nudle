import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@nudle/ui/button";
import { Avatar, AvatarFallback } from "@nudle/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@nudle/ui/use-toast";
import { Badge } from "@nudle/ui/badge";

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

export default function Account() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      void fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await api.get<Profile | null>("/api/profiles/me");
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const displayName = profile?.full_name || user?.name || "Student";
  const displayEmail = profile?.email || user?.email || "N/A";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Account</h1>
          <p className="page-subtitle mt-1">Manage your profile and preferences</p>
        </div>
        <Button
          variant="destructive"
          className="rounded-full"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="surface-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border border-border/80 shadow-sm">
            <AvatarFallback className="text-2xl font-semibold bg-muted">
              {displayName !== "Student" ? (
                getInitials(displayName)
              ) : (
                <UserIcon className="h-8 w-8" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{displayName}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="rounded-full">
                Student
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="font-medium break-all">{displayEmail}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground mb-1">User ID</p>
            <p className="font-medium text-xs break-all">{user?.id || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
