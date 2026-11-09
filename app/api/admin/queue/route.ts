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

export async function GET(req: NextRequest) {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "pending";

    let rows;
    if (type === "reported") {
      rows = await sql`
        SELECT l.id, l.text, l.first_name, l.language, l.style, l.created_at,
               r.id as report_id
        FROM lines l
        LEFT JOIN reports r ON r.line_id = l.id AND r.status = 'open'
        WHERE l.status = 'pending' OR r.id IS NOT NULL
        ORDER BY l.created_at ASC
      `;
    } else {
      rows = await sql`
        SELECT l.id, l.text, l.first_name, l.language, l.style, l.created_at,
               COUNT(r.id) as report_count
        FROM lines l
        LEFT JOIN reports r ON r.line_id = l.id
        WHERE l.status = 'pending'
        GROUP BY l.id, l.text, l.first_name, l.language, l.style, l.created_at
        ORDER BY l.created_at ASC
      `;
    }

    const waiting = await sql`SELECT COUNT(*) as cnt FROM lines WHERE status = 'pending'`;
    const longestWait = await sql`
      SELECT created_at FROM lines WHERE status = 'pending'
      ORDER BY created_at ASC LIMIT 1
    `;

    return NextResponse.json({
      lines: rows.map((r: any) => ({
        id: r.id,
        text: r.text,
        first_name: r.first_name,
        language: r.language,
        style: r.style,
        created_at: r.created_at,
        report_count: Number(r.report_count || 0),
      })),
      waiting: Number(waiting[0].cnt),
      longest_wait: longestWait.length > 0 ? longestWait[0].created_at : null,
    });
  } catch (err) {
    console.error("/api/admin/queue error:", err);
    return NextResponse.json({ error: "Unable to load queue" }, { status: 500 });
  }
}