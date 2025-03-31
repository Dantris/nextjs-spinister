import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css"; // Ensure correct import
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AuthProvider from "@/providers/auth-provider";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Consistent naming for `metadata`
export const metadata: Metadata = {
  title: "Vinyl Store",
  description: "Buy and discover vinyl records",
  icons: {
    icon: "/favicon.ico", // ✅ Served from `public/`
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}