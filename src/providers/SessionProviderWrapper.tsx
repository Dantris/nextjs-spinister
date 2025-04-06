"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        console.log("✅ SessionProviderWrapper is rendering!");
    }, []);

    return <SessionProvider>{children}</SessionProvider>;
}
