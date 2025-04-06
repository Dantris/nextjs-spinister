"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        const res = await fetch("/api/blog/create-blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
            setMessage("❌ Failed to create blog post.");
            return;
        }

        setMessage("✅ Blog created successfully!");
        setTitle("");
        setContent("");
        setTimeout(() => {
            router.push("/blog"); // Redirect after success
        }, 1500);
    }

    return (
        <main className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📝 Create New Blog</h2>

            {message && <p className={`text-center font-semibold mb-4 ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Blog Title"
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                {/* Content Input */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your blog content here..."
                    rows={6}
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    required
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-5 py-2 rounded-md font-bold hover:bg-blue-600 transition duration-200"
                >
                    Publish Blog
                </button>
            </form>
        </main>
    );
}
