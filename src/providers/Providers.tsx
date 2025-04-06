"use client"; // ✅ Required

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast"; // ✅ Import toast provider

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add Toast Provider */}
            {children}
        </Provider>
    );
}
