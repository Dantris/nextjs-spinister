// /api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const { items, address } = await req.json();

        const totalPrice = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.title,
                    images: [item.image || "https://via.placeholder.com/400"],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "klarna", "sofort", "sepa_debit"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
            customer_creation: "always",
        });

        await prisma.order.create({
            data: {
                userId: typeof token?.id === "string" ? token.id : null,
                items,
                total: totalPrice,
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
        });

        return NextResponse.json({ id: stripeSession.id }); // ✅ IMPORTANT
    } catch (error: any) {
        console.error("🚨 Checkout Error:", error.message || error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
