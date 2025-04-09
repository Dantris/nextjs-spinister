import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
});

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["customer", "payment_intent", "line_items"],
        });

        return NextResponse.json(session);
    } catch (error) {
        const err = error as Error;
        console.error("Error fetching session:", err.message || error);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
