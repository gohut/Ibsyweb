"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DirectPurchaseButton } from "@/components/commerce/DirectPurchaseButton";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { useAppState } from "@/components/providers/AppStateProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CartIcon, TrashIcon } from "@/components/ui/Icons";
import { formatProductPrice } from "@/lib/currency";
import type { Product } from "@/lib/mock-data";

export default function CartPage() {
  const { cartItems, removeFromCart, currency } = useAppState();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetch("/api/products")
      .then((res) => res.json())
      .then((allProducts: Record<string, unknown>[]) => {
        const cartSet = new Set(cartItems);
        const mapped: Product[] = allProducts
          .filter((p) => cartSet.has(p.id as string))
          .map((p) => ({
            id: p.id as string,
            name: p.name as string,
            slug: p.slug as string,
            category: (p.category as string) ?? "",
            shortBlurb: (p.short_blurb as string) ?? "",
            descriptionHtml: (p.description_html as string) ?? "",
            images: (p.images as string[]) ?? [],
            youtubeUrls: (p.youtube_urls as string[]) ?? [],
            originalPriceInr: (p.original_price_inr as number) ?? 0,
            priceInr: (p.price_inr as number) ?? 0,
            originalPriceUsd: (p.original_price_usd as number) ?? 0,
            priceUsd: (p.price_usd as number) ?? 0,
            likes: (p.likes as number) ?? 0,
            downloads: (p.downloads as number) ?? 0,
            avgRating: (p.avg_rating as number) ?? 0,
            reviewCount: (p.review_count as number) ?? 0,
            status: (p.status as "active" | "hidden") ?? "active",
            reviews: [],
          }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [cartItems]);

  const subtotal = products.reduce(
    (sum, p) => sum + (currency === "INR" ? p.priceInr : p.priceUsd),
    0,
  );
  const tax = 0;
  const total = subtotal + tax;

  return (
    <StorefrontShell>
      <div className="page-container">
        <section className="page-section">
          <SectionHeading title="Your Cart" eyebrow="Digital products only" />

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>Loading cart...</div>
          ) : products.length ? (
            <div className="cart-layout">
              <div className="stack">
                {products.map((product) => (
                  <Card key={product.id} style={{ padding: "1rem" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "96px 1fr auto",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={96}
                        height={72}
                        style={{ borderRadius: 10, objectFit: "cover" }}
                        unoptimized
                      />
                      <div>
                        <h3>{product.name}</h3>
                        <p className="muted">{product.category}</p>
                        <p className="muted">Qty: 1</p>
                      </div>
                      <div className="stack" style={{ gap: "0.6rem", justifyItems: "end" }}>
                        <strong className="price-display" style={{ fontSize: "1.4rem" }}>
                          {formatProductPrice(product, currency)}
                        </strong>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeFromCart(product.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card style={{ padding: "1rem", height: "fit-content" }}>
                <SectionHeading title="Order Summary" />
                <div className="summary-table">
                  <div className="summary-row">
                    <span className="muted">Subtotal</span>
                    <span>{currency === "INR" ? `₹${subtotal}` : `$${subtotal}`}</span>
                  </div>
                  <div className="summary-row">
                    <span className="muted">Tax</span>
                    <span>{currency === "INR" ? `₹${tax}` : `$${tax}`}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Total</strong>
                    <strong className="price-display" style={{ fontSize: "1.6rem" }}>
                      {currency === "INR" ? `₹${total}` : `$${total}`}
                    </strong>
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <DirectPurchaseButton products={products} buttonLabel="Pay Now" />
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <EmptyState
              icon={<CartIcon width="34" height="34" />}
              title="Your cart is empty"
              description="Add a premium product to continue to checkout."
              action={
                <Link href="/" className="royal-button primary">
                  Browse Products
                </Link>
              }
            />
          )}
        </section>
      </div>
    </StorefrontShell>
  );
}