import { NextResponse, NextRequest } from "next/server";
import { sql } from "@/lib/db.server";
import { verifyAdminCookie } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function checkAuth(): Promise<NextResponse | null> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  if (!session || !verifyAdminCookie(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const rows = await sql`SELECT id, term, language, kind FROM blocked_terms ORDER BY kind, term`;
    return NextResponse.json({ terms: rows });
  } catch (err) {
    console.error("/api/admin/terms error:", err);
    return NextResponse.json({ error: "Unable to load terms" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { term, language, kind } = body;

    if (!term || !kind) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["block_word", "block_pattern", "watch_term"].includes(kind)) {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    await sql`
      INSERT INTO blocked_terms (term, language, kind)
      VALUES (${term}, ${language || null}, ${kind})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/admin/terms error:", err);
    return NextResponse.json({ error: "Unable to add term" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await sql`DELETE FROM blocked_terms WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/admin/terms delete error:", err);
    return NextResponse.json({ error: "Unable to delete term" }, { status: 500 });
  }
}
