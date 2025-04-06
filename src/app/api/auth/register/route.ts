import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 🔹 Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // 🔹 Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Create user in DB
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "user", // Default role is "user"
            },
        });

        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
    } catch (error) {
        console.error("🚨 Registration Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
