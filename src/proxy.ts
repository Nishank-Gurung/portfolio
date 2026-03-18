import { NextRequest, NextResponse } from "next/server";
import { ADMIN_DEFAULT_REDIRECT_URL } from "./config/constant";

import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const path = req.nextUrl.pathname;

    let isLoggedIn = false;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET!);
            isLoggedIn = true;
        } catch (err) {
            isLoggedIn = false;
            console.error("Token verification failed:", err);
        }
    }

    if (path.startsWith("/admin")) {
        if (path === "/admin") {
            if (isLoggedIn) {
                return NextResponse.redirect(
                    new URL(ADMIN_DEFAULT_REDIRECT_URL, req.url),
                );
            }
            return NextResponse.next();
        }

        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    return NextResponse.next();
}
