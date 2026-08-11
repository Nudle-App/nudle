import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const signIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    return { error: error ? new Error(error.message || "Sign in failed") : null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: fullName,
    });
    if (error) {
      return { error: new Error(error.message || "Sign up failed") };
    }
    try {
      await api.post("/api/roles", { role: "student" });
    } catch (roleError) {
      console.error("Failed to assign student role:", roleError);
    }
    return { error: null };
  };

  const signOut = async () => {
    await authClient.signOut();
  };

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, signOut, loading: isPending }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
