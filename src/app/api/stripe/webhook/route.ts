// src/app/api/stripe/webhook/route.ts

import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// ⚠️ Raw body needed for Stripe signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("❌ Invalid Stripe webhook signature:", err);
        return new Response("Webhook signature verification failed", { status: 400 });
    }

    // ✅ Handle payment success
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;

        console.log("✅ Stripe webhook received:", sessionId);

        try {
            await prisma.order.update({
                where: { stripeSessionId: sessionId },
                data: { paid: true },
            });

            console.log("✅ Order marked as paid in DB");
        } catch (err) {
            console.error("❌ Failed to update order in DB:", err);
            return new Response("DB update failed", { status: 500 });
        }
    }

    return new Response("Webhook received", { status: 200 });
}
