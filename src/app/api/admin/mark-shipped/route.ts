import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderData {
    id: string;
    email?: string;
    name?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    user?: {
        email?: string;
        name?: string;
    };
}

export async function POST(req: NextRequest) {
    const supabase = createServerClient();

    try {
        const { orderId } = await req.json();

        const { data } = await supabase
            .from("orders")
            .update({ shipped: true })
            .eq("id", orderId)
            .select("id, email, name, street, postalCode, city, country, user:users (email, name)")
            .single();

        const order = data as OrderData;

        if (!order) {
            return NextResponse.json({ error: "Order not found or update failed" }, { status: 500 });
        }

        const emailToSend = order.email || order.user?.email;

        if (emailToSend) {
            await resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to: emailToSend,
                subject: "Your vinyl order has shipped! 📦",
                html: `
          <h2>Hi ${order.user?.name || order.name || "there"},</h2>
          <p>Your vinyl order from <strong>Spinister</strong> is on its way! 🎶</p>
          <p>📍 Shipping to: <br/>
            ${order.name}<br/>
            ${order.street}<br/>
            ${order.postalCode} ${order.city}, ${order.country}
          </p>
          <p>Enjoy the music,<br/>The Spinister Team</p>
        `,
            });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to mark order as shipped" }, { status: 500 });
    }
}
