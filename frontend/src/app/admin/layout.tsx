import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { BellIcon, UserIcon } from "@/components/ui/Icons";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/admin-auth";
import { readAppSettings } from "@/lib/settings.server";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const settings = await readAppSettings();
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!adminToken || adminToken !== createAdminSessionToken(settings.admin)) {
    redirect("/admin/login");
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
