import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminCookie } from "./lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = req.cookies.get("admin_session")?.value;
    if (!session || !verifyAdminCookie(session)) {
      const loginUrl = new URL("/admin", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};