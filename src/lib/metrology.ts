// Lightweight client-side parsing and validation to improve UX when using direct OCR
// NOTE: Heuristic-only; backend rule engine should be source of truth in production

import type { OCRExtractedFields, RuleResult, ValidateLegalMetrologyResponse } from "@/types/api";

const UNIT_MAP: Record<string, string> = {
  g: "g",
  gram: "g",
  grams: "g",
  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",
  ml: "ml",
  l: "L",
  lt: "L",
  liter: "L",
  litre: "L",
  liters: "L",
  litres: "L",
  pcs: "pcs",
  piece: "pcs",
  pieces: "pcs",
};

export function parseFieldsFromRawText(raw: string): OCRExtractedFields {
  const text = (raw || "").replace(/\u20B9/g, "₹"); // normalize rupee symbol
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const lower = text.toLowerCase();

  // MRP (₹ or Rs/Rs.)
  const mrpMatch = text.match(/(?:₹|rs\.?\s*)(\d{1,5}(?:[\.,]\d{2})?)/i);

  // Quantity and unit e.g., 100 g, 100g, 1 L, 250ml
  const qtyMatch = text.match(/(\d{1,4}(?:[\.,]\d{1,2})?)\s*(kg|gram|grams|g|ml|l|lt|liter|litre|liters|litres|pcs|piece|pieces)\b/i);
  let net_quantity: string | undefined;
  let unit: string | undefined;
  if (qtyMatch) {
    net_quantity = qtyMatch[1]?.replace(/,/g, "");
    const uRaw = qtyMatch[2]?.toLowerCase();
    unit = UNIT_MAP[uRaw] || uRaw;
  }

  // Month/Year (MM/YYYY)
  const myMatch = text.match(/\b(0[1-9]|1[0-2])\s*[\/\.\-]\s*(20\d{2}|19\d{2})\b/);

  // Manufacturer name/address lines
  const manufLine = lines.find((l) => /manufact|mfg\.?\s*by|packer|importer/i.test(l));
  const manufacturer_name = manufLine?.replace(/.*?:\s*/i, "");
  // A very light heuristic for address: the next line if it looks like an address (has numbers/comma)
  const idx = manufLine ? lines.indexOf(manufLine) : -1;
  const manufacturer_address = idx >= 0 && idx + 1 < lines.length && /[0-9,]/.test(lines[idx + 1]) ? lines[idx + 1] : undefined;

  // Consumer care: 1800 or 10-digit phone
  const careMatch = text.match(/(1[89]00[-\s]?\d{3}[-\s]?\d{3,4}|\b\d{10}\b)/);

  // Generic name: try to find line with "name:" or the most prominent uppercase word near top
  const nameLine = lines.find((l) => /name\s*:/i.test(l));
  const generic_name = nameLine ? nameLine.replace(/.*?:\s*/i, "").trim() : undefined;

  return {
    generic_name,
    mrp: mrpMatch ? (text.includes("₹") ? `₹${mrpMatch[1]}` : mrpMatch[0]) : undefined,
    net_quantity,
    unit,
    manufacturer_name,
    manufacturer_address,
    month_year: myMatch ? `${myMatch[1]}/${myMatch[2]}` : undefined,
    consumer_care: careMatch ? careMatch[0] : undefined,
    raw_text: raw,
  };
}

export function validateLocally(ex: OCRExtractedFields): { rules: RuleResult[]; summary: ValidateLegalMetrologyResponse["summary"] } {
  const rules: RuleResult[] = [];
  const add = (rule_key: string, passed: boolean) => rules.push({ rule_key, passed, confidence: passed ? 0.95 : 0.7 });

  add("manufacturer_address_present", !!(ex.manufacturer_name || ex.manufacturer_address));
  add("generic_name_present", !!ex.generic_name);
  add("net_quantity_present", !!ex.net_quantity);
  add("net_quantity_numeric", !!ex.net_quantity && /^\d+(?:\.\d+)?$/.test(ex.net_quantity));
  add("net_quantity_unit_valid", !!ex.unit && ["g", "kg", "ml", "L", "cm", "m", "pcs"].includes(ex.unit));
  add("month_year_present", !!ex.month_year);
  add("mrp_present", !!ex.mrp);
  add("mrp_format_valid", !!ex.mrp && /\d/.test(ex.mrp));
  // Heuristic for prominence (just presence in raw_text here)
  add("mrp_prominent_in_text", !!ex.raw_text && /mrp|price|₹|rs\.?/i.test(ex.raw_text));
  add("consumer_care_present", !!ex.consumer_care);

  const failed = rules.filter((r) => !r.passed).map((r) => r.rule_key);
  const summary = {
    compliant: failed.length === 0,
    violations: failed,
    violation_count: failed.length,
  } as const;

  return { rules, summary };
}
