import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nudle/ui/card";
import { MessageSquare, Send, Mail } from "lucide-react";
import { Button } from "@nudle/ui/button";
import { Textarea } from "@nudle/ui/textarea";
import { Label } from "@nudle/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nudle/ui/select";
import { Input } from "@nudle/ui/input";
import { useToast } from "@nudle/ui/use-toast";

const Messages = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [recipientType, setRecipientType] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [dmSubject, setDmSubject] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  
  const { toast } = useToast();

  const courses = [
    { id: "all", name: "All Courses" },
    { id: "bio101", name: "Biology 101" },
    { id: "math-adv", name: "Math Advanced" },
    { id: "physics101", name: "Physics 101" },
    { id: "chem", name: "Chemistry" },
  ];

  const recipientTypes = [
    { id: "staff", name: "Staff" },
    { id: "students", name: "Students" },
    { id: "parents", name: "Parents" },
  ];

  const staff = [
    { id: "teacher1", name: "Dr. Sarah Johnson" },
    { id: "teacher2", name: "Prof. Michael Chen" },
    { id: "admin1", name: "Jane Smith (Admin)" },
  ];

  const students = [
    { id: "student1", name: "Alex Thompson" },
    { id: "student2", name: "Emma Wilson" },
    { id: "student3", name: "James Brown" },
  ];

  const parents = [
    { id: "parent1", name: "Mr. Thompson (Alex's Parent)" },
    { id: "parent2", name: "Mrs. Wilson (Emma's Parent)" },
    { id: "parent3", name: "Mr. Brown (James's Parent)" },
  ];

  const getRecipients = () => {
    switch (recipientType) {
      case "staff":
        return staff;
      case "students":
        return students;
      case "parents":
        return parents;
      default:
        return [];
    }
  };

  const handleSendAnnouncement = () => {
    if (!selectedCourse || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Announcement Sent!",
      description: `Message sent to students in ${courses.find(c => c.id === selectedCourse)?.name}`,
    });

    setSubject("");
    setMessage("");
  };

  const handleSendDirectMessage = () => {
    if (!recipientType || !selectedRecipient || !dmSubject || !dmMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    const recipients = getRecipients();
    const recipientName = recipients.find(r => r.id === selectedRecipient)?.name;

    toast({
      title: "Message Sent!",
      description: `Direct message sent to ${recipientName}`,
    });

    setSelectedRecipient("");
    setDmSubject("");
    setDmMessage("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with students and staff</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mass Announcement
            </CardTitle>
            <CardDescription>Send announcements to students enrolled in your courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter announcement subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your announcement message..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button 
              variant="default"
              className="w-full gap-2" 
              onClick={handleSendAnnouncement}
            >
              <Send className="h-4 w-4" />
              Send Announcement
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Direct Message
            </CardTitle>
            <CardDescription>Send private messages to staff, students, or parents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientType">Recipient Type</Label>
              <Select value={recipientType} onValueChange={(value) => {
                setRecipientType(value);
                setSelectedRecipient("");
              }}>
                <SelectTrigger id="recipientType">
                  <SelectValue placeholder="Choose recipient type" />
                </SelectTrigger>
                <SelectContent>
                  {recipientTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Select Recipient</Label>
              <Select 
                value={selectedRecipient} 
                onValueChange={setSelectedRecipient}
                disabled={!recipientType}
              >
                <SelectTrigger id="recipient">
                  <SelectValue placeholder={recipientType ? "Choose recipient" : "Select type first"} />
                </SelectTrigger>
                <SelectContent>
                  {getRecipients().map((recipient) => (
                    <SelectItem key={recipient.id} value={recipient.id}>
                      {recipient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dmSubject">Subject</Label>
              <Input
                id="dmSubject"
                placeholder="Enter message subject"
                value={dmSubject}
                onChange={(e) => setDmSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dmMessage">Message</Label>
              <Textarea
                id="dmMessage"
                placeholder="Type your message..."
                rows={6}
                value={dmMessage}
                onChange={(e) => setDmMessage(e.target.value)}
              />
            </div>

            <Button 
              className="w-full bg-gradient-primary text-white gap-2" 
              onClick={handleSendDirectMessage}
            >
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
