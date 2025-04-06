import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log("🔍 Fetching vinyl with ID:", params.id);

        if (!params.id) {
            return NextResponse.json({ error: "Missing vinyl ID" }, { status: 400 });
        }

        const vinyl = await prisma.vinyl.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                title: true,
                artist: true,
                genre: true,
                price: true,
                image: true,
            },
        });

        if (!vinyl) {
            return NextResponse.json({ error: "Vinyl not found" }, { status: 404 });
        }

        console.log("✅ Vinyl found:", vinyl);
        return NextResponse.json(vinyl, { status: 200 });
    } catch (error) {
        console.error("🚨 Error fetching vinyl:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
