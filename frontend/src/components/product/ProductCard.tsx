"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppState } from "@/components/providers/AppStateProvider";
import { DownloadIcon } from "@/components/ui/Icons";
import {
  formatOriginalProductPrice,
  formatProductPrice,
} from "@/lib/currency";
import { getProductDiscountPercentage, type Product } from "@/lib/mock-data";

type ProductCardProps = {
  product: Product;
};

// Fallback image — a plain dark placeholder data URL (no external request)
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%231a2235'/%3E%3C/svg%3E";

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, currency } = useAppState();

  if (!product) return null;

  const discount = getProductDiscountPercentage(product, currency);

  // ── Safe image: use first image if it exists, else fallback ──────────
  const imageSrc =
    Array.isArray(product.images) && product.images[0]
      ? product.images[0]
      : FALLBACK_IMAGE;

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        background: "transparent",
        border: "none",
        padding: 0,
        width: "100%",
      }}
    >
      {/* ── Image Frame ─────────────────────────────── */}
      <Link
        href={`/product/${product.slug}`}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#1a2235",
        }}
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
          // Only use blur placeholder when we have a real image URL
          {...(imageSrc === FALLBACK_IMAGE
            ? {}
            : { placeholder: "blur", blurDataURL: imageSrc })}
          unoptimized
        />

        {/* Gradient scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.08) 65%)",
          }}
        />

        {/* Top-left: product name */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.8rem",
            right: "5.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.18rem",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.92rem",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {product.name}
          </span>
        </div>

        {/* Top-right: floating badge — rating + downloads */}
        <div
          className="product-card-rating"
          style={{
            position: "absolute",
            top: "0.65rem",
            right: "0.65rem",
          }}
        >
          <span style={{ color: "var(--color-star, #f5c518)" }}>★</span>
          <span>{(product.avgRating ?? 0).toFixed(1)}</span>
          <span className="product-card-rating-separator" />
          <DownloadIcon width="12" height="12" />
          <span>{product.downloads ?? 0}</span>
        </div>

        {/* Bottom-left: discount chip */}
        {discount ? (
          <span
            className="product-discount-chip"
            style={{
              position: "absolute",
              bottom: "0.65rem",
              left: "0.65rem",
            }}
          >
            {discount}% OFF
          </span>
        ) : null}
      </Link>

      {/* ── Below image ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.1rem",
          padding: "0 0.1rem",
        }}
      >
        {/* Row: name + price */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <Link
            href={`/product/${product.slug}`}
            style={{ textDecoration: "none", flex: 1, minWidth: 0 }}
          >
            <h3 className="product-card-title">{product.name}</h3>
          </Link>

          {/* Right: current price + struck-through original */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <strong className="price-display">
              {formatProductPrice(product, currency)}
            </strong>
            {discount ? (
              <span className="muted product-original-price">
                {formatOriginalProductPrice(product, currency)}
              </span>
            ) : null}
          </div>
        </div>

        <span
          className="product-card-category"
          style={{ position: "absolute", transform: "translate(-5px, 20px)" }}
        >
          {product.category}
        </span>
      </div>
    </article>
  );
}