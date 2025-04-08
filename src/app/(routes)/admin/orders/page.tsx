"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Order = {
    id: string;
    items: any;
    total: number;
    paid: boolean;
    shipped: boolean;
    createdAt: string;
    user?: { name: string; email: string };
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
};

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (status === "loading") return;

        if (!session || session.user.role !== "admin") {
            router.push("/"); // Redirect if not admin
        } else {
            fetchOrders();
        }
    }, [session, status]);

    async function fetchOrders() {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data);
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
            console.error("❌ Failed to mark as shipped");
            alert("❌ Something went wrong");
        }
    }

    if (status === "loading" || !session) return <p>Loading...</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">📦 Orders</h1>

            {orders.map((order) => (
                <div key={order.id} className="border p-4 mb-4 rounded shadow">
                    <p><strong>User:</strong> {order.user?.name || "Guest"}</p>
                    <p><strong>Total:</strong> €{order.total.toFixed(2)}</p>
                    <p><strong>Paid:</strong> {order.paid ? "✅" : "❌"}</p>
                    <p><strong>Shipped:</strong> {order.shipped ? "📦 Yes" : "🚫 No"}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Shipping To:</strong> {order.name}, {order.street}, {order.city} {order.postalCode}, {order.country}</p>

                    <details className="mt-2">
                        <summary className="cursor-pointer underline">View Items</summary>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                            {JSON.stringify(order.items, null, 2)}
                        </pre>
                    </details>

                    <button
                        disabled={!order.paid || order.shipped}
                        onClick={() => markAsShipped(order.id)}
                        className={`mt-4 px-4 py-2 rounded text-white font-semibold ${order.shipped || !order.paid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {order.shipped ? "✅ Shipped" : "Mark as Shipped"}
                    </button>
                </div>
            ))}
        </main>
    );
}
