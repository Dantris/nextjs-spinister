"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Define your CartItem type
type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
    // Add other fields if needed (e.g., image, artist, etc.)
};

export default function CheckoutButton({ cartItems }: { cartItems: CartItem[] }) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItems }),
        });

        const { id } = await res.json();
        const stripe = await stripePromise;

        await stripe?.redirectToCheckout({ sessionId: id });
        setLoading(false);
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 disabled:opacity-50"
        >
            {loading ? "Processing..." : "Checkout with Stripe"}
        </button>
    );
}
