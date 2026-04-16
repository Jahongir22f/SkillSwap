import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSwap Marketplace",
  description: "Exchange skills using a credit barter system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <main className="min-h-screen pb-20 md:pb-0 md:pt-16 bg-gray-50/30">
              {children}
              <Navbar />
            </main>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
