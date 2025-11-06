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
  "/chatbot", // Add chatbot to protected routes
]

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated and on the landing page, redirect to dashboard
    if (isAuthenticated && user && pathname === "/") {
      router.push("/dashboard")
      return
    }

    // If not authenticated and trying to access a protected route, redirect to login
    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      router.push("/login")
      return
    }
  }, [isAuthenticated, user, pathname, router])

  // Render children only if authenticated or on a non-protected route
  if (!isAuthenticated && protectedRoutes.includes(pathname) && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fix service worker registration to only run in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
          .then(function(registration) {
            console.log('[SW] Registration successful');
          })
          .catch(function(error) {
            console.log('[SW] Registration failed, but continuing:', error);
            // Don't break the app if SW fails
          });
      });
    }
  }, []);

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
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <LanguageProvider>
            <AdvisoryProvider>
              <Suspense fallback={null}>
                <AuthWrapper>{children}</AuthWrapper>
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