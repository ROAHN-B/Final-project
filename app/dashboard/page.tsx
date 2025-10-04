// app/dashboard/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  TrendingUp,
  Leaf,
  MicIcon,
  Volume2,
  Stethoscope,
  MessageCircle,
  Sprout,
  BarChart3,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  ShieldCheck,
  History,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useAdvisory } from "@/contexts/AdvisoryContext"
import { LanguageSelector } from "@/components/language-selector"
import { BottomNavigation } from "@/components/bottom-navigation"
import { NotificationBell } from "@/components/notification-bell"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/hooks/use-toast"

interface VoiceMessage {
  role: "user" | "bot";
  text: string;
  html?: string;
}

interface VoiceChat {
  id: string;
  title: string;
  timestamp: number;
  messages: VoiceMessage[];
}

// Weather data interface
interface WeatherData {
  temp: string;
  condition: string;
  humidity: string;
  rainfall: string;
}

export default function Dashboard() {
  const { translations: t, currentLang } = useLanguage()
  const { user } = useAuth()
  const { advisories, latestSoilReport } = useAdvisory()
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing">("idle")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const [voiceHistory, setVoiceHistory] = useState<VoiceChat[]>([]);
  const [activeVoiceChatId, setActiveVoiceChatId] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true)
    const savedHistory = localStorage.getItem("krishi-mitra-voice-history");
    if (savedHistory) {
      try {
        setVoiceHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse voice history from localStorage", e);
      }
    }

    // Fetch weather data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
          const data = await response.json();
          setWeatherData({
            temp: `${Math.round(data.main.temp)}°C`,
            condition: data.weather[0].main,
            humidity: `${data.main.humidity}%`,
            rainfall: data.rain ? `${data.rain['1h']}mm` : '0mm'
          });
        } catch (error) {
          console.error(error);
          // Set to default if API fails
          setWeatherData(t.dashboard.weather);
        } finally {
          setWeatherLoading(false);
        }
      }, () => {
        // Geolocation denied, use default
        setWeatherData(t.dashboard.weather);
        setWeatherLoading(false);
      });
    } else {
      // Geolocation not supported, use default
      setWeatherData(t.dashboard.weather);
      setWeatherLoading(false);
    }
  }, [t.dashboard.weather]);

  useEffect(() => {
    localStorage.setItem("krishi-mitra-voice-history", JSON.stringify(voiceHistory));
  }, [voiceHistory]);

  const mdToHtml = (md: string): string =>
  md.replace(/^## (.*$)/gim, "<h2 class='font-bold text-lg mt-4 mb-2 text-foreground'>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-foreground'>$1</strong>")
    .replace(/^[\*\-] (.*$)/gim, "<li class='ml-4 my-1 list-disc'>$1</li>")
    .replace(/\n/g, "<br />");

  const KRISHI_INTRO: Record<string, string> = {
    en: "Hi, I am Krishi Mitra, your agriculture assistant. How can I help you today?",
    hi: "नमस्ते, मैं कृषि मित्र हूँ, आपका कृषि सहायक। मैं आपकी कैसे मदद कर सकता हूँ?",
    mr: "नमस्कार, मी कृषी मित्र आहे, तुमचा कृषी सहाय्यक। मी तुम्हाला कशात मदत करू शकतो?",
    pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਹਾਂ, ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    kn: "ನಮಸ್ಕಾರ, ನಾನು ಕೃಷಿ ಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ। ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    ta: "வணக்கம், நான் கிருஷி மித்ரா, உங்கள் விவசாய உதவியாளர்। நான் உங்களுக்கு எப்படி உதவ முடியும்?",
  }

  const handleVoiceActivation = async () => {
    if (voiceStatus !== "idle") return

    window.speechSynthesis.cancel()
    setVoiceStatus("listening")

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.")
      setVoiceStatus("idle")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = currentLang === "en" ? "en-US" : currentLang
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    let heard = false
    recognition.onresult = (e: any) => {
      heard = true
      const transcript = e.results[0][0].transcript.trim()
      recognition.stop()
      setFinalTranscript(transcript)
      askGemini(transcript)
    }

    recognition.onerror = () => {
      if (!heard) setVoiceStatus("idle")
    }

    recognition.onend = () => {
      if (!heard) {
        const intro = KRISHI_INTRO[currentLang] || KRISHI_INTRO.en
        speak(intro)
      }
    }

    recognition.start()
    setTimeout(() => {
      if (!heard) recognition.stop()
    }, 6_000)
  }

  async function askGemini(q: string) {
    setVoiceStatus("processing")
    
    let soilDataContext = "";
    let soilCardPrefix = "";

    const farmingKeywords = ["crop", "soil", "fertilizer", "pesticide", "irrigation", "harvest", "planting", "sowing", "weather", "market price", "farm", "cultivation"];
    const isFarmingQuery = farmingKeywords.some(keyword => q.toLowerCase().includes(keyword));

    if (latestSoilReport && isFarmingQuery) {
      const reportDate = new Date(latestSoilReport.timestamp).toLocaleDateString(currentLang);
      const reportEntries = Object.entries(latestSoilReport)
        .filter(([key, value]) => key !== 'timestamp' && value !== undefined && value !== null && !isNaN(Number(value)))
        .map(([key, value]) => `  - ${key.toUpperCase()}: ${value}`)
        .join("\n");

      if (reportEntries) {
          soilDataContext = `
---
IMPORTANT CONTEXT: USER'S LATEST SOIL HEALTH REPORT (from ${reportDate})
This is the user's latest soil health data. You MUST use this information to provide precise, customized farming advice about nutrient management, appropriate crops, or fertilizer recommendations.
Soil Data (Key/Value):
${reportEntries}
---
`;
        
        const prefixMap: Record<string, string> = {
            en: "According to your soil health card...",
            hi: "आपके मृदा स्वास्थ्य कार्ड के अनुसार...",
            mr: "तुमच्या मृदा आरोग्य पत्रिकेनुसार...",
            pa: "ਤੁਹਾਡੇ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਦੇ ਅਨੁਸਾਰ...",
            kn: "ನಿಮ್ಮ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪ್ರಕಾರ...",
            ta: "உங்கள் மண் சுகாதார அட்டைப்படி...",
        };
        
        soilCardPrefix = `You must start your response with the exact phrase: "${prefixMap[currentLang] || prefixMap.en}".`;
      }
    }

    const system = `You are Krishi Mitra, an expert Indian agriculture assistant.
${soilDataContext}
${soilCardPrefix}
You MUST reply only in the ${currentLang} language, using simple words.
Provide a short, 6-5 sentence answer.
Prioritize safe, practical, and low-cost advice.you have knowledge of every crop and state specific crop as well.
For clear audio, do not use emojis or end your reply with the letter 'n'.
User asks: ${q}
Krishi Mitra:`
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: system }),
      })
      if (!res.ok) throw new Error("Network error")

      let text = await res.text()
      text = text.replace(/[\r\n\t]+/g, " ").trim().replace(/n$/i, "").trim()
      if (!text) throw new Error("Empty reply")
      
      const newChat: VoiceChat = {
        id: Date.now().toString(),
        title: q,
        timestamp: Date.now(),
        messages: [
          { role: "user", text: q },
          { role: "bot", text: text, html: mdToHtml(text) },
        ],
      };
      setVoiceHistory(prev => [newChat, ...prev]);
      setActiveVoiceChatId(newChat.id);

      speak(text)
    } catch {
      const fallback: Record<string, string> = {
        en: "Please check your connection or ask again.",
        hi: "कृपया अपना कनेक्शन जांचें या फिर से पूछें।",
        mr: "कृपया आपला कनेक्शन तपासा किंवा पुन्हा विचारा।",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਜਾਂ ਦੁਬਾਰਾ ਪੁੱਛੋ।",
        kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಮತ್ತೆ ಕೇಳಿ।",
        ta: "உங்கள் இணைப்பை சரிபார்க்கவும் அல்லது மீண்டும் கேளுங்கள்।",
      }
      speak(fallback[currentLang] || fallback.en)
    }
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("idle")
      return
    }
    window.speechSynthesis.cancel()
    const voiceMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      mr: "mr-IN",
      pa: "pa-IN",
      kn: "kn-IN",
      ta: "ta-IN",
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = voiceMap[currentLang] || "hi-IN"
    utter.rate = 0.9
    utter.onend = () => setVoiceStatus("idle")
    window.speechSynthesis.speak(utter)
  }

  const getVoiceStatusText = () => {
    switch (voiceStatus) {
      case "listening":
        return t.dashboard.voiceListening
      case "processing":
        return t.dashboard.voiceProcessing
      default:
        return t.dashboard.voicePrompt
    }
  }

  const handleNavigation = (path: string) => router.push(path)

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
              <span className="text-xl font-bold gradient-text">{t.dashboard.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className={`section-padding ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        <div className="container mx-auto container-padding space-y-8">
          <div className="text-center space-y-4 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text text-balance">
              {t.dashboard.welcome}, {user?.firstName || "Farmer"}!
            </h1>
            <p className="text-lg text-muted-foreground">{t.dashboard.welcomeSubtitle}</p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 border-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] animate-scale-in"
            style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-8 md:p-12 text-center">
              <div className="space-y-6">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-lg">
                  {voiceStatus === "listening" ? (
                    <div className="relative">
                      <MicIcon className="h-12 w-12 text-primary-foreground animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/30 animate-ping" />
                    </div>
                  ) : voiceStatus === "processing" ? (
                    <Volume2 className="h-12 w-12 text-primary-foreground animate-bounce" />
                  ) : (
                    <MicIcon className="h-12 w-12 text-primary-foreground" />
                  )}
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                    {getVoiceStatusText()}
                  </h2>
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      size="lg"
                      onClick={handleVoiceActivation}
                      disabled={voiceStatus !== "idle"}
                      className="text-lg px-10 py-6 h-auto rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Mic className="mr-3 h-6 w-6" />
                      {t.dashboard.speakNow}
                    </Button>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          size="lg"
                          className="text-lg px-8 py-6 h-auto rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          <History className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full max-w-md p-0">
                        <SheetHeader className="p-4 border-b">
                          <SheetTitle>{t.dashboard.conversationHistory}</SheetTitle>
                        </SheetHeader>
                        <div className="h-full overflow-y-auto p-4 space-y-4">
                          {voiceHistory.length > 0 ? voiceHistory.map(chat => (
                            <Card key={chat.id} className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-sm">{chat.title}</h4>
                                  <p className="text-xs text-muted-foreground">{new Date(chat.timestamp).toLocaleString()}</p>
                                </div>
                              </div>
                              {chat.messages.map((msg, index) => (
                                <div key={index} className="mb-2 text-left">
                                  <p className={`font-semibold text-sm ${msg.role === 'user' ? 'text-primary' : 'text-foreground'}`}>
                                    {msg.role === 'user' ? 'You:' : 'Krishi-Mitra:'}
                                  </p>
                                  <div className="flex items-start justify-between">
                                    <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: msg.html || msg.text }}></div>
                                    {msg.role === 'bot' && (
                                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => speak(msg.text)}>
                                        <Volume2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </Card>
                          )) : (
                            <p className="text-sm text-muted-foreground text-center mt-8">No history yet.</p>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">{t.dashboard.quickActions}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard icon={<Stethoscope />} title={t.dashboard.actions.cropDiagnosis} description={t.dashboard.actions.cropDiagnosisDesc} onClick={() => handleNavigation("/diagnose")} />
              <QuickActionCard icon={<BarChart3 />} title={t.dashboard.actions.marketPrices} description={t.dashboard.actions.marketPricesDesc} onClick={() => handleNavigation("/market")} />
              <QuickActionCard icon={<CloudRain />} title={t.dashboard.actions.weather} description={t.dashboard.actions.weatherDesc} onClick={() => handleNavigation("/weather")} />
              <QuickActionCard icon={<MessageCircle />} title={t.dashboard.actions.community} description={t.dashboard.actions.communityDesc} onClick={() => handleNavigation("/community")} />
              
              <QuickActionCard 
                icon={<ShieldCheck />} 
                title={t.dashboard.actions.governmentSchemes} 
                description={t.dashboard.actions.governmentSchemesDesc} 
                onClick={() => handleNavigation("/schemes")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  {t.dashboard.recentAdvisories}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {advisories.map((advisory, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border-l-4 border-primary space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-balance">{advisory.title}</h4>
                      <Badge variant={advisory.priority === "high" ? "destructive" : "secondary"} className="text-xs px-2 py-1">{advisory.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground text-pretty">{advisory.description}</p>
                    <p className="text-xs text-muted-foreground font-medium">{advisory.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card/50 to-accent/5 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Sun className="h-5 w-5 text-accent-foreground" />
                  </div>
                  {t.dashboard.todayWeather}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {weatherLoading ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : weatherData ? (
                  <>
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{weatherData.temp}</div>
                      <div className="text-base text-muted-foreground font-medium">{weatherData.condition}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-card/50 rounded-2xl">
                        <Droplets className="h-5 w-5 text-primary mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground">{t.profile.fields.humidity}</div>
                        <div className="font-bold text-foreground">{weatherData.humidity}</div>
                      </div>
                      <div className="text-center p-3 bg-card/50 rounded-2xl">
                        <Wind className="h-5 w-5 text-primary mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground">{t.profile.fields.rainfall}</div>
                        <div className="font-bold text-foreground">{weatherData.rainfall}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Could not load weather data.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  {t.dashboard.marketPrices}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.dashboard.prices.map((price, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-secondary/30 to-transparent rounded-2xl">
                    <div>
                      <div className="font-semibold text-base text-foreground">{price.crop}</div>
                      <div className="text-sm text-muted-foreground font-medium">{price.price}</div>
                    </div>
                    <Badge variant={price.change.startsWith("+") ? "default" : "destructive"} className="text-sm px-3 py-1 font-semibold">{price.change}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

function QuickActionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-card/50 backdrop-blur-sm" onClick={onClick}>
      <CardContent className="p-6 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 text-primary-foreground" })}
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-base text-balance">{title}</h3>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}