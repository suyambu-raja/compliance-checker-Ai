import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import { parseFieldsFromRawText, validateLocally } from "@/lib/metrology";
import { compressImage } from "@/lib/image";
import { cvSimilarityClient } from "@/lib/cv";
import { googleCVSimilarity } from "@/lib/cv_google";
import type { CVSimilarityResponse, GetScanResultResponse, ScanBarcodeResponse, ScanOCRResponse } from "@/types/api";
import {
  Camera,
  Upload,
  Search,
  Package,
  CheckCircle,
  XCircle,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

export default function Scanner() {
  // OCR state
  const [gtinOrAsin, setGtinOrAsin] = useState("");
  const [sourceHint, setSourceHint] = useState("");
  const [ocrResult, setOcrResult] = useState<ScanOCRResponse | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // Barcode state
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcodeResult, setBarcodeResult] = useState<ScanBarcodeResponse | null>(null);
  const [barcodeLoading, setBarcodeLoading] = useState(false);

  // CV state
  const [refImage, setRefImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [cvResult, setCvResult] = useState<CVSimilarityResponse | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  // Image previews
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);
  useEffect(() => () => { if (ocrImagePreview) URL.revokeObjectURL(ocrImagePreview); }, [ocrImagePreview]);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  useEffect(() => () => { if (refPreview) URL.revokeObjectURL(refPreview); }, [refPreview]);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  useEffect(() => () => { if (userPreview) URL.revokeObjectURL(userPreview); }, [userPreview]);

  // Combined result
  const [combined, setCombined] = useState<GetScanResultResponse | null>(null);
  const [combinedLoading, setCombinedLoading] = useState(false);

  const onSelectOCRFile = async (file: File | null) => {
    const original = file;
    if (!original) return;
    let blobToSend: Blob = original;
    try {
      blobToSend = await compressImage(original);
    } catch {}
    const fileToSend = new File([blobToSend], original.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
    if (!file) return;
    setOcrLoading(true);
    setOcrResult(null);
    setCombined(null);
    try {
      const res = await api.scanOCR({ file: fileToSend, gtin_or_asin: gtinOrAsin || undefined, source_hint: sourceHint || undefined });
      setOcrResult(res);
      toast.success("OCR completed", { description: "Extraction and rule validation done." });
    } catch (err: any) {
      toast.error("OCR failed", { description: err?.message || "Unable to process image" });
    } finally {
      setOcrLoading(false);
    }
  };

  const handleBarcodeLookup = async () => {
    if (!barcodeValue.trim()) {
      toast("Enter a barcode or product ID");
      return;
    }
    setBarcodeLoading(true);
    setBarcodeResult(null);
    try {
      const res = await api.scanBarcode({ barcode_value: barcodeValue.trim() });
      setBarcodeResult(res);
      toast.success("Product enrichment fetched");
    } catch (err: any) {
      toast.error("Barcode lookup failed", { description: err?.message });
    } finally {
      setBarcodeLoading(false);
    }
  };

  const handleCVSimilarity = async () => {
    // If no backend CV, compute a quick heuristic similarity in-browser
    if (!refImage || !userImage) {
      toast("Select both images for CV similarity");
      return;
    }
    try {
      setCvLoading(true);
      // Prefer backend if available (kept for later), otherwise client
      // Try Google Vision-based similarity first with your key
      try {
        const g = await googleCVSimilarity(refImage, userImage);
        setCvResult(g);
        toast.success("CV similarity computed (Google Vision)");
        return;
      } catch {}

      // Fallback to client-side aHash similarity
      const local = await cvSimilarityClient(refImage, userImage);
      setCvResult(local);
      toast.success("CV similarity computed (client)");
    } catch (err: any) {
      toast.error("CV similarity failed", { description: err?.message });
    } finally {
      setCvLoading(false);
    }
  };


  const handleRefreshCombined = async () => {
    const scanId = ocrResult?.scan_id;
    if (!scanId) return;
    setCombinedLoading(true);
    try {
      const res = await api.getScanResult(scanId);
      setCombined(res);
      toast.success("Fetched combined result");
    } catch (err: any) {
      toast.error("Fetch failed", { description: err?.message });
    } finally {
      setCombinedLoading(false);
    }
  };

  const handleOCRFileSelected = async (file: File | null) => {
    if (!file) {
      setOcrImagePreview(null);
      return;
    }
    // Set preview for the selected OCR image
    try {
      const url = URL.createObjectURL(file);
      setOcrImagePreview(url);
    } catch {}

    // Force direct OCR.Space mode to avoid API not found
    const useDirect = true;
    if (!file) return;
    if (useDirect) {
      try {
        setOcrLoading(true);
        setOcrResult(null);
        setCombined(null);
        const direct = await api.scanOCRDirectOCRSpace({ file });
        const extracted = parseFieldsFromRawText(direct.raw_text);
        const local = validateLocally(extracted);
        setOcrResult({ scan_id: "direct-ocrspace", extracted, rules: local.rules, summary: local.summary });
        toast.success("OCR text fetched (direct)");
      } catch (err: any) {
        toast.error("OCR (direct) failed", { description: err?.message });
      } finally {
        setOcrLoading(false);
      }
    } else {
      await onSelectOCRFile(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Product Scanner</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Scan or search products to check compliance status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Scanner Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Product</CardTitle>
            <CardDescription>Use camera or upload image to scan label and validate rules</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="camera">Camera</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>

              {/* Camera (uses file input with capture) */}
              <TabsContent value="camera" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-8 text-center">
                  <Camera className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">Use your camera to capture a label image</p>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleOCRFileSelected(e.target.files?.[0] || null)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button onClick={() => cameraInputRef.current?.click()} disabled={ocrLoading} className="w-full" size="sm">
                      {ocrLoading ? "Processing..." : "Open Camera"}
                    </Button>
                    <Input
                      placeholder="GTIN/ASIN (optional)"
                      value={gtinOrAsin}
                      onChange={(e) => setGtinOrAsin(e.target.value)}
                    />
                    <Input
                      placeholder="Source hint (optional)"
                      value={sourceHint}
                      onChange={(e) => setSourceHint(e.target.value)}
                    />
                  </div>
                  {ocrImagePreview && (
                    <div className="mt-4">
                      <img src={ocrImagePreview} alt="Preview" className="max-h-72 rounded-md border mx-auto" />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Upload */}
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">Upload an image containing the packaging label</p>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleOCRFileSelected(e.target.files?.[0] || null)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button variant="outline" className="w-full" size="sm" onClick={() => uploadInputRef.current?.click()}>
                      <ImageIcon className="h-4 w-4 mr-2" /> Choose Image
                    </Button>
                    <Input
                      placeholder="GTIN/ASIN (optional)"
                      value={gtinOrAsin}
                      onChange={(e) => setGtinOrAsin(e.target.value)}
                    />
                    <Input
                      placeholder="Source hint (optional)"
                      value={sourceHint}
                      onChange={(e) => setSourceHint(e.target.value)}
                    />
                  </div>
                  {ocrImagePreview && (
                    <div className="mt-4">
                      <img src={ocrImagePreview} alt="Preview" className="max-h-72 rounded-md border mx-auto" />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Manual barcode/ID */}
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="barcode">Barcode / Product ID</Label>
                    <Input id="barcode" placeholder="Enter GTIN/EAN/ASIN or SKU" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} />
                  </div>
                  <Button onClick={handleBarcodeLookup} className="w-full" disabled={barcodeLoading}>
                    <Search className="h-4 w-4 mr-2" /> {barcodeLoading ? "Searching..." : "Search Product"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Results</CardTitle>
              <CardDescription>OCR extraction, rule validation, and enrichment</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefreshCombined} disabled={!ocrResult?.scan_id || combinedLoading}>
                <RefreshCw className="h-4 w-4 mr-2" /> Combined
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!ocrResult && !barcodeResult && !combined ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No scan yet. Capture or upload a label, or search by barcode.</p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {/* OCR Section */}
                <AccordionItem value="ocr">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">OCR Extraction & Rule Summary</span>
                      {ocrResult?.summary && (
                        <Badge className={ocrResult.summary.compliant ? "bg-success text-success-foreground" : "bg-error text-error-foreground"}>
                          {ocrResult.summary.compliant ? "Compliant" : `Violations: ${ocrResult.summary.violation_count ?? ocrResult.summary.violations?.length ?? 0}`}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {ocrResult ? (
                      <div className="space-y-4">
                        {/* Extracted fields in two columns */}
                        <div>
                          <h4 className="font-medium mb-2">Extracted Fields</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {([
                              ["Generic Name", ocrResult.extracted?.generic_name],
                              ["MRP", ocrResult.extracted?.mrp],
                              ["Net Quantity", ocrResult.extracted?.net_quantity],
                              ["Unit", ocrResult.extracted?.unit],
                              ["Manufacturer Name", ocrResult.extracted?.manufacturer_name],
                              ["Manufacturer Address", ocrResult.extracted?.manufacturer_address],
                              ["Month/Year", ocrResult.extracted?.month_year],
                              ["Consumer Care", ocrResult.extracted?.consumer_care],
                            ] as const).map(([label, value]) => (
                              <div key={label} className="flex items-center gap-2">
                                <span className="text-muted-foreground w-40 min-w-40">{label}:</span>
                                <span className="font-medium break-words">{value || "—"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rule checks */}
                        {ocrResult.rules && ocrResult.rules.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Rule Checks</h4>
                            <div className="space-y-2">
                              {ocrResult.rules.map((r) => (
                                <div key={r.rule_key} className="flex items-center justify-between text-sm p-2 border rounded-md">
                                  <span className="capitalize">{r.rule_key.replace(/_/g, " ")}</span>
                                  {r.passed ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-error" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No OCR results yet.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Enrichment Section */}
                <AccordionItem value="enrichment">
                  <AccordionTrigger>
                    <span className="font-medium">Product Enrichment</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {barcodeResult?.product ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {([
                          ["Title", barcodeResult.product.title],
                          ["Brand", barcodeResult.product.brand],
                          ["GTIN", barcodeResult.product.gtin],
                          ["ASIN", barcodeResult.product.asin],
                          ["Price", barcodeResult.product.offers?.price?.toString()],
                          ["Currency", barcodeResult.product.offers?.currency],
                        ] as const).map(([label, value]) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-muted-foreground w-40 min-w-40">{label}:</span>
                            <span className="font-medium break-words">{value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No enrichment data.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Combined Section */}
                <AccordionItem value="combined">
                  <AccordionTrigger>
                    <span className="font-medium">Combined Result</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {combined ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-40 min-w-40">Scan ID:</span>
                          <span className="font-medium break-words">{combined.scan_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-40 min-w-40">Similarity:</span>
                          <span className="font-medium break-words">{combined.cv?.similarity ?? "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-40 min-w-40">Risk Score:</span>
                          <span className="font-medium break-words">{combined.anomaly?.risk_score ?? "—"}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No combined results yet.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CV similarity section */}
      <Card>
        <CardHeader>
          <CardTitle>CV Similarity</CardTitle>
          <CardDescription>Compare listing/reference image with your captured image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Reference image</Label>
              <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setRefImage(f); try { setRefPreview(f ? URL.createObjectURL(f) : null); } catch {} }} />
              {refPreview && (
                <div className="mt-2">
                  <img src={refPreview} alt="Reference preview" className="max-h-56 rounded-md border" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>User image</Label>
              <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setUserImage(f); try { setUserPreview(f ? URL.createObjectURL(f) : null); } catch {} }} />
              {userPreview && (
                <div className="mt-2">
                  <img src={userPreview} alt="User preview" className="max-h-56 rounded-md border" />
                </div>
              )}
            </div>
          </div>
          <Button onClick={handleCVSimilarity} disabled={cvLoading} className="w-full sm:w-auto">
            {cvLoading ? "Computing..." : "Compute Similarity"}
          </Button>
          {cvResult && (
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Similarity:</span>
                <span className="font-medium">{cvResult.similarity}</span>
              </div>
              {cvResult.flags && cvResult.flags.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium mb-1">Flags</h4>
                  <ul className="list-disc pl-6">
                    {cvResult.flags.map((f) => (
                      <li key={f.key} className="text-sm">
                        {f.key} — {f.present ? "present" : "absent"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>Your recent product scans and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Product Scan #{i}</p>
                    <p className="text-sm text-muted-foreground">Scanned recently</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
