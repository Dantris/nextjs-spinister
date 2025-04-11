import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getToken } from "next-auth/jwt";
import { createServerClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

interface CartItem {
    id: string;
    title: string;
    artist: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Address {
    name: string;
    email: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

interface RequestBody {
    items: CartItem[];
    address: Address;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = createServerClient(); // ✅ based on your config
        const token = await getToken({ req });
        const body = (await req.json()) as RequestBody;
        const { items, address } = body;

        const totalPrice = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
            (item) => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.title,
                        images: [item.image || "https://via.placeholder.com/400"],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })
        );

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "klarna", "sofort", "sepa_debit"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
            customer_email: address.email,
            customer_creation: "always",
        });

        const { error } = await supabase.from("Order").insert([
            {
                user_id: token?.id || null,
                items, // ✅ make sure this column is jsonb in Supabase
                total: parseFloat(totalPrice.toFixed(2)),
                paid: false,
                shipped: false,
                stripeSessionId: stripeSession.id,
                name: address.name,
                email: address.email,
                street: address.street,
                city: address.city,
                postalCode: address.postalCode,
                country: address.country,
            },
        ]);

        if (error) {
            return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
        }

        return NextResponse.json({ id: stripeSession.id });
    } catch (err) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
