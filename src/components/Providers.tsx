"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide the footer on course learning pages (module / topic / quiz) so the
  // sticky course sidebar stays locked for the entire scroll.
  const isLearningPage = /^\/courses\/[^/]+\/[^/]+/.test(pathname);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        {!isLearningPage && <Footer />}
      </ThemeProvider>
    </AuthProvider>
  );
}
