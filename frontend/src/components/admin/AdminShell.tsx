"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { BellIcon, UserIcon } from "@/components/ui/Icons";
import { fallbackSettings, type AppSettings } from "@/lib/settings";

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<AppSettings>(fallbackSettings);

  useEffect(() => {
    let active = true;

    fetch("/api/settings")
      .then((response) => (response.ok ? response.json() : fallbackSettings))
      .then((data: AppSettings) => {
        if (active) {
          setSettings(data);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell page-fade">
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-row">
              <div>
                <p className="eyebrow">Admin workspace</p>
                <h1 className="display-heading" style={{ fontSize: "1.8rem" }}>
                  {settings.website.siteName} Dashboard
                </h1>
              </div>
              <div className="header-actions">
                <button className="icon-button" aria-label="Notifications">
                  <BellIcon />
                </button>
                <span className="icon-button" aria-hidden="true">
                  <UserIcon />
                </span>
              </div>
            </div>
          </header>
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
