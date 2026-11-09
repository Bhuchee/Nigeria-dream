"use node";
import { createHmac, timingSafeEqual } from "crypto";
import "server-only";

const SALT = process.env.HASH_SALT!;
const PASSCODE = process.env.ADMIN_PASSCODE!;

export function hashDevice(ip: string, userAgent: string): string {
  return createHmac("sha256", SALT).update(`${ip}|${userAgent}`).digest("hex");
}

export function signAdminCookie(value: string): string {
  const hmac = createHmac("sha256", SALT).update(value).digest("hex");
  return `${value}.${hmac}`;
}

export function verifyAdminCookie(signed: string): boolean {
  const idx = signed.lastIndexOf(".");
  if (idx <= 0) return false;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = createHmac("sha256", SALT).update(value).digest("hex");
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function isPasscodeValid(passcode: string): boolean {
  return timingSafeEqual(
    Buffer.from(passcode),
    Buffer.from(PASSCODE),
  );
}