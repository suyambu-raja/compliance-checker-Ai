// Minimal Gemini client for the browser (demo). For production, call from your backend.
// Uses v1beta generateContent endpoint. See: https://ai.google.dev/gemini-api/docs

export type ChatMessage = {
  role: "user" | "assistant"; // local roles; Gemini expects "user" | "model"
  content: string;
};

const HARDCODED_GEMINI_KEY = "AIzaSyDfzFKOYj-GT8jRhbA5E6jMS_KvSbsRW3A"; // per user request (not secure for prod)
const GEMINI_API_KEY: string | undefined = (import.meta as any).env.VITE_GEMINI_API_KEY || HARDCODED_GEMINI_KEY;
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash-latest"; // valid for Google AI Studio (Generative Language API)

function normalizeModelName(input?: string): string {
  const m = (input || "").trim();
  if (!m) return DEFAULT_GEMINI_MODEL;
  // If the provided model looks like a Vertex AI publisher model or a versioned suffix (e.g., -001/-002),
  // fall back to a public Generative Language API model name.
  if (/^projects\//.test(m) || /-00\d$/.test(m)) return DEFAULT_GEMINI_MODEL;
  return m;
}

const GEMINI_MODEL = normalizeModelName((import.meta as any).env.VITE_GEMINI_MODEL) || DEFAULT_GEMINI_MODEL;

export async function generateWithGemini(messages: ChatMessage[], systemInstruction?: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key missing");

  // Convert local messages to Gemini contents
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body: any = { contents };
  if (systemInstruction) {
    body.systemInstruction = { role: "system", parts: [{ text: systemInstruction }] };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(
    GEMINI_API_KEY,
  )}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${txt || res.statusText}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}
