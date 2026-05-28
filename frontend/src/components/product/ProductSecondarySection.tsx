"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Card } from "@/components/ui/Card";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { formatProductPrice } from "@/lib/currency";
import type { Product } from "@/lib/mock-data";

type ProductSecondarySectionProps = {
  descriptionHtml: string;
  relatedProducts: Product[];
};

export function ProductSecondarySection({
  descriptionHtml,
  relatedProducts,
}: ProductSecondarySectionProps) {
  const [open, setOpen] = useState(false);
  const { currency } = useAppState();

  return (
    <div className="product-secondary-layout">
      {/* ── Description accordion ── */}
      <Card
        className="product-accordion-card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <button
          type="button"
          className="product-accordion-toggle"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.65rem 0.9rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span className="display-heading" style={{ fontSize: "1.1rem", margin: 0 }}>
            Description
          </span>
          <span
            className={`product-accordion-arrow${open ? " open" : ""}`}
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              transition: "transform 0.2s ease",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <ChevronRightIcon />
          </span>
        </button>

        {open && (
          <div
            className="product-accordion-body"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            style={{
              padding: "0 0.9rem 0.75rem",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          />
        )}
      </Card>

      {/* ── You May Also Like ── */}
      <div className="stack" style={{ gap: "0.6rem" }}>
        <div>
          <p className="eyebrow" style={{ fontSize: "10px", marginBottom: "2px" }}>
            Related picks
          </p>
          <h2 className="display-heading" style={{ fontSize: "15px", margin: 0 }}>
            You May Also Like
          </h2>
        </div>

        {/* Horizontal scroll row */}
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.85rem",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
            paddingBottom: "4px",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              style={{
                flex: "0 0 auto",
                width: "190px",
                scrollSnapAlign: "start",
                display: "block",
                textDecoration: "none",
                color: "inherit",
                background: "transparent",
              }}
            >
              {/* Rectangle thumbnail — sharp corners, no border-radius */}
              <div
                style={{
                  position: "relative",
                  width: "190px",
                  height: "126px",
                  borderRadius: 0,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={190}
                  height={126}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  unoptimized
                />

                {/* Top-right pill: ★ rating + ↓ downloads */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(0,0,0,0.52)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    borderRadius: "20px",
                    padding: "3px 8px",
                  }}
                >
                  <span
                    style={{
                      color: "#f5c842",
                      fontSize: "11px",
                      fontWeight: 700,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    ★
                    <span style={{ color: "#fff" }}>
                      {(product as any).rating ?? "4.8"}
                    </span>
                  </span>

                  <span
                    style={{
                      width: "1px",
                      height: "10px",
                      background: "rgba(255,255,255,0.25)",
                    }}
                  />

                  <span
                    style={{
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 600,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span style={{ fontSize: "10px", opacity: 0.85 }}>↓</span>
                    {(product as any).downloads ?? "122"}
                  </span>
                </div>
              </div>

              {/* Card body — name bold, then category + price on same row */}
              <div
                style={{
                  paddingTop: "7px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                }}
              >
                <strong
                  style={{
                    fontSize: "12.5px",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.name}
                </strong>
                  <span className="muted" style={{ fontSize: "10.5px", lineHeight: 1.2 }}>
                    {product.category}
                  </span>
                {/* Category left — price right */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >

                  <span
                    className="price-display"
                    style={{ fontSize: "20.5px", fontWeight: 700, lineHeight: 1 }}
                  >
                    {formatProductPrice(product, currency)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}