"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { CartIcon } from "@/components/ui/Icons";

export function Navbar({
  variant = "default",
}: {
  variant?: "default" | "product";
}) {
  const { cartItems } = useAppState();
  const {
    settings: { website },
  } = useSettings();

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className={`minimal-navbar${variant === "product" ? " product-navbar-desktop" : ""}`}>

          {/* Brand */}
          <Link href="/" className="minimal-brand" aria-label={website.siteName}>
            <span
              style={{
                width: "36px",
                height: "36px",
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
                sizes="36px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </span>
            {/* <span className="brand-name">{website.siteName}</span> */}
          </Link>

          {/* Search */}
          <div className={`navbar-search-slot${variant === "product" ? " product-search-slot" : ""}`}>
            <SearchBar compact />
          </div>

          {/* Cart */}
          <Link href="/cart" className="icon-button" aria-label="View cart">
            <CartIcon />
            {cartItems.length > 0 && (
              <span
                className="badge-count"
                style={{
                  background: "var(--color-accent-primary)",
                  color: "var(--color-accent-contrast)",
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
}