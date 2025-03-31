"use client";

import { useSession } from "next-auth/react";
import LoginButton from "@/components/auth/LoginButton";

export default function AccountPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p className="text-center mt-10 text-gray-500">Checking authentication...</p>;
    }

    return (
        <main className="container mx-auto p-6">
            {session ? (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">👤 Welcome, {session.user?.name || "User"}!</h1>
                    <p className="text-gray-600 mt-2">Manage your orders and account settings.</p>
                    <LoginButton /> {/* Shows logout button */}
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Please log in to access your account.</h1>
                    <LoginButton /> {/* Shows login button */}
                </div>
            )}
        </main>
    );
}
