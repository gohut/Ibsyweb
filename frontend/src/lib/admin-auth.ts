import { createHash, timingSafeEqual } from "crypto";
import type { AdminSettings } from "@/lib/settings";

export const ADMIN_COOKIE_NAME = "ibsy-admin-token";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function createAdminSessionToken(admin: AdminSettings) {
  return createHash("sha256")
    .update(`${admin.username}::${admin.password}::ibsy-admin`)
    .digest("hex");
}

export function isSafeCredentialInput(value: string) {
  return value.length > 0 && value.length <= 128 && !/[\0\r\n\t]/.test(value);
}

export function verifyAdminCredentials(
  username: string,
  password: string,
  admin: AdminSettings,
) {
  if (!isSafeCredentialInput(username) || !isSafeCredentialInput(password)) {
    return false;
  }

  const expected = digest(`${admin.username}::${admin.password}`);
  const received = digest(`${username.trim()}::${password}`);

  return timingSafeEqual(expected, received);
}
