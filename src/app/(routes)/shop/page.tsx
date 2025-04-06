"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

type Vinyl = {
    id: string;
    title: string;
    artist: string;
    genre: string;
    price: number;
    image?: string;
};

export default function ProductPage() {
    const params = useParams();
    const [vinyl, setVinyl] = useState<Vinyl | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) {
            setError("Invalid vinyl ID");
            return;
        }

        async function fetchVinyl() {
            try {
                console.log("🔍 Fetching vinyl from API:", `/api/admin/get-vinyl/${params.id}`);
                const res = await fetch(`/api/admin/get-vinyl/${params.id}`); // ✅ Fixed API Route

                if (!res.ok) {
                    throw new Error("Vinyl not found");
                }

                const data: Vinyl = await res.json();
                console.log("✅ Vinyl fetched successfully:", data);
                setVinyl(data);
            } catch (err: any) {
                console.error("🚨 Error fetching vinyl:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchVinyl();
    }, [params.id]);

    if (loading) return <p className="text-center">Loading vinyl details...</p>;
    if (error) return notFound(); // Shows 404 page if vinyl not found

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                    src={vinyl?.image || "https://via.placeholder.com/400"}
                    alt={vinyl?.title}
                    className="w-64 h-64 object-cover rounded-md"
                />

                <div>
                    <h1 className="text-3xl font-bold">{vinyl?.title}</h1>
                    <p className="text-gray-500">{vinyl?.artist}</p>
                    <p className="text-gray-500">Genre: {vinyl?.genre}</p>
                    <p className="text-2xl font-bold mt-4">${vinyl?.price.toFixed(2)}</p>

                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                        Add to Cart 🛒
                    </button>
                </div>
            </div>
        </main>
    );
}
