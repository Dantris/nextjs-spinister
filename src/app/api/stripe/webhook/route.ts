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
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = createServerClient();
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed" && session.payment_status === "paid") {
        await supabase
            .from("Order")
            .update({ paid: true })
            .eq("stripeSessionId", session.id);
    }

    return NextResponse.json({ received: true });
}
