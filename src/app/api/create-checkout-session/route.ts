import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient, Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();
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

interface TokenPayload {
    id: string;
    name?: string;
    email?: string;
    role?: "admin" | "user";
}

export async function POST(req: NextRequest) {
    try {
        const token = (await getToken({ req })) as TokenPayload | null;
        const body = (await req.json()) as RequestBody;
        const { items, address } = body;

        const totalPrice = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
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
                userId: token?.id || null,
                items: items as unknown as Prisma.InputJsonValue,
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
        });

        return NextResponse.json({ id: stripeSession.id });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
