"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();

    return (
        <div>
            {session ? (
                <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={() => signIn()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            )}
        </div>
    );
}
