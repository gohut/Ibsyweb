import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { readAppSettings } from "@/lib/settings.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";
  const settings = await readAppSettings();

  if (!verifyAdminCredentials(username, password, settings.admin)) {
    return NextResponse.json(
      { message: "Invalid admin credentials." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminSessionToken(settings.admin),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
