import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Kernal — Data Structures & Algorithms",
  description: "The modern way to master DSA. Structured curriculum, integrated code editor, and 100+ interview problems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
