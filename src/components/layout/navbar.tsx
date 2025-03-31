import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full bg-white shadow-md py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                    🎵 Vinyl Store
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="text-gray-700 hover:text-gray-900">
                        Home
                    </Link>
                    <Link href="/shop" className="text-gray-700 hover:text-gray-900">
                        Shop
                    </Link>
                    <Link href="/account" className="text-gray-700 hover:text-gray-900"> {/* ✅ FIXED */}
                        Account
                    </Link>
                    <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                        Cart 🛒
                    </Link>
                </div>
            </div>
        </nav>
    );
}
