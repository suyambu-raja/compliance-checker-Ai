// Google Cloud Vision-based similarity (labels + colors heuristic)
// Note: This calls Google Vision directly from the browser with an API key for demo purposes only.
// For production, route via your backend to keep keys secret and handle quotas/errors.

import type { CVSimilarityResponse } from "@/types/api";

const HARDCODED_GOOGLE_VISION_KEY = "AIzaSyCGMDpOR3XR1tjWTIPMALBBJYvrAGL7NBA"; // per user request (unsafe for prod)
const GOOGLE_VISION_KEY: string | undefined = (import.meta as any).env.VITE_GOOGLE_VISION_API_KEY || HARDCODED_GOOGLE_VISION_KEY;

const VISION_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";

export async function googleCVSimilarity(refFile: File, userFile: File): Promise<CVSimilarityResponse> {
  if (!GOOGLE_VISION_KEY) throw new Error("Google Vision API key missing");

  const [refB64, userB64] = await Promise.all([toBase64(refFile), toBase64(userFile)]);

  const features = [
    { type: "LABEL_DETECTION", maxResults: 50 },
    { type: "IMAGE_PROPERTIES" },
  ];

  const body = {
    requests: [
      { image: { content: refB64 }, features },
      { image: { content: userB64 }, features },
    ],
  };

  const res = await fetch(`${VISION_ENDPOINT}?key=${encodeURIComponent(GOOGLE_VISION_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Vision ${res.status}: ${txt || res.statusText}`);
  }
  const data = await res.json();
  const [refResp, userResp] = (data?.responses || []) as any[];

  if (!refResp || !userResp) throw new Error("Vision response missing");

  const refLabels: string[] = (refResp.labelAnnotations || []).map((x: any) => (x.description || "").toLowerCase());
  const userLabels: string[] = (userResp.labelAnnotations || []).map((x: any) => (x.description || "").toLowerCase());

  const labelSim = jaccardSimilarity(new Set(refLabels), new Set(userLabels));

  const refColors = (refResp.imagePropertiesAnnotation?.dominantColors?.colors || []).slice(0, 5);
  const userColors = (userResp.imagePropertiesAnnotation?.dominantColors?.colors || []).slice(0, 5);
  const colorSim = paletteSimilarity(refColors, userColors);

  // Weighted similarity (labels heavier than colors)
  const similarity = Number((labelSim * 0.7 + colorSim * 0.3).toFixed(2));

  const flags = [
    // present=true means any difference is observed; Vision-based heuristic rarely hits 1.0
    { key: "packaging_layout_diff", present: similarity < 1.0 },
    { key: "logo_mismatch", present: !hasLogoIndication(refLabels) || !hasLogoIndication(userLabels) },
  ];

  const verdict = similarity >= 0.85 ? "likely_match" : similarity >= 0.7 ? "likely_match_with_warnings" : "mismatch";

  return { similarity, flags, verdict };
}

function hasLogoIndication(labels: string[]): boolean {
  return labels.some((l) => /logo|brand|trademark/.test(l));
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  a.forEach((x) => {
    if (b.has(x)) inter++;
  });
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function paletteSimilarity(a: any[], b: any[]): number {
  // Compare top-N dominant colors via nearest-neighbor distance
  if (!a.length || !b.length) return 0;
  const aRGB = a.map((c) => c.color || { red: 0, green: 0, blue: 0 });
  const bRGB = b.map((c) => c.color || { red: 0, green: 0, blue: 0 });
  let total = 0;
  let count = 0;
  for (const ca of aRGB) {
    let best = Infinity;
    for (const cb of bRGB) {
      const d = colorDistance(ca, cb);
      if (d < best) best = d;
    }
    // normalize distance 0..1 assuming max ~ 441.67 (sqrt(255^2*3))
    const sim = 1 - Math.min(best, 442) / 442;
    total += sim;
    count++;
  }
  return count ? total / count : 0;
}

function colorDistance(a: any, b: any): number {
  const dr = (a.red || 0) - (b.red || 0);
  const dg = (a.green || 0) - (b.green || 0);
  const db = (a.blue || 0) - (b.blue || 0);
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function toBase64(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
  return dataUrl.split(",")[1] || "";
}
