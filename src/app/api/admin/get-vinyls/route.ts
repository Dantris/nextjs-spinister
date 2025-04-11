// src/app/api/admin/get-vinyls/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
    const { data: vinyls, error } = await supabase
        .from("Vinyl")
        .select("id, title, artist, genre, price, image");

    if (error) {
        console.error("[Vinyl fetch error]", error);
        return NextResponse.json({ error: "Failed to fetch vinyls" }, { status: 500 });
    }

    return NextResponse.json(vinyls, { status: 200 });
}
