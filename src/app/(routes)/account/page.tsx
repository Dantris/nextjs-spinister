"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated";
    const [showSignup, setShowSignup] = useState(false);
    const setIsLoggedIn = () => { };

    if (status === "loading") {
        return (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                Checking authentication...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 px-6 py-12 text-gray-800 dark:text-white">
            {isLoggedIn ? (
                <div className="text-center max-w-xl mx-auto">
                    <h1 className="text-4xl font-extrabold">👤 Welcome, {session.user?.name || "Back"}!</h1>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Manage your orders and account settings.
                    </p>

                    <Button
                        variant="destructive"
                        className="mt-6"
                        onClick={() => signOut()}
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {showSignup ? "Create an Account" : "Login to Spinister"}
                    </h2>

                    {showSignup ? (
                        <SignupForm setIsLoggedIn={setIsLoggedIn} />
                    ) : (
                        <LoginForm />
                    )}

                    <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        {showSignup ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={() => setShowSignup(!showSignup)}
                            className="ml-2 text-violet-500 hover:underline font-medium"
                        >
                            {showSignup ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            )}
        </main>
    );
}
