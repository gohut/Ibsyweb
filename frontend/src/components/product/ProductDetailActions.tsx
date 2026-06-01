"use client";

import { DirectPurchaseButton } from "@/components/commerce/DirectPurchaseButton";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/Icons";
import { RatingStars } from "@/components/product/RatingStars";
import type { Product } from "@/lib/mock-data";

type ProductDetailActionsProps = {
  product: Product;
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addToCart } = useAppState();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Buttons */}
      <div className="two-column" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Button variant="secondary" fullWidth onClick={() => addToCart(product.id)}>
          Add to Cart
        </Button>
        <DirectPurchaseButton products={[product]} />
      </div>

      {/* Downloads + Rating — now below the buttons */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }} className="muted">
          <DownloadIcon width="14" height="14" />
          <span style={{ fontSize: "13px" }}>{product.downloads} Downloads</span>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <RatingStars rating={product.avgRating} />
          <span className="muted" style={{ fontSize: "13px" }}>
            {product.avgRating} ({product.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}