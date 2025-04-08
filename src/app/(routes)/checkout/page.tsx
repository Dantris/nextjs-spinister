'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing');

        if (!stripe || !elements) return;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
        });

        if (result.error) {
            console.error('❌ Payment error:', result.error.message);
            setStatus('error');
        } else {
            setStatus('success');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
            <PaymentElement />
            <button
                type="submit"
                disabled={status === 'processing'}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {status === 'processing' ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const createIntent = async () => {
            const res = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{ title: 'Vinyl Record', price: 20, quantity: 1 }],
                    address: {
                        name: 'Test User',
                        email: 'test@example.com',
                        street: 'Teststraße 1',
                        city: 'Berlin',
                        postalCode: '10115',
                        country: 'DE',
                    },
                }),
            });
            const data = await res.json();
            setClientSecret(data.clientSecret);
        };

        createIntent();
    }, []);

    if (!clientSecret) return <p>Loading payment form...</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
}
