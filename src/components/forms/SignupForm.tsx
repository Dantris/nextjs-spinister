"use client";

import { useState } from "react"; // ✅ Missing import

export default function SignupForm({ setIsLoggedIn }: { setIsLoggedIn: (loggedIn: boolean) => void }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
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
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <label className="block mb-2">
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded mt-1"
                    required
                />
            </label>

            <label className="block mb-2">
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mt-1"
                    required
                />
            </label>

            <label className="block mb-4">
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded mt-1"
                    required
                />
            </label>

            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Sign Up
            </button>
        </form>
    );
}
