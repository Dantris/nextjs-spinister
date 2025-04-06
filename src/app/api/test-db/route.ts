import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST() {
    try {
        const newUser = await prisma.user.create({
            data: {
                name: "Test User",
                email: `test${Math.floor(Math.random() * 1000)}@example.com`, // Avoid duplicate emails
            },
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
