"use client";

import { useState } from "react";
import { RatingStars } from "@/components/product/RatingStars";
import type { Review } from "@/lib/mock-data";

type ReviewListProps = {
  reviews: Review[];
  average: number;
  count: number;
};

export function ReviewList({ reviews, average, count }: ReviewListProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const breakdown = [
    { label: "5★", value: 72 },
    { label: "4★", value: 18 },
    { label: "3★", value: 7 },
    { label: "2★", value: 2 },
    { label: "1★", value: 1 },
  ];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Rating summary — no card, no border, no bg */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.75rem 1rem",
          alignItems: "center",
          padding: "0.5rem 0",
        }}
      >
        {/* Left: big number + stars */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1 }}>
            {average.toFixed(1)}
          </span>
          <RatingStars rating={average} />
          <span style={{ fontSize: "0.7rem", color: "var(--color-muted, #888)", marginTop: "2px" }}>
            {count} reviews
          </span>
        </div>

        {/* Right: breakdown bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {breakdown.map((item) => (
            <div
              key={item.label}
              style={{ display: "grid", gridTemplateColumns: "20px 1fr 24px", gap: "6px", alignItems: "center" }}
            >
              <span style={{ fontSize: "0.68rem", color: "var(--color-muted, #888)", textAlign: "right" }}>
                {item.label}
              </span>
              <div
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--color-bar-track, #e5e2d8)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.value}%`,
                    borderRadius: "2px",
                    background: "var(--color-accent, #8a7a52)",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--color-muted, #888)" }}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section heading — compact, no subtitle clutter */}
      <div style={{ paddingTop: "0.25rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>
          Customer reviews
        </h3>
      </div>

      {/* Review list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr",
              gap: "0.65rem",
              alignItems: "start",
              paddingBottom: "0.75rem",
              borderBottom: "0.5px solid var(--color-divider, #e5e2d8)",
            }}
          >
            {/* Avatar */}
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--color-avatar-bg, #e9e3d5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--color-avatar-text, #6b5c3e)",
                flexShrink: 0,
              }}
            >
              {review.author
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </span>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{review.author}</span>
                <RatingStars rating={review.rating} />
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--color-muted, #888)" }}>{review.date}</span>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.5, margin: 0, marginTop: "3px" }}>
                {review.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View more — inline text button below last review, no box */}
      {reviews.length > 1 ? (
        <button
          type="button"
          onClick={() => setShowAllReviews((c) => !c)}
          style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: "var(--color-accent, #8a7a52)",
            cursor: "pointer",
            padding: "0.1rem 0",
          }}
        >
          {showAllReviews ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 9L7 5L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Show less
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              View {reviews.length - 1} more {reviews.length - 1 === 1 ? "review" : "reviews"}
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}