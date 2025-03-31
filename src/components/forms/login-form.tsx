"use client";

import { useState } from "react";

// ✅ Define prop type correctly
interface LoginFormProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function LoginForm({ setIsLoggedIn }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("user", email); // Simulate login
        setIsLoggedIn(true);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Login</h2>

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

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Login
            </button>
        </form>
    );
}
