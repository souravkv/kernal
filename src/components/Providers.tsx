"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
}
