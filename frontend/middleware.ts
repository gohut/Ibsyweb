import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/library", "/checkout"];
const ADMIN_PATH = "/admin";
const ADMIN_LOGIN = "/admin/login";
const ADMIN_COOKIE_NAME = "ibsy-admin-token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("ibsy-session")?.value;
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  const requiresUserAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const requiresAdmin = pathname.startsWith(ADMIN_PATH) && pathname !== ADMIN_LOGIN;

  if (requiresUserAuth && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (requiresAdmin && !adminCookie) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*", "/checkout/:path*", "/admin/:path*"],
};
