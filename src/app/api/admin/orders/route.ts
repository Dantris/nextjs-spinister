import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const token = await getToken({ req });

    if (!token || token.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    const { data: orders } = await supabase
        .from("orders")
        .select("*, users(name, email)")
        .order("createdAt", { ascending: false });

    return NextResponse.json(
        (orders || []).map((order) => ({
            ...order,
            user: order.users ?? null,
        }))
    );
}
