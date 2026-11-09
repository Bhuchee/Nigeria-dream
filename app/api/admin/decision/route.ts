import { NextResponse, NextRequest } from "next/server";
import { sql } from "@/lib/db";
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

export async function POST(req: NextRequest) {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { line_id, decision, bulk_ids } = body;

    if (bulk_ids && Array.isArray(bulk_ids)) {
      await sql`
        UPDATE lines SET status = ${decision}, reviewed_at = NOW()
        WHERE id = ANY(${bulk_ids})
      `;
      return NextResponse.json({ ok: true, count: bulk_ids.length });
    }

    if (!line_id || !decision) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["approved", "rejected", "removed"].includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    await sql`
      UPDATE lines SET status = ${decision}, reviewed_at = NOW()
      WHERE id = ${line_id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/admin/decision error:", err);
    return NextResponse.json({ error: "Unable to process decision" }, { status: 500 });
  }
}