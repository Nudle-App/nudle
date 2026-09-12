import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Label } from "@nudle/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nudle/ui/tabs";
import { useToast } from "@nudle/ui/use-toast";
import klevaMark from "@/assets/kleva-mark.svg";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

function safeNext(path: string | null) {
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return null;
}

async function loadRoles() {
  const me = await api.get<{ roles: string[] }>("/api/me");
  return me.roles;
}

export default function Auth() {
  const [params] = useSearchParams();
  const initialRole = params.get("role") === "parent" ? "parent" : "student";
  const initialTab = params.get("tab") === "signup" ? "signup" : "signin";
  const redirectTo = safeNext(params.get("next"));
  const fromInvite = Boolean(redirectTo?.startsWith("/invite/"));
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState<"student" | "parent">(initialRole);
  const [tab, setTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fromQuery = params.get("email");
    if (fromQuery) setEmail(fromQuery);
    if (fromInvite) setAccountType("student");
  }, [params, fromInvite]);

  const goAfterAuth = async (created: boolean) => {
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    const roles = await loadRoles();
    const isParent = roles.includes("parent");

    if (redirectTo) {
      navigate(redirectTo);
      return;
    }

    if (accountType === "parent" && !isParent) {
      await api.post("/api/roles", { role: "parent" });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    }

    const rolesAfter = accountType === "parent" && !isParent ? await loadRoles() : roles;
    const parentNow = rolesAfter.includes("parent");

    if (accountType === "parent" && !parentNow) {
      throw new Error("Parent access could not be enabled for this account.");
    }

    if (accountType === "parent" || parentNow) {
      toast({
        title: created ? "Parent account created" : "Welcome back!",
        description: created
          ? "Finance is ready. Invite a student from Family when you want to view their portal."
          : "Signed in to the parent portal.",
      });
      navigate(created ? "/family" : "/finance/home");
      return;
    }

    toast({
      title: created ? "Account created!" : "Welcome back!",
      description: created ? "Successfully signed up. Welcome!" : "Successfully signed in.",
    });
    navigate("/");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    } else {
      try {
        await goAfterAuth(false);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Could not open the parent portal",
          description: err instanceof Error ? err.message : "Signed in, but parent access failed.",
        });
        navigate("/");
      }
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName.trim()) {
      toast({
        variant: "destructive",
        title: "Full name required",
        description: "Please enter your full name",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      email,
      password,
      fullName,
      fromInvite ? "student" : accountType,
    );

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } else {
      try {
        await goAfterAuth(true);
      } catch {
        navigate(redirectTo || (accountType === "parent" ? "/family" : "/"));
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md surface-card border-border/80 shadow-elevated">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="flex justify-center">
            <img src={klevaMark} alt="Kleva" className="h-16 w-16" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">Kleva</p>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {accountType === "parent" ? "Parent Portal" : "Student Portal"}
            </CardTitle>
            <CardDescription className="mt-1.5">
              {accountType === "parent"
                ? "Sign in to manage finances and your child's school portal"
                : "Sign in to access your courses and assignments"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {!fromInvite && (
            <div className="mb-5 space-y-2">
              <Label>Account type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["student", "parent"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm capitalize transition-colors",
                      accountType === type
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Tabs value={tab} onValueChange={(value) => setTab(value as "signin" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full p-1 h-auto bg-muted">
              <TabsTrigger value="signin" className="rounded-full">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                  {isLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl"
                    required
                    minLength={6}
                  />
                </div>
                {accountType === "parent" && (
                  <p className="text-xs text-muted-foreground">
                    After signing up, invite your student from Family. Finance is available right away
                    on your parent account.
                  </p>
                )}
                <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                  {isLoading ? "Creating account…" : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
