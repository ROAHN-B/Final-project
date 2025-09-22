import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Krishi Sahayak - Agricultural Advisory",
  description: "AI-powered agricultural advisory for farmers in Maharashtra, Tamil Nadu, Karnataka, and Punjab",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: [
    "agriculture",
    "farming",
    "crop diagnosis",
    "market prices",
    "Maharashtra",
    "Tamil Nadu",
    "Karnataka",
    "Punjab",
  ],
  authors: [{ name: "Krishi Sahayak Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Krishi Sahayak",
  },
  openGraph: {
    title: "Krishi Sahayak - Agricultural Advisory",
    description: "AI-powered agricultural advisory for farmers",
    type: "website",
    locale: "en_IN",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2d5016",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
