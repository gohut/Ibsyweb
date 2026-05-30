export type Currency = "INR" | "USD";

const INDIA_TIMEZONES = new Set(["Asia/Kolkata", "Asia/Calcutta"]);

// ── Server-safe default (always USD — real detection happens client-side) ──
export function detectCurrency(timeZone?: string): Currency {
  if (!timeZone) return "USD";
  return INDIA_TIMEZONES.has(timeZone) ? "INR" : "USD";
}

// ── Client-side detection using browser timezone ──────────────────────────
export function detectCurrencyClient(): Currency {
  if (typeof window === "undefined") return "USD";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return INDIA_TIMEZONES.has(tz) ? "INR" : "USD";
  } catch {
    return "USD";
  }
}

export function formatCurrencyValue(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatProductPrice(
  product: { priceInr: number; priceUsd: number },
  currency: Currency,
) {
  return formatCurrencyValue(
    currency === "INR" ? product.priceInr : product.priceUsd,
    currency,
  );
}

export function formatOriginalProductPrice(
  product: { originalPriceInr: number; originalPriceUsd: number },
  currency: Currency,
) {
  return formatCurrencyValue(
    currency === "INR" ? product.originalPriceInr : product.originalPriceUsd,
    currency,
  );
}

export function getProductDiscountPercentage(
  product: { originalPriceInr: number; priceInr: number; originalPriceUsd: number; priceUsd: number },
  currency: Currency,
): number {
  const original = currency === "INR" ? product.originalPriceInr : product.originalPriceUsd;
  const current = currency === "INR" ? product.priceInr : product.priceUsd;
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}