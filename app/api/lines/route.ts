import { NextResponse } from "next/server";
import { sql } from "@/lib/db.server";
import { filterLine } from "@/lib/filter";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, first_name, language, style, device_hash } = body;

    if (!text || !language || !style || !device_hash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["en", "pcm"].includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    const trimmed = text.trim();
    if (trimmed.length < 10 || trimmed.length > 150) {
      return NextResponse.json({ error: "Line must be between 10 and 150 characters" }, { status: 400 });
    }

    if (first_name && first_name.length > 20) {
      return NextResponse.json({ error: "Name must be 20 characters or fewer" }, { status: 400 });
    }

    const allowed = await checkRateLimit(device_hash, "lines");
    if (!allowed) {
      return NextResponse.json(
        { error: "You've shared a few lines already. Please try again later." },
        { status: 429 },
      );
    }

    const result = await filterLine(trimmed, language, device_hash);

    await sql`
      INSERT INTO lines (text, first_name, language, style, status)
      VALUES (${trimmed}, ${first_name || null}, ${language}, ${style}, ${result.status})
    `;

    return NextResponse.json({
      message: "Thanks! Your line is on its way to the wall.",
    });
  } catch (err) {
    console.error("/api/lines error:", err);
    return NextResponse.json(
      { error: "Unable to save your line. Please try again later." },
      { status: 500 },
    );
  }
}
