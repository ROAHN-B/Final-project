"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { AdvisoryProvider } from "@/contexts/AdvisoryContext"
import { Toaster } from "@/components/ui/toaster"
import { Leaf } from "lucide-react"

// List of routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/market",
  "/community",
  "/diagnose",
  "/schemes",
  "/contact",
  "/weather",
]

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading) return; // Don't do anything until auth state is loaded

    if (isAuthenticated && user && (pathname === "/" || pathname === "/login")) {
      router.push("/dashboard")
    } else if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      router.push("/login")
    }
  }, [isAuthenticated, user, pathname, router, loading])

  if (loading || (!isAuthenticated && protectedRoutes.includes(pathname))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Your Farm...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Krishi Sahayak" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Krishi Sahayak" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2d5016" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/agricultural-app-icon.jpg" />
        <link rel="icon" type="image/svg+xml" href="/agricultural-app-icon.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/agricultural-app-icon.jpg" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[SW] Registration successful');
                    })
                    .catch(function(error) {
                      console.log('[SW] Registration failed');
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <LanguageProvider>
            <AdvisoryProvider>
              <Suspense fallback={null}>
                <AppInitializer>{children}</AppInitializer>
              </Suspense>
            </AdvisoryProvider>
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}