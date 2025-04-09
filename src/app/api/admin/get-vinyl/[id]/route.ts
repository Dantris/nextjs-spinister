import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createServerClient();
    const { id } = params;

    const { data: vinyl, error } = await supabase
        .from("vinyls")
        .select("id, title, artist, genre, price, image")
        .eq("id", id)
        .single();

    if (error || !vinyl) {
        return NextResponse.json({ error: "Vinyl not found" }, { status: 404 });
    }

    return NextResponse.json(vinyl, { status: 200 });
}
