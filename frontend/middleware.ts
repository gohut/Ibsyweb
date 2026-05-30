import { NextResponse, type NextRequest } from "next/server";
import { fallbackSettings } from "@/lib/settings";

export const runtime = "edge";

const PROTECTED_PATHS = ["/library", "/checkout"];
const ADMIN_PATH = "/admin";
const ADMIN_LOGIN = "/admin/login";
const ADMIN_COOKIE_NAME = "ibsy-admin-token";

async function createAdminSessionToken(admin: { username: string; password: string }) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${admin.username}::${admin.password}::ibsy-admin`),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("middleware", pathname);
  const sessionCookie = request.cookies.get("ibsy-session")?.value;
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  const requiresUserAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const requiresAdmin = pathname.startsWith(ADMIN_PATH) && pathname !== ADMIN_LOGIN;

  if (requiresUserAuth && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (requiresAdmin) {
    const expectedToken = await createAdminSessionToken(fallbackSettings.admin);

    if (!adminCookie || adminCookie !== expectedToken) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*", "/checkout/:path*", "/admin", "/admin/:path*"],
};
