// src/app/api/debug/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING URL",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Exists" : "❌ Missing",
    });
}
