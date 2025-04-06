import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    console.log("✅ API | Session Data:", session);

    if (!session || session.user.role !== "admin") {
        console.error("🚨 Unauthorized | No admin session detected");
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { title, artist, genre, price, image } = await req.json();

        if (!title || !artist || !genre || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newVinyl = await prisma.vinyl.create({
            data: {
                title,
                artist,
                genre,
                price: parseFloat(price),
                image,
                adminId: session.user.id,
            },
        });

        return NextResponse.json(newVinyl, { status: 201 });
    } catch (error) {
        console.error("🚨 Vinyl Upload Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
