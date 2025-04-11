"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Order = {
    id: string;
    items: unknown;
    total: number;
    paid: boolean;
    shipped: boolean;
    createdAt: string;
    name: string;
    email: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    user?: {
        name: string;
        email: string;
    };
};


export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "admin") {
            router.push("/");
        } else {
            fetchOrders();
        }
    }, [session, status, router]);

    async function fetchOrders() {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();

        // Coerce all paid and shipped values to booleans
        const fixed = data.map((order: any) => ({
            ...order,
            paid: Boolean(order.paid),
            shipped: Boolean(order.shipped),
        }));

        setOrders(fixed);
    }


    async function markAsShipped(orderId: string) {
        const res = await fetch("/api/admin/mark-shipped", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
        });

        if (res.ok) {
            alert("📦 Order marked as shipped!");
            fetchOrders();
        } else {
            alert("❌ Something went wrong");
        }
    }

    if (status === "loading" || !session) return <p className="text-center mt-10">Loading orders...</p>;

    return (
        <main className="max-w-6xl mx-auto px-6 py-10 text-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold mb-8">📦 Admin Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">No orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                <div className="space-y-1">
                                    <p className="text-lg font-semibold">
                                        👤 {order.user?.name || "Guest"} — {order.user?.email || order.email}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4 md:mt-0">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${order.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {order.paid ? "✅ Paid" : "❌ Unpaid"}
                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${order.shipped ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {order.shipped ? "📦 Shipped" : "⏳ Not Shipped"}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <strong>Shipping Address:</strong><br />
                                    {order.name}, {order.street}, {order.postalCode} {order.city}, {order.country}
                                </p>
                                <p className="text-lg font-bold mt-2">💰 €{order.total.toFixed(2)}</p>
                            </div>

                            <details className="mt-2">
                                <summary className="cursor-pointer underline font-medium text-sm text-gray-600 dark:text-gray-300">
                                    View Items
                                </summary>
                                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm mt-2 overflow-x-auto whitespace-pre-wrap">
                                    {JSON.stringify(order.items, null, 2)}
                                </pre>
                            </details>

                            <button
                                disabled={!order.paid || order.shipped}
                                onClick={() => markAsShipped(order.id)}
                                className={`mt-6 px-5 py-2 rounded-md font-semibold text-white transition ${order.shipped || !order.paid
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {order.shipped ? "✅ Already Shipped" : "Mark as Shipped"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
