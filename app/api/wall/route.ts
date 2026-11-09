import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkWallRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const device_hash = searchParams.get("device_hash") || "";

    if (device_hash) {
      const allowed = await checkWallRateLimit(device_hash);
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many wall views. Please slow down." },
          { status: 429 },
        );
      }
    }

    const settingRows = await sql`SELECT value FROM settings WHERE key = 'wall_enabled'`;
    const wallEnabled = settingRows.length > 0
      ? (typeof settingRows[0].value === "string" ? JSON.parse(settingRows[0].value) : settingRows[0].value) ?? true
      : true;

    if (!wallEnabled) {
      return NextResponse.json({
        lines: [],
        next_cursor: null,
        message: "The wall is taking a short break. Please check back soon.",
      });
    }

    const offset = cursor ? Number(cursor) : 0;
    const rows = await sql`
      SELECT id, text, first_name, language, style, created_at
      FROM lines
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 24 OFFSET ${offset}
    `;

    const nextCursor = rows.length === 24 ? String(offset + 24) : null;

    return NextResponse.json({
      lines: rows.map((r: any) => ({
        id: r.id,
        text: r.text,
        first_name: r.first_name,
        language: r.language,
        style: r.style,
        created_at: r.created_at,
      })),
      next_cursor: nextCursor,
    });
  } catch (err) {
    console.error("/api/wall error:", err);
    return NextResponse.json(
      { error: "Unable to load the wall. Please try again later." },
      { status: 500 },
    );
  }
}