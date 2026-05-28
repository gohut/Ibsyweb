"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { searchProducts } from "@/lib/mock-data";
import { SearchHandleIcon, SearchIcon } from "@/components/ui/Icons";

type SearchBarProps = {
  compact?: boolean;
};

export function SearchBar({ compact = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchProducts(deferredQuery),
    [deferredQuery],
  );

  return (
    <div className="search-shell">
      <div
        className="search-box"
        style={{
          maxWidth: compact ? 480 : undefined,
          width: "100%",
          minHeight: compact ? "40px" : "52px",
          padding: compact ? "0 0.35rem 0 0.8rem" : "0 0.4rem 0 0.95rem",
        }}
      >
        {/* Icon tinted to accent colour */}
        <span style={{ color: "var(--color-accent-primary)", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <SearchIcon />
        </span>

        <input
          aria-label="Search products"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ fontSize: compact ? "0.85rem" : "1rem" }}
        />
      </div>

      {results.length > 0 && (
        <div
          className="search-dropdown surface-card"
          style={{
            borderRadius: "14px",
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px var(--color-accent-faint)",
            overflow: "hidden",
            padding: "0.4rem",
          }}
        >
          {results.map((product, i) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="search-result"
              style={{
                borderRadius: "10px",
                borderTop: i > 0 ? "1px solid var(--color-border)" : "none",
              }}
            >
              {/* Thumbnail with gold ring */}
              <span
                style={{
                  display: "block",
                  width: "44px",
                  height: "44px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid var(--color-accent-faint)",
                }}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={44}
                  height={44}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  unoptimized
                />
              </span>

              {/* Text */}
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "0.87rem",
                    color: "var(--color-text-primary)",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </p>
                <p
                  className="muted"
                  style={{ fontSize: "0.75rem", margin: 0, marginTop: "1px" }}
                >
                  {product.category}
                </p>
              </div>

              {/* Arrow icon tinted */}
              <span style={{ color: "var(--color-accent-primary)", display: "flex", flexShrink: 0 }}>
                <SearchHandleIcon width="16" height="16" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}