"use client";

import { useState } from "react";

export default function CartPage() {
    // Sample cart data (mock data for now)
    const [cartItems, setCartItems] = useState([
        { id: 1, title: "Abbey Road", artist: "The Beatles", price: 29.99, quantity: 1 },
        { id: 2, title: "Dark Side of the Moon", artist: "Pink Floyd", price: 34.99, quantity: 1 },
    ]);

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

            {/* Cart Items List */}
            {cartItems.length > 0 ? (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
                            <div>
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                <p className="text-gray-500">{item.artist}</p>
                            </div>
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Your cart is empty.</p>
            )}

            {/* Total Price & Checkout */}
            {cartItems.length > 0 && (
                <div className="mt-6">
                    <p className="text-xl font-semibold">Total: ${totalPrice}</p>
                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </main>
    );
}
