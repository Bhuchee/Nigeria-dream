import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rows = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, any> = {};
    for (const row of rows) {
      settings[row.key] = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
    }

    return NextResponse.json({
      hashtags: settings.hashtags || ["#NigeriaOfMyDream", "#MyNaijaDream", "#GenZNDC"],
      show_ndc_mark: settings.show_ndc_mark ?? false,
      wall_enabled: settings.wall_enabled ?? true,
      site_url: settings.site_url || process.env.SITE_URL || "",
    });
  } catch (err) {
    console.error("/api/config error:", err);
    return NextResponse.json(
      { error: "Unable to load settings. Please try again later." },
      { status: 500 },
    );
  }
}