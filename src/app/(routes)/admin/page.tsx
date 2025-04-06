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
    const [showForm, setShowForm] = useState(false); // ✅ Toggle form visibility

    useEffect(() => {
        console.log("✅ useEffect running | Status:", status, "| Session:", session);

        if (status === "loading") return; // ✅ Wait for session to load
        if (!session || !session.user || !session.user.role) {
            console.warn("🚨 No user role found. Session data:", session);
            return;
        }
        if (session.user.role !== "admin") {
            console.warn("🚨 Redirecting non-admin user:", session.user);
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p>Welcome, {session?.user?.email}!</p>

            <h2 className="text-xl font-semibold mt-4">Vinyl Management</h2>

            {/* ✅ Upload Button to Show Form */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            >
                {showForm ? "Cancel Upload" : "Upload Vinyl"}
            </button>

            {/* ✅ Upload Form (Toggled by Button) */}
            {showForm && <UploadVinylForm refreshVinyls={fetchVinyls} />}

            <div className="mt-6">
                <h3 className="text-lg font-bold">Vinyl Collection</h3>
                {vinyls.length === 0 ? (
                    <p>No vinyls available.</p>
                ) : (
                    <ul>
                        {vinyls.map((vinyl) => (
                            <li key={vinyl.id} className="border p-3 my-2 flex justify-between">
                                <div>
                                    <p className="font-bold">{vinyl.title} - {vinyl.artist}</p>
                                    <p>{vinyl.genre} | ${vinyl.price.toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
