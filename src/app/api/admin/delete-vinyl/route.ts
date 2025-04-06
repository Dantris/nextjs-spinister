import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });

    try {
        await prisma.vinyl.delete({ where: { id } });
        return new Response(JSON.stringify({ message: "Vinyl deleted" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
    }
}
