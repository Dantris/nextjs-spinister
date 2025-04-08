"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

type Vinyl = {
  id: string;
  title: string;
  artist: string;
  image?: string;
};

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { name: string; email: string };
};

export default function Home() {
  const [vinyls, setVinyls] = useState<Vinyl[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vinylRes, blogRes] = await Promise.all([
          fetch("/api/admin/get-vinyls"),
          fetch("/api/blog/get-blogs"),
        ]);

        if (!vinylRes.ok || !blogRes.ok) throw new Error("Failed to fetch");

        setVinyls(await vinylRes.json());
        setBlogs(await blogRes.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-20 text-lg">Loading your sound...</p>;
  if (error) return <p className="text-center text-red-500 py-20">Error: {error}</p>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* 🎞 Hero Carousel */}
      <section className="w-full max-w-5xl mx-auto pt-10 px-4">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          showIndicators={true}
          interval={4500}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {vinyls.map((v) => (
            <div key={v.id}>
              <img
                src={v.image || "https://via.placeholder.com/800x400"}
                alt={v.title}
                className="object-cover h-80 w-full"
              />
              <p className="legend bg-black bg-opacity-60 text-white text-lg font-semibold px-4 py-2 rounded">
                {v.title} — {v.artist}
              </p>
            </div>
          ))}
        </Carousel>
      </section>

      {/* 🎵 Welcome */}
      <section className="text-center mt-20 px-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 to-pink-400 text-transparent bg-clip-text">
            Welcome to Spinister
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Find timeless vinyls. Rediscover your sound.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition shadow-md"
          >
            🎧 Browse Records
          </Link>
          <Link
            href="/cart"
            className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition shadow-md"
          >
            🛒 View Cart
          </Link>
        </div>
      </section>

      {/* 🧩 Featured Vinyls */}
      <section className="max-w-7xl mx-auto mt-24 px-6">
        <h2 className="text-3xl font-bold mb-6">🔥 Featured Vinyls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {vinyls.slice(0, 6).map((record) => (
            <Link
              key={record.id}
              href={`/shop/${record.id}`}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
            >
              <img
                src={record.image || "https://via.placeholder.com/400"}
                alt={record.title}
                className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{record.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{record.artist}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🎼 Browse by Genre */}
      <section className="max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-3xl font-bold mb-6">🎼 Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Jazz", color: "bg-yellow-100 dark:bg-yellow-300/10", emoji: "🎷" },
            { name: "Rock", color: "bg-red-100 dark:bg-red-300/10", emoji: "🎸" },
            { name: "Hip-Hop", color: "bg-blue-100 dark:bg-blue-300/10", emoji: "🎤" },
            { name: "Electronic", color: "bg-purple-100 dark:bg-purple-300/10", emoji: "🎧" },
          ].map((genre) => (
            <Link
              key={genre.name}
              href={`/shop?genre=${genre.name.toLowerCase()}`}
              className={`rounded-xl p-6 text-center font-medium shadow-sm hover:shadow-md transition ${genre.color}`}
            >
              <div className="text-3xl mb-2">{genre.emoji}</div>
              <div className="text-lg">{genre.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 📝 Latest Blog Posts */}
      <section className="max-w-7xl mx-auto mt-24 mb-0 px-6">
        <h2 className="text-3xl font-bold mb-6">📝 Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.slice(0, 4).map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-semibold">{blog.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                By {blog.author.name} · {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3">
                {blog.content.slice(0, 120)}...
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
