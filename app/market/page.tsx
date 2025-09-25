"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  MapPin,
  Calendar,
  BarChart3,
  Leaf,
  RefreshCw,
  Phone,
  AlertCircle,
  LoaderCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import { BottomNavigation } from "@/components/bottom-navigation"
import { NotificationBell } from "@/components/notification-bell"
import { useLanguage } from "@/contexts/language-context"
import { HamburgerMenu } from "@/components/hamburger-menu"

// Language support for market intelligence
const marketLanguages = {
  en: {
    title: "Market Intelligence",
    subtitle: "Live Market Prices & Trends",
    selectLocation: "Select Location",
    selectCrop: "Select Crop",
    todayPrices: "Today's Prices",
    priceHistory: "Price History",
    marketAnalysis: "Market Analysis",
    lastUpdated: "Last updated: 2 minutes ago",
    priceChange: "Price Change",
    marketTrend: "Market Trend",
    marketComparison: "Market Comparison",
    trendAnalysis: "Trend Analysis",
    trendAnalysisText:
      "Prices have shown a {trend} trend over the past month. Current market conditions suggest this trend may continue in the short term.",
    expertConsultation: "Expert Consultation",
    expertConsultationText: "Need personalized market advice? Connect with our agricultural market experts.",
    callExpert: "Call Market Expert",
    findingMarkets: "Finding Local Markets...",
    allowLocation: "Please allow location access to get the most relevant market data.",
    defaultingLocation: "(Defaulting to Solapur if access is denied)",
    week: "Week",
    locations: {
      mumbai: "Mumbai",
      pune: "Pune",
      nashik: "Nashik",
      solapur: "Solapur",
      chennai: "Chennai",
      coimbatore: "Coimbatore",
      bangalore: "Bangalore",
      mysore: "Mysore",
      ludhiana: "Ludhiana",
      amritsar: "Amritsar",
    },
    crops: {
      cotton: "Cotton",
      wheat: "Wheat",
      rice: "Rice",
      sugarcane: "Sugarcane",
      onion: "Onion",
      tomato: "Tomato",
      potato: "Potato",
      soybean: "Soybean",
    },
    insights: {
      title: "Market Insights",
      demand: "High demand expected for cotton in next 2 weeks",
      weather: "Weather conditions favorable for wheat harvest",
      export: "Export opportunities increasing for rice varieties",
    },
    recommendations: {
      title: "Selling Recommendations",
      timing: "Best Time to Sell",
      price: "Expected Price Range",
      market: "Recommended Market",
    },
    trends: {
      rising: "rising",
      falling: "falling",
      stable: "stable",
    },
  },
  hi: {
    title: "बाजार बुद्धिमत्ता",
    subtitle: "थेट बाजार भाव और ट्रेंड",
    selectLocation: "स्थान चुनें",
    selectCrop: "फसल चुनें",
    todayPrices: "आज के भाव",
    priceHistory: "भाव इतिहास",
    marketAnalysis: "बाजार विश्लेषण",
    lastUpdated: "अंतिम अपडेट: 2 मिनट पहले",
    priceChange: "भाव परिवर्तन",
    marketTrend: "बाजार ट्रेंड",
    marketComparison: "बाजार तुलना",
    trendAnalysis: "ट्रेंड विश्लेषण",
    trendAnalysisText:
      "पिछले महीने में कीमतों में {trend} की प्रवृत्ति देखी गई है। वर्तमान बाजार की स्थितियाँ बताती हैं कि यह प्रवृत्ति अल्पावधि में जारी रह सकती है।",
    expertConsultation: "विशेषज्ञ परामर्श",
    expertConsultationText: "व्यक्तिगत बाजार सलाह चाहिए? हमारे कृषि बाजार विशेषज्ञों से जुड़ें।",
    callExpert: "बाजार विशेषज्ञ को कॉल करें",
    findingMarkets: "स्थानीय बाजार ढूँढ़ रहा है...",
    allowLocation: "सबसे प्रासंगिक बाजार डेटा प्राप्त करने के लिए कृपया स्थान पहुंच की अनुमति दें।",
    defaultingLocation: "(पहुंच अस्वीकार होने पर सोलापुर में डिफॉल्ट)",
    week: "सप्ताह",
    locations: {
      mumbai: "मुंबई",
      pune: "पुणे",
      nashik: "नाशिक",
      solapur: "सोलापुर",
      chennai: "चेन्नई",
      coimbatore: "कोयंबटूर",
      bangalore: "बेंगलुरु",
      mysore: "मैसूर",
      ludhiana: "लुधियाना",
      amritsar: "अमृतसर",
    },
    crops: {
      cotton: "कपास",
      wheat: "गेहूं",
      rice: "चावल",
      sugarcane: "गन्ना",
      onion: "प्याज",
      tomato: "टमाटर",
      potato: "आलू",
      soybean: "सोयाबीन",
    },
    insights: {
      title: "बाजार अंतर्दृष्टि",
      demand: "अगले 2 हफ्तों में कपास की उच्च मांग अपेक्षित",
      weather: "गेहूं की कटाई के लिए मौसम अनुकूल",
      export: "चावल की किस्मों के लिए निर्यात के अवसर बढ़ रहे हैं",
    },
    recommendations: {
      title: "बिक्री सिफारिशें",
      timing: "बेचने का सबसे अच्छा समय",
      price: "अपेक्षित मूल्य सीमा",
      market: "अनुशंसित बाजार",
    },
    trends: {
      rising: "बढ़ती",
      falling: "गिरती",
      stable: "स्थिर",
    },
  },
  mr: {
    title: "बाजार बुद्धिमत्ता",
    subtitle: "थेट बाजार भाव आणि ट्रेंड",
    selectLocation: "स्थान निवडा",
    selectCrop: "पीक निवडा",
    todayPrices: "आजचे भाव",
    priceHistory: "भावाचा इतिहास",
    marketAnalysis: "बाजार विश्लेषण",
    lastUpdated: "शेवटचे अपडेट: २ मिनिटांपूर्वी",
    priceChange: "भाव बदल",
    marketTrend: "बाजार ट्रेंड",
    marketComparison: "बाजार तुलना",
    trendAnalysis: "ट्रेंड विश्लेषण",
    trendAnalysisText:
      "गेल्या महिन्यात भावांमध्ये {trend} ची प्रवृत्ती दिसून आली आहे. सध्याच्या बाजाराची परिस्थिती दर्शवते की ही प्रवृत्ती अल्प कालावधीसाठी सुरू राहू शकते.",
    expertConsultation: "तज्ञ सल्ला",
    expertConsultationText: "वैयक्तिकृत बाजार सल्ला हवा आहे का? आमच्या कृषी बाजार तज्ञांशी संपर्क साधा.",
    callExpert: "बाजार तज्ञांना कॉल करा",
    findingMarkets: "स्थानिक बाजारपेठ शोधत आहे...",
    allowLocation: "सर्वात संबंधित बाजार डेटा मिळविण्यासाठी कृपया स्थान प्रवेशास अनुमती द्या.",
    defaultingLocation: "(प्रवेश नाकारल्यास सोलापूरमध्ये डीफॉल्ट)",
    week: "आठवडा",
    locations: {
      mumbai: "मुंबई",
      pune: "पुणे",
      nashik: "नाशिक",
      solapur: "सोलापूर",
      chennai: "चेन्नई",
      coimbatore: "कोयंबटूर",
      bangalore: "बंगळूर",
      mysore: "मैसूर",
      ludhiana: "लुधियाना",
      amritsar: "अमृतसर",
    },
    crops: {
      cotton: "कापूस",
      wheat: "गहू",
      rice: "तांदूळ",
      sugarcane: "ऊस",
      onion: "कांदा",
      tomato: "टोमॅटो",
      potato: "बटाटा",
      soybean: "सोयाबीन",
    },
    insights: {
      title: "बाजार अंतर्दृष्टी",
      demand: "पुढील २ आठवड्यांत कापसाची मोठी मागणी अपेक्षित",
      weather: "गव्हाच्या कापणीसाठी हवामान अनुकूल",
      export: "तांदूळ जातींसाठी निर्यात संधी वाढत आहेत",
    },
    recommendations: {
      title: "विक्री शिफारसी",
      timing: "विक्रीचा सर्वोत्तम वेळ",
      price: "अपेक्षित भाव श्रेणी",
      market: "शिफारस केलेले बाजार",
    },
    trends: {
      rising: "वाढणारी",
      falling: "घसरण",
      stable: "स्थिर",
    },
  },
  ta: {
    title: "சந்தை நுண்ணறிவு",
    subtitle: "நேரடி சந்தை விலைகள் மற்றும் போக்குகள்",
    selectLocation: "இடத்தைத் தேர்ந்தெடுக்கவும்",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    todayPrices: "இன்றைய விலைகள்",
    priceHistory: "விலை வரலாறு",
    marketAnalysis: "சந்தை பகுப்பாய்வு",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது: 2 நிமிடங்களுக்கு முன்பு",
    priceChange: "விலை மாற்றம்",
    marketTrend: "சந்தை போக்கு",
    marketComparison: "சந்தை ஒப்பீடு",
    trendAnalysis: "போக்கு பகுப்பாய்வு",
    trendAnalysisText:
      "கடந்த மாதத்தில் விலைகள் {trend} போக்கைக் காட்டியுள்ளன. தற்போதைய சந்தை நிலைமைகள் இந்த போக்கு குறுகிய காலத்தில் தொடரக்கூடும் என்று கூறுகின்றன.",
    expertConsultation: "நிபுணர் ஆலோசனை",
    expertConsultationText: "தனிப்பயனாக்கப்பட்ட சந்தை ஆலோசனை தேவையா? எங்கள் விவசாய சந்தை நிபுணர்களுடன் இணையுங்கள்.",
    callExpert: "சந்தை நிபுணரை அழைக்கவும்",
    findingMarkets: "உள்ளூர் சந்தைகளைக் கண்டறிகிறது...",
    allowLocation: "மிகவும் பொருத்தமான சந்தைத் தரவைப் பெற இருப்பிட அணுகலை அனுமதிக்கவும்.",
    defaultingLocation: "(அணுகல் மறுக்கப்பட்டால் சோலாபூருக்கு இயல்புநிலையாகிறது)",
    week: "வாரம்",
    locations: {
      mumbai: "மும்பை",
      pune: "புனே",
      nashik: "நாசிக்",
      solapur: "சோலாப்பூர்",
      chennai: "சென்னை",
      coimbatore: "கோயம்புத்தூர்",
      bangalore: "பெங்களூரு",
      mysore: "மைசூர்",
      ludhiana: "லுதியானா",
      amritsar: "அம்ரித்சர்",
    },
    crops: {
      cotton: "பருத்தி",
      wheat: "கோதுமை",
      rice: "அரிசி",
      sugarcane: "கரும்பு",
      onion: "வெங்காயம்",
      tomato: "தக்காளி",
      potato: "உருளைக்கிழங்கு",
      soybean: "சோயாபீன்",
    },
    insights: {
      title: "சந்தை நுண்ணறிவுகள்",
      demand: "அடுத்த 2 வாரங்களில் பருத்திக்கு அதிக தேவை எதிர்பார்க்கப்படுகிறது",
      weather: "கோதுமை அறுவடைக்கு வானிலை சாதகமாக உள்ளது",
      export: "அரிசி வகைகளுக்கு ஏற்றுமதி வாய்ப்புகள் அதிகரித்து வருகின்றன",
    },
    recommendations: {
      title: "விற்பனை பரிந்துரைகள்",
      timing: "விற்க சிறந்த நேரம்",
      price: "எதிர்பார்க்கப்படும் விலை வரம்பு",
      market: "பரிந்துரைக்கப்பட்ட சந்தை",
    },
    trends: {
      rising: "உயர்ந்து",
      falling: "குறைந்து",
      stable: "நிலையான",
    },
  },
  kn: {
    title: "ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿವಂತಿಕೆ",
    subtitle: "ನೇರ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು",
    selectLocation: "ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectCrop: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    todayPrices: "ಇಂದಿನ ಬೆಲೆಗಳು",
    priceHistory: "ಬೆಲೆ ಇತಿಹಾಸ",
    marketAnalysis: "ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ",
    lastUpdated: "ಕೊನೆಯ ಬಾರಿ ನವೀಕರಿಸಲಾಗಿದೆ: 2 ನಿಮಿಷಗಳ ಹಿಂದೆ",
    priceChange: "ಬೆಲೆ ಬದಲಾವಣೆ",
    marketTrend: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ",
    marketComparison: "ಮಾರುಕಟ್ಟೆ ಹೋಲಿಕೆ",
    trendAnalysis: "ಪ್ರವೃತ್ತಿ ವಿಶ್ಲೇಷಣೆ",
    trendAnalysisText:
      "ಕಳೆದ ತಿಂಗಳಲ್ಲಿ ಬೆಲೆಗಳು {trend} ಪ್ರವೃತ್ತಿಯನ್ನು ತೋರಿಸಿವೆ. ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಪರಿಸ್ಥಿತಿಗಳು ಈ ಪ್ರವೃತ್ತಿ ಅಲ್ಪಾವಧಿಯಲ್ಲಿ ಮುಂದುವರಿಯಬಹುದು ಎಂದು ಸೂಚಿಸುತ್ತವೆ.",
    expertConsultation: "ತಜ್ಞರ ಸಮಾಲೋಚನೆ",
    expertConsultationText: "ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಮಾರುಕಟ್ಟೆ ಸಲಹೆ ಬೇಕೇ? ನಮ್ಮ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.",
    callExpert: "ಮಾರುಕಟ್ಟೆ ತಜ್ಞರಿಗೆ ಕರೆ ಮಾಡಿ",
    findingMarkets: "ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    allowLocation: "ಅತ್ಯಂತ ಸಂಬಂಧಿತ ಮಾರುಕಟ್ಟೆ ಡೇಟಾವನ್ನು ಪಡೆಯಲು ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ.",
    defaultingLocation: "(ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಿದರೆ ಸೋಲಾಪುರಕ್ಕೆ ಡೀಫಾಲ್ಟ್ ಆಗುತ್ತದೆ)",
    week: "ವಾರ",
    locations: {
      mumbai: "ಮುಂಬೈ",
      pune: "ಪುಣೆ",
      nashik: "ನಾಸಿಕ್",
      solapur: "ಸೊಲ್ಲಾಪುರ",
      chennai: "ಚೆನ್ನೈ",
      coimbatore: "ಕೋಯಂಬತ್ತೂರು",
      bangalore: "ಬೆಂಗಳೂರು",
      mysore: "ಮೈಸೂರು",
      ludhiana: "ಲುಧಿಯಾನಾ",
      amritsar: "ಅಮೃತಸರ",
    },
    crops: {
      cotton: "ಹತ್ತಿ",
      wheat: "ಗೋಧಿ",
      rice: "ಅಕ್ಕಿ",
      sugarcane: "ಕಬ್ಬು",
      onion: "ಈರುಳ್ಳಿ",
      tomato: "ಟೊಮೇಟೊ",
      potato: "ಆಲೂಗಡ್ಡೆ",
      soybean: "ಸೋಯಾಬೀನ್",
    },
    insights: {
      title: "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
      demand: "ಮುಂದಿನ 2 ವಾರಗಳಲ್ಲಿ ಹತ್ತಿಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
      weather: "ಗೋಧಿ ಸುಗ್ಗಿಗೆ ಹವಾಮಾನ ಅನುಕೂಲಕರವಾಗಿದೆ",
      export: "ಅಕ್ಕಿ ಪ್ರಭೇದಗಳಿಗೆ ರಫ್ತು ಅವಕಾಶಗಳು ಹೆಚ್ಚುತ್ತಿವೆ",
    },
    recommendations: {
      title: "ಮಾರಾಟ ಶಿಫಾರಸುಗಳು",
      timing: "ಮಾರಾಟ ಮಾಡಲು ಉತ್ತಮ ಸಮಯ",
      price: "ನಿರೀಕ್ಷಿತ ಬೆಲೆ ಶ್ರೇಣಿ",
      market: "ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರುಕಟ್ಟೆ",
    },
    trends: {
      rising: "ಏರುತ್ತಿರುವ",
      falling: "ಇಳಿಯುತ್ತಿರುವ",
      stable: "ಸ್ಥಿರ",
    },
  },
  pa: {
    title: "ਮਾਰਕੀਟ ਇੰਟੈਲੀਜੈਂਸ",
    subtitle: "ਲਾਈਵ ਮਾਰਕੀਟ ਕੀਮਤਾਂ ਅਤੇ ਰੁਝਾਨ",
    selectLocation: "ਸਥਾਨ ਚੁਣੋ",
    selectCrop: "ਫਸਲ ਚੁਣੋ",
    todayPrices: "ਅੱਜ ਦੀਆਂ ਕੀਮਤਾਂ",
    priceHistory: "ਕੀਮਤ ਇਤਿਹਾਸ",
    marketAnalysis: "ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ",
    lastUpdated: "ਆਖਰੀ ਵਾਰ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ: 2 ਮਿੰਟ ਪਹਿਲਾਂ",
    priceChange: "ਕੀਮਤ ਬਦਲਾਅ",
    marketTrend: "ਮਾਰਕੀਟ ਰੁਝਾਨ",
    marketComparison: "ਮਾਰਕੀਟ ਤੁਲਨਾ",
    trendAnalysis: "ਰੁਝਾਨ ਵਿਸ਼ਲੇਸ਼ਣ",
    trendAnalysisText:
      "ਪਿਛਲੇ ਮਹੀਨੇ ਵਿੱਚ ਕੀਮਤਾਂ ਨੇ ਇੱਕ {trend} ਰੁਝਾਨ ਦਿਖਾਇਆ ਹੈ। ਮੌਜੂਦਾ ਮਾਰਕੀਟ ਹਾਲਾਤ ਦੱਸਦੇ ਹਨ ਕਿ ਇਹ ਰੁਝਾਨ ਥੋੜ੍ਹੇ ਸਮੇਂ ਵਿੱਚ ਜਾਰੀ ਰਹਿ ਸਕਦਾ ਹੈ।",
    expertConsultation: "ਮਾਹਿਰ ਸਲਾਹ",
    expertConsultationText: "ਨਿੱਜੀ ਮਾਰਕੀਟ ਸਲਾਹ ਦੀ ਲੋੜ ਹੈ? ਸਾਡੇ ਖੇਤੀਬਾੜੀ ਮਾਰਕੀਟ ਮਾਹਿਰਾਂ ਨਾਲ ਜੁੜੋ।",
    callExpert: "ਮਾਰਕੀਟ ਮਾਹਿਰ ਨੂੰ ਕਾਲ ਕਰੋ",
    findingMarkets: "ਸਥਾਨਕ ਬਾਜ਼ਾਰਾਂ ਨੂੰ ਲੱਭ ਰਿਹਾ ਹੈ...",
    allowLocation: "ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮਾਰਕੀਟ ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਸਥਾਨ ਪਹੁੰਚ ਦੀ ਆਗਿਆ ਦਿਓ।",
    defaultingLocation: "(ਜੇ ਪਹੁੰਚ ਤੋਂ ਇਨਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਤਾਂ ਸੋਲਾਪੁਰ ਵਿੱਚ ਡਿਫੌਲਟ)",
    week: "ਹਫ਼ਤਾ",
    locations: {
      mumbai: "ਮੁੰਬਈ",
      pune: "ਪੁਣੇ",
      nashik: "ਨਾਸਿਕ",
      solapur: "ਸੋਲਾਪੁਰ",
      chennai: "ਚੇਨਈ",
      coimbatore: "ਕੋਇੰਬਟੂਰ",
      bangalore: "ਬੰਗਲੌਰ",
      mysore: "ਮੈਸੂਰ",
      ludhiana: "ਲੁਧਿਆਣਾ",
      amritsar: "ਅੰਮ੍ਰਿਤਸਰ",
    },
    crops: {
      cotton: "ਕਪਾਹ",
      wheat: "ਕਣਕ",
      rice: "ਚਾਵਲ",
      sugarcane: "ਗੰਨਾ",
      onion: "ਪਿਆਜ਼",
      tomato: "ਟਮਾਟਰ",
      potato: "ਆਲੂ",
      soybean: "ਸੋਇਆਬੀਨ",
    },
    insights: {
      title: "ਮਾਰਕੀਟ ਸੂਝ",
      demand: "ਅਗਲੇ 2 ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਕਪਾਹ ਦੀ ਉੱਚ ਮੰਗ ਦੀ ਉਮੀਦ",
      weather: "ਕਣਕ ਦੀ ਵਾਢੀ ਲਈ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ",
      export: "ਚਾਵਲ ਦੀਆਂ ਕਿਸਮਾਂ ਲਈ ਨਿਰਯਾਤ ਮੌਕੇ ਵਧ ਰਹੇ ਹਨ",
    },
    recommendations: {
      title: "ਵਿਕਰੀ ਸਿਫਾਰਸ਼ਾਂ",
      timing: "ਵੇਚਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ",
      price: "ਉਮੀਦ ਕੀਤੀ ਕੀਮਤ ਰੇਂਜ",
      market: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਮਾਰਕੀਟ",
    },
    trends: {
      rising: "ਵਧ ਰਿਹਾ",
      falling: "ਡਿੱਗ ਰਿਹਾ",
      stable: "ਸਥਿਰ",
    },
  },
}

// Sample market data
const sampleMarketData = {
  cotton: {
    currentPrice: 6200,
    change: 2.5,
    trend: "rising",
    history: [5800, 5950, 6100, 6200],
    markets: [
      { location: "mumbai", price: 6200, change: 2.5 },
      { location: "pune", price: 6150, change: 1.8 },
      { location: "nashik", price: 6180, change: 2.2 },
      { location: "solapur", price: 6190, change: 2.3 },
    ],
  },
  wheat: {
    currentPrice: 2150,
    change: -1.2,
    trend: "falling",
    history: [2200, 2180, 2160, 2150],
    markets: [
      { location: "ludhiana", price: 2150, change: -1.2 },
      { location: "amritsar", price: 2140, change: -1.5 },
      { location: "pune", price: 2160, change: -0.8 },
    ],
  },
  rice: {
    currentPrice: 3800,
    change: 0.8,
    trend: "stable",
    history: [3750, 3770, 3790, 3800],
    markets: [
      { location: "chennai", price: 3800, change: 0.8 },
      { location: "coimbatore", price: 3780, change: 0.5 },
      { location: "bangalore", price: 3820, change: 1.1 },
    ],
  },
  sugarcane: {
    currentPrice: 3100,
    change: 0.1,
    trend: "stable",
    history: [3050, 3080, 3100, 3100],
    markets: [
      { location: "mumbai", price: 3100, change: 0.1 },
      { location: "pune", price: 3080, change: 0.0 },
      { location: "solapur", price: 3120, change: 0.2 },
    ],
  },
  onion: {
    currentPrice: 2500,
    change: 5.0,
    trend: "rising",
    history: [2200, 2350, 2450, 2500],
    markets: [
      { location: "nashik", price: 2500, change: 5.0 },
      { location: "mumbai", price: 2480, change: 4.5 },
      { location: "solapur", price: 2510, change: 5.2 },
    ],
  },
  tomato: {
    currentPrice: 1800,
    change: -3.0,
    trend: "falling",
    history: [1900, 1850, 1820, 1800],
    markets: [
      { location: "bangalore", price: 1800, change: -3.0 },
      { location: "chennai", price: 1780, change: -3.5 },
    ],
  },
  potato: {
    currentPrice: 1500,
    change: 1.0,
    trend: "stable",
    history: [1480, 1490, 1500, 1500],
    markets: [
      { location: "ludhiana", price: 1500, change: 1.0 },
      { location: "amritsar", price: 1490, change: 0.8 },
    ],
  },
  soybean: {
    currentPrice: 4500,
    change: 0.5,
    trend: "rising",
    history: [4400, 4450, 4480, 4500],
    markets: [
      { location: "pune", price: 4500, change: 0.5 },
      { location: "solapur", price: 4515, change: 0.6 },
    ],
  },
}

// Coordinates for each market location
const marketCoordinates: { [key: string]: { lat: number; lon: number } } = {
  mumbai: { lat: 19.076, lon: 72.8777 },
  pune: { lat: 18.5204, lon: 73.8567 },
  nashik: { lat: 20.0112, lon: 73.7909 },
  solapur: { lat: 17.6599, lon: 75.9064 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  coimbatore: { lat: 11.0168, lon: 76.9558 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  mysore: { lat: 12.2958, lon: 76.6394 },
  ludhiana: { lat: 30.901, lon: 75.8573 },
  amritsar: { lat: 31.634, lon: 74.8723 },
}

// Haversine formula to calculate distance between two lat/lon points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

// Function to find the closest market
const getClosestMarket = (userLat: number, userLon: number) => {
  let closestMarket = ""
  let minDistance = Infinity

  for (const market in marketCoordinates) {
    const { lat, lon } = marketCoordinates[market]
    const distance = calculateDistance(userLat, userLon, lat, lon)
    if (distance < minDistance) {
      minDistance = distance
      closestMarket = market
    }
  }
  return closestMarket
}


export default function MarketIntelligence() {
  const { currentLang } = useLanguage()
  const [locationState, setLocationState] = useState<"prompting" | "loading" | "success">("prompting")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedCrop, setSelectedCrop] = useState("cotton")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const t = marketLanguages[currentLang] || marketLanguages.en

  useEffect(() => {
    setLocationState("loading")
    navigator.geolocation.getCurrentPosition(
      // Success Callback
      (position) => {
        const userLat = position.coords.latitude
        const userLon = position.coords.longitude
        const closestMarket = getClosestMarket(userLat, userLon)
        setSelectedLocation(closestMarket)
        setLocationState("success")
      },
      // Error Callback
      () => {
        setSelectedLocation("solapur")
        setLocationState("success")
      },
      { timeout: 10000 }
    )
  }, [])


  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const getCurrentCropData = () => {
    const data = sampleMarketData[selectedCrop as keyof typeof sampleMarketData]
    if (data) {
      return data
    }
    return {
      currentPrice: 0,
      change: 0,
      trend: "stable",
      history: [0, 0, 0, 0],
      markets: [],
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "falling":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <BarChart3 className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "default"
    if (change < 0) return "destructive"
    return "secondary"
  }

  if (locationState !== "success" || !selectedLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-xl font-bold text-foreground">{t.findingMarkets}</h1>
        <p className="text-muted-foreground mt-2">{t.allowLocation}</p>
        <p className="text-sm text-muted-foreground mt-4">{t.defaultingLocation}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <HamburgerMenu />
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">{t.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{t.subtitle}</h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4" />
            {t.lastUpdated}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectLocation} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.locations).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectCrop} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t?.crops || {}).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      {value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="prices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prices">{t.todayPrices}</TabsTrigger>
            <TabsTrigger value="history">{t.priceHistory}</TabsTrigger>
            <TabsTrigger value="analysis">{t.marketAnalysis}</TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>{t.crops[selectedCrop as keyof typeof t.crops]}</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(getCurrentCropData().trend)}
                    <Badge variant={getTrendColor(getCurrentCropData().change)}>
                      {getCurrentCropData().change > 0 ? "+" : ""}
                      {getCurrentCropData().change}%
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    ₹{getCurrentCropData().currentPrice.toLocaleString()}/quintal
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.marketTrend}: {t.trends[getCurrentCropData().trend as keyof typeof t.trends]}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t.marketComparison}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getCurrentCropData().markets.map((market, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{t.locations[market.location as keyof typeof t.locations]}</div>
                        <div className="text-sm text-muted-foreground">₹{market.price.toLocaleString()}/quintal</div>
                      </div>
                    </div>
                    <Badge variant={getTrendColor(market.change)}>
                      {market.change > 0 ? "+" : ""}
                      {market.change}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <TrendingUp className="h-5 w-5 text-primary" />
                   {t.priceHistory} - {t.crops[selectedCrop as keyof typeof t.crops]}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div className="grid grid-cols-4 gap-2">
                     {getCurrentCropData().history.map((price, index) => (
                       <div key={index} className="text-center p-3 border rounded-lg">
                         <div className="text-xs text-muted-foreground">{t.week} {index + 1}</div>
                         <div className="font-semibold">₹{price.toLocaleString()}</div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                     <h4 className="font-semibold mb-2">{t.trendAnalysis}</h4>
                     <p className="text-sm text-muted-foreground">
                        {t.trendAnalysisText.replace(
                            "{trend}",
                            t.trends[getCurrentCropData().trend as keyof typeof t.trends]
                        )}
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  {t.insights.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <p className="text-sm">{t.insights.demand}</p>
                </div>
                <div className="p-3 border-l-4 border-accent bg-accent/5 rounded-r-lg">
                  <p className="text-sm">{t.insights.weather}</p>
                </div>
                <div className="p-3 border-l-4 border-secondary bg-secondary/5 rounded-r-lg">
                  <p className="text-sm">{t.insights.export}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t.recommendations.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t.recommendations.timing}</div>
                    <div className="font-semibold">Next 7-10 days</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t.recommendations.price}</div>
                    <div className="font-semibold">₹6,100 - ₹6,300</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t.recommendations.market}</div>
                    <div className="font-semibold">{t.locations.mumbai}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  {t.expertConsultation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t.expertConsultationText}
                  </p>
                  <Button className="w-full sm:w-auto">
                    <Phone className="mr-2 h-4 w-4" />
                    {t.callExpert}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </div>
  )
}