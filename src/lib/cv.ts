// Minimal client-side CV similarity using average hash (aHash)
// Note: This is a heuristic. For production-grade similarity, use a provider (Roboflow/Replicate) server-side.

export async function cvSimilarityClient(refFile: File, userFile: File): Promise<{
  similarity: number; // 0..1
  flags: { key: string; present: boolean }[];
  verdict: string;
}> {
  // Use full 64-bit aHash with bigint Hamming distance to avoid scaling errors.
  const [h1, h2] = await Promise.all([computeAHashBig(refFile), computeAHashBig(userFile)]);
  const dist = hammingDistanceHashBigInt(h1, h2); // 0..64
  const similarity = 1 - dist / 64; // proper normalization
  const flags = [
    // present=true means any difference is observed; absent only when aHash is identical
    { key: "packaging_layout_diff", present: dist > 0 },
  ];
  const verdict = similarity >= 0.85
    ? "likely_match"
    : similarity >= 0.7
    ? "likely_match_with_warnings"
    : "mismatch";
  return { similarity: Number(similarity.toFixed(2)), flags, verdict };
}

async function computeAHash(file: File): Promise<number> {
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);
  // Draw to 8x8 canvas, grayscale, compute average
  const size = 8;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  // Draw image scaled
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const gray: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    gray.push(0.299 * r + 0.587 * g + 0.114 * b);
  }
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  // Build 64-bit hash as number represented across two 32-bit halves. For simplicity, pack into a bigint.
  let hash = 0n;
  for (let i = 0; i < gray.length; i++) {
    hash = (hash << 1n) | (gray[i] >= avg ? 1n : 0n);
  }
  // Convert to normal number by modding into Number range (lossy, but ok for hamming using BigInt ops)
  // We'll keep bigint-based hamming
  return Number(hash & 0xffffffffn); // not used; we will keep bigint below
}

function hammingDistanceHashBigInt(a: bigint, b: bigint): number {
  let x = a ^ b;
  let count = 0;
  while (x) {
    x &= x - 1n;
    count++;
  }
  return count;
}

// Revised aHash returning bigint for proper 64-bit distance
async function computeAHashBig(file: File): Promise<bigint> {
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);
  const size = 8;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const gray: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    gray.push(0.299 * r + 0.587 * g + 0.114 * b);
  }
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  let hash = 0n;
  for (let i = 0; i < gray.length; i++) {
    hash = (hash << 1n) | (gray[i] >= avg ? 1n : 0n);
  }
  return hash;
}

function hammingDistance(a: number, b: number): number {
  // Note: Using number-based Hamming here for simplicity since above computeAHash returned number.
  // For more accurate 64-bit Hamming, use computeAHashBig + hammingDistanceHashBigInt.
  let x = a ^ b;
  let count = 0;
  while (x) {
    x &= x - 1;
    count++;
  }
  return count;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
