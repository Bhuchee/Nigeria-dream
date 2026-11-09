import { NextResponse, NextRequest } from "next/server";
import { isPasscodeValid, signAdminCookie } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode) {
      return NextResponse.json({ error: "Passcode required" }, { status: 400 });
    }

    if (!isPasscodeValid(passcode)) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const signed = signAdminCookie("admin");
    const store = await cookies();
    store.set("admin_session", signed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/admin/login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}