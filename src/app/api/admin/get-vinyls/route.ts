import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = createServerClient();

    const { data: vinyls, error } = await supabase
        .from("Vinyl")
        .select("id, title, artist, genre, price, image");

    if (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json(vinyls, { status: 200 });
}
