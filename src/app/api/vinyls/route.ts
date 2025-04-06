import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, artist, genre, releaseYear, price, imageUrl } = await req.json();

    const newVinyl = await prisma.vinyl.create({
        data: {
            title,
            artist,
            genre,
            price,
            imageUrl,
            addedById: session.user.id,
        },
    });

    return NextResponse.json(newVinyl, { status: 201 });
}
