// Minimal Gemini client for the browser (demo). For production, call from your backend.
// We use the GA v1 REST API and dynamically discover available models for your API key.
// Docs: https://ai.google.dev/gemini-api/docs

export type ChatMessage = {
  role: "user" | "assistant"; // local roles; Gemini expects "user" | "model"
  content: string;
};

// Per your request, use a hardcoded API key (not recommended for production)
const GEMINI_API_KEY: string = "AIzaSyDfzFKOYj-GT8jRhbA5E6jMS_KvSbsRW3A";

// Prefer a stable, widely-available model first
const STABLE_DEFAULT_MODEL = "gemini-1.5-flash";

// In-memory cache of discovered models for this session
let discoveredModels: string[] | null = null;

function normalizeModelName(input?: string): string {
  let m = (input || "").trim();
  if (!m) return STABLE_DEFAULT_MODEL;
  // Strip common prefixes and aliases
  m = m.replace(/^models\//, "");
  if (m.includes("/")) m = m.split("/").pop() || m;
  // Remove -latest suffix (we will use explicit names returned by ListModels)
  m = m.replace(/-latest$/, "");
  // Avoid old 1.0 family which often 404s for some API keys
  if (/^gemini-1\.0/.test(m)) return STABLE_DEFAULT_MODEL;
  return m;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

async function listModelsV1(): Promise<string[]> {
  if (discoveredModels) return discoveredModels;
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ListModels ${res.status}: ${await res.text().catch(() => res.statusText)}`);
    const data: any = await res.json();
    const names: string[] = (data?.models || [])
      .map((m: any) => (typeof m?.name === "string" ? m.name : ""))
      .filter(Boolean)
      .map((n: string) => n.replace(/^models\//, ""));
    discoveredModels = uniq(names);
  } catch (e) {
    // If listing fails (e.g., quota/restriction), fall back to defaults only
    discoveredModels = [];
  }
  return discoveredModels;
}

function sortByPreference(models: string[]): string[] {
  // Prefer flash first, then flash-8b, then pro, then the rest
  return models.slice().sort((a, b) => {
    const score = (m: string) =>
      /^gemini-1\.5-flash$/.test(m) ? 100 :
      /^gemini-1\.5-flash-8b/.test(m) ? 90 :
      /^gemini-1\.5-pro/.test(m) ? 80 :
      /^gemini-/.test(m) ? 50 : 0;
    return score(b) - score(a);
  });
}

async function getCandidateModels(): Promise<string[]> {
  const listed = await listModelsV1();
  // Start with our stable default, then add discovered ones in preferred order
  const preferred = [STABLE_DEFAULT_MODEL];
  const discovered = sortByPreference(listed.filter((m) => /^gemini-/.test(m)));
  return uniq([...preferred, ...discovered]);
}

export async function generateWithGemini(messages: ChatMessage[], systemInstruction?: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key missing");

  // Convert local messages to Gemini contents
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // GA v1 only (avoid v1beta mismatches)
  const ver = "v1" as const;
  const tried: string[] = [];
  let lastError: any = null;

  // Build an initial list, then expand using ListModels if needed
  let modelsToTry = uniq([normalizeModelName(STABLE_DEFAULT_MODEL)]);

  // Attempt initial model(s)
  const attempt = async (model: string) => {
    const endpoint = `https://generativelanguage.googleapis.com/${ver}/models/${encodeURIComponent(model)}:generateContent?key=${GEMINI_API_KEY}`;
    tried.push(`${ver}/${model}`);

    // Build body; use systemInstruction (camelCase) for v1 REST JSON
    const bodyAny: any = { contents };
    if (systemInstruction) {
      const sys = { parts: [{ text: systemInstruction }] };
      (bodyAny as any).systemInstruction = sys;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyAny),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        // If the server complains about system instruction field, retry without it
        if (res.status === 400 && /systemInstruction|system_instruction/.test(txt || "")) {
          const res2 = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
          });
          if (!res2.ok) {
            const txt2 = await res2.text().catch(() => "");
            lastError = new Error(`Gemini ${res2.status}: ${txt2 || res2.statusText}`);
            return false;
          }
          const data2 = await res2.json();
          const text2 = data2?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text2) {
            lastError = null;
            (discoveredModels ?? (discoveredModels = [])).push(model);
            return text2;
          }
          lastError = new Error("Gemini returned no text");
          return false;
        }
        // For 404, indicate not found; for other retryable codes, keep trying
        if (res.status === 404 || res.status === 403 || res.status === 400) {
          lastError = new Error(`Gemini ${res.status}: ${txt || res.statusText}`);
          return false;
        }
        throw new Error(`Gemini ${res.status}: ${txt || res.statusText}`);
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) {
        lastError = null;
        (discoveredModels ?? (discoveredModels = [])).push(model);
        return text;
      }
      lastError = new Error("Gemini returned no text");
      return false;
    } catch (err) {
      lastError = err;
      return false;
    }
  };

  // First try the default
  for (const m of modelsToTry) {
    const out = await attempt(m);
    if (typeof out === "string" && out) return out;
  }

  // If initial failed (e.g., 404), dynamically discover models and try compatible ones
  const discovered = await getCandidateModels();
  for (const m of discovered) {
    if (!modelsToTry.includes(m)) {
      const out = await attempt(m);
      if (typeof out === "string" && out) return out;
    }
  }

  // If all attempts failed, throw a helpful error
  const suffix = tried.length ? `; tried: ${tried.join(", ")}` : "";
  if (lastError) throw new Error(String((lastError as any)?.message || lastError) + suffix);
  throw new Error("Gemini request failed" + suffix);
}
