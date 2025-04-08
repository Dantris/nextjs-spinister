import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    try {
        switch (event.type) {
            case "checkout.session.completed":
                if (session.payment_status === "paid") {
                    await prisma.order.updateMany({
                        where: { stripeSessionId: session.id },
                        data: { paid: true },
                    });
                    console.log(`✅ Order marked as paid (immediate) for session: ${session.id}`);
                } else {
                    console.log(`⚠️ Checkout completed but not yet paid (status: ${session.payment_status})`);
                }
                break;

            case "checkout.session.async_payment_succeeded":
                await prisma.order.updateMany({
                    where: { stripeSessionId: session.id },
                    data: { paid: true },
                });
                console.log(`✅ Delayed payment succeeded. Order marked as paid for session: ${session.id}`);
                break;

            case "checkout.session.async_payment_failed":
                await prisma.order.updateMany({
                    where: { stripeSessionId: session.id },
                    data: { paid: false },
                });
                console.warn(`❌ Delayed payment failed for session: ${session.id}`);
                break;

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("❌ Error handling webhook event:", err);
        return NextResponse.json({ error: "Webhook handling error" }, { status: 500 });
    }
}
