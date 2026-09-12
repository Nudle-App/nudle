import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, Mail, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Label } from "@nudle/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nudle/ui/select";
import { useToast } from "@nudle/ui/use-toast";
import { useFamily } from "@/contexts/FamilyContext";
import { api } from "@/lib/api";
import { dummySchoolForId } from "@/lib/dummy-schools";
import { cn } from "@/lib/utils";

const relationships = ["Mother", "Father", "Guardian", "Sponsor", "Other"];

type ParentInvitation = {
  id: string;
  studentEmail: string;
  relationship: string;
  status: string;
  expiresAt: string;
  inviteUrl?: string;
  emailSent?: boolean;
};

export default function Family() {
  const queryClient = useQueryClient();
  const { children, activeChild, setActiveChild, removeChild } = useFamily();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Guardian");
  const [removing, setRemoving] = useState<string | null>(null);

  const { data: invitations = [] } = useQuery({
    queryKey: ["parent-invitations"],
    queryFn: () => api.get<ParentInvitation[]>("/api/parent/invitations"),
  });

  const invite = useMutation({
    mutationFn: () =>
      api.post<ParentInvitation>("/api/parent/invitations", {
        email: email.trim(),
        relationship,
      }),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ["parent-invitations"] });
      setEmail("");
      toast({
        title: result.emailSent ? "Invitation sent" : "Invitation created",
        description: result.emailSent
          ? `We emailed ${result.studentEmail}. They must accept before you can view their portal.`
          : `Email delivery is not configured. Share this link with the student: ${result.inviteUrl}`,
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Could not send invitation",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  const resend = useMutation({
    mutationFn: (id: string) =>
      api.post<ParentInvitation>(`/api/parent/invitations/${id}/resend`),
    onSuccess: (result) => {
      toast({
        title: result.emailSent ? "Invitation resent" : "Invitation link ready",
        description: result.emailSent
          ? `We emailed ${result.studentEmail} again.`
          : result.inviteUrl,
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Could not resend",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  const cancel = useMutation({
    mutationFn: (id: string) => api.delete(`/api/parent/invitations/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["parent-invitations"] });
      toast({ title: "Invitation cancelled" });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Could not cancel",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  async function onRemove(linkId: string, name: string) {
    setRemoving(linkId);
    try {
      await removeChild(linkId);
      toast({ title: "Removed", description: `${name} is no longer linked.` });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not remove student",
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Family</h1>
        <p className="page-subtitle mt-1">
          Invite a student by email. After they accept, you can view their school portal. Finance
          stays available on your parent account.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          invite.mutate();
        }}
        className="surface-card p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Invite a student</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ll email them a link to accept. Access starts after they confirm.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto]">
          <div className="space-y-2">
            <Label htmlFor="child-email">Student email</Label>
            <Input
              id="child-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.edu"
              className="rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select value={relationship} onValueChange={setRelationship}>
              <SelectTrigger id="relationship" className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {relationships.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full rounded-full" disabled={invite.isPending}>
              {invite.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send invite
            </Button>
          </div>
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending invitations</h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending invitations.</p>
        ) : (
          invitations.map((inviteRow) => (
            <div
              key={inviteRow.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                <Mail className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{inviteRow.studentEmail}</p>
                <p className="text-xs text-muted-foreground">
                  {inviteRow.relationship} · waiting for the student to accept
                </p>
              </div>
              <div className="flex items-center gap-2">
                {inviteRow.inviteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      void navigator.clipboard.writeText(inviteRow.inviteUrl!);
                      toast({ title: "Invite link copied" });
                    }}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy link
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  disabled={resend.isPending}
                  onClick={() => resend.mutate(inviteRow.id)}
                >
                  Resend email
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-destructive"
                  disabled={cancel.isPending}
                  onClick={() => cancel.mutate(inviteRow.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Linked students</h2>
        {children.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
            <Users className="mx-auto h-8 w-8 text-brand-teal" />
            <p className="mt-3 text-sm font-medium">No students linked yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              After a student accepts, you can switch into their portal from the sidebar.
            </p>
          </div>
        ) : (
          children.map((child) => {
            const active = activeChild?.id === child.id;
            const school = dummySchoolForId(child.id);
            return (
              <div
                key={child.linkId}
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm",
                  active ? "border-primary" : "border-border",
                )}
              >
                <img
                  src={school.logo}
                  alt=""
                  className="h-10 w-10"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{child.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {school.name} · {child.email} · {child.relationship}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {active ? (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Viewing
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setActiveChild(child.id)}
                    >
                      View portal
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-destructive"
                    disabled={removing === child.linkId}
                    onClick={() => void onRemove(child.linkId, child.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
