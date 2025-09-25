"use client"

import { Button } from "@/components/ui/button"
import { Home, Stethoscope, BarChart3, MessageCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { translations } = useLanguage()

  const t = translations.bottomNav

  const navItems = [
    {
      label: t?.home || "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: t?.diagnose || "Diagnose",
      icon: Stethoscope,
      href: "/diagnose",
    },
    {
      label: t?.markets || "Markets",
      icon: BarChart3,
      href: "/market",
    },
    {
      label: t?.community || "Community",
      icon: MessageCircle,
      href: "/community",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-col gap-2 h-auto py-3 px-4 transition-all duration-300 hover:scale-110 rounded-2xl min-w-[4rem]",
                  isActive
                    ? "text-primary font-semibold bg-primary/10 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
                onClick={() => router.push(item.href)}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                    isActive ? "bg-primary/20" : "bg-transparent",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}