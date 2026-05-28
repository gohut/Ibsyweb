export type Currency = "INR" | "USD";

export function detectCurrency(timeZone?: string): Currency {
  const resolvedTimeZone =
    timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  return resolvedTimeZone === "Asia/Kolkata" ? "INR" : "USD";
}

export function formatCurrencyValue(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 0,
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
