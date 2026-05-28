"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import {
  CartIcon,
  HomeIcon,
  LibraryIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/Icons";

const tabs = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/cart", label: "Cart", icon: CartIcon },
  { href: "/library", label: "Library", icon: LibraryIcon },
  { href: "/login", label: "Profile", icon: UserIcon },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const { cartItems } = useAppState();

  return (
    <div className="tab-bar mobile-only">
      <nav>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-link${active ? " active" : ""}`}
            >
              <span style={{ position: "relative" }}>
                <Icon width="18" height="18" />
                {tab.href === "/cart" && cartItems.length ? (
                  <span className="badge-count" style={{ top: -10, right: -14 }}>
                    {cartItems.length}
                  </span>
                ) : null}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
