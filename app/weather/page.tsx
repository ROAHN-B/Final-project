"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets, ArrowLeft, Calendar, MapPin, AlertTriangle, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "@/components/language-selector";
import { NotificationBell } from "@/components/notification-bell";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

/* ---------- helpers ---------- */
const getWeatherIcon = (iconCode: string, size = "h-16 w-16") => {
  if (iconCode?.startsWith("01")) return <Sun className={`${size} text-yellow-400`} />;
  if (iconCode?.startsWith("02")) return <Sun className={`${size} text-yellow-400 opacity-80`} />;
  if (iconCode?.startsWith("03") || iconCode?.startsWith("04")) return <Cloud className={`${size} text-gray-400`} />;
  if (iconCode?.startsWith("09") || iconCode?.startsWith("10")) return <CloudRain className={`${size} text-blue-400`} />;
  if (iconCode?.startsWith("13")) return <CloudRain className={`${size} text-blue-200`} />;
  if (iconCode?.startsWith("50")) return <Wind className={`${size} text-gray-500`} />;
  return <Cloud className={`${size} text-gray-400`} />;
};

const getWeatherGradient = (iconCode: string) => {
  if (iconCode?.startsWith("01") || iconCode?.startsWith("02")) return "from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50";
  if (iconCode?.startsWith("09") || iconCode?.startsWith("10")) return "from-blue-100 to-gray-200 dark:from-blue-900/50 dark:to-gray-900/50";
  return "from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-900/50";
};

const processForecastData = (list: any[]) => {
  const dailyData: { [key: string]: any } = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!dailyData[date]) dailyData[date] = { temps: [], rains: [], icons: [], descriptions: [] };
    dailyData[date].temps.push(item.main.temp);
    if (item.rain?.["3h"]) dailyData[date].rains.push(item.rain["3h"]);
    const hour = new Date(item.dt * 1000).getUTCHours();
    if (hour >= 12 && hour <= 15) {
      dailyData[date].icons.push(item.weather[0].icon);
      dailyData[date].descriptions.push(item.weather[0].description);
    }
  });
  return Object.keys(dailyData)
    .map((date) => {
      const day = dailyData[date];
      return {
        dt: new Date(date).getTime() / 1000,
        temp: { min: Math.min(...day.temps), max: Math.max(...day.temps) },
        rain: day.rains.reduce((a: number, b: number) => a + b, 0).toFixed(2),
        weather: [{ icon: day.icons[0] || "03d", description: day.descriptions[0] || "Cloudy" }],
      };
    })
    .slice(0, 7);
};

/* ---------- component ---------- */
export default function WeatherPage() {
  const router = useRouter();
  const { translations: t, currentLang } = useLanguage();

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [farmingAdvisory, setFarmingAdvisory] = useState<string[]>([]);

  /* === geolocation === */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setError("Location permission denied. Please enable it in your browser settings.");
        setLoading(false);
      }
    );
  }, []);

  /* === weather + advisory === */
  useEffect(() => {
    if (!location || !API_KEY) {
      if (!API_KEY) {
        setError("API key is missing. Please add it to your .env.local file.");
        setLoading(false);
      }
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=${currentLang}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=${currentLang}`),
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
          if (currentRes.status === 401 || forecastRes.status === 401) throw new Error("Invalid API key. Please check your .env.local file.");
          throw new Error("Failed to fetch weather data. Check your network connection.");
        }

        const current = await currentRes.json();
        const forecast = await forecastRes.json();
        const daily = processForecastData(forecast.list);

        setWeatherData({ current, daily, timezone: current.name });

        /* === multilingual farming prompt === */
        if (daily.length > 1) {
          const tomorrow = daily[1];
          const prompt = (() => {
            const { max, min } = tomorrow.temp;
            const rain = tomorrow.rain;
            const cond = tomorrow.weather[0].description;
            switch (currentLang) {
              case "hi":
                return `कल के मौसम पूर्वानुमान के आधार पर (अधिकतम तापमान: ${max}°C, न्यूनतम तापमान: ${min}°C, वर्षा: ${rain} mm, स्थिति: ${cond}), कृषि के लिए तीन छोटे, कार्यात्मक सुझाव दें। प्रत्येक सुझाव नई पंक्ति में हो।`;
              case "pa":
                return `ਕੱਲ ਦੇ ਮੌਸਮ ਪੂਰਵ ਅਨੁਮਾਨ ਦੇ ਆਧਾਰ 'ਤੇ (ਅਧਿਕਤਮ ਤਾਪਮਾਨ: ${max}°C, ਨਿਊਨਤਮ ਤਾਪਮਾਨ: ${min}°C, ਮੀਂਹ: ${rain} mm, ਹਾਲਤ: ${cond}), ਖੇਤੀਬਾੜੀ ਲਈ ਤਿੰਨ ਛੋਟੇ, ਕਾਰਜਸ਼ੀਲ ਸੁਝਾਅ ਦਿਓ। ਹਰ ਸੁਝਾਅ ਨਵੀਂ ਲਾਈਨ ਵਿੱਚ ਹੋਵੇ।`;
              case "ta":
                return `நாளைய வானிலை முன்னறிவிப்பின் அடிப்படையில் (அதிகபட்ச வெப்பநிலை: ${max}°C, குறைந்தபட்ச வெப்பநிலை: ${min}°C, மழை: ${rain} mm, நிலை: ${cond}), விவசாயத்திற்கான மூன்று சிறிய, செயல்படக்கூடிய ஆலோசனைகளை வழங்கவும்। ஒவ்வொரு ஆலோசனையும் புதிய வரியில் இருக்க வேண்டும்।`;
              case "kn":
                return `ನಾಳೆಯ ಹವಾಮಾನ ಪೂರ್ವಾನುಮಾನದ ಆಧಾರದಲ್ಲಿ (ಗರಿಷ್ಠ ತಾಪಮಾನ: ${max}°C, ಕನಿಷ್ಠ ತಾಪಮಾನ: ${min}°C, ಮಳೆ: ${rain} mm, ಸ್ಥಿತಿ: ${cond}), ಕೃಷಿಗಾಗಿ ಮೂರು ಚಿಕ್ಕ, ಕ್ರಿಯಾತ್ಮಕ ಸಲಹೆಗಳನ್ನು ನೀಡಿ। ಪ್ರತಿ ಸಲಹೆಯು ಹೊಸ ಸಾಲಿನಲ್ಲಿ ಇರಬೇಕು।`;
              case "mr":
                return `उद्याच्या हवामान अंदाजाच्या आधारे (कमाल तापमान: ${max}°C, किमान तापमान: ${min}°C, पाऊस: ${rain} mm, स्थिती: ${cond}), शेतीसाठी तीन छोटे, उपयुक्त सूचना द्या। प्रत्येक सूचना नव्या ओळीत असावी।`;
              default:
                return `Based on tomorrow’s forecast (max temp: ${max}°C, min temp: ${min}°C, rain: ${rain} mm, condition: ${cond}), give exactly 3 short, actionable farming tips. One tip per line.`;
            }
          })();

          const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          });
          if (res.ok) {
            const text = await res.json();
            setFarmingAdvisory(
              text
                .split("\n")
                .map((l: string) => l.trim().replace(/^(\d+\.|-|\*)\s*/, ""))
                .filter(Boolean)
            );
          } else {
            setFarmingAdvisory(["Could not generate AI advisory."]);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, currentLang]);

  /* ---------- render ---------- */
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Sun className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">{t.dashboard?.weather?.loading || "Fetching your local weather..."}</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive font-semibold">{t.dashboard?.weather?.errorTitle || "An Error Occurred"}</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold text-foreground">{t.features?.weather || "Weather"}</span>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {weatherData && (
        <main className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
          {/* Current Weather */}
          <Card className={`bg-gradient-to-br ${getWeatherGradient(weatherData.current.weather[0].icon)} transition-all duration-500`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-semibold text-foreground/80">
                <MapPin className="h-5 w-5" />
                {weatherData.timezone}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              {getWeatherIcon(weatherData.current.weather[0].icon)}
              <div className="text-6xl font-bold mt-2">{Math.round(weatherData.current.main.temp)}°C</div>
              <div className="text-xl text-muted-foreground capitalize mt-1">{weatherData.current.weather[0].description}</div>
              <div className="text-sm text-muted-foreground">{t.dashboard?.weather?.feelsLike || "Feels like"} {Math.round(weatherData.current.main.feels_like)}°C</div>

              <div className="w-full grid grid-cols-2 gap-4 mt-6 text-sm">
                <div className="flex items-center justify-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>{t.dashboard?.weather?.humidity || "Humidity"}: <strong>{weatherData.current.main.humidity}%</strong></span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <span>{t.profile?.fields?.windSpeed || "Wind"}: <strong>{weatherData.current.wind.speed} m/s</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farming Advisory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5 text-primary" /> {t.dashboard?.weather?.farmingAdvisory || "Farming Advisory"}
              </CardTitle>
              <CardDescription>{t.dashboard?.weather?.basedOnForecast || "Based on tomorrow's forecast"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-disc list-inside text-sm text-muted-foreground">
                {farmingAdvisory.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> {t.dashboard?.weatherDesc || "7-Day Forecast"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weatherData.daily.map((day: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-semibold w-1/4">{new Date(day.dt * 1000).toLocaleDateString(currentLang, { weekday: "long" })}</div>
                    <div className="flex items-center justify-center w-1/4">{getWeatherIcon(day.weather[0].icon, "h-8 w-8")}</div>
                    <div className="w-1/4 text-center text-sm text-blue-500 font-medium">{day.rain > 0 ? `${day.rain} mm` : ""}</div>
                    <div className="text-right font-semibold w-1/4">
                      <span>{Math.round(day.temp.max)}°</span>
                      <span className="text-muted-foreground"> / {Math.round(day.temp.min)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
}