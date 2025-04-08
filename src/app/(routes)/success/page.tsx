// app/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Stripe from 'stripe';

export default function SuccessPage() {
    const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!sessionId) return;

        const fetchSession = async () => {
            try {
                const res = await fetch(`/api/checkout-session?session_id=${sessionId}`);
                const data = await res.json();
                setSession(data);
            } catch (error) {
                console.error("Failed to fetch session:", error);
            }
        };

        fetchSession();
    }, [sessionId]);

    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful!</h1>
            {session ? (
                <div>
                    <p>Thanks for your order, {session.customer_details?.name}!</p>
                    <p>We’ve emailed a confirmation to: <strong>{session.customer_details?.email}</strong></p>
                </div>
            ) : (
                <p>Loading payment details...</p>
            )}
        </div>
    );
}
