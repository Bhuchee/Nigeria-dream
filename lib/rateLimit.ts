import "server-only";
import { sql } from "./db";

const LIMITS: Record<string, { count: number; windowHours: number }> = {
  lines: { count: 5, windowHours: 1 },
  events: { count: 120, windowHours: 1 },
};

export async function checkRateLimit(
  deviceHash: string,
  type: "lines" | "events",
): Promise<{ allowed: boolean; remaining: number }> {
  const limit = LIMITS[type];
  const windowStart = new Date(Date.now() - limit.windowHours * 60 * 60 * 1000);

  if (type === "lines") {
    const rows = await sql`
      SELECT COUNT(*) as cnt FROM lines
      WHERE device_hash = ${deviceHash} AND created_at > ${windowStart}
    `;
    const used = Number(rows[0].cnt);
    return { allowed: used < limit.count, remaining: Math.max(0, limit.count - used) };
  }

  if (type === "events") {
    const rows = await sql`
      SELECT COUNT(*) as cnt FROM events
      WHERE device_hash = ${deviceHash} AND created_at > ${windowStart}
    `;
    const used = Number(rows[0].cnt);
    return { allowed: used < limit.count, remaining: Math.max(0, limit.count - used) };
  }

  return { allowed: true, remaining: 0 };
}

export async function checkWallRateLimit(deviceHash: string): Promise<{ allowed: boolean }> {
  const minuteAgo = new Date(Date.now() - 60 * 1000);
  // We track wall views via events, count recent ones
  const rows = await sql`
    SELECT COUNT(*) as cnt FROM events
    WHERE device_hash = ${deviceHash} AND name = 'wall_view' AND created_at > ${minuteAgo}
  `;
  const used = Number(rows[0].cnt);
  return { allowed: used < 60 };
}