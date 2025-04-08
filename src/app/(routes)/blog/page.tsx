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

    if (loading)
        return (
            <p className="text-center py-16 text-lg text-gray-500 dark:text-gray-400">
                Loading blogs...
            </p>
        );

    if (error)
        return (
            <p className="text-center text-red-500 font-semibold py-16">
                ❌ Error: {error}
            </p>
        );

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-10">
                    📖 Blog Posts
                </h1>

                {blogs.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
                        No blogs available. Stay tuned!
                    </p>
                ) : (
                    <div className="space-y-8">
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition"
                            >
                                <Link
                                    href={`/blog/${blog.id}`}
                                    className="text-2xl font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                    {blog.title}
                                </Link>

                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    By <span className="font-medium">{blog.author.name}</span> •{" "}
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </p>

                                <p className="mt-4 text-gray-700 dark:text-gray-300 line-clamp-3">
                                    {blog.content.slice(0, 180)}...
                                </p>

                                <Link
                                    href={`/blog/${blog.id}`}
                                    className="mt-4 inline-block text-violet-500 dark:text-violet-400 font-semibold hover:underline"
                                >
                                    Read more →
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
