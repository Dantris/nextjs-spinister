import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Missing vinyl ID" }, { status: 400 });
    }

    try {
        const vinyl = await prisma.vinyl.findUnique({
            where: { id },
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

        return NextResponse.json(vinyl, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
