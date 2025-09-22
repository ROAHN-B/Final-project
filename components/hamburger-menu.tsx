"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Phone, Home, MessageSquare, FileText, LogOut, LogIn, Leaf } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { translations } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  const baseMenuItems = [
    {
      icon: Home,
      label: translations.menu?.home || "Home",
      href: "/",
    },
    {
      icon: User,
      label: translations.menu?.profile || "My Profile",
      href: "/profile",
    },
    {
      icon: Phone,
      label: translations.menu?.contact || "Contact",
      href: "/contact",
    },
    {
      icon: FileText,
      label: translations.menu?.schemes || "Government Schemes",
      href: "/schemes",
    },
    {
      icon: MessageSquare,
      label: translations.menu?.chatbot || "Chat Bot",
      href: "/chatbot",
    },
  ]

  const handleMenuItemClick = (href: string) => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleLogin = () => {
    setIsOpen(false)
    router.push("/login")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary rounded-xl">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 border-0">
        <div className="flex flex-col h-full bg-gradient-to-b from-card to-background">
          <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <Leaf className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text text-balance">{translations.title || "KrishiMitra"}</h2>
                <p className="text-sm text-muted-foreground text-pretty">
                  {translations.subtitle || "Your Digital Agricultural Advisor"}
                </p>
              </div>
            </div>

            {isAuthenticated && user ? (
              <div className="p-4 bg-card rounded-2xl shadow-sm border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.village}, {user.district}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-secondary/50 rounded-2xl text-center border border-border/50">
                <p className="text-sm text-muted-foreground text-pretty">
                  {translations.loginDescription || "Please log in to access personalized features."}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <nav className="space-y-3">
              {baseMenuItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={() => handleMenuItemClick(item.href)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 h-14 text-left hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300 rounded-2xl group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-balance">{item.label}</span>
                  </Button>
                </Link>
              ))}

              <div className="pt-4 border-t border-border/50">
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-4 h-14 text-left hover:bg-destructive/5 hover:text-destructive hover:scale-[1.02] transition-all duration-300 rounded-2xl group"
                  >
                    <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                      <LogOut className="h-5 w-5 text-destructive" />
                    </div>
                    <span className="font-medium text-balance">{translations.logout || "Logout"}</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleLogin}
                    className="w-full justify-start gap-4 h-14 text-left hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300 rounded-2xl group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <LogIn className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-balance">{translations.login || "Login"}</span>
                  </Button>
                )}
              </div>
            </nav>
          </div>

          <div className="p-6 border-t border-border bg-gradient-to-r from-secondary/30 to-accent/20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm">
                <Phone className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {translations.support || "Free Support: 1800-XXX-XXXX"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
