import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { line_id } = body;

    if (!line_id) {
      return NextResponse.json({ error: "Missing line_id" }, { status: 400 });
    }

    await sql`
      INSERT INTO reports (line_id, reason, status)
      VALUES (${line_id}, 'user_report', 'open')
    `;

    return NextResponse.json({ ok: true, message: "Report submitted." });
  } catch (err) {
    console.error("/api/report error:", err);
    return NextResponse.json(
      { error: "Unable to submit report. Please try again later." },
      { status: 500 },
    );
  }
}