"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/components/providers/SettingsProvider";

export function Footer() {
  const {
    settings: { website, admin },
  } = useSettings();

  return (
    <footer
      style={{
        padding: "2.5rem 1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Top: Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            display: "block",
            position: "relative",
          }}
        >
          <Image
            src={website.logoUrl}
            alt={website.siteName}
            fill
            sizes="42px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </span>
        <div>
          <p
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--color-heading, #5c4a1e)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {website.siteName}
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--color-muted, #9a8c6e)",
              margin: 0,
              marginTop: "1px",
            }}
          >
            {website.tagline}
          </p>
        </div>
      </div>

      {/* Middle: two-column link grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem 1rem",
        }}
      >
        {/* Connect */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-muted, #9a8c6e)",
              margin: 0,
            }}
          >
            Connect
          </p>
          <a
            href={website.instagramUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            {website.instagramHandle}
          </a>
          <a
            href={`mailto:${admin.contactEmail}`}
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            {admin.contactEmail}
          </a>
        </div>

        {/* Legal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-muted, #9a8c6e)",
              margin: 0,
            }}
          >
            Legal
          </p>
          <Link
            href={website.termsUrl}
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/refunds"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            Refund Policy
          </Link>
        </div>

        {/* Shop */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-muted, #9a8c6e)",
              margin: 0,
            }}
          >
            Shop
          </p>
          <Link
            href="/products"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            All Products
          </Link>
          <Link
            href="/collections"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            Collections
          </Link>
          <Link
            href="/new-arrivals"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            New Arrivals
          </Link>
        </div>

        {/* Help */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-muted, #9a8c6e)",
              margin: 0,
            }}
          >
            Help
          </p>
          <Link
            href="/faq"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            Contact Us
          </Link>
          <Link
            href="/downloads"
            style={{
              fontSize: "0.82rem",
              color: "var(--color-body, #4a3f28)",
              textDecoration: "none",
            }}
          >
            My Downloads
          </Link>
        </div>
      </div>

      {/* Bottom: copyright strip */}
      <div
        style={{
          paddingTop: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          opacity: 0.55,
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--color-body, #4a3f28)" }}>
          © {new Date().getFullYear()} {website.copyrightName}. All rights reserved.
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--color-body, #4a3f28)" }}>
          Made with care ✦
        </span>
      </div>
    </footer>
  );
}