import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@nudle/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { useToast } from "@nudle/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, apiFetch } from "@/lib/api";
import klevaMark from "@/assets/kleva-mark.svg";

type Invitation = {
  parentName: string;
  studentEmail: string;
  relationship: string;
  status: string;
  expiresAt: string;
  expired: boolean;
};

export default function Invite() {
  const { token } = useParams<{ token: string }>();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [done, setDone] = useState<"accepted" | "declined" | null>(null);

  const dropFromDashboard = () => {
    queryClient.setQueryData(
      ["student-invitations"],
      (current: Array<{ token: string }> | undefined) =>
        (current ?? []).filter((invite) => invite.token !== token),
    );
    void queryClient.invalidateQueries({ queryKey: ["student-invitations"] });
    void queryClient.invalidateQueries({ queryKey: ["invitation", token] });
    void queryClient.invalidateQueries({ queryKey: ["parent-invitations"] });
    void queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["invitation", token],
    queryFn: () => apiFetch<Invitation>(`/api/invitations/${token}`),
    enabled: Boolean(token),
    retry: false,
  });

  const accept = useMutation({
    mutationFn: () => api.post(`/api/invitations/${token}/accept`),
    onSuccess: () => {
      dropFromDashboard();
      setDone("accepted");
      toast({ title: "Invitation accepted", description: "Your parent can now view your portal." });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Could not accept",
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });

  const decline = useMutation({
    mutationFn: () => api.post(`/api/invitations/${token}/decline`),
    onSuccess: () => {
      dropFromDashboard();
      setDone("declined");
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Could not decline",
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
  });

  const next = token ? `/invite/${token}` : "/";
  const authHref = `/auth?role=student&email=${encodeURIComponent(data?.studentEmail ?? "")}&next=${encodeURIComponent(next)}`;
  const signupHref = `${authHref}&tab=signup`;
  const emailMatches = Boolean(
    user?.email && data?.studentEmail && user.email.toLowerCase() === data.studentEmail.toLowerCase(),
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md surface-card border-border/80 shadow-elevated">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="flex justify-center">
            <img src={klevaMark} alt="Kleva" className="h-16 w-16" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">Family invitation</p>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {done === "accepted"
                ? "You're linked"
                : done === "declined"
                  ? "Invitation declined"
                  : "Connect a parent"}
            </CardTitle>
            <CardDescription className="mt-1.5">
              {data
                ? `${data.parentName} (${data.relationship}) asked to view your school portal.`
                : "Confirm this invitation from a parent or guardian."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {isPending || loading ? (
            <p className="text-sm text-muted-foreground text-center">Loading invitation…</p>
          ) : error || !data ? (
            <p className="text-sm text-muted-foreground text-center">
              This invitation is missing or no longer valid.
            </p>
          ) : done === "accepted" ? (
            <div className="space-y-4 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <p className="text-sm text-muted-foreground">
                {data.parentName} can now see your courses, assignments, and report card.
              </p>
              <Button className="w-full rounded-full" onClick={() => navigate("/", { replace: true })}>
                Go to dashboard
              </Button>
            </div>
          ) : done === "declined" ? (
            <div className="space-y-4 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <XCircle className="h-7 w-7" />
              </span>
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link to="/">Back to Kleva</Link>
              </Button>
            </div>
          ) : data.status !== "pending" || data.expired ? (
            <p className="text-sm text-muted-foreground text-center">
              This invitation is no longer pending.
            </p>
          ) : !user ? (
            <div className="space-y-3">
              <div className="flex gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Sign in as <span className="font-medium text-foreground">{data.studentEmail}</span> to
                  accept or decline.
                </p>
              </div>
              <Button asChild className="w-full rounded-full">
                <Link to={authHref}>Sign in to accept</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to={signupHref}>Create a student account</Link>
              </Button>
            </div>
          ) : !emailMatches ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                You&apos;re signed in as {user.email}. Sign in as {data.studentEmail} to respond to this
                invitation.
              </p>
              <Button
                className="w-full rounded-full"
                onClick={async () => {
                  await signOut();
                  navigate(authHref);
                }}
              >
                Sign in as {data.studentEmail}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                className="w-full rounded-full"
                disabled={accept.isPending || decline.isPending}
                onClick={() => accept.mutate()}
              >
                {accept.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Accept invitation
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                disabled={accept.isPending || decline.isPending}
                onClick={() => decline.mutate()}
              >
                Decline
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
