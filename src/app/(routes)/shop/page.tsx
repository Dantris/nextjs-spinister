"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Vinyl = {
    id: string;
    title: string;
    artist: string;
    genre: string;
    price: number;
    image?: string;
};

export default function ShopPage() {
    const [vinyls, setVinyls] = useState<Vinyl[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVinyls() {
            try {
                const res = await fetch("/api/admin/get-vinyls");
                if (!res.ok) throw new Error("Failed to fetch vinyls");

                const data = await res.json();
                setVinyls(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message);
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchVinyls();
    }, []);

    if (loading) return <p className="text-center py-20 text-gray-500">Loading vinyls...</p>;
    if (error) return <p className="text-center text-red-500 py-20 font-semibold">❌ {error}</p>;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-12">
            {/* 🔥 Heading */}
            <h1 className="text-4xl font-extrabold text-center mb-10">
                <span className="bg-gradient-to-r from-violet-500 to-pink-400 text-transparent bg-clip-text">
                    Explore Vinyl Records
                </span>
            </h1>

            {/* 🛍️ Grid */}
            {vinyls.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">No records found. Stay tuned!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {vinyls.map((record) => (
                        <Link
                            key={record.id}
                            href={`/shop/${record.id}`}
                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
                        >
                            <Image
                                src={record.image || "https://via.placeholder.com/300"}
                                alt={record.title}
                                className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-5">
                                <h2 className="text-xl font-semibold">{record.title}</h2>
                                <p className="text-gray-500 dark:text-gray-400">{record.artist}</p>

                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-bold text-violet-500 dark:text-violet-400">
                                        €{record.price.toFixed(2)}
                                    </span>
                                    <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300">
                                        {record.genre}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
