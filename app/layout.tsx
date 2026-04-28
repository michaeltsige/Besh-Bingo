import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SocketProvider } from "@/contexts/SocketContext"; // <-- add this
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Besh Bingo Demo",
  description: "Bingo game frontend",
  manifest: "/manifest.json",
  applicationName: "Besh Bingo",
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Replace with your real test user UUID (from the database)
  const devUserId = "a7251ca0-0c59-44cf-bf71-555dfe15c247";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} bg-bingo-deep-purple`}
    >
      <body className="font-sans antialiased h-dvh overflow-hidden">
        <SocketProvider userId={devUserId}>
          {children}
        </SocketProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}