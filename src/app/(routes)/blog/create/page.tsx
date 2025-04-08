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
        setTimeout(() => router.push("/blog"), 1500);
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-4 py-12">
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-md rounded-xl p-8">
                <h2 className="text-4xl font-bold mb-6 text-center">📝 Create a New Blog Post</h2>

                {message && (
                    <p
                        className={`text-center font-semibold mb-6 ${message.includes("Failed") ? "text-red-500" : "text-green-500"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Blog Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your blog title..."
                        className="px-4 py-3 rounded-md bg-gray-100 dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />

                    {/* Blog Content */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your blog content..."
                        rows={8}
                        className="px-4 py-3 rounded-md bg-gray-100 dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                        required
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="px-6 py-3 bg-violet-500 hover:bg-violet-600 transition text-white font-bold rounded-md"
                    >
                        🚀 Publish Blog
                    </button>
                </form>
            </div>
        </main>
    );
}
