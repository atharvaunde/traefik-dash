import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AppBar } from "@/components/layout/app-bar";
import { MobileBottomNav } from "@/components/layout/mobile-navigation";
import { AppProvider } from "@/components/providers/app-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Traefik Dashboard",
  description: "A dashboard for managing Traefik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <AppBar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster position="bottom-right" richColors />
            <MobileBottomNav />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
