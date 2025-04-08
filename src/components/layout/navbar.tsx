"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                    Spinister
                </Link>

                <nav className="flex items-center gap-5 text-sm font-medium">
                    <Link href="/shop" className="hover:underline">Shop</Link>
                    <Link href="/cart" className="hover:underline">Cart</Link>
                    <Link href="/blog" className="text-gray-500 dark:text-gray-300 hover:underline">Blog</Link>

                    {session?.user?.role === "admin" && (
                        <>
                            <Link href="/blog/create" className="text-green-500 hover:text-green-600">Create</Link>
                            <Link href="/admin" className="text-yellow-500 hover:text-yellow-600">Admin</Link>
                            <Link
                                href="/admin/orders"
                                className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-3 py-1 rounded-full font-semibold text-xs"
                            >
                                Admin Orders
                            </Link>
                        </>
                    )}

                    <Link href="/account" className="hover:underline">
                        {session ? "Account" : "Login"}
                    </Link>

                    <DarkModeToggle />
                </nav>
            </div>
        </header>
    );
}
