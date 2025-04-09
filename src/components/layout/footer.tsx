import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Brand */}
                <h2 className="text-2xl font-extrabold tracking-tight">🎵 Spinister</h2>
                <p className="text-sm text-gray-400 mt-1">
                    Your favorite place for timeless vinyl records.
                </p>

                {/* Links */}
                <nav className="mt-6 flex justify-center flex-wrap gap-6 text-sm font-medium">
                    <Link href="/shop" className="text-gray-300 hover:text-violet-400 transition">
                        Shop
                    </Link>
                    <Link href="/cart" className="text-gray-300 hover:text-violet-400 transition">
                        Cart
                    </Link>
                    <Link href="/account" className="text-gray-300 hover:text-violet-400 transition">
                        Account
                    </Link>
                    <Link href="/contact" className="text-gray-300 hover:text-violet-400 transition">
                        Contact
                    </Link>
                </nav>

                {/* Newsletter Signup */}
                <div className="mt-10">
                    <form className="max-w-md mx-auto flex items-center gap-2">
                        <input
                            type="email"
                            placeholder="Join the newsletter"
                            className="w-full px-4 py-2 rounded-md text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-violet-500 text-white font-semibold hover:bg-violet-600 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">
                        No spam. Just rare drops & vinyl news.
                    </p>
                </div>

                {/* Footer line */}
                <div className="mt-10 text-xs text-gray-500 border-t border-gray-800 pt-4">
                    © {new Date().getFullYear()} <span className="font-semibold text-white">Spinister</span>. All rights reserved.
                </div>

            </div>
        </footer>
    );
}
