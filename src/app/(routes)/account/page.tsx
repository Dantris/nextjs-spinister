"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated";
    const [showSignup, setShowSignup] = useState(false);
    const [userLoggedIn, setIsLoggedIn] = useState(false); // ✅ Add state

    if (status === "loading") {
        return <div className="text-center mt-10 text-gray-500">Checking authentication...</div>;
    }

    return (
        <main className="container mx-auto p-6">
            {isLoggedIn ? (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">👤 Welcome {session.user?.name || "Back"}!</h1>
                    <p className="text-gray-600 mt-2">Manage your orders and account settings.</p>
                    <button
                        onClick={() => signOut()}
                        className="mt-4 px-6 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    {showSignup ? <SignupForm setIsLoggedIn={setIsLoggedIn} /> : <LoginForm />}
                    {/* ✅ Pass `setIsLoggedIn` to SignupForm */}

                    <p className="text-center mt-4">
                        {showSignup ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={() => setShowSignup(!showSignup)}
                            className="ml-1 text-blue-500 underline"
                        >
                            {showSignup ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            )}
        </main>
    );
}
