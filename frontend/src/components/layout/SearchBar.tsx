"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
};

type SearchBarProps = {
  compact?: boolean;
};

export function SearchBar({ compact = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  // Fetch from real API with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(trimmed)}&limit=6`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        // Support both { products: [...] } and [...] response shapes
        const list: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];
        setResults(list);
        setIsOpen(list.length > 0);
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shellRef.current && !shellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="search-shell" ref={shellRef}>
      {/* ── Search box ── */}
      <div
        className="search-box"
        style={{
          maxWidth: compact ? 480 : undefined,
          width: "100%",
          minHeight: compact ? "42px" : "52px",
          padding: compact ? "0 0.5rem 0 0.85rem" : "0 0.5rem 0 1rem",
        }}
      >
        {/* Magnifier icon — inline SVG, no external dependency */}
        <span
          style={{
            color: "var(--color-accent-primary)",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8.5" cy="8.5" r="5.75" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
          </svg>
        </span>

        {/* Spinner shown while fetching */}
        {isLoading && (
          <span
            style={{
              position: "absolute",
              left: compact ? "0.85rem" : "1rem",
              display: "flex",
              alignItems: "center",
              color: "var(--color-accent-primary)",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              style={{ animation: "spin 0.75s linear infinite" }}
            >
              <path d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="16 48" />
            </svg>
          </span>
        )}

        <input
          aria-label="Search products"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          style={{ fontSize: compact ? "0.875rem" : "1rem" }}
          autoComplete="off"
        />

        {/* Clear button */}
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            style={{
              flexShrink: 0,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "var(--transition-base)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {isOpen && results.length > 0 && (
        <div className="search-dropdown surface-card">
          <div className="search-dropdown-header">
            <span className="search-dropdown-label">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
            <button
              aria-label="Close results"
              onClick={() => setIsOpen(false)}
              className="search-dropdown-close"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="11" y2="11" />
                <line x1="11" y1="1" x2="1" y2="11" />
              </svg>
            </button>
          </div>

          <div className="search-result-list">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="search-result"
                onClick={handleSelect}
              >
                {/* Thumbnail */}
                <span className="search-result-thumb">
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
                  <p className="search-result-name">{product.name}</p>
                  <p className="search-result-category">{product.category}</p>
                </div>

                {/* Chevron */}
                <span className="search-result-chevron">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="5,2 11,8 5,14" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}