"use client";

import { useState } from "react";

export default function SignupForm({
    setIsLoggedIn,
}: {
    setIsLoggedIn: (loggedIn: boolean) => void;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setSuccess("User registered successfully!");
            setIsLoggedIn(true);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md flex flex-col gap-2 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Sign Up</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="border p-2 rounded"
                required
            />

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

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Sign Up
            </button>
        </form>
    );
}
