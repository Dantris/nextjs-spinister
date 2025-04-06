"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Blog = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: { name: string; email: string };
};

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const res = await fetch("/api/blog/get-blogs");
                if (!res.ok) throw new Error("Failed to fetch blogs");

                const data: Blog[] = await res.json();
                setBlogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    if (loading) return <p className="text-center text-lg text-gray-500">Loading blogs...</p>;
    if (error) return <p className="text-center text-red-500 font-semibold">❌ Error: {error}</p>;

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">📖 Blog Posts</h1>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No blogs available. Stay tuned!</p>
            ) : (
                <div className="space-y-8">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <Link href={`/blog/${blog.id}`} className="text-2xl font-semibold text-blue-600 hover:underline">
                                {blog.title}
                            </Link>
                            <p className="text-gray-500 text-sm mt-2">
                                By <span className="font-semibold">{blog.author.name}</span> • {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                            <p className="mt-3 text-gray-700 line-clamp-2">{blog.content}</p> {/* Shows a preview */}
                            <Link href={`/blog/${blog.id}`} className="mt-4 inline-block text-blue-500 hover:underline font-semibold">
                                Read more →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
