import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Send } from "lucide-react";
import { Button } from "@nudle/ui/button";
import { Textarea } from "@nudle/ui/textarea";
import { Label } from "@nudle/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";
import { Input } from "@nudle/ui/input";
import { useToast } from "@nudle/ui/use-toast";
import { api } from "@/lib/api";
import { useCourses, useProfiles } from "@/hooks/useTeacherData";

const Messages = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"students" | "staff" | "">("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [dmSubject, setDmSubject] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const { data: courses = [] } = useCourses();
  const { data: students = [] } = useProfiles("student");
  const { data: staff = [] } = useProfiles("teacher");

  const recipients =
    recipientType === "students" ? students : recipientType === "staff" ? staff : [];

  const handleSendAnnouncement = async () => {
    if (!selectedCourse || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const enrollments = await api.get<
        { student_id: string; profiles: { id: string; full_name: string } | null }[]
      >(`/api/courses/${selectedCourse}/enrollments`);

      if (enrollments.length === 0) {
        toast({ title: "No students enrolled in this course", variant: "destructive" });
        return;
      }

      await Promise.all(
        enrollments.map((e) =>
          api.post("/api/conversations", {
            subject: `[Announcement] ${subject}`,
            recipient_id: e.student_id,
          }).then(async (conv: { id: string }) => {
            await api.post(`/api/conversations/${conv.id}/messages`, {
              content: message,
            });
          }),
        ),
      );

      toast({
        title: "Announcement sent",
        description: `Messaged ${enrollments.length} student(s)`,
      });
      setSubject("");
      setMessage("");
    } catch (err) {
      toast({
        title: "Failed to send announcement",
        description: err instanceof Error ? err.message : "Error",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendDM = async () => {
    if (!selectedRecipient || !dmSubject || !dmMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const conv = await api.post<{ id: string }>("/api/conversations", {
        subject: dmSubject,
        recipient_id: selectedRecipient,
      });
      await api.post(`/api/conversations/${conv.id}/messages`, { content: dmMessage });
      toast({ title: "Message sent" });
      setDmSubject("");
      setDmMessage("");
      setSelectedRecipient("");
    } catch (err) {
      toast({
        title: "Failed to send message",
        description: err instanceof Error ? err.message : "Error",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Announce to a course or message someone directly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course announcement</CardTitle>
            <CardDescription>Starts a conversation with each enrolled student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
            </div>
            <Button onClick={() => void handleSendAnnouncement()} disabled={sending} className="gap-2">
              <Send className="h-4 w-4" /> Send announcement
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct message</CardTitle>
            <CardDescription>Message a student or fellow teacher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient type</Label>
              <Select
                value={recipientType}
                onValueChange={(v) => {
                  setRecipientType(v as "students" | "staff");
                  setSelectedRecipient("");
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="staff">Teachers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
                <SelectContent>
                  {recipients.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.full_name} ({r.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={dmSubject} onChange={(e) => setDmSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={dmMessage} onChange={(e) => setDmMessage(e.target.value)} rows={5} />
            </div>
            <Button onClick={() => void handleSendDM()} disabled={sending} className="gap-2">
              <Send className="h-4 w-4" /> Send message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
