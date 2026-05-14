import { Suspense } from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SplashScreen from "@/components/layout/splash-screen";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LUXE CINEMA — Premium Movie Experience",
  description: "Trải nghiệm điện ảnh cao cấp cùng LUXE CINEMA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white overscroll-none">
        <SplashScreen />
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

