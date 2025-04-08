import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";

import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import Providers from "@/providers/Providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import { ThemeProvider } from "next-themes"; // ✅ NEW

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Spinister",
  description: "Buy and discover vinyl records",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProviderWrapper>
            <Providers>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </Providers>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
