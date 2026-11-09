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

export async function GET() {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM events WHERE name = 'page_view' AND created_at > ${today}) as visits,
        (SELECT COUNT(*) FROM events WHERE name = 'line_started' AND created_at > ${today}) as lines_started,
        (SELECT COUNT(*) FROM events WHERE name = 'card_created' AND created_at > ${today}) as cards_created,
        (SELECT COUNT(*) FROM events WHERE name = 'name_added' AND created_at > ${today}) as name_added,
        (SELECT COUNT(*) FROM events WHERE name = 'photo_added' AND created_at > ${today}) as photo_added,
        (SELECT COUNT(*) FROM events WHERE name = 'share_whatsapp' OR name = 'share_x' OR name = 'share_sheet' OR name = 'download' OR name = 'copy_caption' AND created_at > ${today}) as share_attempts,
        (SELECT COUNT(*) FROM events WHERE name = 'wall_opt_in' AND created_at > ${today}) as wall_opt_ins,
        (SELECT COUNT(*) FROM reports WHERE status = 'open') as reports,
        (SELECT COUNT(*) FROM lines WHERE status = 'pending') as pending_lines,
        (SELECT COUNT(*) FROM lines WHERE status = 'approved') as approved_lines;
    `;

    return NextResponse.json({ stats: stats[0] });
  } catch (err) {
    console.error("/api/admin/stats error:", err);
    return NextResponse.json({ error: "Unable to load stats" }, { status: 500 });
  }
}