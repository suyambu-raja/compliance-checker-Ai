import type {
  BarcodeRequest,
  CVSimilarityResponse,
  GetScanResultResponse,
  ScanBarcodeResponse,
  ScanOCRResponse,
  ValidateLegalMetrologyRequest,
  ValidateLegalMetrologyResponse,
} from "@/types/api";

// Optional CV provider key (e.g., Roboflow, Replicate, or custom service)
const HARDCODED_CV_API_KEY = ""; // set if you want to demo quickly
const CV_API_KEY: string | undefined = (import.meta as any).env.VITE_CV_API_KEY || HARDCODED_CV_API_KEY;

const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "/api"; // fallback to /api for local proxy
// Fallback hardcoded OCR.Space key per user request (not recommended for production)
const HARDCODED_OCRSPACE_KEY = "K88180301688957";
const OCRSPACE_KEY: string | undefined = (import.meta as any).env.VITE_OCRSPACE_API_KEY || HARDCODED_OCRSPACE_KEY;
// Default to true so direct OCR works even if env is not set
const USE_OCRSPACE: boolean = ((import.meta as any).env.VITE_USE_OCRSPACE || "true").toString() === "true";

function getAuthHeaders() {
  const token = (import.meta as any).env.VITE_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Optional direct call to OCR.Space for quick prototyping (NOT for production)
  async scanOCRDirectOCRSpace(params: { file: File; language?: string }): Promise<{ raw_text: string }>{
    if (!OCRSPACE_KEY) throw new Error("VITE_OCRSPACE_API_KEY not set");
    const form = new FormData();
    form.append("language", params.language || "eng");
    form.append("isOverlayRequired", "false");
    form.append("OCREngine", "2");
    form.append("detectOrientation", "true");
    form.append("scale", "true");
    form.append("file", params.file);
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: OCRSPACE_KEY,
      } as any,
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OCR.Space ${res.status}: ${text || res.statusText}`);
    }
    const data: any = await res.json();
    // Handle OCR.Space error semantics (200 with error details)
    if (data?.IsErroredOnProcessing) {
      const msg = Array.isArray(data?.ErrorMessage) ? data.ErrorMessage.join("; ") : data?.ErrorMessage || "Errored on processing";
      throw new Error(`OCR.Space error: ${msg}`);
    }
    const results = data?.ParsedResults || [];
    const textAggregated = results.map((r: any) => r?.ParsedText || "").join("\n").trim();
    if (!textAggregated) {
      throw new Error("OCR returned empty text. Try a clearer image or different language setting.");
    }
    return { raw_text: textAggregated };
  },
  async scanOCR(params: { file: File; gtin_or_asin?: string; source_hint?: string }): Promise<ScanOCRResponse> {
    const form = new FormData();
    form.append("image_file", params.file);
    if (params.gtin_or_asin) form.append("gtin_or_asin", params.gtin_or_asin);
    if (params.source_hint) form.append("source_hint", params.source_hint);

    const res = await fetch(`${BASE_URL}/v1/scan/ocr`, {
      method: "POST",
      headers: { ...getAuthHeaders() },
      body: form,
    });
    return handleResponse<ScanOCRResponse>(res);
  },

  async scanBarcode(body: BarcodeRequest): Promise<ScanBarcodeResponse> {
    const res = await fetch(`${BASE_URL}/v1/scan/barcode`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(body),
    });
    return handleResponse<ScanBarcodeResponse>(res);
  },

  async validateLegalMetrology(body: ValidateLegalMetrologyRequest): Promise<ValidateLegalMetrologyResponse> {
    const res = await fetch(`${BASE_URL}/v1/validate/legal-metrology`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(body),
    });
    return handleResponse<ValidateLegalMetrologyResponse>(res);
  },

  async cvSimilarity(params: { ref_image: File; user_image: File }): Promise<CVSimilarityResponse> {
    const form = new FormData();
    form.append("ref_image", params.ref_image);
    form.append("user_image", params.user_image);

    const res = await fetch(`${BASE_URL}/v1/cv/similarity`, {
      method: "POST",
      headers: { ...getAuthHeaders() },
      body: form,
    });
    return handleResponse<CVSimilarityResponse>(res);
  },

  async getScanResult(scan_id: string): Promise<GetScanResultResponse> {
    const res = await fetch(`${BASE_URL}/v1/scan/${encodeURIComponent(scan_id)}/result`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
    });
    return handleResponse<GetScanResultResponse>(res);
  },
};
