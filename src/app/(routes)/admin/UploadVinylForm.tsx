"use client";

import { useState } from "react";

export default function UploadVinylForm({ refreshVinyls }: { refreshVinyls: () => void }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const vinylData = {
            title,
            artist,
            genre,
            price: parseFloat(price),
            image,
        };

        console.log("✅ Submitting Vinyl:", vinylData);

        try {
            const res = await fetch("/api/admin/upload-vinyl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json" // ✅ Ensures JSON response
                },
                body: JSON.stringify(vinylData),
            });

            const data = await res.json(); // ✅ Ensures JSON parsing
            if (!res.ok) {
                console.error("🚨 Upload failed:", data);
                setMessage(`Upload failed: ${data.error || "Unknown error"}`);
                return;
            }

            console.log("✅ Vinyl uploaded successfully:", data);
            setMessage("Vinyl uploaded successfully!");
            refreshVinyls(); // Refresh list
        } catch (error) {
            console.error("🚨 Unexpected Error:", error);
            setMessage("Something went wrong!");
        }
    }


    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md flex flex-col gap-2">
            <h2 className="text-lg font-bold mb-2">Upload New Vinyl</h2>

            {message && <p className="text-green-500">{message}</p>}

            <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border p-2 rounded"
                required
            />

            <input
                type="text"
                name="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist"
                className="border p-2 rounded"
                required
            />

            <input
                type="text"
                name="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre"
                className="border p-2 rounded"
                required
            />

            <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="border p-2 rounded"
                required
            />

            <input
                type="text"
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image URL"
                className="border p-2 rounded"
                required
            />

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Upload Vinyl
            </button>
        </form>
    );
}
