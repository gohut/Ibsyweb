"use client";

import { useAppState } from "@/components/providers/AppStateProvider";
import {
  formatCurrencyValue,
  formatOriginalProductPrice,
  formatProductPrice,
} from "@/lib/currency";
import { getProductDiscountPercentage, type Product } from "@/lib/mock-data";

export function ProductPricePanel({ product }: { product: Product }) {
  const { currency } = useAppState();
  const discount = getProductDiscountPercentage(product, currency);

  return (
    <div className="stack" style={{ gap: "0.35rem" }}>
      <span className="price-display">{formatProductPrice(product, currency)}</span>
      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
        <span className="muted product-original-price">
          {formatOriginalProductPrice(product, currency)}
        </span>
        {discount ? <span className="product-discount-chip">{discount}% OFF</span> : null}
      </div>
      {/* <p className="muted">
        INR {formatCurrencyValue(product.priceInr, "INR")} | USD{" "}
        {formatCurrencyValue(product.priceUsd, "USD")}
      </p> */}
    </div>
  );
}
