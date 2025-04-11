import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
        .from("Blog")
        .insert([
            {
                title,
                content,
                author_id: session.user.id, // 👈 MATCHES Supabase column
            },
        ])
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
