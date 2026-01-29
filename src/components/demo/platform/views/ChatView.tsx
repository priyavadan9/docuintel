import { useState, useRef, useEffect } from "react";
import { useDemo, Document } from "@/contexts/DemoContext";
import { 
  MessageSquare, 
  Send, 
  FileText, 
  Sparkles,
  Bot,
  User,
  Paperclip,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { doc: string; page: number }[];
  timestamp: Date;
}

const sampleResponses: Record<string, { response: string; citations?: { doc: string; page: number }[] }> = {
  "invoice": {
    response: "Based on your invoice documents, I found **3 invoices** from Acme Corporation totaling **$34,450.00**. The most recent one (INV-2024-001) was dated January 15, 2024 with a due date of February 15, 2024.\n\nWould you like me to summarize the line items or compare them with previous months?",
    citations: [{ doc: "INV-2024-001.pdf", page: 1 }]
  },
  "contract": {
    response: "I found the **TechCorp Service Agreement** in your documents. Here are the key details:\n\n• **Effective Date:** January 1, 2024\n• **Expiry Date:** December 31, 2024\n• **Contract Value:** $150,000\n• **Renewal Clause:** Auto-renew for 12 months with 30-day notice\n\nThe termination clause (Section 8.2) requires 60 days written notice by either party.",
    citations: [{ doc: "Service_Agreement_TechCorp.pdf", page: 4 }]
  },
  "total": {
    response: "Across all processed invoices, the **total amount is $12,450.00** from INV-2024-001. This includes:\n\n• **Subtotal:** $11,000.00\n• **Tax (13.2%):** $1,450.00\n• **Due Date:** February 15, 2024\n\nPayment terms are Net 30.",
    citations: [{ doc: "INV-2024-001.pdf", page: 1 }]
  },
  "compare": {
    response: "Comparing the two most recent invoices:\n\n| Field | INV-2024-001 | Q4 Statement |\n|-------|-------------|---------------|\n| Total | $12,450.00 | N/A |\n| Period | January 2024 | Q4 2024 |\n| Vendor | Acme Corp | Internal |\n\nThe Q4 Financial Statement shows **$2,450,000 in revenue** and **$340,000 net income**.",
    citations: [{ doc: "INV-2024-001.pdf", page: 1 }, { doc: "Q4_Financial_Statement.pdf", page: 2 }]
  },
  "policy": {
    response: "I found **Privacy_Policy_2024.pdf** in your documents. However, this document has an **exception status** with 72.3% confidence, which means some sections may need manual review.\n\nWould you like me to attempt a summary of the readable sections?",
    citations: [{ doc: "Privacy_Policy_2024.pdf", page: 1 }]
  },
  "default": {
    response: "I can help you with questions about your documents. Here are some things you can ask:\n\n• \"Show me all invoices from last month\"\n• \"What are the key terms in the TechCorp contract?\"\n• \"Summarize the Q4 financial statement\"\n• \"Compare two contracts\"\n\nWhich documents would you like to explore?"
  }
};

export function ChatView() {
  const { documents } = useDemo();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your document assistant. I can help you search, analyze, and compare your documents. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = sampleResponses.default;

      if (lowerInput.includes("invoice") || lowerInput.includes("inv")) {
        response = sampleResponses.invoice;
      } else if (lowerInput.includes("contract") || lowerInput.includes("agreement") || lowerInput.includes("termination")) {
        response = sampleResponses.contract;
      } else if (lowerInput.includes("total") || lowerInput.includes("amount") || lowerInput.includes("sum")) {
        response = sampleResponses.total;
      } else if (lowerInput.includes("compare") || lowerInput.includes("difference")) {
        response = sampleResponses.compare;
      } else if (lowerInput.includes("policy") || lowerInput.includes("privacy")) {
        response = sampleResponses.policy;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        citations: response.citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const processedDocs = documents.filter((d) => d.status === "processed");

  return (
    <div className="h-[calc(100vh-3.5rem)] flex animate-fade-in">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Document Chat
          </h1>
          <p className="text-muted-foreground">Ask questions about your documents in natural language</p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === "assistant" ? "bg-gradient-primary" : "bg-secondary"
                )}>
                  {msg.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className={cn(
                  "flex-1 max-w-[80%]",
                  msg.role === "user" && "flex flex-col items-end"
                )}>
                  <div className={cn(
                    "rounded-2xl p-4",
                    msg.role === "assistant" 
                      ? "bg-secondary/50 rounded-tl-sm" 
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}>
                    <div className="prose prose-sm prose-invert max-w-none">
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                  
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.citations.map((cite, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                        >
                          <FileText className="h-3 w-3" />
                          {cite.doc} (p.{cite.page})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-secondary/50 rounded-2xl rounded-tl-sm p-4">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Ask about your documents..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              {["Show recent invoices", "Contract summary", "Compare documents"].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInput(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Context Sidebar */}
      <aside className="w-72 border-l border-border p-4 hidden lg:block">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Context Documents
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          The AI can reference these {processedDocs.length} processed documents:
        </p>
        <div className="space-y-2">
          {processedDocs.slice(0, 6).map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 text-sm">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{doc.name}</span>
            </div>
          ))}
          {processedDocs.length > 6 && (
            <p className="text-xs text-muted-foreground text-center">
              +{processedDocs.length - 6} more documents
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
