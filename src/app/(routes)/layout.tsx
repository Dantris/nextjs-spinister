import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

import SessionProviderWrapper from "@/providers/SessionProvider"; // ✅ Fixed Import
import Providers from "@/providers/Providers"; // ✅ Redux Provider
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spinister",
  description: "Buy and discover vinyl records",
  icons: {
    icon: "/favicon.ico",
  },
};

// ✅ This file remains a Server Component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProviderWrapper> {/* ✅ NextAuth Provider */}
          <Providers> {/* ✅ Redux Provider */}
            <Navbar />
            <main>{children}</main>
            <Footer />
          </Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
