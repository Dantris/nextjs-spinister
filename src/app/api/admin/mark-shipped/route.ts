import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { shipped: true },
            include: { user: true },
        });

        const emailToSend = updatedOrder.email || updatedOrder.user?.email;

        if (emailToSend) {
            console.log("📦 Order email target:", emailToSend);

            await resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to: emailToSend,
                subject: "Your vinyl order has shipped! 📦",
                html: `
          <h2>Hi ${updatedOrder.user?.name || updatedOrder.name || "there"},</h2>
          <p>Your vinyl order from <strong>Spinister</strong> is on its way! 🎶</p>
          <p>📍 Shipping to: <br/>
            ${updatedOrder.name}<br/>
            ${updatedOrder.street}<br/>
            ${updatedOrder.postalCode} ${updatedOrder.city}, ${updatedOrder.country}
          </p>
          <p>Enjoy the music,<br/>The Spinister Team</p>
        `,
            });
        } else {
            console.warn("⚠️ No email address found for order:", orderId);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Error in mark-shipped:", error);
        return NextResponse.json({ error: "Failed to mark order as shipped" }, { status: 500 });
    }
}
