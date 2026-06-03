import type { UploadStats } from "@/types";

export function parseCsvPreview(filename: string, text: string): UploadStats {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error("Dataset needs a header row and at least one observation.");
  }

  const headers = lines[0].split(",").map((item) => item.trim() || "Ad");
  const rows = lines.slice(1).map((line) => line.split(",").map((value) => Number(value.trim())));
  const invalid = rows.some((row) => row.length !== headers.length || row.some((value) => value !== 0 && value !== 1));
  if (invalid) {
    throw new Error("Only binary values are valid: 1 for clicked, 0 for not clicked.");
  }

  const clicksByAd = headers.map((_, index) => rows.reduce((sum, row) => sum + row[index], 0));
  const totalClicks = clicksByAd.reduce((sum, value) => sum + value, 0);
  const bestIndex = clicksByAd.reduce((best, value, index) => (value > clicksByAd[best] ? index : best), 0);
  const totalImpressions = rows.length * headers.length;
  const adDetails = headers.map((ad, index) => ({
    ad,
    impressions: rows.length,
    clicks: clicksByAd[index],
    ctr: (clicksByAd[index] / Math.max(rows.length, 1)) * 100
  }));

  return {
    filename,
    rows: rows.length,
    columns: headers.length,
    totalClicks,
    overallCtr: (totalClicks / Math.max(totalImpressions, 1)) * 100,
    bestAd: headers[bestIndex],
    adDetails
  };
}
