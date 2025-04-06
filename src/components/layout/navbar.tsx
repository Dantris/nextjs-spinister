"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession(); // ✅ Get session data

    return (
        <nav className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Spinister</Link>

                <div className="flex space-x-4">
                    <Link href="/shop" className="hover:underline">Shop</Link>
                    <Link href="/cart" className="hover:underline">Cart</Link>

                    <Link href="/blog" className="text-gray-300 hover:text-white">
                        Blog
                    </Link>

                    {session?.user?.role === "admin" && (
                        <Link href="/blog/create" className="text-green-400 hover:text-white">
                            Create Blog
                        </Link>
                    )}

                    {/* ✅ Only show Admin link if user is an admin */}
                    {session?.user?.role === "admin" && (
                        <Link href="/admin" className="hover:underline text-yellow-400 font-semibold">Admin</Link>
                    )}

                    {session ? (
                        <Link href="/account" className="hover:underline">Account</Link>
                    ) : (
                        <Link href="/account" className="hover:underline">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
