import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { Button } from "@nudle/ui/button";
import { Input } from "@nudle/ui/input";
import { Textarea } from "@nudle/ui/textarea";
import { Label } from "@nudle/ui/label";
import { useToast } from "@nudle/ui/use-toast";
import { Avatar, AvatarFallback } from "@nudle/ui/avatar";
import { ScrollArea } from "@nudle/ui/scroll-area";
import { Separator } from "@nudle/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@nudle/ui/dialog";
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
  sender?: Profile;
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
    if (user) {
      fetchConversations();
      fetchProfiles();
      subscribeToMessages();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", user?.id);

    if (error) {
      console.error("Error fetching profiles:", error);
    } else {
      setProfiles(data || []);
    }
  };

  const fetchConversations = async () => {
    const { data: participantData, error: participantError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user?.id);

    if (participantError) {
      console.error("Error fetching conversations:", participantError);
      return;
    }

    const conversationIds = participantData.map((p) => p.conversation_id);

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        conversation_participants!inner(
          user_id,
          profiles(id, email, full_name)
        )
      `)
      .in("id", conversationIds)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      setConversations(data || []);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // Fetch sender profiles separately
    const senderIds = [...new Set(data.map(m => m.sender_id))];
    const { data: senderProfiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", senderIds);

    const messagesWithSenders = data.map(msg => ({
      ...msg,
      sender: senderProfiles?.find(p => p.id === msg.sender_id)
    }));

    setMessages(messagesWithSenders);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (payload.new.conversation_id === selectedConversation) {
            fetchMessages(selectedConversation);
          }
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation,
      sender_id: user?.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
    } else {
      setNewMessage("");
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedConversation);
    }
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newRecipient) return;

    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .insert({ subject: newSubject.trim() })
      .select()
      .single();

    if (conversationError) {
      toast({
        variant: "destructive",
        title: "Error creating conversation",
        description: conversationError.message,
      });
      return;
    }

    const { error: participantsError } = await supabase
      .from("conversation_participants")
      .insert([
        { conversation_id: conversationData.id, user_id: user?.id },
        { conversation_id: conversationData.id, user_id: newRecipient },
      ]);

    if (participantsError) {
      toast({
        variant: "destructive",
        title: "Error adding participants",
        description: participantsError.message,
      });
    } else {
      toast({
        title: "Conversation started!",
        description: "You can now send messages.",
      });
      setIsDialogOpen(false);
      setNewSubject("");
      setNewRecipient("");
      fetchConversations();
      setSelectedConversation(conversationData.id);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">Send and receive messages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                  <SelectTrigger>
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
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Start Conversation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your message threads</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {conversations.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">
                  No conversations yet. Start a new one!
                </p>
              ) : (
                conversations.map((conv) => (
                  <div key={conv.id}>
                    <button
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full text-left p-4 hover:bg-accent transition-colors ${
                        selectedConversation === conv.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="font-semibold truncate">{conv.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(conv.updated_at), "MMM d, h:mm a")}
                      </div>
                    </button>
                    <Separator />
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedConv?.subject || "Select a conversation"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <>
                <ScrollArea className="h-[450px] mb-4 pr-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.sender_id === user?.id ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
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
                              className={`inline-block p-3 rounded-lg mt-1 ${
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
                    placeholder="Type your message..."
                    className="resize-none"
                    rows={3}
                  />
                  <Button type="submit" size="icon" className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                Select a conversation to view messages
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
