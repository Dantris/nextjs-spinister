import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: params.id },
            include: { author: { select: { name: true, email: true } } },
        });

        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
