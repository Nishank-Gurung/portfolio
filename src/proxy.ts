import { NextRequest, NextResponse } from "next/server";
import { ADMIN_DEFAULT_REDIRECT_URL } from "./config/constant";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const path = req.nextUrl.pathname
     const isLoggedIn = Boolean(token)
    // Protect /admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {

        if (path === '/admin') {
      // If already logged in, redirect to admin dashboard
      if (isLoggedIn) {
        return NextResponse.redirect(
          new URL(ADMIN_DEFAULT_REDIRECT_URL, req.url)
        )
      }
      // If not logged in, allow access to login page
      return NextResponse.next()
    }

    // For all other admin routes
    if (!isLoggedIn) {
      // If not logged in, redirect to admin login page
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
