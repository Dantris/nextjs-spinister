// src/app/api/admin/get-vinyls/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: vinyls, error } = await supabase
        .from("Vinyl")
        .select("id, title, artist, genre, price, image");

    if (error) {
        console.error("[Vinyl fetch error]", error);
        return NextResponse.json({ error: "Failed to fetch vinyls" }, { status: 500 });
    }

    return NextResponse.json(vinyls, { status: 200 });
}
