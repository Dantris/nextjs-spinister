"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity, clearCart } from "@/redux/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useRouter } from 'next/navigation';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const router = useRouter();


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
        const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cartItems,
                address,
            }),
        });

        const data = await res.json();

        if (!data.id) {
            console.error('❌ Failed to create Stripe session:', data.error);
            return;
        }

        const stripe = await stripePromise;
        const result = await stripe?.redirectToCheckout({
            sessionId: data.id,
        });

        if (result?.error) {
            console.error('❌ Stripe redirect error:', result.error.message);
        }
    };



    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

            {cartItems.length > 0 ? (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                <p className="text-gray-500">{item.artist}</p>
                            </div>
                            <p className="font-semibold">${item.price.toFixed(2)}</p>

                            <div className="flex items-center">
                                <button
                                    onClick={() =>
                                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                                    }
                                    className="px-2 bg-gray-200 rounded"
                                >
                                    -
                                </button>
                                <span className="px-4">{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                                    }
                                    className="px-2 bg-gray-200 rounded"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => dispatch(removeFromCart(item.id))}
                                className="px-3 py-1 bg-red-500 text-white rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Your cart is empty.</p>
            )}

            {cartItems.length > 0 && (
                <div className="mt-6">
                    <div className="space-y-2 mb-4">
                        <h2 className="text-xl font-semibold">Shipping Address</h2>
                        <input
                            placeholder="Name"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Email"
                            value={address.email}
                            onChange={(e) => setAddress({ ...address, email: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                        <input
                            placeholder="Street"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Postal Code"
                            value={address.postalCode}
                            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            placeholder="Country"
                            value={address.country}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <p className="text-xl font-semibold">Total: ${totalPrice}</p>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() => dispatch(clearCart())}
                            className="px-6 py-2 bg-gray-500 text-white font-bold rounded-md"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="px-6 py-2 bg-green-500 text-white font-bold rounded-md"
                        >
                            Checkout with Stripe 💳
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
