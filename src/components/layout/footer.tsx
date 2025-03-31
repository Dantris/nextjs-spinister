export default function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-white py-6 mt-10">
            <div className="container mx-auto text-center">
                <p className="text-lg font-semibold">🎵 Vinyl Store</p>
                <p className="text-sm text-gray-400 mt-1">Your favorite place for classic records.</p>

                {/* Footer Links */}
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="/shop" className="text-gray-300 hover:text-white">
                        Shop
                    </a>
                    <a href="/account" className="text-gray-300 hover:text-white">
                        Account
                    </a>
                    <a href="/cart" className="text-gray-300 hover:text-white">
                        Cart
                    </a>
                    <a href="/contact" className="text-gray-300 hover:text-white">
                        Contact Us
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-500 mt-4">© {new Date().getFullYear()} Vinyl Store. All rights reserved.</p>
            </div>
        </footer>
    );
}
