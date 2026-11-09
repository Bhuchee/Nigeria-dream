import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const CACHE_TTL_MS = 30000;
let cache: { value: number; ts: number } | null = null;

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL_MS) {
    return NextResponse.json({ count: cache.value });
  }

  try {
    const rows = await sql`
      SELECT COUNT(*) as cnt FROM events WHERE name = 'card_created'
    `;
    const eventCount = Number(rows[0].cnt);

    const settingRows = await sql`SELECT value FROM settings WHERE key = 'counter_offset'`;
    const offset = settingRows.length > 0
      ? (typeof settingRows[0].value === "string" ? JSON.parse(settingRows[0].value) : settingRows[0].value) || 0
      : 0;

    const total = eventCount + Number(offset);
    cache = { value: total, ts: now };

    return NextResponse.json({ count: total });
  } catch (err) {
    console.error("/api/counter error:", err);
    return NextResponse.json(
      { error: "Unable to load counter. Please try again later." },
      { status: 500 },
    );
  }
}