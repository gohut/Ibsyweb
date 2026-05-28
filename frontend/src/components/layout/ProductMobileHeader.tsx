"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/components/providers/AppStateProvider";
import { CartIcon, ChevronLeftIcon } from "@/components/ui/Icons";

export function ProductMobileHeader() {
  const router = useRouter();
  const { cartItems } = useAppState();

  return (
    <header className="app-header mobile-only">
      <div className="header-inner">
        <div className="product-mobile-header">
          <button
            type="button"
            className="icon-button"
            aria-label="Go back"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
                return;
              }

              router.push("/");
            }}
          >
            <ChevronLeftIcon />
          </button>
          <span className="product-mobile-header-spacer" aria-hidden="true" />
          <Link href="/cart" className="icon-button" aria-label="View cart">
            <CartIcon />
            <span className="badge-count">{cartItems.length}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
