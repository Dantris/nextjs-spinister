"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity, clearCart } from "@/redux/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();

    const totalPrice = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    const [address, setAddress] = useState({
        name: "",
        email: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const handleCheckout = async () => {
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems, address }),
        });

        const data = await res.json();

        if (!data.id) {
            return;
        }

        const stripe = await stripePromise;
        const result = await stripe?.redirectToCheckout({ sessionId: data.id });

        if (result?.error) {
            console.error("❌ Stripe redirect error:", result.error.message);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center">🛒 Your Cart</h1>

                {cartItems.length > 0 ? (
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md transition"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold">{item.title}</h2>
                                    <p className="text-gray-500 dark:text-gray-400">{item.artist}</p>
                                </div>

                                <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                                    <p className="font-bold text-lg">${item.price.toFixed(2)}</p>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                                            }
                                            className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white rounded-md"
                                        >
                                            -
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                                            }
                                            className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white rounded-md"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty.</p>
                )}

                {cartItems.length > 0 && (
                    <div className="mt-12 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">📦 Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                placeholder="Name"
                                value={address.name}
                                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                placeholder="Email"
                                value={address.email}
                                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white"
                                required
                            />
                            <input
                                placeholder="Street"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                placeholder="City"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                placeholder="Postal Code"
                                value={address.postalCode}
                                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                placeholder="Country"
                                value={address.country}
                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <p className="text-2xl font-bold">Total: ${totalPrice}</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-semibold"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold"
                                >
                                    Checkout with Stripe 💳
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
