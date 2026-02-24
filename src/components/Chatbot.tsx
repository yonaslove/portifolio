import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const INITIAL_MESSAGE: Message = {
    role: "assistant",
    content: "Hi! I'm AI assistant. Feel free to ask me anything about his skills, projects, or experience!",
  };
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const streamChat = async (userMessage: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" } // Placeholder for streaming assistant response
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Validation check
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
      console.error("Missing Supabase configuration in .env");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI Error: Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY are missing. Please check your .env file." }
      ]);
      setIsLoading(false);
      return;
    }

    try {
      // Use the unified Vercel/Local API (Relative path works for both)
      const url = "/api/chat";

      console.log(`[Chat] Sending message to: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for AI

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages.slice(0, -1) }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {
          const text = await response.text();
          errorMsg = text.slice(0, 100) || errorMsg;
        }
        throw new Error(errorMsg);
      }

      if (!response.body) {
        throw new Error("Empty response body received from AI service.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        const lines = textBuffer.split("\n");
        textBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith(":")) continue;
          if (!trimmedLine.startsWith("data: ")) continue;

          const jsonStr = trimmedLine.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === "assistant") {
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                }
                return updated;
              });
            }
          } catch (e) {
            console.error("Stream parse error:", e);
          }
        }
      }
    } catch (error: any) {
      console.error("Full Chat Error:", error);
      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error.message) {
        if (error.message.includes("402")) errorMessage = "AI Credit Limit: Payment required on Supabase/Lovable.";
        else if (error.message.includes("429")) errorMessage = "Too many requests. Please wait a moment.";
        else if (error.message.includes("404")) errorMessage = "Chat Function Not Found. Deploy the 'chat' function to Supabase.";
        else if (error.message.includes("Failed to fetch")) errorMessage = "Network Error: Cannot reach the chat service. Check your internet or CORS settings.";
        else errorMessage = `Service Error: ${error.message}`;
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "assistant" && lastMsg.content === "") {
          updated[updated.length - 1] = { role: "assistant", content: errorMessage };
        } else {
          updated.push({ role: "assistant", content: errorMessage });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    streamChat(input);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg z-50 glow-cyan"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[380px] h-[500px] glass-strong shadow-2xl z-50 flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="p-4 border-b border-primary/30 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg gradient-text">Yonas's AI Concierge</h3>
              <p className="text-sm text-foreground/70">Professional Assistant & Project Guide</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="text-foreground/50 hover:text-accent hover:bg-accent/10 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass border border-primary/30"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass border border-primary/30 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-primary/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
