"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadVinylForm from "./UploadVinylForm";

type Vinyl = {
    id: string;
    title: string;
    artist: string;
    genre: string;
    price: number;
    image?: string;
};

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [vinyls, setVinyls] = useState<Vinyl[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "admin") {
            router.push("/");
        } else {
            fetchVinyls();
        }
    }, [session, status]);

    async function fetchVinyls() {
        const res = await fetch("/api/admin/get-vinyls");
        if (res.ok) {
            const data: Vinyl[] = await res.json();
            setVinyls(data);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this vinyl?")) return;
        try {
            const res = await fetch(`/api/admin/delete-vinyl?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            fetchVinyls();
        } catch (err) {
            console.error("❌ Delete failed:", err);
            alert("Something went wrong");
        }
    }

    return (
        <main className="max-w-5xl mx-auto px-6 py-10 text-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold mb-4">👑 Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome, {session?.user?.email}</p>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">🎵 Vinyl Collection</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 rounded-md bg-violet-500 text-white font-semibold hover:bg-violet-600 transition"
                    >
                        {showForm ? "Cancel Upload" : "Upload New Vinyl"}
                    </button>
                </div>

                {/* Upload Form */}
                {showForm && (
                    <div className="mb-8">
                        <UploadVinylForm refreshVinyls={fetchVinyls} />
                    </div>
                )}

                {/* Vinyl List */}
                {vinyls.length === 0 ? (
                    <p className="text-gray-500">No vinyls available yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {vinyls.map((vinyl) => (
                            <div
                                key={vinyl.id}
                                className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{vinyl.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">{vinyl.artist}</p>
                                        <p className="text-sm text-gray-400">{vinyl.genre}</p>
                                        <p className="mt-1 font-semibold text-lg">${vinyl.price.toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(vinyl.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
