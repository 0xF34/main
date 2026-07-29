import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DICE.exe — Roblox Dice & Brainrot Tools",
  description:
    "Hand-tested Roblox dice-game and brainrot-game scripts. Mobile-first. Free. Run by lcr4.",
  keywords: [
    "Roblox dice",
    "Steal a Brainrot",
    "Roblox scripts",
    "dice tools",
    "brainrot scripts",
  ],
  authors: [{ name: "lcr4" }],
  openGraph: {
    title: "DICE.exe — Roblox Dice & Brainrot Tools",
    description:
      "Hand-tested Roblox dice-game and brainrot-game scripts. Mobile-first. Free.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DICE.exe — Roblox Dice & Brainrot Tools",
    description:
      "Hand-tested Roblox dice-game and brainrot-game scripts. Mobile-first. Free.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
