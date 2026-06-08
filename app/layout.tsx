import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers/providers";
import { AuthProvider } from "@/context/auth.context";
import AuthWrapper from "./AuthWrapper";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ENorth Logistics",
    template: "%s | ENorth Logistics",
  },
  description: "Shipment tracking and logistics CRM platform.",

  manifest: "/manifest.json",

  //   themeColor: "#0f172a",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "ENorth Logistics",
    description: "Shipment tracking and logistics management platform.",
    url: "https://live.enorthlogistics.com",
    siteName: "ENorth Logistics",
    images: ["/og-image.png"],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ENorth Logistics",
    description: "Shipment tracking and logistics management platform.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`
      }
      suppressHydrationWarning
      >
        <Providers>
          <AuthProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </AuthProvider>
        </Providers>
        <Script
          src="https://sandbox.web.squarecdn.com/v1/square.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
