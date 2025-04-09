import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = createServerClient();

    const { data: blogs, error } = await supabase
        .from("Blog")
        .select("id, title, content, createdAt, author:users(name, email)")
        .order("createdAt", { ascending: false });

    if (error || !blogs) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json(blogs, { status: 200 });
}
