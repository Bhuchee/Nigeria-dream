import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a longer message." }, { status: 400 });
    }

    await sql`
      INSERT INTO takedown_requests (message, status)
      VALUES (${message.trim()}, 'open')
    `;

    return NextResponse.json({ ok: true, message: "Takedown request received." });
  } catch (err) {
    console.error("/api/takedown error:", err);
    return NextResponse.json(
      { error: "Unable to submit request. Please try again later." },
      { status: 500 },
    );
  }
}