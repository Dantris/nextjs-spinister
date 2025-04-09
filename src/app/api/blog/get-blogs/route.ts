import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            include: { author: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(blogs, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
