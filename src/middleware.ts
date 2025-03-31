import { NextRequest, NextResponse } from "next/server";

// Define Middleware Function
export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token"); // Example: Check for auth token

    // 🚨 Instead of redirecting, show a normal page even if not logged in
    if (!token && req.nextUrl.pathname.startsWith("/account")) {
        return NextResponse.next(); // Allow access to /account even if not authenticated
    }

    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url)); // Keep dashboard protected
    }

    return NextResponse.next(); // Continue if authorized
}

// ✅ Tell Next.js which paths should use this middleware
export const config = {
    matcher: ["/dashboard/:path*"], // Keep dashboard protected, but remove /account from middleware
};
