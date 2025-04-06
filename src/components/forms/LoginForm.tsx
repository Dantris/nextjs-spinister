"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            redirect: false, // ✅ Prevent automatic redirection
            email,
            password,
        });

        if (result?.error) {
            setError("Invalid email or password.");
            return;
        }

        router.push("/account"); // ✅ Redirect to account page after successful login
    }

    return (
        <form onSubmit={handleLogin} className="p-4 border rounded shadow-md flex flex-col gap-2">
            <h2 className="text-lg font-bold mb-2">Login</h2>

            {error && <p className="text-red-500">{error}</p>}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border p-2 rounded"
                required
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border p-2 rounded"
                required
            />

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Login
            </button>
        </form>
    );
}
