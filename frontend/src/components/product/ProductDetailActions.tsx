"use client";

import { DirectPurchaseButton } from "@/components/commerce/DirectPurchaseButton";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/mock-data";

type ProductDetailActionsProps = {
  product: Product;
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addToCart } = useAppState();

  return (
    <div className="two-column" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <Button variant="secondary" fullWidth onClick={() => addToCart(product.id)}>
        Add to Cart
      </Button>
      <DirectPurchaseButton products={[product]} />
    </div>
  );
}
