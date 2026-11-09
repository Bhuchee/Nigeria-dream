import { NextResponse } from "next/server";
import { sql } from "@/lib/db.server";
import { hashDevice } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, language, style, device_hash } = body;

    if (!name || !device_hash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const allowed = await checkRateLimit(device_hash, "events");
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many events. Please slow down." },
        { status: 429 },
      );
    }

    await sql`
      INSERT INTO events (name, language, style, device_hash)
      VALUES (${name}, ${language || null}, ${style || null}, ${device_hash})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/events error:", err);
    return NextResponse.json(
      { error: "Unable to record event. Please try again later." },
      { status: 500 },
    );
  }
}
