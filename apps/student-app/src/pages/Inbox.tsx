import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Textarea } from "@nudle/ui/textarea";
import { Label } from "@nudle/ui/label";
import { useToast } from "@nudle/ui/use-toast";
import { Avatar, AvatarFallback } from "@nudle/ui/avatar";
import { ScrollArea } from "@nudle/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nudle/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";
import { MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  email: string;
  full_name: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender?: Profile | null;
}

interface Conversation {
  id: string;
  subject: string;
  updated_at: string;
  messages?: Message[];
  participants?: { user_id: string; profiles: Profile }[];
}

export default function Inbox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!user) return;
    void fetchConversations();
    void fetchProfiles();

    const interval = window.setInterval(() => {
      void fetchConversations();
      if (selectedConversation) {
        void fetchMessages(selectedConversation);
      }
    }, 8000);

    return () => window.clearInterval(interval);
  }, [user, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      void fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchProfiles = async () => {
    try {
      const data = await api.get<Profile[]>("/api/profiles");
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const data = await api.get<Conversation[]>("/api/conversations");
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await api.get<Message[]>(`/api/conversations/${conversationId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await api.post(`/api/conversations/${selectedConversation}/messages`, {
        content: newMessage.trim(),
      });
      setNewMessage("");
      await fetchMessages(selectedConversation);
      await fetchConversations();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
    }
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newRecipient) return;

    try {
      const conversation = await api.post<Conversation>("/api/conversations", {
        subject: newSubject.trim(),
        recipient_id: newRecipient,
      });

      toast({
        title: "Conversation started!",
        description: "You can now send messages.",
      });
      setIsDialogOpen(false);
      setNewSubject("");
      setNewRecipient("");
      await fetchConversations();
      setSelectedConversation(conversation.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating conversation",
        description: error instanceof Error ? error.message : "Failed to create conversation",
      });
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Inbox</h1>
          <p className="page-subtitle mt-1">Send and receive messages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
              <DialogDescription>
                Choose a recipient and subject to start messaging
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStartConversation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={newRecipient} onValueChange={setNewRecipient}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name} ({profile.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject..."
                  className="rounded-xl"
                  required
                />
              </div>
              <Button type="submit" className="w-full rounded-full">
                Start Conversation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="surface-card lg:col-span-1 overflow-hidden">
          <div className="p-5 border-b border-border/80">
            <h2 className="font-semibold">Conversations</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your message threads</p>
          </div>
          <ScrollArea className="h-[600px]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start a new one to message someone.
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left px-5 py-4 border-b border-border/60 hover:bg-hover transition-colors ${
                    selectedConversation === conv.id ? "bg-muted/60" : ""
                  }`}
                >
                  <div className="font-semibold truncate">{conv.subject}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(conv.updated_at), "MMM d, h:mm a")}
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </section>

        <section className="surface-card lg:col-span-2 p-5 md:p-6">
          <h2 className="font-semibold text-lg mb-4">
            {selectedConv?.subject || "Select a conversation"}
          </h2>
          {selectedConversation ? (
            <>
              <ScrollArea className="h-[450px] mb-4 pr-4">
                {messages.length === 0 ? (
                  <div className="h-full min-h-[200px] flex items-center justify-center text-center px-4">
                    <div>
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start the conversation below.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender_id === user?.id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8 border border-border/80">
                          <AvatarFallback className="bg-muted text-xs">
                            {message.sender?.full_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex-1 ${
                            message.sender_id === user?.id ? "text-right" : ""
                          }`}
                        >
                          <div className="text-sm font-semibold">
                            {message.sender?.full_name}
                          </div>
                          <div
                            className={`inline-block p-3 rounded-2xl mt-1 max-w-[85%] text-left ${
                              message.sender_id === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(new Date(message.created_at), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message…"
                  className="resize-none rounded-2xl"
                  rows={3}
                />
                <Button type="submit" size="icon" className="self-end rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-center px-4">
              <div>
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Select a conversation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a thread from the left to view messages.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
