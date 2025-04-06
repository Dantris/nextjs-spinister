"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Blog = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: { name: string; email: string };
};

export default function BlogPostPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blog/get-blogs`);
                if (!res.ok) throw new Error("Blog not found");

                const data: Blog[] = await res.json();
                const foundBlog = data.find((b) => b.id === id);
                if (!foundBlog) throw new Error("Blog not found");

                setBlog(foundBlog);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchBlog();
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading blog post...</p>;
    if (error) return <p className="text-center text-red-500 font-semibold">{error}</p>;

    return (
        <main className="max-w-3xl mx-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{blog?.title}</h1>
                <p className="text-sm text-gray-500 mb-6">
                    By <span className="font-medium text-gray-700">{blog?.author.name}</span> •{" "}
                    {new Date(blog?.createdAt || "").toLocaleDateString()}
                </p>
                <article className="prose max-w-none text-gray-700 leading-relaxed">
                    {blog?.content}
                </article>
            </div>
        </main>
    );
}
