"use client";

import { useEffect, useState } from "react";
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
                const res = await fetch("/api/admin/get-vinyls"); // ✅ Make sure this route exists
                if (!res.ok) throw new Error("Failed to fetch vinyls");

                const data = await res.json();
                setVinyls(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchVinyls();
    }, []);

    if (loading) return <p className="text-center">Loading vinyls...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🎵 Shop Vinyl Records</h1>

            {vinyls.length === 0 ? (
                <p className="text-center text-gray-500">No vinyls available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {vinyls.map((record) => (
                        <Link
                            key={record.id}
                            href={`/shop/${record.id}`}
                            className="bg-white shadow-md p-4 rounded-lg hover:shadow-xl transition"
                        >
                            <img
                                src={record.image || "https://via.placeholder.com/200"}
                                alt={record.title}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <h2 className="mt-2 text-xl font-semibold">{record.title}</h2>
                            <p className="text-gray-500">{record.artist}</p>
                            <p className="text-lg font-bold mt-2">${record.price.toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
