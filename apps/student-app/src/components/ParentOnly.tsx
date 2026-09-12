import { Navigate } from "react-router-dom";
import { useMe } from "@/hooks/use-me";

export function ParentOnly({ children }: { children: React.ReactNode }) {
  const { isParent, isPending, isFetched } = useMe();

  if (isPending || !isFetched) {
    return <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isParent) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
