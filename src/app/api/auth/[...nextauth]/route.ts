import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("✅ Received login attempt:", credentials);

                if (!credentials?.email || !credentials?.password) {
                    console.error("🚨 Missing email or password.");
                    return null;
                }

                // 🔹 Find user in the database
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        password: true,
                        role: true,
                    },
                });

                console.log("🔍 Found user in database:", user);

                // 🔹 If no user is found, reject login
                if (!user) {
                    console.error("🚨 No user found with this email.");
                    return null;
                }

                // 🔹 If password is missing (e.g., Google login), reject login
                if (!user.password) {
                    console.error("🚨 User has no password set. Use Google login.");
                    return null;
                }

                // 🔹 Compare password using bcrypt
                const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                console.log("🔍 Password match:", passwordMatch);

                if (!passwordMatch) {
                    console.error("🚨 Incorrect password.");
                    return null;
                }

                console.log("✅ Login successful! Returning user:", user.email);

                // ✅ Return only safe user data
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role as "admin" | "user",
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role as "admin" | "user";
            }
            console.log("✅ JWT Token:", token);
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "user";
            }
            console.log("✅ Final Session:", session);
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
