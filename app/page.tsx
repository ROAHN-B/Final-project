"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Camera,
  TrendingUp,
  Leaf,
  Users,
  Phone,
  ArrowDown,
  Star,
  Shield,
  Zap,
  CreditCard,
  MessageSquare,
  Sprout,
  BarChart3,
  CloudRain,
} from "lucide-react"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSelector } from "@/components/language-selector"
import { NotificationBell } from "@/components/notification-bell"
import { BottomNavigation } from "@/components/bottom-navigation"
import Autoplay from "embla-carousel-autoplay"

interface FeatureCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  badgeText: string;
  BadgeIcon: React.ElementType;
  animationDelay?: string;
}

function FeatureCard({ Icon, title, description, badgeText, BadgeIcon, animationDelay = "0s" }: FeatureCardProps) {
  return (
    <Card className="group text-center p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm" style={{ animationDelay }}>
      <CardHeader className="pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl text-balance font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base text-pretty leading-relaxed">
          {description}
        </CardDescription>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <BadgeIcon className="h-4 w-4 mr-2" />
          {badgeText}
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  const { translations: t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => {
      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight - 150) {
          element.classList.add("animate-fade-in")
        }
      })
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavigation = (path: string) => router.push(path)
  const scrollToFeatures = () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })

  const carouselImages = [
    { src: "/carousel-1.webp", alt: "Farmer with technology", title: t.features?.cropAdvisory || "", description: t.features?.cropAdvisoryDesc || "" },
    { src: "/carousel-2.webp", alt: "Tractor in a field", title: t.ads?.equipment || "Modern Equipment", description: t.ads?.equipmentDesc || "Find the best deals on farming machinery." },
    { src: "/carousel-3.webp", alt: "Healthy wheat crop", title: t.features?.soilHealth || "Soil Health", description: t.features?.soilHealthDesc || "Analyze soil health and get recommendations." },
    { src: "/carousel-4.webp", alt: "Agronomist with tablet", title: t.features?.chatBot || "Expert ChatBot", description: t.features?.chatBotDesc || "Chat with an AI agronomist for instant solutions." },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto container-padding py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text text-balance">{t.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto container-padding py-6">
          <Carousel
            className="w-full"
            plugins={[Autoplay({ delay: 4000 })]}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="overflow-hidden relative aspect-video md:aspect-[2.4/1]">
                      <CardContent className="p-0 h-full">
                        <img src={image.src} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                        <div className="relative h-full flex flex-col justify-end p-6 text-white">
                          <h3 className="text-xl font-bold drop-shadow-lg">{image.title}</h3>
                          <p className="text-sm text-white/90 drop-shadow-md mt-1">{image.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </section>

        <section className={`section-padding ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <div className="container mx-auto container-padding text-center">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="space-y-6">
                <h1 className="heading-responsive font-bold gradient-text text-balance animate-slide-up">{t.title}</h1>
                <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>{t.subtitle}</p>
                <p className="text-responsive text-muted-foreground max-w-2xl mx-auto text-pretty animate-slide-up" style={{ animationDelay: "0.4s" }}>{t.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: "0.6s" }}>
                <Button size="lg" className="text-lg px-8 py-6 h-auto min-w-48 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" onClick={() => handleNavigation(isAuthenticated ? "/dashboard" : "/login")}>
                  <Camera className="mr-3 h-5 w-5" />
                  {t.getStarted}
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto min-w-48 rounded-xl font-semibold border-2 hover:bg-secondary hover:scale-105 transition-all duration-300 bg-transparent" onClick={() => handleNavigation("/market")}>
                  <TrendingUp className="mr-3 h-5 w-5" />
                  {t.features?.marketPrice || "Market"}
                </Button>
              </div>
              <div className="mt-12 animate-bounce cursor-pointer" onClick={scrollToFeatures}>
                <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <ArrowDown className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{t.exploreFeatures || "Explore Features"}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section-padding animate-on-scroll">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text text-balance mb-4">{t.features?.mainTitle || "Powerful Features for Modern Farming"}</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">{t.features?.mainDescription || "Advanced AI technology meets traditional farming wisdom..."}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard Icon={Sprout} title={t.features?.cropAdvisory || ""} description={t.features?.cropAdvisoryDesc || ""} badgeText={t.features?.aiPowered || "AI Powered"} BadgeIcon={Star} />
              <FeatureCard Icon={BarChart3} title={t.features?.marketPrice || ""} description={t.features?.marketPriceDesc || ""} badgeText={t.features?.realTime || "Real-time"} BadgeIcon={Zap} animationDelay="0.2s" />
              <FeatureCard Icon={CloudRain} title={t.features?.weather || ""} description={t.features?.weatherDesc || ""} badgeText={t.features?.accurate || "Accurate"} BadgeIcon={Shield} animationDelay="0.4s" />
              <FeatureCard Icon={MessageSquare} title={t.features?.chatBot || ""} description={t.features?.chatBotDesc || ""} badgeText={t.features?.support277 || "24/7 Support"} BadgeIcon={Users} animationDelay="0.6s" />
              <FeatureCard Icon={Shield} title={t.menu?.schemes || "Government Schemes"} description={t.features?.schemesDesc || "Government schemes information..."} badgeText={t.features?.schemesBadge || "Government"} BadgeIcon={CreditCard} animationDelay="0.8s" />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-secondary/30 to-accent/20 section-padding animate-on-scroll">
          <div className="container mx-auto container-padding text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text text-balance">{t.supportSection?.title || "24/7 Farmer Support"}</h2>
              <p className="text-lg text-muted-foreground text-pretty">{t.supportSection?.description || "Get help in your local language from our agricultural experts"}</p>
              <div className="inline-flex items-center gap-3 bg-card px-6 py-4 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">{t.support}</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-card/30 section-padding">
          <div className="container mx-auto container-padding text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold gradient-text">{t.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.footer?.copyright || "© 2024 KrishiMitra. Empowering farmers with technology."}</p>
          </div>
        </footer>
      </main>

      <BottomNavigation />
    </div>
  )
}