"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSettings } from "@/components/providers/SettingsProvider";
import {
  DashboardIcon,
  LogoutIcon,
  PackageIcon,
  PaletteIcon,
  SettingsIcon,
} from "@/components/ui/Icons";

const links = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/products", label: "Products", icon: PackageIcon },
  { href: "/admin/orders", label: "Orders", icon: DashboardIcon },
  { href: "/admin/slider", label: "Slider", icon: PackageIcon },
  { href: "/admin/appearance", label: "Appearance", icon: PaletteIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    settings: { website },
  } = useSettings();

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" style={{ display: "inline-flex", gap: "0.9rem", alignItems: "center" }}>
        <span className="logo-mark" style={{ width: 48, height: 48 }}>
          <Image
            src={website.logoUrl}
            alt={website.siteName}
            width={48}
            height={48}
            unoptimized
          />
        </span>
        <span className="brand-copy">
          <strong style={{ fontSize: "1rem" }}>{website.siteName}</strong>
          <span>Control center</span>
        </span>
      </Link>
      <nav>
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-sidebar-link${active ? " active" : ""}`}
            >
              <Icon width="18" height="18" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
        <button
          type="button"
          className="admin-sidebar-link"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
          }}
        >
          <LogoutIcon width="18" height="18" />
          Logout
        </button>
      </div>
    </aside>
  );
}
