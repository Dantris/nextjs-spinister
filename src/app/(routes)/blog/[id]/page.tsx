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
    const params = useParams();
    const id = params?.id as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch("/api/blog/get-blogs");
                if (!res.ok) throw new Error("Blog not found");

                const data: Blog[] = await res.json();
                const foundBlog = data.find((b) => b.id === id);
                if (!foundBlog) throw new Error("Blog not found");

                setBlog(foundBlog);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message);
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchBlog();
    }, [id]);

    if (loading)
        return (
            <p className="text-center py-20 text-lg text-gray-500 dark:text-gray-400">
                Loading blog post...
            </p>
        );

    if (error)
        return (
            <p className="text-center py-20 text-red-500 font-semibold">{error}</p>
        );

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-md">
                    <h1 className="text-4xl font-extrabold leading-tight mb-4">
                        {blog?.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        By{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {blog?.author.name}
                        </span>{" "}
                        • {new Date(blog?.createdAt || "").toLocaleDateString()}
                    </p>

                    <article className="prose dark:prose-invert max-w-none text-base leading-relaxed">
                        {blog?.content}
                    </article>
                </div>
            </div>
        </main>
    );
}
