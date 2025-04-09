import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, artist, genre, price, image } = await req.json();

    if (!title || !artist || !genre || !price) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.from("Vinyl").insert([
        {
            title,
            artist,
            genre,
            price: parseFloat(price),
            image,
            adminId: session.user.id,
        },
    ]).select().single();

    if (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
