import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-6">
      <h1 className="text-4xl font-bold">🎵 Welcome to Vinyl Store</h1>
      <p className="mt-2 text-lg text-gray-600">Discover and buy your favorite vinyl records.</p>

      {/* Navigation Buttons */}
      <div className="mt-6 flex space-x-4">
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
    </main>
  );
}
