"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  Users,
  Star,
  Send,
  ArrowLeft,
  Search,
  Filter,
  ThumbsUp,
  MessageSquare,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import { BottomNavigation } from "@/components/bottom-navigation" // Import BottomNavigation
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
import { useLanguage } from "@/contexts/language-context" // Import useLanguage

interface Question {
  id: number
  title: string
  category: string
  author: string
  time: string
  likes: number
  replies: number
  status: "answered" | "pending"
  preview: string
}

interface Expert {
  name: string
  specialty: string
  rating: number
  answers: number
  avatar: string
}

interface CommunityLanguageContent {
  title: string
  askExperts: string
  recentQuestions: string
  topExperts: string
  categories: string[]
  searchPlaceholder: string
  askQuestion: string
  questionTitle: string
  questionDetails: string
  selectCategory: string
  submitQuestion: string
  back: string
  answered: string
  pending: string
  likes: string
  replies: string
  questions: Question[]
  experts: Expert[]
}

// Language support for community
const communityLanguages: Record<string, CommunityLanguageContent> = {
  en: {
    title: "Farmer Community",
    askExperts: "Ask Experts",
    recentQuestions: "Recent Questions",
    topExperts: "Top Experts",
    categories: [
      "Crop Diseases",
      "Pest Control",
      "Fertilizers",
      "Weather",
      "Market Prices",
      "Irrigation",
      "Seeds",
      "General",
    ],
    searchPlaceholder: "Search questions...",
    askQuestion: "Ask a Question",
    questionTitle: "Question Title",
    questionDetails: "Question Details",
    selectCategory: "Select Category",
    submitQuestion: "Submit Question",
    back: "Back",
    answered: "Answered",
    pending: "Pending",
    likes: "likes",
    replies: "replies",
    questions: [
      {
        id: 1,
        title: "White spots on cotton leaves - what could this be?",
        category: "Crop Diseases",
        author: "Ramesh Kumar",
        time: "2 hours ago",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "I noticed white spots appearing on my cotton plants. The spots are small and scattered...",
      },
      {
        id: 2,
        title: "Best time for wheat sowing in Punjab?",
        category: "Seeds",
        author: "Gurpreet Singh",
        time: "5 hours ago",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "When is the optimal time to sow wheat in Punjab region? Weather has been unpredictable...",
      },
      {
        id: 3,
        title: "Organic fertilizer recommendations for tomatoes",
        category: "Fertilizers",
        author: "Priya Sharma",
        time: "1 day ago",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "Looking for organic fertilizer options for my tomato crop. Want to avoid chemicals...",
      },
    ],
    experts: [
      {
        name: "Dr. Suresh Patel",
        specialty: "Plant Pathology",
        rating: 4.9,
        answers: 234,
        avatar: "SP",
      },
      {
        name: "Prof. Meera Joshi",
        specialty: "Soil Science",
        rating: 4.8,
        answers: 189,
        avatar: "MJ",
      },
      {
        name: "Rajesh Verma",
        specialty: "Pest Management",
        rating: 4.7,
        answers: 156,
        avatar: "RV",
      },
    ],
  },
  hi: {
    title: "किसान समुदाय",
    askExperts: "विशेषज्ञों से पूछें",
    recentQuestions: "हाल के प्रश्न",
    topExperts: "शीर्ष विशेषज्ञ",
    categories: ["फसल रोग", "कीट नियंत्रण", "उर्वरक", "मौसम", "बाजार भाव", "सिंचाई", "बीज", "सामान्य"],
    searchPlaceholder: "प्रश्न खोजें...",
    askQuestion: "एक प्रश्न पूछें",
    questionTitle: "प्रश्न शीर्षक",
    questionDetails: "प्रश्न विवरण",
    selectCategory: "श्रेणी चुनें",
    submitQuestion: "प्रश्न सबमिट करें",
    back: "वापस",
    answered: "उत्तर दिया गया",
    pending: "लंबित",
    likes: "पसंद",
    replies: "उत्तर",
    questions: [
      {
        id: 1,
        title: "कपास के पत्तों पर सफेद धब्बे - यह क्या हो सकता है?",
        category: "फसल रोग",
        author: "रमेश कुमार",
        time: "2 घंटे पहले",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "मैंने अपने कपास के पौधों पर सफेद धब्बे देखे। धब्बे छोटे और बिखरे हुए हैं...",
      },
      {
        id: 2,
        title: "पंजाब में गेहूं बोने का सबसे अच्छा समय?",
        category: "बीज",
        author: "गुरप्रीत सिंह",
        time: "5 घंटे पहले",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "पंजाब क्षेत्र में गेहूं बोने का सबसे अच्छा समय कब है? मौसम अप्रत्याशित रहा है...",
      },
      {
        id: 3,
        title: "टमाटर के लिए जैविक उर्वरक की सिफारिशें",
        category: "उर्वरक",
        author: "प्रिया शर्मा",
        time: "1 दिन पहले",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "अपने टमाटर की फसल के लिए जैविक उर्वरक विकल्पों की तलाश में हूं। रसायनों से बचना चाहता हूं...",
      },
    ],
    experts: [
      {
        name: "डॉ. सुरेश पटेल",
        specialty: "पादप रोग विज्ञान",
        rating: 4.9,
        answers: 234,
        avatar: "एसपी",
      },
      {
        name: "प्रो. मीरा जोशी",
        specialty: "मृदा विज्ञान",
        rating: 4.8,
        answers: 189,
        avatar: "एमजे",
      },
      {
        name: "राजेश वर्मा",
        specialty: "कीट प्रबंधन",
        rating: 4.7,
        answers: 156,
        avatar: "आरवी",
      },
    ],
  },
  mr: {
    title: "शेतकरी समुदाय",
    askExperts: "तज्ञांना विचारा",
    recentQuestions: "अलीकडील प्रश्न",
    topExperts: "शीर्ष तज्ञ",
    categories: ["पीक रोग", "कीटक नियंत्रण", "खते", "हवामान", "बाजार भाव", "सिंचन", "बियाणे", "सामान्य"],
    searchPlaceholder: "प्रश्न शोधा...",
    askQuestion: "प्रश्न विचारा",
    questionTitle: "प्रश्नाचे शीर्षक",
    questionDetails: "प्रश्नाचे तपशील",
    selectCategory: "श्रेणी निवडा",
    submitQuestion: "प्रश्न सबमिट करा",
    back: "परत",
    answered: "उत्तर दिले",
    pending: "प्रलंबित",
    likes: "आवडी",
    replies: "उत्तरे",
    questions: [
      {
        id: 1,
        title: "कापसाच्या पानांवर पांढरे डाग - हे काय असू शकते?",
        category: "पीक रोग",
        author: "रमेश कुमार",
        time: "2 तासांपूर्वी",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "मी माझ्या कापसाच्या रोपांवर पांढरे डाग दिसले. डाग लहान आणि विखुरलेले आहेत...",
      },
      {
        id: 2,
        title: "पंजाबमध्ये गहू पेरणीसाठी सर्वोत्तम वेळ कधी आहे?",
        category: "बियाणे",
        author: "गुरप्रीत सिंग",
        time: "5 तासांपूर्वी",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "पंजाब प्रदेशात गहू पेरणीसाठी सर्वोत्तम वेळ कधी आहे? हवामानवु अनपेक्षित राहिले आहे...",
      },
      {
        id: 3,
        title: "टोमॅटोसाठी सेंद्रिय खतांच्या शिफारसी",
        category: "खते",
        author: "प्रिया शर्मा",
        time: "1 दिवसापूर्वी",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "माझ्या टोमॅटो पिकासाठी सेंद्रिय खतांचे पर्याय शोधत आहे. रसायने टाळू इच्छितो...",
      },
    ],
    experts: [
      {
        name: "डॉ. सुरेश पाटील",
        specialty: "वनस्पती रोगशास्त्र",
        rating: 4.9,
        answers: 234,
        avatar: "एसपी",
      },
      {
        name: "प्रा. मीरा जोशी",
        specialty: "मृदा विज्ञान",
        rating: 4.8,
        answers: 189,
        avatar: "एमजे",
      },
      {
        name: "राजेश वर्मा",
        specialty: "कीटक व्यवस्थापन",
        rating: 4.7,
        answers: 156,
        avatar: "आरवी",
      },
    ],
  },
  ta: {
    title: "விவசாயி சமூகம்",
    askExperts: "நிபுணர்களிடம் கேளுங்கள்",
    recentQuestions: "சமீபத்திய கேள்விகள்",
    topExperts: "சிறந்த நிபுணர்கள்",
    categories: ["பயிர் நோய்கள்", "பூச்சி கட்டுப்பாடு", "உரங்கள்", "வானிலை", "சந்தை விலைகள்", "நீர்ப்பாசனம்", "விதைகள்", "பொது"],
    searchPlaceholder: "கேள்விகளைத் தேடுங்கள்...",
    askQuestion: "கேள்வி கேளுங்கள்",
    questionTitle: "கேள்வி தலைப்பு",
    questionDetails: "கேள்வி விவரங்கள்",
    selectCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
    submitQuestion: "கேள்வியை சமர்ப்பிக்கவும்",
    back: "பின்",
    answered: "பதிலளிக்கப்பட்டது",
    pending: "நிலுவையில்",
    likes: "விருப்பங்கள்",
    replies: "பதில்கள்",
    questions: [
      {
        id: 1,
        title: "பருத்தி இலைகளில் வெள்ளை புள்ளிகள் - இது என்னவாக இருக்கும்?",
        category: "பயிர் நோய்கள்",
        author: "ரமேஷ் குமார்",
        time: "2 மணிநேரத்திற்கு முன்",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "எனது பருத்தி செடிகளில் வெள்ளை புள்ளிகள் தோன்றுவதை நான் கவனித்தேன். புள்ளிகள் சிறியதாகவும் சிதறியும் உள்ளன...",
      },
      {
        id: 2,
        title: "பஞ்சாபில் கோதுமை விதைப்பதற்கு சிறந்த நேரம் எது?",
        category: "விதைகள்",
        author: "குர்பிரீத் சிங்",
        time: "5 மணிநேரத்திற்கு முன்",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "பஞ்சாப் பகுதியில் கோதுமை விதைப்பதற்கு உகந்த நேரம் எது? வானிலை கணிக்க முடியாததாக உள்ளது...",
      },
      {
        id: 3,
        title: "தக்காளிகளுக்கு கரிம உர பரிந்துரைகள்",
        category: "உரங்கள்",
        author: "பிரியா சர்மா",
        time: "1 நாளுக்கு முன்",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "எனது தக்காளி பயிருக்கு கரிம உர விருப்பங்களைத் தேடுகிறேன். இரசாயனங்களைத் தவிர்க்க விரும்புகிறேன்...",
      },
    ],
    experts: [
      {
        name: "டாக்டர். சுரேஷ் படேல்",
        specialty: "தாவர நோயியல்",
        rating: 4.9,
        answers: 234,
        avatar: "SP",
      },
      {
        name: "பேராசிரியர். மீரா ஜோஷி",
        specialty: "மண் அறிவியல்",
        rating: 4.8,
        answers: 189,
        avatar: "MJ",
      },
      {
        name: "ராஜேஷ் வர்மா",
        specialty: "பூச்சி மேலாண்மை",
        rating: 4.7,
        answers: 156,
        avatar: "RV",
      },
    ],
  },
  kn: {
    title: "ರೈತ ಸಮುದಾಯ",
    askExperts: "ತಜ್ಞರನ್ನು ಕೇಳಿ",
    recentQuestions: "ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು",
    topExperts: "ಉನ್ನತ ತಜ್ಞರು",
    categories: ["ಬೆಳೆ ರೋಗಗಳು", "ಕೀಟ ನಿಯಂತ್ರಣ", "ಗೊಬ್ಬರಗಳು", "ಹವಾಮಾನ", "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು", "ನೀರಾವರಿ", "ಬೀಜಗಳು", "ಸಾಮಾನ್ಯ"],
    searchPlaceholder: "ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ...",
    askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ",
    questionTitle: "ಪ್ರಶ್ನೆ ಶೀರ್ಷಿಕೆ",
    questionDetails: "ಪ್ರಶ್ನೆ ವಿವರಗಳು",
    selectCategory: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    submitQuestion: "ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    back: "ಹಿಂದೆ",
    answered: "ಉತ್ತರಿಸಲಾಗಿದೆ",
    pending: "ಬಾಕಿ",
    likes: "ಇಷ್ಟಗಳು",
    replies: "ಉತ್ತರಗಳು",
    questions: [
      {
        id: 1,
        title: "ಹತ್ತಿ ಎಲೆಗಳ ಮೇಲೆ ಬಿಳಿ ಕಲೆಗಳು - ಇದು ಏನಾಗಿರಬಹುದು?",
        category: "ಬೆಳೆ ರೋಗಗಳು",
        author: "ರಮೇಶ್ ಕುಮಾರ್",
        time: "2 ಗಂಟೆಗಳ ಹಿಂದೆ",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "ನನ್ನ ಹತ್ತಿ ಗಿಡಗಳ ಮೇಲೆ ಬಿಳಿ ಕಲೆಗಳು ಕಾಣಿಸಿಕೊಳ್ಳುವುದನ್ನು ನಾನು ಗಮನಿಸಿದ್ದೇನೆ. ಕಲೆಗಳು ಚಿಕ್ಕದಾಗಿ ಮತ್ತು ಹರಡಿವೆ...",
      },
      {
        id: 2,
        title: "ಪಂಜಾಬ್‌ನಲ್ಲಿ ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಉತ್ತಮ ಸಮಯ ಯಾವುದು?",
        category: "ಬೀಜಗಳು",
        author: "ಗುರ್‌ಪ್ರೀತ್ ಸಿಂಗ್",
        time: "5 ಗಂಟೆಗಳ ಹಿಂದೆ",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "ಪಂಜಾಬ್ ಪ್ರದೇಶದಲ್ಲಿ ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು? ಹವಾಮಾನವು ಅನಿರೀಕ್ಷಿತವಾಗಿದೆ...",
      },
      {
        id: 3,
        title: "ಟೊಮೆಟೊಗಳಿಗೆ ಸಾವಯವ ಗೊಬ್ಬರ ಶಿಫಾರಸುಗಳು",
        category: "ಗೊಬ್ಬರಗಳು",
        author: "ಪ್ರಿಯಾ ಶರ್ಮಾ",
        time: "1 ದಿನದ ಹಿಂದೆ",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "ನನ್ನ ಟೊಮೆಟೊ ಬೆಳೆಗೆ ಸಾವಯವ ಗೊಬ್ಬರ ಆಯ್ಕೆಗಳನ್ನು ಹುಡುಕುತ್ತಿದ್ದೇನೆ. ರಾಸಾಯನಿಕಗಳನ್ನು ತಪ್ಪಿಸಲು ಬಯಸುತ್ತೇನೆ...",
      },
    ],
    experts: [
      {
        name: "ಡಾ. ಸುರೇಶ್ ಪಟೇಲ್",
        specialty: "ಸಸ್ಯ ರೋಗಶಾಸ್ತ್ರ",
        rating: 4.9,
        answers: 234,
        avatar: "SP",
      },
      {
        name: "ಪ್ರೊ. ಮೀರಾ ಜೋಶಿ",
        specialty: "ಮಣ್ಣು ವಿಜ್ಞಾನ",
        rating: 4.8,
        answers: 189,
        avatar: "MJ",
      },
      {
        name: "ರಾಜೇಶ್ ವರ್ಮಾ",
        specialty: "ಕೀಟ ನಿರ್ವಹಣೆ",
        rating: 4.7,
        answers: 156,
        avatar: "RV",
      },
    ],
  },
  pa: {
    title: "ਕਿਸਾਨ ਭਾਈਚਾਰਾ",
    askExperts: "ਮਾਹਿਰਾਂ ਨੂੰ ਪੁੱਛੋ",
    recentQuestions: "ਹਾਲੀਆ ਸਵਾਲ",
    topExperts: "ਚੋਟੀ ਦੇ ਮਾਹਿਰ",
    categories: ["ਫਸਲਾਂ ਦੇ ਰੋਗ", "ਕੀਟ ਕੰਟਰੋਲ", "ਖਾਦਾਂ", "ਮੌਸਮ", "ਮਾਰਕੀਟ ਕੀਮਤਾਂ", "ਸਿੰਚਾਈ", "ਬੀਜ", "ਜਨਰਲ"],
    searchPlaceholder: "ਸਵਾਲ ਖੋਜੋ...",
    askQuestion: "ਸਵਾਲ ਪੁੱਛੋ",
    questionTitle: "ਸਵਾਲ ਦਾ ਸਿਰਲੇਖ",
    questionDetails: "ਸਵਾਲ ਦੇ ਵੇਰਵੇ",
    selectCategory: "ਸ਼੍ਰੇਣੀ ਚੁਣੋ",
    submitQuestion: "ਸਵਾਲ ਜਮ੍ਹਾਂ ਕਰੋ",
    back: "ਵਾਪਸ",
    answered: "ਜਵਾਬ ਦਿੱਤਾ",
    pending: "ਬਾਕੀ",
    likes: "ਪਸੰਦਾਂ",
    replies: "ਜਵਾਬਾਂ",
    questions: [
      {
        id: 1,
        title: "ਕਪਾਹ ਦੇ ਪੱਤਿਆਂ 'ਤੇ ਚਿੱਟੇ ਧੱਬੇ - ਇਹ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        category: "ਫਸਲਾਂ ਦੇ ਰੋਗ",
        author: "ਰਮੇਸ਼ ਕੁਮਾਰ",
        time: "2 ਘੰਟੇ ਪਹਿਲਾਂ",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "ਮੈਂ ਆਪਣੇ ਕਪਾਹ ਦੇ ਪੌਦਿਆਂ 'ਤੇ ਚਿੱਟੇ ਧੱਬੇ ਦੇਖੇ। ਧੱਬੇ ਛੋਟੇ ਅਤੇ ਖਿੰਡੇ ਹੋਏ ਹਨ...",
      },
      {
        id: 2,
        title: "ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਬੀਜਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ?",
        category: "ਬੀਜ",
        author: "ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ",
        time: "5 ਘੰਟੇ ਪਹਿਲਾਂ",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "ਪੰਜਾਬ ਖੇਤਰ ਵਿੱਚ ਕਣਕ ਬੀਜਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕਦੋਂ ਹੈ? ਮੌਸਮ ਅਨਿਸ਼ਚਿਤ ਰਿਹਾ ਹੈ...",
      },
      {
        id: 3,
        title: "ਟਮਾਟਰਾਂ ਲਈ ਜੈਵਿਕ ਖਾਦ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ",
        category: "ਖਾਦਾਂ",
        author: "ਪ੍ਰਿਆ ਸ਼ਰਮਾ",
        time: "1 ਦਿਨ ਪਹਿਲਾਂ",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "ਮੈਂ ਆਪਣੇ ਟਮਾਟਰ ਦੀ ਫਸਲ ਲਈ ਜੈਵਿਕ ਖਾਦ ਦੇ ਵਿਕਲਪ ਲੱਭ ਰਿਹਾ ਹਾਂ। ਰਸਾਇਣਾਂ ਤੋਂ ਬਚਣਾ ਚਾਹੁੰਦਾ ਹਾਂ...",
      },
    ],
    experts: [
      {
        name: "ਡਾ. ਸੁਰੇਸ਼ ਪਟੇਲ",
        specialty: "ਪੌਦਾ ਰੋਗ ਵਿਗਿਆਨ",
        rating: 4.9,
        answers: 234,
        avatar: "SP",
      },
      {
        name: "ਪ੍ਰੋ. ਮੀਰਾ ਜੋਸ਼ੀ",
        specialty: "ਮਿੱਟੀ ਵਿਗਿਆਨ",
        rating: 4.8,
        answers: 189,
        avatar: "MJ",
      },
      {
        name: "ਰਾਜੇਸ਼ ਵਰਮਾ",
        specialty: "ਕੀਟ ਪ੍ਰਬੰਧਨ",
        rating: 4.7,
        answers: 156,
        avatar: "RV",
      },
    ],
  },
}

export default function CommunityPage() {
  const { currentLang } = useLanguage()
  const [showAskForm, setShowAskForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const t = communityLanguages[currentLang] || communityLanguages.en // Fallback to English

  return (
    <div className="min-h-screen bg-background pb-20">
      {" "}
      {/* Added pb-20 for bottom navigation */}
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">{t.title}</span>
            </div>
          </div>

          {/* Language Selector and Notification Bell */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Ask Question */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowAskForm(!showAskForm)} className="whitespace-nowrap">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t.askQuestion}
          </Button>
        </div>

        {/* Ask Question Form */}
        {showAskForm && (
          <Card>
            <CardHeader>
              <CardTitle>{t.askQuestion}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.questionTitle}</label>
                <Input placeholder="Enter your question title..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">{t.questionDetails}</label>
                <Textarea placeholder="Describe your question in detail..." className="mt-1" rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium">{t.selectCategory}</label>
                <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                  {t.categories.map((category: string, index: number) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  {t.submitQuestion}
                </Button>
                <Button variant="outline" onClick={() => setShowAskForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t.recentQuestions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.questions.map((question: Question) => (
                  <div key={question.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {question.category}
                          </Badge>
                          <Badge
                            variant={question.status === "answered" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {question.status === "answered" ? t.answered : t.pending}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{question.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{question.preview}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {question.author}
                          </span>
                          <span>{question.time}</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {question.likes} {t.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {question.replies} {t.replies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Experts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t.topExperts}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.experts.map((expert: Expert, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">{expert.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{expert.name}</div>
                      <div className="text-xs text-muted-foreground">{expert.specialty}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {expert.rating}
                        </div>
                        <span className="text-muted-foreground">{expert.answers} answers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t.categories}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {t.categories.map((category: string, index: number) => (
                    <Button key={index} variant="ghost" size="sm" className="w-full justify-start text-xs">
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNavigation /> {/* Add BottomNavigation here */}
    </div>
  )
}
