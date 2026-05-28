import { promises as fs } from "fs";
import path from "path";
import { fallbackSettings, mergeSettings, type AppSettings } from "@/lib/settings";

const SETTINGS_PATH = path.join(process.cwd(), "settings.json");

export async function readAppSettings(): Promise<AppSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf8");
    return mergeSettings(JSON.parse(raw) as Partial<AppSettings>);
  } catch {
    return fallbackSettings;
  }
}

export async function writeAppSettings(settings: AppSettings) {
  const safeSettings = mergeSettings(settings);
  await fs.writeFile(SETTINGS_PATH, `${JSON.stringify(safeSettings, null, 2)}\n`, "utf8");
  return safeSettings;
}
