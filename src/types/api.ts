// API types aligned with the provided backend spec
// Keep these minimal and focused on request/response contracts we consume in the UI

export type UUID = string;

// Shared
export interface RuleResult {
  rule_key: string;
  passed: boolean;
  confidence?: number;
  details?: Record<string, unknown>;
}

export interface SummaryResult {
  compliant: boolean;
  violations?: string[];
  violation_count?: number;
  recommendation?: string;
}

// /v1/scan/ocr
export interface OCRExtractedFields {
  generic_name?: string;
  mrp?: string; // as string, may contain currency symbol
  net_quantity?: string; // e.g., "100"
  unit?: string; // e.g., "g"
  manufacturer_name?: string;
  manufacturer_address?: string;
  month_year?: string; // e.g., "08/2025"
  consumer_care?: string;
  raw_text?: string;
}

export interface ScanOCRResponse {
  scan_id: UUID;
  extracted: OCRExtractedFields;
  rules?: RuleResult[];
  summary?: SummaryResult;
}

// /v1/scan/barcode
export interface BarcodeRequest {
  barcode_value: string;
  domain?: string;
}

export interface EnrichedProduct {
  gtin?: string;
  asin?: string;
  title?: string;
  brand?: string;
  images?: string[];
  offers?: { price?: number; currency?: string };
}

export interface ProductSource {
  source: string;
  asin?: string;
  sku?: string;
  price?: number;
}

export interface ScanBarcodeResponse {
  product?: EnrichedProduct;
  sources?: ProductSource[];
}

// /v1/validate/legal-metrology
export interface ValidateLegalMetrologyRequest {
  extracted: OCRExtractedFields;
  enrichment?: { gtin?: string; asin?: string; title?: string; brand?: string };
}

export interface ValidateLegalMetrologyResponse {
  rules: RuleResult[];
  summary: SummaryResult;
}

// /v1/cv/similarity
export interface CVSimilarityResponse {
  similarity: number; // 0..1
  flags?: { key: string; present: boolean }[];
  verdict?: string;
}

// GET /v1/scan/{scan_id}/result
export interface GetScanResultResponse {
  scan_id: UUID;
  product?: { gtin?: string; asin?: string; title?: string };
  ocr?: { fields?: Pick<OCRExtractedFields, "mrp" | "net_quantity" | "unit">; raw_text?: string };
  rules?: RuleResult[];
  anomaly?: { risk_score?: number; anomalies?: { type: string; details?: Record<string, unknown> }[] };
  cv?: { similarity?: number; flags?: { key: string; present: boolean }[] };
  summary?: SummaryResult;
}
