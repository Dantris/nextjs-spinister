"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

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

        if (!vinylRes.ok || !blogRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const vinylData = await vinylRes.json();
        const blogData = await blogRes.json();

        setVinyls(vinylData);
        setBlogs(blogData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* 🔄 Carousel for Vinyls */}
      <section className="w-full max-w-2xl mx-auto pt-6">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          showIndicators={false}
          interval={4000}
          className="rounded-xl shadow-md overflow-hidden"
        >
          {vinyls.map((v) => (
            <div key={v.id}>
              <img src={v.image || "https://via.placeholder.com/800x400"} alt={v.title} className="object-cover h-72 w-full" />
              <p className="legend">{v.title} — {v.artist}</p>
            </div>
          ))}
        </Carousel>
      </section >

      {/* 🔥 Headline */}
      < section className="text-center mt-10 px-6" >
        <h1 className="text-4xl font-bold">🎵 Welcome to Spinister</h1>
        <p className="mt-2 text-lg text-gray-600">Discover and buy your favorite vinyl records.</p>

        <div className="mt-6 flex justify-center space-x-4">
          <Link
            href="/shop"
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Browse Records
          </Link>
          <Link
            href="/cart"
            className="px-6 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-900"
          >
            View Cart 🛒
          </Link>
        </div>
      </section >

      {/* 🧩 Featured Vinyls */}
      < section className="max-w-6xl mx-auto mt-16 px-6" >
        <h2 className="text-2xl font-bold mb-6">🎧 Featured Vinyls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vinyls.map((record) => (
            <Link
              key={record.id}
              href={`/shop/${record.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <img src={record.image || "https://via.placeholder.com/400"} alt={record.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{record.title}</h3>
                <p className="text-gray-500">{record.artist}</p>
              </div>
            </Link>
          ))}
        </div>
      </section >

      {/* 📝 Latest Blog Posts */}
      < section className="max-w-6xl mx-auto mt-16 px-6" >
        <h2 className="text-2xl font-bold mb-6">📝 Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.slice(0, 4).map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-500 text-sm">By {blog.author.name} | {new Date(blog.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      </section >
    </main >
  );
}
