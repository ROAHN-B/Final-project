"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Send, ArrowLeft, Leaf, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
import { useAuth } from "@/contexts/auth-context" // Import useAuth

export default function ContactPage() {
  const { translations } = useLanguage()
  const { user } = useAuth() // Get user from AuthContext
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const t = translations.contact

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    village: user?.village || "",
    query: "",
  })

  // Sample recent queries - in real app this would come from API
  const recentQueries = [
    {
      id: 1,
      query: "Cotton crop yellowing leaves problem",
      status: "resolved",
      date: "2 days ago",
    },
    {
      id: 2,
      query: "Best fertilizer for wheat in winter",
      status: "inProgress",
      date: "1 week ago",
    },
    {
      id: 3,
      query: "Market price for rice in my area",
      status: "pending",
      date: "3 days ago",
    },
  ]

  useEffect(() => {
    setIsVisible(true)
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        village: user.village,
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setFormData({
        fullName: user ? `${user.firstName} ${user.lastName}` : "",
        village: user?.village || "",
        query: "",
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      case "inProgress":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <HamburgerMenu />
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-lg font-bold text-foreground gradient-text">{t.title}</span>
            </div>
          </div>

          {/* Language Selector, Notification Bell, and Theme Toggle */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className={`container mx-auto px-4 py-6 space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        {/* Success Message */}
        {showSuccess && (
          <Card className="border-green-200 bg-green-50 animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">{t.form.success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card className="glass-effect animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {t.subtitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.form.fullName}</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t.placeholders.fullName}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village">{t.form.village}</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder={t.placeholders.village}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query">{t.form.query}</Label>
                  <Textarea
                    id="query"
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    placeholder={t.placeholders.query}
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t.form.submit}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Free Helpline</div>
                    <div className="text-sm text-muted-foreground">1800-XXX-XXXX</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-muted-foreground">support@krishimitra.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Office Address</div>
                    <div className="text-sm text-muted-foreground">
                      Agricultural Advisory Center, Mumbai, Maharashtra
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Support Hours</div>
                    <div className="text-sm text-muted-foreground">24/7 Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Queries */}
            <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Queries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentQueries.map((query, index) => (
                  <div
                    key={query.id}
                    className="border-l-4 border-primary/30 pl-3 space-y-1 animate-fade-in"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{query.query}</h4>
                      {getStatusBadge(query.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{query.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
