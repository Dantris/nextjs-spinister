"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import Image from 'next/image'
import toast from "react-hot-toast";

type Vinyl = {
    id: string;
    title: string;
    artist: string;
    genre: string;
    price: number;
    image?: string;
};

export default function ProductPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [vinyl, setVinyl] = useState<Vinyl | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Invalid vinyl ID");
            return;
        }

        async function fetchVinyl() {
            try {
                const res = await fetch(`/api/admin/get-vinyl/${id}`);
                if (!res.ok) throw new Error("Vinyl not found");

                const data: Vinyl = await res.json();
                setVinyl(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchVinyl();
    }, [id]);

    if (loading) return <p className="text-center py-20 text-gray-500">Loading vinyl details...</p>;
    if (error) return <p className="text-center text-red-500 py-20 font-semibold">{error}</p>;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-12">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
                {/* 🖼 Image */}
                <div className="relative w-full max-w-sm h-[400px]">
                    <Image
                        src={vinyl?.image || "https://via.placeholder.com/400"}
                        alt={vinyl?.title ?? "Vinyl record"}
                        fill
                        className="object-cover rounded-xl shadow-lg"
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                </div>


                {/* 🎶 Details */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold">{vinyl?.title}</h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">{vinyl?.artist}</p>

                        <span className="inline-block mt-4 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm px-3 py-1 rounded-full font-medium w-fit">
                            {vinyl?.genre}
                        </span>

                        <p className="mt-6 text-3xl font-bold text-violet-600 dark:text-violet-400">
                            €{vinyl?.price.toFixed(2)}
                        </p>
                    </div>

                    {/* 🛒 Add to Cart */}
                    <button
                        onClick={() => {
                            if (vinyl) {
                                dispatch(addToCart({ ...vinyl, quantity: 1 }));
                                toast.success(`${vinyl.title} added to cart!`);
                            }
                        }}
                        className="mt-10 w-full md:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold rounded-lg transition shadow-md"
                    >
                        Add to Cart 🛒
                    </button>
                </div>
            </div>
        </main>
    );
}
