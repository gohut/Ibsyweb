import { NextResponse } from "next/server";
import { mergeSettings, type AppSettings } from "@/lib/settings";
import { readAppSettings, writeAppSettings } from "@/lib/settings.server";

export const runtime = "nodejs";

export async function GET() {
  const settings = await readAppSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as Partial<AppSettings>;
  const currentSettings = await readAppSettings();
  const nextSettings = mergeSettings({
    website: {
      ...currentSettings.website,
      ...payload.website,
    },
    admin: {
      ...currentSettings.admin,
      ...payload.admin,
    },
  });

  const savedSettings = await writeAppSettings(nextSettings);
  return NextResponse.json(savedSettings);
}
