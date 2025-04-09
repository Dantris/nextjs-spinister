import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // Extract the ID from the URL
        const id = req.nextUrl.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ error: "Missing vinyl ID" }, { status: 400 });
        }

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

        return NextResponse.json(vinyl);
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}