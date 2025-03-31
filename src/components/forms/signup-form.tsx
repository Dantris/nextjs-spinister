"use client";

import { useState } from "react";

// ✅ Define prop type correctly
interface SignupFormProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function SignupForm({ setIsLoggedIn }: SignupFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("user", email); // Simulate signup
        setIsLoggedIn(true);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

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
