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
    } catch {
        return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
    }

    const supabase = createServerClient();
    const session = event.data.object as Stripe.Checkout.Session;

    try {
        switch (event.type) {
            case "checkout.session.completed":
                if (session.payment_status === "paid") {
                    await supabase
                        .from("orders")
                        .update({ paid: true })
                        .eq("stripeSessionId", session.id);
                }
                break;

            case "checkout.session.async_payment_succeeded":
                await supabase
                    .from("orders")
                    .update({ paid: true })
                    .eq("stripeSessionId", session.id);
                break;

            case "checkout.session.async_payment_failed":
                await supabase
                    .from("orders")
                    .update({ paid: false })
                    .eq("stripeSessionId", session.id);
                break;

            default:
                break;
        }

        return NextResponse.json({ received: true });
    } catch {
        return NextResponse.json({ error: "Webhook handling error" }, { status: 500 });
    }
}
