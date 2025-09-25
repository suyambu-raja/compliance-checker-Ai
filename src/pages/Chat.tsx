import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { generateWithGemini, type ChatMessage } from "@/lib/ai_gemini";
import { Send, Bot, User } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I’m your Compliance Assistant. Ask me about scanning labels, Legal Metrology rules, anomalies, or CV checks." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setSending(true);
    try {
      const reply = await generateWithGemini(newMessages, SYSTEM_PROMPT);
      setMessages((prev) => [...prev, { role: "assistant", content: reply || "(no response)" }]);
    } catch (err: any) {
      toast.error("Chat failed", { description: err?.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Compliance Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={listRef} className="h-[55vh] overflow-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${m.role === "assistant" ? "bg-accent text-foreground" : "bg-primary text-primary-foreground"}`}>
                  <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                    {m.role === "assistant" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    <span>{m.role === "assistant" ? "Assistant" : "You"}</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Ask about OCR, Legal Metrology rules, anomalies, CV checks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey ? onSend() : undefined}
              disabled={sending}
            />
            <Button onClick={onSend} disabled={sending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for an AI Automated E‑Commerce Legal Metrology Checker web app.
- Capabilities: explain OCR results, Legal Metrology rules (India), anomaly detection, barcode enrichment, and CV similarity; guide users through scanning steps.
- Provide concise, clear answers with action-oriented steps, and link users to features in the app (Scanner, Reports, Compliance).
- If you don’t know, ask clarifying questions; don’t fabricate.
- Avoid legal advice; provide informational guidance and cite rule names when relevant.`;
