import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createServerClient();

    const { data: blog, error } = await supabase
        .from("blogs")
        .select("id, title, content, createdAt, author:users(name, email)")
        .eq("id", params.id)
        .single();

    if (error || !blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
}
