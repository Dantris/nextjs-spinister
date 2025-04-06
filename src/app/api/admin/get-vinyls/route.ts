import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const vinyls = await prisma.vinyl.findMany({
            select: {
                id: true,
                title: true,
                artist: true,
                genre: true,
                price: true,
                image: true,
            },
        });

        return NextResponse.json(vinyls, { status: 200 });
    } catch (error) {
        console.error("🚨 Error fetching vinyls:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
