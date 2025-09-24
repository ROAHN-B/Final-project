"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "hi" | "mr" | "pa" | "kn" | "ta"

// Interfaces for structured data
interface Advisory {
  title: string
  description: string
  time: string
  priority: "high" | "medium" | "low"
}

interface WeatherInfo {
  temp: string
  condition: string
  humidity: string
  rainfall: string
}

interface PriceInfo {
  crop: string
  price: string
  change: string
}

// Main Translation Interface
export interface GlobalTranslations {
  // General
  title: string
  subtitle: string
  description: string
  getStarted: string
  exploreFeatures: string
  logout?: string
  login?: string
  signup?: string
  continue: string
  register: string
  alreadyHaveAccount: string
  dontHaveAccount: string
  loginSuccess: string
  signupSuccess: string
  userNotFound: string
  mobileExists: string
  selectLanguage: string
  fillAllFields?: string
  invalidMobile?: string

  // Menu and Navigation
  menu: {
    home: string
    profile: string
    schemes: string
    contact: string
    chatbot: string
  }
  bottomNav: {
    home: string
    diagnose: string
    markets: string
    community: string
  }

  // Landing Page Features
  features: {
    mainTitle: string
    mainDescription: string
    cropAdvisory: string
    cropAdvisoryDesc: string
    marketPrice: string
    marketPriceDesc: string
    weather: string
    weatherDesc: string
    soilHealth: string
    soilHealthDesc: string
    chatBot: string
    chatBotDesc: string
    aiPowered: string
    realTime: string
    accurate: string
    support247: string
    schemesDesc: string
    schemesBadge: string
  }

  // Profile Page
  profile: {
    title: string
    personalInfo: string
    farmInfo: string
    statistics: string
    edit: string
    save: string
    cancel: string
    back: string
    fields: {
      fullName: string
      phone: string
      email: string
      village: string
      district: string
      state: string
      farmSize: string
      cropTypes: string
      experience: string
      bio: string
      yearsUnit: string
      acresUnit: string
    }
    placeholders: {
      fullName: string
      phone: string
      email: string
      village: string
      district: string
      state: string
      farmSize: string
      cropTypes: string
      experience: string
      bio: string
    }
    stats: {
      totalQueries: string
      cropsDiagnosed: string
      advisoriesReceived: string
      communityPosts: string
    }
  }

  // Contact Page
  contact: {
    title: string
    subtitle: string
    form: {
      fullName: string
      village: string
      query: string
      submit: string
      success: string
    }
    placeholders: {
      fullName: string
      village: string
      query: string
    }
  }

  // Advertisements
  ads: {
    fertilizer: string
    fertilizerDesc: string
    seeds: string
    seedsDesc: string
    equipment: string
    equipmentDesc: string
    insurance: string
    insuranceDesc: string
  }

  // Login Page
  loginDescription?: string
  mobileNumber?: string
  firstName?: string
  lastName?: string
  selectState?: string
  selectDistrict?: string
  selectTaluka?: string
  selectVillage?: string
  update?: string

  // Dashboard Page
  dashboard: {
    title: string
    welcome: string
    welcomeSubtitle: string
    voicePrompt: string
    quickActions: string
    recentAdvisories: string
    todayWeather: string
    marketPrices: string
    actions: {
      cropDiagnosis: string
      cropDiagnosisDesc: string
      marketPrices: string
      marketPricesDesc: string
      weather: string
      weatherDesc: string
      community: string
      communityDesc: string
      governmentSchemes: string
      governmentSchemesDesc: string
    }
    advisories: Advisory[]
    weather: WeatherInfo
    prices: PriceInfo[]
    voiceListening: string
    voiceProcessing: string
    speakNow: string
  }

  // Chatbot UI
  chatbotUI: {
    online: string
    thinking: string
    placeholder: string
    newChat: string
  }

  // Notification Bell
  notifications: {
    title: string
    markAllAsRead: string
    noNotifications: string
  }

  // Support Section
  supportSection: {
    title: string
    description: string
    support: string
  }

  // Footer
  footer: {
    copyright: string
  }
}

interface LanguageContextType {
  currentLang: Language
  setCurrentLang: (lang: Language) => void
  translations: GlobalTranslations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const globalTranslations: Record<Language, GlobalTranslations> = {
  // English Translations
  en: {
    title: "KrishiMitra",
    subtitle: "Your Digital Agricultural Advisor",
    description: "Get instant crop advice, market prices, and weather updates in your local language",
    getStarted: "Get Started",
    exploreFeatures: "Explore Features",
    logout: "Logout",
    login: "Login",
    signup: "Sign Up",
    continue: "Continue",
    register: "Register",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    loginSuccess: "Login successful! Redirecting...",
    signupSuccess: "Registration successful! Redirecting...",
    userNotFound: "User not found. Please sign up.",
    mobileExists: "Mobile number already registered. Please log in.",
    selectLanguage: "Select Language",
    fillAllFields: "Please fill all fields",
    invalidMobile: "Please enter a valid 10-digit mobile number",
    menu: {
      home: "Home",
      profile: "My Profile",
      schemes: "Government Schemes",
      contact: "Contact",
      chatbot: "Chat Bot",
    },
    bottomNav: {
      home: "Home",
      diagnose: "Diagnose",
      markets: "Markets",
      community: "Community",
    },
    features: {
      mainTitle: "Powerful Features for Modern Farming",
      mainDescription: "Advanced AI technology meets traditional farming wisdom...",
      cropAdvisory: "Crop Advisory",
      cropAdvisoryDesc: "AI-powered crop diagnosis and recommendations",
      marketPrice: "Market Price",
      marketPriceDesc: "Real-time local market prices",
      weather: "Weather Recommendation",
      weatherDesc: "Hyperlocal weather forecasts and farming advice",
      soilHealth: "Soil Health Card",
      soilHealthDesc: "Digital soil testing and health monitoring",
      chatBot: "Chat Bot",
      chatBotDesc: "24/7 AI assistant for farming queries",
      aiPowered: "AI Powered",
      realTime: "Real-time",
      accurate: "Accurate",
      support247: "24/7 Support",
      schemesDesc: "Government schemes information...",
      schemesBadge: "Government",
    },
    profile: {
      title: "My Profile",
      personalInfo: "Personal Information",
      farmInfo: "Farm Information",
      statistics: "My Statistics",
      edit: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      back: "Back",
      fields: {
        fullName: "Full Name",
        phone: "Phone Number",
        email: "Email Address",
        village: "Village",
        district: "District",
        state: "State",
        farmSize: "Farm Size (Acres)",
        cropTypes: "Main Crops",
        experience: "Farming Experience (Years)",
        bio: "About Me",
        yearsUnit: "years",
        acresUnit: "acres",
      },
      placeholders: {
        fullName: "Enter your full name",
        phone: "Enter phone number",
        email: "Enter email address",
        village: "Enter village name",
        district: "Enter district",
        state: "Select state",
        farmSize: "Enter farm size",
        cropTypes: "e.g., Cotton, Wheat, Rice",
        experience: "Years of experience",
        bio: "Tell us about your farming journey...",
      },
      stats: {
        totalQueries: "Total Queries",
        cropsDiagnosed: "Crops Diagnosed",
        advisoriesReceived: "Advisories Received",
        communityPosts: "Community Posts",
      },
    },
    contact: {
      title: "Contact Us",
      subtitle: "Get in touch with our agricultural experts",
      form: {
        fullName: "Full Name",
        village: "Village",
        query: "Your Query",
        submit: "Submit Query",
        success: "Query submitted successfully!",
      },
      placeholders: {
        fullName: "Enter your full name",
        village: "Enter your village name",
        query: "Describe your farming question or issue...",
      },
    },
    ads: {
      fertilizer: "Premium Fertilizers",
      fertilizerDesc: "Best quality fertilizers for better crop yield",
      seeds: "Quality Seeds",
      seedsDesc: "High yield variety seeds available",
      equipment: "Farm Equipment",
      equipmentDesc: "Modern farming equipment for rent",
      insurance: "Crop Insurance",
      insuranceDesc: "Protect your crops with insurance",
    },
    loginDescription: "Please provide your details to get started.",
    mobileNumber: "Mobile Number",
    firstName: "First Name",
    lastName: "Last Name",
    selectState: "Select State",
    selectDistrict: "Select District",
    selectTaluka: "Select Taluka",
    selectVillage: "Select Village",
    update: "UPDATE",
    dashboard: {
      title: "KrishiMitra Dashboard",
      welcome: "Welcome back",
      welcomeSubtitle: "How can we help you farm smarter today?",
      voicePrompt: "Tap to speak your question",
      quickActions: "Quick Actions",
      recentAdvisories: "Recent Advisories",
      todayWeather: "Today's Weather",
      marketPrices: "Market Prices",
      actions: {
        cropDiagnosis: "Crop Diagnosis",
        cropDiagnosisDesc: "Photo diagnosis",
        marketPrices: "Market Prices",
        marketPricesDesc: "Live rates",
        weather: "Weather",
        weatherDesc: "7-day forecast",
        community: "Community",
        communityDesc: "Ask experts",
        governmentSchemes: "Government Schemes",
        governmentSchemesDesc: "Explore new schemes and subsidies for farmers.",
      },
      advisories: [
        { title: "Cotton Bollworm Alert", description: "Monitor your cotton crops for early signs", time: "2 hours ago", priority: "high" },
        { title: "Fertilizer Application", description: "Best time for nitrogen application", time: "1 day ago", priority: "medium" },
      ],
      weather: { temp: "28°C", condition: "Partly Cloudy", humidity: "65%", rainfall: "20mm expected" },
      prices: [
        { crop: "Cotton", price: "₹6,200/quintal", change: "+2.5%" },
        { crop: "Wheat", price: "₹2,150/quintal", change: "-1.2%" },
        { crop: "Rice", price: "₹3,800/quintal", change: "+0.8%" },
      ],
      voiceListening: "Listening...",
      voiceProcessing: "Processing your question...",
      speakNow: "Speak now",
    },
    chatbotUI: {
      online: "Online",
      thinking: "Thinking...",
      placeholder: "Ask a farming question...",
      newChat: "New Chat",
    },
    notifications: {
      title: "Notifications",
      markAllAsRead: "Mark all as read",
      noNotifications: "No new notifications",
    },
    supportSection: {
      title: "24/7 Farmer Support",
      description: "Get help in your local language from our agricultural experts",
      support: "Free Support: 	+91 011-24300606",
    },
    footer: {
      copyright: "© 2024 KrishiMitra. Empowering farmers with technology.",
    },
  },

  // Hindi Translations
  hi: {
    title: "कृषिमित्र",
    subtitle: "आपका डिजिटल कृषि सलाहकार",
    description: "अपनी स्थानीय भाषा में तुरंत फसल सलाह, बाजार भाव और मौसम अपडेट प्राप्त करें",
    getStarted: "शुरू करें",
    exploreFeatures: "विशेषताएं खोजें",
    logout: "लॉग आउट",
    login: "लॉग इन करें",
    signup: "साइन अप करें",
    continue: "जारी रखें",
    register: "रजिस्टर करें",
    alreadyHaveAccount: "पहले से ही एक खाता है?",
    dontHaveAccount: "खाता नहीं है?",
    loginSuccess: "लॉगिन सफल! रीडायरेक्ट कर रहा है...",
    signupSuccess: "पंजीकरण सफल! रीडायरेक्ट कर रहा है...",
    userNotFound: "उपयोगकर्ता नहीं मिला। कृपया साइन अप करें।",
    mobileExists: "मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉग इन करें।",
    selectLanguage: "भाषा चुनें",
    fillAllFields: "कृपया सभी फ़ील्ड भरें",
    invalidMobile: "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें",
    menu: {
      home: "होम",
      profile: "मेरी प्रोफाइल",
      schemes: "सरकारी योजनाएं",
      contact: "संपर्क",
      chatbot: "चैट बॉट",
    },
    bottomNav: {
      home: "होम",
      diagnose: "निदान",
      markets: "बाजार",
      community: "समुदाय",
    },
    features: {
      mainTitle: "आधुनिक खेती के लिए शक्तिशाली विशेषताएं",
      mainDescription: "उन्नत AI तकनीक पारंपरिक खेती के ज्ञान से मिलती है...",
      cropAdvisory: "फसल सलाह",
      cropAdvisoryDesc: "AI-संचालित फसल निदान और सिफारिशें",
      marketPrice: "बाजार भाव",
      marketPriceDesc: "रियल-टाइम स्थानीय बाजार भाव",
      weather: "मौसम सिफारस",
      weatherDesc: "स्थानीय मौसम पूर्वानुमान और खेती सलाह",
      soilHealth: "मिट्टी स्वास्थ्य कार्ड",
      soilHealthDesc: "डिजital मिट्टी परीक्षण और स्वास्थ्य निगरानी",
      chatBot: "चैट बॉट",
      chatBotDesc: "खेती प्रश्नों के लिए 24/7 AI सहायक",
      aiPowered: "एआई-संचालित",
      realTime: "रीयल-टाइम",
      accurate: "सटीक",
      support247: "24/7 सहायता",
      schemesDesc: "सरकारी योजनाओं की जानकारी...",
      schemesBadge: "सरकारी",
    },
    profile: {
      title: "मेरी प्रोफाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      farmInfo: "खेत की जानकारी",
      statistics: "मेरे आंकड़े",
      edit: "प्रोफाइल संपादित करें",
      save: "परिवर्तन सहेजें",
      cancel: "रद्द करें",
      back: "वापस",
      fields: {
        fullName: "पूरा नाम",
        phone: "फोन नंबर",
        email: "ईमेल पता",
        village: "गांव",
        district: "जिला",
        state: "राज्य",
        farmSize: "खेत का आकार (एकड़)",
        cropTypes: "मुख्य फसलें",
        experience: "खेती का अनुभव (वर्ष)",
        bio: "मेरे बारे में",
        yearsUnit: "वर्ष",
        acresUnit: "एकड़",
      },
      placeholders: {
        fullName: "अपना पूरा नाम दर्ज करें",
        phone: "फोन नंबर दर्ज करें",
        email: "ईमेल पता दर्ज करें",
        village: "गांव का नाम दर्ज करें",
        district: "जिला दर्ज करें",
        state: "राज्य चुनें",
        farmSize: "खेत का आकार दर्ज करें",
        cropTypes: "जैसे कपास, गेहूं, चावल",
        experience: "अनुभव के वर्ष",
        bio: "अपनी खेती की यात्रा के बारे में बताएं...",
      },
      stats: {
        totalQueries: "कुल प्रश्न",
        cropsDiagnosed: "फसल निदान",
        advisoriesReceived: "प्राप्त सलाह",
        communityPosts: "समुदाय पोस्ट",
      },
    },
    contact: {
      title: "संपर्क करें",
      subtitle: "हमारे कृषि विशेषज्ञों से संपर्क करें",
      form: {
        fullName: "पूरा नाम",
        village: "गांव",
        query: "आपका प्रश्न",
        submit: "प्रश्न भेजें",
        success: "प्रश्न सफलतापूर्वक भेजा गया!",
      },
      placeholders: {
        fullName: "अपना पूरा नाम दर्ज करें",
        village: "अपने गांव का नाम दर्ज करें",
        query: "अपने खेती संबंधी प्रश्न या समस्या का वर्णन करें...",
      },
    },
    ads: {
      fertilizer: "प्रीमियम उर्वरक",
      fertilizerDesc: "बेहतर फसल उत्पादन के लिए सर्वोत्तम गुणवत्ता के उर्वरक",
      seeds: "गुणवत्ता बीज",
      seedsDesc: "उच्च उत्पादन किस्म के बीज उपलब्ध",
      equipment: "कृषि उपकरण",
      equipmentDesc: "किराए के लिए आधुनिक कृषि उपकरण",
      insurance: "फसल बीमा",
      insuranceDesc: "बीमा के साथ अपनी फसलों की सुरक्षा करें",
    },
    loginDescription: "शुरू करने के लिए कृपया अपना विवरण प्रदान करें।",
    mobileNumber: "मोबाइल नंबर",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    selectTaluka: "तालुका चुनें",
    selectVillage: "गांव चुनें",
    update: "अपडेट करें",
    dashboard: {
      title: "कृषिमित्र डैशबोर्ड",
      welcome: "वापसी पर स्वागत है",
      welcomeSubtitle: "आज हम आपकी खेती को बेहतर बनाने में कैसे मदद कर सकते हैं?",
      voicePrompt: "अपना प्रश्न बोलने के लिए टैप करें",
      quickActions: "त्वरित कार्रवाइयां",
      recentAdvisories: "हालिया सलाह",
      todayWeather: "आज का मौसम",
      marketPrices: "बाजार भाव",
      actions: {
        cropDiagnosis: "फसल निदान",
        cropDiagnosisDesc: "फोटो निदान",
        marketPrices: "बाजार भाव",
        marketPricesDesc: "लाइव रेट",
        weather: "मौसम",
        weatherDesc: "7-दिन का पूर्वानुमान",
        community: "समुदाय",
        communityDesc: "विशेषज्ञों से पूछें",
        governmentSchemes: "सरकारी योजनाएं",
        governmentSchemesDesc: "किसानों के लिए नई योजनाओं और सब्सिडी का पता लगाएं।",
      },
      advisories: [
        { title: "कपास की सुंडी का अलर्ट", description: "शुरुआती लक्षणों के लिए अपनी कपास की फसलों की निगरानी करें", time: "2 घंटे पहले", priority: "high" },
        { title: "उर्वरक का प्रयोग", description: "नाइट्रोजन प्रयोग के लिए सबसे अच्छा समय", time: "1 दिन पहले", priority: "medium" },
      ],
      weather: { temp: "28°C", condition: "आंशिक रूप से बादल छाए रहेंगे", humidity: "65%", rainfall: "20 मिमी अपेक्षित" },
      prices: [
        { crop: "कपास", price: "₹6,200/क्विंटल", change: "+2.5%" },
        { crop: "गेहूं", price: "₹2,150/क्विंटल", change: "-1.2%" },
        { crop: "चावल", price: "₹3,800/क्विंटल", change: "+0.8%" },
      ],
      voiceListening: "सुन रहा हूँ...",
      voiceProcessing: "आपके प्रश्न पर कार्रवाई हो रही है...",
      speakNow: "अभी बोलें",
    },
    chatbotUI: {
      online: "ऑनलाइन",
      thinking: "सोच रहा हूँ...",
      placeholder: "खेती से जुड़ा कोई सवाल पूछें...",
      newChat: "नई चैट",
    },
    notifications: {
      title: "सूचनाएं",
      markAllAsRead: "सभी को पढ़ा हुआ चिह्नित करें",
      noNotifications: "कोई नई सूचनाएं नहीं हैं",
    },
    supportSection: {
      title: "24/7 किसान सहायता",
      description: "हमारे कृषि विशेषज्ञों से अपनी स्थानीय भाषा में सहायता प्राप्त करें",
      support: "निःशुल्क सहायता: 	+91 011-24300606",
    },
    footer: {
      copyright: "© 2024 कृषिमित्र। प्रौद्योगिकी के साथ किसानों को सशक्त बनाना।",
    },
  },
  // Marathi Translations
  mr: {
    title: "कृषीमित्र",
    subtitle: "तुमचा डिजिटल शेती सल्लागार",
    description: "तुमच्या स्थानिक भाषेत तत्काळ पीक सल्ला, बाजार भाव आणि हवामान अपडेट मिळवा",
    getStarted: "सुरुवात करा",
    exploreFeatures: "वैशिष्ट्ये एक्सप्लोर करा",
    logout: "लॉग आउट",
    login: "लॉग इन करा",
    signup: "नोंदणी करा",
    continue: "सुरू ठेवा",
    register: "नोंदणी करा",
    alreadyHaveAccount: "आधीच खाते आहे?",
    dontHaveAccount: "खाते नाही?",
    loginSuccess: "लॉगिन यशस्वी! पुनर्निर्देशित करत आहे...",
    signupSuccess: "नोंदणी यशस्वी! पुनर्निर्देशित करत आहे...",
    userNotFound: "वापरकर्ता सापडला नाही. कृपया नोंदणी करा.",
    mobileExists: "मोबाइल नंबर आधीच नोंदणीकृत आहे. कृपया लॉग इन करा.",
    selectLanguage: "भाषा निवडा",
    fillAllFields: "कृपया सर्व फील्ड भरा",
    invalidMobile: "कृपया वैध 10-अंकी मोबाइल नंबर प्रविष्ट करा",
    menu: {
      home: "होम",
      profile: "माझी प्रोफाइल",
      schemes: "सरकारी योजना",
      contact: "संपर्क",
      chatbot: "चॅट बॉट",
    },
    bottomNav: {
      home: "होम",
      diagnose: "निदान",
      markets: "बाजार",
      community: "समुदाय",
    },
    features: {
      mainTitle: "आधुनिक शेतीसाठी शक्तिशाली वैशिष्ट्ये",
      mainDescription: "प्रगत AI तंत्रज्ञान पारंपारिक शेतीच्या ज्ञानाशी मिळते...",
      cropAdvisory: "पीक सल्ला",
      cropAdvisoryDesc: "AI-आधारित पीक निदान आणि शिफारसी",
      marketPrice: "बाजार भाव",
      marketPriceDesc: "रिअल-टाइम स्थानिक बाजार भाव",
      weather: "हवामान शिफारस",
      weatherDesc: "स्थानिक हवामान अंदाज आणि शेती सल्ला",
      soilHealth: "माती आरोग्य कार्ड",
      soilHealthDesc: "डिजिटल माती चाचणी आणि आरोग्य निरीक्षण",
      chatBot: "चॅट बॉट",
      chatBotDesc: "शेती प्रश्नांसाठी 24/7 AI सहाय्यक",
      aiPowered: "एआय-आधारित",
      realTime: "रिअल-टाइम",
      accurate: "सटीक",
      support247: "24/7 सहाय्य",
      schemesDesc: "सरकारी योजनांची माहिती...",
      schemesBadge: "सरकारी",
    },
    profile: {
      title: "माझी प्रोफाइल",
      personalInfo: "वैयक्तिक माहिती",
      farmInfo: "शेताची माहिती",
      statistics: "माझे आकडेवारी",
      edit: "प्रोफाइल संपादित करा",
      save: "बदल जतन करा",
      cancel: "रद्द करा",
      back: "परत",
      fields: {
        fullName: "पूर्ण नाव",
        phone: "फोन नंबर",
        email: "ईमेल पत्ता",
        village: "गाव",
        district: "जिल्हा",
        state: "राज्य",
        farmSize: "शेताचा आकार (एकर)",
        cropTypes: "मुख्य पिके",
        experience: "शेतीचा अनुभव (वर्षे)",
        bio: "माझ्याबद्दल",
        yearsUnit: "वर्षे",
        acresUnit: "एकर",
      },
      placeholders: {
        fullName: "तुमचे पूर्ण नाव टाका",
        phone: "फोन नंबर टाका",
        email: "ईमेल पत्ता टाका",
        village: "गावाचे नाव टाका",
        district: "जिल्हा टाका",
        state: "राज्य निवडा",
        farmSize: "शेताचा आकार टाका",
        cropTypes: "उदा. कापूस, गहू, तांदूळ",
        experience: "अनुभवाची वर्षे",
        bio: "तुमच्या शेतीच्या प्रवासाबद्दल सांगा...",
      },
      stats: {
        totalQueries: "एकूण प्रश्न",
        cropsDiagnosed: "पीक निदान",
        advisoriesReceived: "मिळालेले सल्ले",
        communityPosts: "समुदाय पोस्ट",
      },
    },
    contact: {
      title: "संपर्क साधा",
      subtitle: "आमच्या शेती तज्ञांशी संपर्क साधा",
      form: {
        fullName: "पूर्ण नाव",
        village: "गाव",
        query: "तुमचा प्रश्न",
        submit: "प्रश्न पाठवा",
        success: "प्रश्न यशस्वीरित्या पाठवला गेला!",
      },
      placeholders: {
        fullName: "तुमचे पूर्ण नाव टाका",
        village: "तुमच्या गावाचे नाव टाका",
        query: "तुमच्या शेतीशी संबंधित प्रश्न किंवा समस्येचे वर्णन करा...",
      },
    },
    ads: {
      fertilizer: "प्रीमियम खते",
      fertilizerDesc: "चांगल्या पीक उत्पादनासाठी सर्वोत्तम दर्जाची खते",
      seeds: "दर्जेदार बियाणे",
      seedsDesc: "उच्च उत्पादन जातीचे बियाणे उपलब्ध",
      equipment: "शेती उपकरणे",
      equipmentDesc: "भाड्याने आधुनिक शेती उपकरणे",
      insurance: "पीक विमा",
      insuranceDesc: "विम्यासह आपल्या पिकांचे संरक्षण करा",
    },
    loginDescription: "सुरुवात करण्यासाठी कृपया आपले तपशील प्रदान करा.",
    mobileNumber: "मोबाइल नंबर",
    firstName: "पहिले नाव",
    lastName: "आडनाव",
    selectState: "राज्य निवडा",
    selectDistrict: "जिल्हा निवडा",
    selectTaluka: "तालुका निवडा",
    selectVillage: "गाव निवडा",
    update: "अपडेट करा",
    dashboard: {
      title: "कृषीमित्र डॅशबोर्ड",
      welcome: "परत स्वागत आहे",
      welcomeSubtitle: "आज आम्ही तुमच्या शेतीला अधिक स्मार्ट बनवण्यासाठी कशी मदत करू शकतो?",
      voicePrompt: "तुमचा प्रश्न बोलण्यासाठी टॅप करा",
      quickActions: "त्वरित क्रिया",
      recentAdvisories: "अलीकडील सल्ले",
      todayWeather: "आजचे हवामान",
      marketPrices: "बाजार भाव",
      actions: {
        cropDiagnosis: "पीक निदान",
        cropDiagnosisDesc: "फोटो निदान",
        marketPrices: "बाजार भाव",
        marketPricesDesc: "थेट दर",
        weather: "हवामान",
        weatherDesc: "७ दिवसांचा अंदाज",
        community: "समुदाय",
        communityDesc: "तज्ञांना विचारा",
        governmentSchemes: "सरकारी योजना",
        governmentSchemesDesc: "शेतकऱ्यांसाठी नवीन योजना आणि अनुदानांचा शोध घ्या.",
      },
      advisories: [
        { title: "कापसावरील बोंडअळीचा इशारा", description: "प्राथमिक लक्षणांसाठी तुमच्या कापूस पिकावर लक्ष ठेवा", time: "२ तासांपूर्वी", priority: "high" },
        { title: "खत व्यवस्थापन", description: "नत्रयुक्त खते देण्यासाठी सर्वोत्तम वेळ", time: "१ दिवसापूर्वी", priority: "medium" },
      ],
      weather: { temp: "28°C", condition: "अंशतः ढगाळ", humidity: "65%", rainfall: "20मिमी अपेक्षित" },
      prices: [
        { crop: "कापूस", price: "₹6,200/क्विंटल", change: "+2.5%" },
        { crop: "गहू", price: "₹2,150/क्विंटल", change: "-1.2%" },
        { crop: "तांदूळ", price: "₹3,800/क्विंटल", change: "+0.8%" },
      ],
      voiceListening: "ऐकत आहे...",
      voiceProcessing: "तुमच्या प्रश्नावर प्रक्रिया होत आहे...",
      speakNow: "आता बोला",
    },
    chatbotUI: {
      online: "ऑनलाइन",
      thinking: "विचार करत आहे...",
      placeholder: "शेतीबद्दल प्रश्न विचारा...",
      newChat: "नवीन चॅट",
    },
    notifications: {
      title: "सूचना",
      markAllAsRead: "सर्व वाचले म्हणून चिन्हांकित करा",
      noNotifications: "नवीन सूचना नाहीत",
    },
    supportSection: {
      title: "24/7 शेतकरी सहाय्य",
      description: "आमच्या कृषी तज्ञांकडून तुमच्या स्थानिक भाषेत मदत मिळवा",
      support: "मोफत सहाय्य: +91 011-24300606",
    },
    footer: {
      copyright: "© 2024 कृषीमित्र. तंत्रज्ञानासह शेतकऱ्यांना सक्षम बनवणे.",
    },
  },
  // Punjabi Translations
  pa: {
    title: "ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ",
    subtitle: "ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ",
    description: "ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਤੁਰੰਤ ਫਸਲ ਸਲਾਹ, ਮਾਰਕੀਟ ਦੀਆਂ ਕੀਮਤਾਂ ਅਤੇ ਮੌਸਮ ਅਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰੋ",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
    exploreFeatures: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ",
    logout: "ਲੌਗ ਆਉਟ",
    login: "ਲੌਗ ਇਨ ਕਰੋ",
    signup: "ਸਾਈਨ ਅੱਪ ਕਰੋ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    register: "ਰਜਿਸਟਰ ਕਰੋ",
    alreadyHaveAccount: "ਪਹਿਲਾਂ ਹੀ ਇੱਕ ਖਾਤਾ ਹੈ?",
    dontHaveAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    loginSuccess: "ਲੌਗਇਨ ਸਫਲ! ਰੀਡਾਇਰੈਕਟ ਕਰ ਰਿਹਾ ਹੈ...",
    signupSuccess: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਫਲ! ਰੀਡਾਇਰੈਕਟ ਕਰ ਰਿਹਾ ਹੈ...",
    userNotFound: "ਉਪਭੋਗਤਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ ਅੱਪ ਕਰੋ।",
    mobileExists: "ਮੋਬਾਈਲ ਨੰਬਰ ਪਹਿਲਾਂ ਹੀ ਰਜਿਸਟਰਡ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਲੌਗ ਇਨ ਕਰੋ।",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    fillAllFields: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ",
    invalidMobile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕੀ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    menu: {
      home: "ਹੋਮ",
      profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
      schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
      contact: "ਸੰਪਰਕ",
      chatbot: "ਚੈਟ ਬੋਟ",
    },
    bottomNav: {
      home: "ਹੋਮ",
      diagnose: "ਨਿਦਾਨ",
      markets: "ਮਾਰਕੀਟ",
      community: "ਭਾਈਚਾਰਾ",
    },
    features: {
      mainTitle: "ਆਧੁਨਿਕ ਖੇਤੀ ਲਈ ਸ਼ਕਤੀਸ਼ਾਲੀ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      mainDescription: "ਉੱਨਤ AI ਤਕਨਾਲੋਜੀ ਰਵਾਇਤੀ ਖੇਤੀ ਦੇ ਗਿਆਨ ਨੂੰ ਮਿਲਦੀ ਹੈ...",
      cropAdvisory: "ਫਸਲ ਸਲਾਹ",
      cropAdvisoryDesc: "AI-ਸੰਚਾਲਿਤ ਫਸਲ ਨਿਦਾਨ ਅਤੇ ਸਿਫਾਰਸ਼ਾਂ",
      marketPrice: "ਮਾਰਕੀਟ ਕੀਮਤ",
      marketPriceDesc: "ਰੀਅਲ-ਟਾਈਮ ਸਥਾਨਕ ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
      weather: "ਮੌਸਮ ਸਿਫਾਰਸ਼",
      weatherDesc: "ਸਥਾਨਕ ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ ਅਤੇ ਖੇਤੀ ਸਲਾਹ",
      soilHealth: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ",
      soilHealthDesc: "ਡਿਜੀਟਲ ਮਿੱਟੀ ਜਾਂਚ ਅਤੇ ਸਿਹਤ ਨਿਗਰਾਨੀ",
      chatBot: "ਚੈਟ ਬੋਟ",
      chatBotDesc: "ਖੇਤੀ ਸਵਾਲਾਂ ਲਈ 24/7 AI ਸਹਾਇਕ",
      aiPowered: "AI-ਸੰਚਾਲਿਤ",
      realTime: "ਰੀਅਲ-ਟਾਈਮ",
      accurate: "ਸਹੀ",
      support247: "24/7 ਸਹਾਇਤਾ",
      schemesDesc: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ...",
      schemesBadge: "ਸਰਕਾਰੀ",
    },
    profile: {
      title: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
      personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
      farmInfo: "ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ",
      statistics: "ਮੇਰੇ ਅੰਕੜੇ",
      edit: "ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ",
      save: "ਤਬਦੀਲੀਆਂ ਸੇਵ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ",
      back: "ਵਾਪਸ",
      fields: {
        fullName: "ਪੂਰਾ ਨਾਮ",
        phone: "ਫੋਨ ਨੰਬਰ",
        email: "ਈਮੇਲ ਪਤਾ",
        village: "ਪਿੰਡ",
        district: "ਜ਼ਿਲ੍ਹਾ",
        state: "ਰਾਜ",
        farmSize: "ਖੇਤ ਦਾ ਆਕਾਰ (ਏਕੜ)",
        cropTypes: "ਮੁੱਖ ਫਸਲਾਂ",
        experience: "ਖੇਤੀ ਦਾ ਤਜਰਬਾ (ਸਾਲ)",
        bio: "ਮੇਰੇ ਬਾਰੇ",
        yearsUnit: "ਸਾਲ",
        acresUnit: "ਏਕੜ",
      },
      placeholders: {
        fullName: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        phone: "ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
        email: "ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
        village: "ਪਿੰਡ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        district: "ਜ਼ਿਲ੍ਹਾ ਦਰਜ ਕਰੋ",
        state: "ਰਾਜ ਚੁਣੋ",
        farmSize: "ਖੇਤ ਦਾ ਆਕਾਰ ਦਰਜ ਕਰੋ",
        cropTypes: "ਜਿਵੇਂ ਕਪਾਹ, ਕਣਕ, ਚਾਵਲ",
        experience: "ਤਜਰਬੇ ਦੇ ਸਾਲ",
        bio: "ਆਪਣੀ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਬਾਰੇ ਦੱਸੋ...",
      },
      stats: {
        totalQueries: "ਕੁੱਲ ਸਵਾਲ",
        cropsDiagnosed: "ਫਸਲ ਨਿਦਾਨ",
        advisoriesReceived: "ਮਿਲੀਆਂ ਸਲਾਹਾਂ",
        communityPosts: "ਭਾਈਚਾਰਾ ਪੋਸਟਾਂ",
      },
    },
    contact: {
      title: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      subtitle: "ਸਾਡੇ ਖੇਤੀਬਾੜੀ ਮਾਹਿਰਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      form: {
        fullName: "ਪੂਰਾ ਨਾਮ",
        village: "ਪਿੰਡ",
        query: "ਤੁਹਾਡਾ ਸਵਾਲ",
        submit: "ਸਵਾਲ ਭੇਜੋ",
        success: "ਸਵਾਲ ਸਫਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ!",
      },
      placeholders: {
        fullName: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        village: "ਆਪਣੇ ਪਿੰਡ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        query: "ਆਪਣੇ ਖੇਤੀਬਾੜੀ ਸੰਬੰਧੀ ਸਵਾਲ ਜਾਂ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ...",
      },
    },
    ads: {
      fertilizer: "ਪ੍ਰੀਮੀਅਮ ਖਾਦ",
      fertilizerDesc: "ਬਿਹਤਰ ਫਸਲ ਉਤਪਾਦਨ ਲਈ ਸਰਵੋਤਮ ਗੁਣਵੱਤਾ ਦੀ ਖਾਦ",
      seeds: "ਗੁਣਵੱਤਾ ਬੀਜ",
      seedsDesc: "ਉੱਚ ਉਤਪਾਦਨ ਕਿਸਮ ਦੇ ਬੀਜ ਉਪਲਬਧ",
      equipment: "ਖੇਤੀ ਉਪਕਰਣ",
      equipmentDesc: "ਕਿਰਾਏ ਲਈ ਆਧੁਨਿਕ ਖੇਤੀ ਉਪਕਰਣ",
      insurance: "ਫਸਲ ਬੀਮਾ",
      insuranceDesc: "ਬੀਮੇ ਨਾਲ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਸੁਰੱਖਿਆ ਕਰੋ",
    },
    loginDescription: "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਵੇਰਵੇ ਪ੍ਰਦਾਨ ਕਰੋ।",
    mobileNumber: "ਮੋਬਾਈਲ ਨੰਬਰ",
    firstName: "ਪਹਿਲਾ ਨਾਮ",
    lastName: "ਆਖਰੀ ਨਾਮ",
    selectState: "ਰਾਜ ਚੁਣੋ",
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    selectTaluka: "ਤਹਿਸੀਲ ਚੁਣੋ",
    selectVillage: "ਪਿੰਡ ਚੁਣੋ",
    update: "ਅੱਪਡੇਟ ਕਰੋ",
    dashboard: {
      title: "ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ ਡੈਸ਼ਬੋਰਡ",
      welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
      welcomeSubtitle: "ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਖੇਤੀ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?",
      voicePrompt: "ਆਪਣਾ ਸਵਾਲ ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
      quickActions: "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
      recentAdvisories: "ਹਾਲੀਆ ਸਲਾਹਾਂ",
      todayWeather: "ਅੱਜ ਦਾ ਮੌਸਮ",
      marketPrices: "ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
      actions: {
        cropDiagnosis: "ਫਸਲ ਨਿਦਾਨ",
        cropDiagnosisDesc: "ਫੋਟੋ ਨਿਦਾਨ",
        marketPrices: "ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
        marketPricesDesc: "ਲਾਈਵ ਰੇਟ",
        weather: "ਮੌਸਮ",
        weatherDesc: "7 ਦਿਨਾਂ ਦਾ ਪੂਰਵ-ਅਨੁਮਾਨ",
        community: "ਭਾਈਚਾਰਾ",
        communityDesc: "ਮਾਹਿਰਾਂ ਨੂੰ ਪੁੱਛੋ",
        governmentSchemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        governmentSchemesDesc: "ਕਿਸਾਨਾਂ ਲਈ ਨਵੀਆਂ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੀ ਪੜਚੋਲ ਕਰੋ।",
      },
      advisories: [
        { title: "ਕਪਾਹ ਦੀ ਸੁੰਡੀ ਦਾ ਚੇਤਾਵਨੀ", description: "ਸ਼ੁਰੂਆਤੀ ਲੱਛਣਾਂ ਲਈ ਆਪਣੀ ਕਪਾਹ ਦੀਆਂ ਫਸਲਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ", time: "2 ਘੰਟੇ ਪਹਿਲਾਂ", priority: "high" },
        { title: "ਖਾਦ ਦੀ ਵਰਤੋਂ", description: "ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਵਰਤੋਂ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ", time: "1 ਦਿਨ ਪਹਿਲਾਂ", priority: "medium" },
      ],
      weather: { temp: "28°C", condition: "ਅੰਸ਼ਕ ਤੌਰ 'ਤੇ ਬੱਦਲਵਾਈ", humidity: "65%", rainfall: "20mm ਦੀ ਉਮੀਦ" },
      prices: [
        { crop: "ਕਪਾਹ", price: "₹6,200/ਕੁਇੰਟਲ", change: "+2.5%" },
        { crop: "ਕਣਕ", price: "₹2,150/ਕੁਇੰਟਲ", change: "-1.2%" },
        { crop: "ਚਾਵਲ", price: "₹3,800/ਕੁਇੰਟਲ", change: "+0.8%" },
      ],
      voiceListening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
      voiceProcessing: "ਤੁਹਾਡੇ ਸਵਾਲ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰ ਰਿਹਾ ਹੈ...",
      speakNow: "ਹੁਣ ਬੋਲੋ",
    },
    chatbotUI: {
      online: "ਆਨਲਾਈਨ",
      thinking: "ਸੋਚ ਰਿਹਾ ਹਾਂ...",
      placeholder: "ਖੇਤੀਬਾੜੀ ਦਾ ਸਵਾਲ ਪੁੱਛੋ...",
      newChat: "ਨਵੀਂ ਗੱਲਬਾਤ",
    },
    notifications: {
      title: "ਸੂਚਨਾਵਾਂ",
      markAllAsRead: "ਸਭ ਨੂੰ ਪੜ੍ਹਿਆ ਹੋਇਆ ਮਾਰਕ ਕਰੋ",
      noNotifications: "ਕੋਈ ਨਵੀਂ ਸੂਚਨਾ ਨਹੀਂ ਹੈ",
    },
    supportSection: {
      title: "24/7 ਕਿਸਾਨ ਸਹਾਇਤਾ",
      description: "ਸਾਡੇ ਖੇਤੀਬਾੜੀ ਮਾਹਿਰਾਂ ਤੋਂ ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ",
      support: "ਮੁਫਤ ਸਹਾਇਤਾ: +91 011-24300606",
    },
    footer: {
      copyright: "© 2024 ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ। ਤਕਨਾਲੋਜੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀ ਦੇਣਾ।",
    },
  },
  // Kannada Translations
  kn: {
    title: "ಕೃಷಿಮಿತ್ರ",
    subtitle: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಲಹೆಗಾರ",
    description: "ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ತಕ್ಷಣದ ಬೆಳೆ ಸಲಹೆ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಹವಾಮಾನ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    exploreFeatures: "ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    logout: "ಲಾಗ್ ಔಟ್",
    login: "ಲಾಗ್ ಇನ್",
    signup: "ಸೈನ್ ಅಪ್",
    continue: "ಮುಂದುವರಿಸಿ",
    register: "ನೋಂದಾಯಿಸಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    loginSuccess: "ಲಾಗ್ ಇನ್ ಯಶಸ್ವಿ! ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    signupSuccess: "ನೋಂದಣಿ ಯಶಸ್ವಿ! ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    userNotFound: "ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಸೈನ್ ಅಪ್ ಮಾಡಿ.",
    mobileExists: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗ್ ಇನ್ ಮಾಡಿ.",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    fillAllFields: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ",
    invalidMobile: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    menu: {
      home: "ಮುಖಪುಟ",
      profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
      schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      contact: "ಸಂಪರ್ಕಿಸಿ",
      chatbot: "ಚಾಟ್ ಬೋಟ್",
    },
    bottomNav: {
      home: "ಮನೆ",
      diagnose: "ರೋಗನಿರ್ಣಯ",
      markets: "ಮಾರುಕಟ್ಟೆಗಳು",
      community: "ಸಮುದಾಯ",
    },
    features: {
      mainTitle: "ಆಧುನಿಕ ಕೃಷಿಗಾಗಿ ಶಕ್ತಿಶಾಲಿ ವೈಶಿಷ್ಟ್ಯಗಳು",
      mainDescription: "ಸುಧಾರಿತ AI ತಂತ್ರಜ್ಞಾನವು ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ಜ್ಞಾನವನ್ನು ಪೂರೈಸುತ್ತದೆ...",
      cropAdvisory: "ಬೆಳೆ ಸಲಹೆ",
      cropAdvisoryDesc: "AI-ಚಾಲಿತ ಬೆಳೆ ರೋಗನಿರ್ಣಯ ಮತ್ತು ಶಿಫಾರಸುಗಳು",
      marketPrice: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
      marketPriceDesc: "ನೈಜ-ಸಮಯದ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
      weather: "ಹವಾಮಾನ ಶಿಫಾರಸು",
      weatherDesc: "ಹೈಪರ್‌ಲೋಕಲ್ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳು ಮತ್ತು ಕೃಷಿ ಸಲಹೆ",
      soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್",
      soilHealthDesc: "ಡಿಜಿಟಲ್ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮತ್ತು ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ",
      chatBot: "ಚಾಟ್ ಬೋಟ್",
      chatBotDesc: "ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ 24/7 AI ಸಹಾಯಕ",
      aiPowered: "AI-ಚಾಲಿತ",
      realTime: "ನೈಜ-ಸಮಯ",
      accurate: "ನಿಖರ",
      support247: "24/7 ಬೆಂಬಲ",
      schemesDesc: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿ...",
      schemesBadge: "ಸರ್ಕಾರಿ",
    },
    profile: {
      title: "ನನ್ನ ಪ್ರೊಫೈಲ್",
      personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
      farmInfo: "ಕೃಷಿ ಮಾಹಿತಿ",
      statistics: "ನನ್ನ ಅಂಕಿಅಂಶಗಳು",
      edit: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
      save: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
      cancel: "ರದ್ದುಮಾಡು",
      back: "ಹಿಂದೆ",
      fields: {
        fullName: "ಪೂರ್ಣ ಹೆಸರು",
        phone: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
        email: "ಇಮೇಲ್ ವಿಳಾಸ",
        village: "ಗ್ರಾಮ",
        district: "ಜಿಲ್ಲೆ",
        state: "ರಾಜ್ಯ",
        farmSize: "ಕೃಷಿ ಗಾತ್ರ (ಎಕರೆ)",
        cropTypes: "ಮುಖ್ಯ ಬೆಳೆಗಳು",
        experience: "ಕೃಷಿ ಅನುಭವ (ವರ್ಷಗಳು)",
        bio: "ನನ್ನ ಬಗ್ಗೆ",
        yearsUnit: "ವರ್ಷಗಳು",
        acresUnit: "ಎಕರೆ",
      },
      placeholders: {
        fullName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ",
        phone: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
        email: "ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ",
        village: "ಗ್ರಾಮದ ಹೆಸರು ನಮೂದಿಸಿ",
        district: "ಜಿಲ್ಲೆ ನಮೂದಿಸಿ",
        state: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
        farmSize: "ಕೃಷಿ ಗಾತ್ರ ನಮೂದಿಸಿ",
        cropTypes: "ಉದಾ. ಹತ್ತಿ, ಗೋಧಿ, ಭತ್ತ",
        experience: "ಅನುಭವದ ವರ್ಷಗಳು",
        bio: "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಯಾಣದ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ...",
      },
      stats: {
        totalQueries: "ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು",
        cropsDiagnosed: "ರೋಗನಿರ್ಣಯ ಮಾಡಿದ ಬೆಳೆಗಳು",
        advisoriesReceived: "ಸ್ವೀಕರಿಸಿದ ಸಲಹೆಗಳು",
        communityPosts: "ಸಮುದಾಯ ಪೋಸ್ಟ್‌ಗಳು",
      },
    },
    contact: {
      title: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
      subtitle: "ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ",
      form: {
        fullName: "ಪೂರ್ಣ ಹೆಸರು",
        village: "ಗ್ರಾಮ",
        query: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ",
        submit: "ಪ್ರಶ್ನೆ ಸಲ್ಲಿಸಿ",
        success: "ಪ್ರಶ್ನೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
      },
      placeholders: {
        fullName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ",
        village: "ನಿಮ್ಮ ಗ್ರಾಮದ ಹೆಸರು ನಮೂದಿಸಿ",
        query: "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಅಥವಾ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ...",
      },
    },
    ads: {
      fertilizer: "ಪ್ರೀಮಿಯಂ ರಸಗೊಬ್ಬರಗಳು",
      fertilizerDesc: "ಉತ್ತಮ ಬೆಳೆ ಇಳುವರಿಗಾಗಿ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ರಸಗೊಬ್ಬರಗಳು",
      seeds: "ಗುಣಮಟ್ಟದ ಬೀಜಗಳು",
      seedsDesc: "ಹೆಚ್ಚಿನ ಇಳುವರಿ ನೀಡುವ ವಿವಿಧ ಬೀಜಗಳು ಲಭ್ಯವಿದೆ",
      equipment: "ಕೃಷಿ ಉಪಕರಣಗಳು",
      equipmentDesc: "ಬಾಡಿಗೆಗೆ ಆಧುನಿಕ ಕೃಷಿ ಉಪಕರಣಗಳು",
      insurance: "ಬೆಳೆ ವಿಮೆ",
      insuranceDesc: "ವಿಮೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ರಕ್ಷಿಸಿ",
    },
    loginDescription: "ಪ್ರಾರಂಭಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ.",
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    firstName: "ಮೊದಲ ಹೆಸರು",
    lastName: "ಕೊನೆಯ ಹೆಸರು",
    selectState: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
    selectDistrict: "ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",
    selectTaluka: "ತಾಲ್ಲೂಕು ಆಯ್ಕೆಮಾಡಿ",
    selectVillage: "ಗ್ರಾಮ ಆಯ್ಕೆಮಾಡಿ",
    update: "ಅಪ್‌ಡೇಟ್ ಮಾಡಿ",
    dashboard: {
      title: "ಕೃಷಿಮಿತ್ರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
      welcomeSubtitle: "ಇಂದು ನಾವು ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
      voicePrompt: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಹೇಳಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
      quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      recentAdvisories: "ಇತ್ತೀಚಿನ ಸಲಹೆಗಳು",
      todayWeather: "ಇಂದಿನ ಹವಾಮಾನ",
      marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
      actions: {
        cropDiagnosis: "ಬೆಳೆ ರೋಗ ನಿರ್ಣಯ",
        cropDiagnosisDesc: "ಫೋಟೋ ರೋಗ ನಿರ್ಣಯ",
        marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
        marketPricesDesc: "ನೇರ ದರಗಳು",
        weather: "ಹವಾಮಾನ",
        weatherDesc: "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
        community: "ಸಮುದಾಯ",
        communityDesc: "ತಜ್ಞರನ್ನು ಕೇಳಿ",
        governmentSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
        governmentSchemesDesc: "ರೈತರಿಗೆ ಹೊಸ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
      },
      advisories: [
        { title: "ಹತ್ತಿ ಕಾಯಿ ಕೊರಕ ಎಚ್ಚರಿಕೆ", description: "ನಿಮ್ಮ ಹತ್ತಿ ಬೆಳೆಗಳಲ್ಲಿ ಆರಂಭಿಕ ಚಿಹ್ನೆಗಳಿಗಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ", time: "2 ಗಂಟೆಗಳ ಹಿಂದೆ", priority: "high" },
        { title: "ಗೊಬ್ಬರ ಅನ್ವಯ", description: "ಸಾರಜನಕ ಅನ್ವಯಕ್ಕೆ ಉತ್ತಮ ಸಮಯ", time: "1 ದಿನದ ಹಿಂದೆ", priority: "medium" },
      ],
      weather: { temp: "28°C", condition: "ಭಾಗಶಃ ಮೋಡ ಕವಿದಿದೆ", humidity: "65%", rainfall: "20ಮಿಮೀ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ" },
      prices: [
        { crop: "ಹತ್ತಿ", price: "₹6,200/ಕ್ವಿಂಟಾಲ್", change: "+2.5%" },
        { crop: "ಗೋಧಿ", price: "₹2,150/ಕ್ವಿಂಟಾಲ್", change: "-1.2%" },
        { crop: "ಭತ್ತ", price: "₹3,800/ಕ್ವಿಂಟಾಲ್", change: "+0.8%" },
      ],
      voiceListening: "ಕೇಳುತ್ತಿದೆ...",
      voiceProcessing: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...",
      speakNow: "ಈಗ ಮಾತನಾಡಿ",
    },
    chatbotUI: {
      online: "ಆನ್‌ಲೈನ್",
      thinking: "ಯೋಚಿಸುತ್ತಿದೆ...",
      placeholder: "ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...",
      newChat: "ಹೊಸ ಚಾಟ್",
    },
    notifications: {
      title: "ಅಧಿಸೂಚನೆಗಳು",
      markAllAsRead: "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
      noNotifications: "ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",
    },
    supportSection: {
      title: "24/7 ರೈತರ ಬೆಂಬಲ",
      description: "ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರಿಂದ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಸಹಾಯ ಪಡೆಯಿರಿ",
      support: "ಉಚಿತ ಬೆಂಬಲ: +91 011-24300606",
    },
    footer: {
      copyright: "© 2024 ಕೃಷಿಮಿತ್ರ. ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು.",
    },
  },
  // Tamil Translations
  ta: {
    title: "கிருஷிமித்ரா",
    subtitle: "உங்கள் டிஜிட்டல் விவசாய ஆலோசகர்",
    description: "உங்கள் உள்ளூர் மொழியில் உடனடி பயிர் ஆலோசனை, சந்தை விலைகள் மற்றும் வானிலை புதுப்பிப்புகளைப் பெறுங்கள்",
    getStarted: "தொடங்குங்கள்",
    exploreFeatures: "அம்சங்களை ஆராயவும்",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    signup: "பதிவுசெய்",
    continue: "தொடரவும்",
    register: "பதிவுசெய்",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    dontHaveAccount: "கணக்கு இல்லையா?",
    loginSuccess: "உள்நுழைவு வெற்றிகரம்! திருப்பி விடப்படுகிறது...",
    signupSuccess: "பதிவு வெற்றிகரம்! திருப்பி விடப்படுகிறது...",
    userNotFound: "பயனர் காணப்படவில்லை. பதிவு செய்யவும்.",
    mobileExists: "மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. உள்நுழையவும்.",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    fillAllFields: "அனைத்து புலங்களையும் நிரப்பவும்",
    invalidMobile: "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்",
    menu: {
      home: "முகப்பு",
      profile: "எனது சுயவிவரம்",
      schemes: "அரசு திட்டங்கள்",
      contact: "தொடர்பு",
      chatbot: "அரட்டை போட்",
    },
    bottomNav: {
      home: "முகப்பு",
      diagnose: "நோய் கண்டறி",
      markets: "சந்தைகள்",
      community: "சமூகம்",
    },
    features: {
      mainTitle: "நவீன விவசாயத்திற்கான சக்திவாய்ந்த அம்சங்கள்",
      mainDescription: "மேம்பட்ட AI தொழில்நுட்பம் பாரம்பரிய விவசாய அறிவை சந்திக்கிறது...",
      cropAdvisory: "பயிர் ஆலோசனை",
      cropAdvisoryDesc: "AI-இயங்கும் பயிர் கண்டறிதல் மற்றும் பரிந்துரைகள்",
      marketPrice: "சந்தை விலை",
      marketPriceDesc: "நிகழ்நேர உள்ளூர் சந்தை விலைகள்",
      weather: "வானிலை பரிந்துரை",
      weatherDesc: "உள்ளூர் வானிலை முன்னறிவிப்புகள் மற்றும் விவசாய ஆலோசனை",
      soilHealth: "மண் சுகாதார அட்டை",
      soilHealthDesc: "டிஜிட்டல் மண் பரிசோதனை மற்றும் சுகாதார கண்காணிப்பு",
      chatBot: "அரட்டை போட்",
      chatBotDesc: "விவசாய வினவல்களுக்கு 24/7 AI உதவியாளர்",
      aiPowered: "AI-இயங்கும்",
      realTime: "நிகழ்நேர",
      accurate: "துல்லியமான",
      support247: "24/7 ஆதரவு",
      schemesDesc: "அரசு திட்டங்கள் பற்றிய தகவல்கள்...",
      schemesBadge: "அரசு",
    },
    profile: {
      title: "எனது சுயவிவரம்",
      personalInfo: "தனிப்பட்ட தகவல்",
      farmInfo: "பண்ணை தகவல்",
      statistics: "எனது புள்ளிவிவரங்கள்",
      edit: "சுயவிவரத்தைத் திருத்து",
      save: "மாற்றங்களைச் சேமி",
      cancel: "ரத்துசெய்",
      back: "பின்",
      fields: {
        fullName: "முழு பெயர்",
        phone: "தொலைபேசி எண்",
        email: "மின்னஞ்சல் முகவரி",
        village: "கிராமம்",
        district: "மாவட்டம்",
        state: "மாநிலம்",
        farmSize: "பண்ணை அளவு (ஏக்கர்)",
        cropTypes: "முக்கிய பயிர்கள்",
        experience: "விவசாய அனுபவம் (ஆண்டுகள்)",
        bio: "என்னை பற்றி",
        yearsUnit: "ஆண்டுகள்",
        acresUnit: "ஏக்கர்",
      },
      placeholders: {
        fullName: "உங்கள் முழு பெயரை உள்ளிடவும்",
        phone: "தொலைபேசி எண்ணை உள்ளிடவும்",
        email: "மின்னஞ்சਲ முகவரியை உள்ளிடவும்",
        village: "கிராமத்தின் பெயரை உள்ளிடவும்",
        district: "மாவட்டத்தை உள்ளிடவும்",
        state: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
        farmSize: "பண்ணை அளவை உள்ளிடவும்",
        cropTypes: "எ.கா., பருத்தி, கோதுமை, அரிசி",
        experience: "அனுபவ ஆண்டுகள்",
        bio: "உங்கள் விவசாயப் பயணம் பற்றி எங்களிடம் கூறுங்கள்...",
      },
      stats: {
        totalQueries: "மொத்த வினவல்கள்",
        cropsDiagnosed: "பயிர்கள் கண்டறியப்பட்டன",
        advisoriesReceived: "ஆலோசனைகள் பெறப்பட்டன",
        communityPosts: "சமூக இடுகைகள்",
      },
    },
    contact: {
      title: "எங்களை தொடர்பு கொள்ளவும்",
      subtitle: "எங்கள் விவசாய நிபுணர்களுடன் தொடர்பு கொள்ளுங்கள்",
      form: {
        fullName: "முழு பெயர்",
        village: "கிராமம்",
        query: "உங்கள் கேள்வி",
        submit: "வினவலைச் சமர்ப்பி",
        success: "வினவல் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      },
      placeholders: {
        fullName: "உங்கள் முழு பெயரை உள்ளிடவும்",
        village: "உங்கள் கிராமத்தின் பெயரை உள்ளிடவும்",
        query: "உங்கள் விவசாய கேள்வி அல்லது சிக்கலை விவரிக்கவும்...",
      },
    },
    ads: {
      fertilizer: "பிரீமியம் உரங்கள்",
      fertilizerDesc: "சிறந்த பயிர் விளைச்சலுக்கான சிறந்த தரமான உரங்கள்",
      seeds: "தரமான விதைகள்",
      seedsDesc: "அதிக மகசூல் தரும் பல்வேறு விதைகள் உள்ளன",
      equipment: "பண்ணை உபகரணங்கள்",
      equipmentDesc: "வாடகைக்கு நவீன விவசாய உபகரணங்கள்",
      insurance: "பயிர் காப்பீடு",
      insuranceDesc: "காப்பீட்டுடன் உங்கள் பயிர்களைப் பாதுகாக்கவும்",
    },
    loginDescription: "தொடங்குவதற்கு உங்கள் விவரங்களை வழங்கவும்.",
    mobileNumber: "கைபேசி எண்",
    firstName: "முதல் பெயர்",
    lastName: "கடைசி பெயர்",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    selectTaluka: "வட்டத்தைத் தேர்ந்தெடுக்கவும்",
    selectVillage: "கிராமத்தைத் தேர்ந்தெடுக்கவும்",
    update: "புதுப்பிக்கவும்",
    dashboard: {
      title: "கிருஷிமித்ரா டாஷ்போர்டு",
      welcome: "மீண்டும் வரவேற்கிறோம்",
      welcomeSubtitle: "இன்று உங்கள் விவசாயத்தை சிறந்ததாக்க நாங்கள் எப்படி உதவ முடியும்?",
      voicePrompt: "உங்கள் கேள்வியைச் சொல்ல தட்டவும்",
      quickActions: "விரைவு செயல்கள்",
      recentAdvisories: "சமீபத்திய ஆலோசனைகள்",
      todayWeather: "இன்றைய வானிலை",
      marketPrices: "சந்தை விலைகள்",
      actions: {
        cropDiagnosis: "பயிர் நோய் கண்டறிதல்",
        cropDiagnosisDesc: "புகைப்பட நோய் கண்டறிதல்",
        marketPrices: "சந்தை விலைகள்",
        marketPricesDesc: "நேரடி விலைகள்",
        weather: "வானிலை",
        weatherDesc: "7 நாள் முன்னறிவிப்பு",
        community: "சமூகம்",
        communityDesc: "நிபுணர்களிடம் கேளுங்கள்",
        governmentSchemes: "அரசு திட்டங்கள்",
        governmentSchemesDesc: "விவசாயிகளுக்கு புதிய திட்டங்கள் மற்றும் மானியங்களை ஆராயவும்.",
      },
      advisories: [
        { title: "பருத்தி காய் புழு எச்சரிக்கை", description: "பருத்தி பயிர்களில் ஆரம்ப அறிகுறிகளுக்கு கண்காணிக்கவும்", time: "2 மணிநேரத்திற்கு முன்", priority: "high" },
        { title: "உர பயன்பாடு", description: "நைட்ரஜன் பயன்பாட்டிற்கு சிறந்த நேரம்", time: "1 நாளுக்கு முன்", priority: "medium" },
      ],
      weather: { temp: "28°C", condition: "பகுதி மேகமூட்டம்", humidity: "65%", rainfall: "20மிமீ எதிர்பார்க்கப்படுகிறது" },
      prices: [
        { crop: "பருத்தி", price: "₹6,200/குவிண்டால்", change: "+2.5%" },
        { crop: "கோதுமை", price: "₹2,150/குவிண்டால்", change: "-1.2%" },
        { crop: "அரிசி", price: "₹3,800/குவிண்டால்", change: "+0.8%" },
      ],
      voiceListening: "கேட்கிறது...",
      voiceProcessing: "உங்கள் கேள்வியை செயலாக்குகிறது...",
      speakNow: "இப்போது பேசுங்கள்",
    },
    chatbotUI: {
      online: "ஆன்லைனில்",
      thinking: "சிந்திக்கிறேன்...",
      placeholder: "விவசாயம் தொடர்பான கேள்வி கேளுங்கள்...",
      newChat: "புதிய அரட்டை",
    },
    notifications: {
      title: "அறிவிப்புகள்",
      markAllAsRead: "அனைத்தையும் படித்ததாக குறிக்கவும்",
      noNotifications: "புதிய அறிவிப்புகள் இல்லை",
    },
    supportSection: {
      title: "24/7 விவசாயி ஆதரவு",
      description: "எங்கள் விவசாய நிபுணர்களிடமிருந்து உங்கள் உள்ளூர் மொழியில் உதவி பெறுங்கள்",
      support: "இலவச ஆதரவு: +91 011-24300606",
    },
    footer: {
      copyright: "© 2024 கிருஷிமித்ரா. தொழில்நுட்பத்துடன் விவசாயிகளுக்கு அதிகாரம் அளித்தல்.",
    },
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("krishi-language") as Language
      if (savedLang && ["en", "hi", "mr", "pa", "kn", "ta"].includes(savedLang)) {
        return savedLang
      }
    }
    return "en" // Default language
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("krishi-language", currentLang)
    }
  }, [currentLang])

  const setCurrentLang = (lang: Language) => {
    setCurrentLangState(lang)
  }

  const translations = globalTranslations[currentLang]

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}