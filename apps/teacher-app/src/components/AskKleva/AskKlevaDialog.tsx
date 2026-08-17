import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@nudle/ui/dialog";
import { Input } from "@nudle/ui/input";
import { Button } from "@nudle/ui/button";
import { ScrollArea } from "@nudle/ui/scroll-area";
import { Bot, Send, Sparkles } from "lucide-react";

interface AskKlevaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const examplePrompts = [
  "Summarize student performance in Grade 10 Math",
  "Generate a course outline for Intro to Biology",
  "Suggest resources for students struggling with AI concepts",
  "Show me engagement trends for this semester",
];

export const AskKlevaDialog = ({ open, onOpenChange }: AskKlevaDialogProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          "This is a demo response. In production, this would connect to an AI service to provide intelligent insights and suggestions.",
      },
    ]);
    setInput("");
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bot className="h-6 w-6 text-primary" />
            Ask Kleva
          </DialogTitle>
          <DialogDescription>
            Get AI-powered insights and assistance for your teaching tasks
          </DialogDescription>
        </DialogHeader>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Try one of these example prompts:
            </p>
            <div className="grid grid-cols-1 gap-3 w-full max-w-md">
              {examplePrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleExampleClick(prompt)}
                >
                  <span className="text-sm">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-primary">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
