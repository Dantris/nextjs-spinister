import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@/lib/supabase/server";

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
    } catch (err) {
        console.error("[Webhook] Signature verification failed", err);
        return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
    }

    const supabase = createServerClient();
    const session = event.data.object as Stripe.Checkout.Session;

    try {
        switch (event.type) {
            case "checkout.session.completed":
                if (session.payment_status === "paid") {
                    const { error } = await supabase
                        .from("Order")
                        .update({ paid: true })
                        .eq("stripeSessionId", session.id);

                    if (error) console.error("[Webhook] Order update failed", error);
                    else console.log("[Webhook] Order marked as paid");
                }
                break;

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("[Webhook] Processing error", err);
        return NextResponse.json({ error: "Webhook handling error" }, { status: 500 });
    }
}
