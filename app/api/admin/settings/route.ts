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
    const rows = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, any> = {};
    for (const row of rows) {
      settings[row.key] = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
    }
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("/api/admin/settings error:", err);
    return NextResponse.json({ error: "Unable to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await checkAuth();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${JSON.stringify(value)})
      ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/admin/settings error:", err);
    return NextResponse.json({ error: "Unable to save settings" }, { status: 500 });
  }
}
