"use client"

import type React from "react"
import { useState, useRef, FC, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Camera,
    Upload,
    Volume2,
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Info,
    Leaf,
    Droplets,
    Bug,
    Phone,
    CreditCard,
    TestTube,
    MapPin,
    FileText,
    Loader2,
    Sprout,
    FlaskConical,
    Mountain,
    Thermometer,
    Sun,
    Atom,
    Microscope,
    Award,
    XCircle,
    ShoppingCart,
    ExternalLink,
    ChevronsRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { BottomNavigation } from "@/components/bottom-navigation"
import { NotificationBell } from "@/components/notification-bell"
import { HamburgerMenu } from "@/components/hamburger-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useAdvisory } from "@/contexts/AdvisoryContext"
import { toast } from "@/hooks/use-toast"

// Data structures
interface SoilReportData {
    ph: number; ec: number; oc: number;
    n: number; p: number; k: number;
    s: number; ca: number; mg: number;
    zn: number; b: number; fe: number; mn: number; cu: number;
}

interface Insight {
    title: string;
    value: string;
    level: "Very Low" | "Low" | "Optimal" | "High" | "Very High" | "Acidic" | "Neutral" | "Alkaline";
    color: "red" | "green" | "yellow" | "blue";
    description: string;
    icon: ReactNode;
}

interface FertilizerRecommendation {
    nutrient: string;
    productName: string;
    reason: string;
    icon: ReactNode;
    links: { name: string; url: string }[];
}

interface CropDiagnosisResults {
    disease: string;
    severity: "low" | "medium" | "high";
    confidence: number;
    description: string;
    treatment: string;
    prevention: string;
}

interface SoilDataEntry {
    ph: number | undefined
    nitrogen: number | undefined
    phosphorus: number | undefined
    potassium: number | undefined
    organicCarbon: number | undefined
    sulfur: number | undefined
    ec: number | undefined
    calcium: number | undefined
    magnesium: number | undefined
    zinc: number | undefined
    boron: number | undefined
    iron: number | undefined
    manganese: number | undefined
    cu: number | undefined
}

interface StructuredGuidance {
    general_analysis: string;
    nutrient_recommendations: { nutrient: string; level: string; action: string; }[];
    actionable_steps: string[];
}


const diagnosisLanguages: Record<string, any> = {
    en: {
        title: "Crop Advisory & Soil Health",
        subtitle: "AI-Powered Crop Analysis with Soil Health Integration",
        uploadPrompt: "Take a photo or upload an image of your crop",
        takePhoto: "Take Photo",
        uploadImage: "Upload Image",
        analyzing: "Analyzing your crop...",
        results: "Diagnosis Results",
        confidence: "Confidence Level",
        recommendations: "Recommendations",
        soilHealth: "Soil Health Analysis",
        soilHealthCard: "Soil Health Card",
        hasCard: "I have Soil Health Card",
        noCard: "I don't have Soil Health Card",
        uploadCard: "Upload Soil Health Card",
        enterAadhaar: "Enter Aadhaar Number",
        linkAadhaar: "Link with Aadhaar",
        soilParameters: "Soil Parameters",
        locationDetails: "Location Details",
        selectState: "Select State",
        selectDistrict: "Select District",
        selectCity: "Select City/Village",
        manualEntry: "Manual Soil Data Entry",
        severity: {
            low: "Low Risk",
            medium: "Medium Risk",
            high: "High Risk",
        },
        actions: {
            retake: "Take Another Photo",
            speakResults: "Listen to Results",
            getHelp: "Get Expert Help",
            back: "Back",
            submitData: "Submit Data",
            getGuidance: "Get Guidance",
            cancel: "Cancel"
        },
        soilData: {
            ph: "pH Level",
            nitrogen: "Nitrogen (N)",
            phosphorus: "Phosphorus (P)",
            potassium: "Potassium (K)",
            organicCarbon: "Organic Carbon",
            sulfur: "Sulfur (S)",
            zinc: "Zinc (Zn)",
            boron: "Boron (B)",
            iron: "Iron (Fe)",
            manganese: "Manganese (Mn)",
            ec: "Conductivity (EC)",
            calcium: "Calcium (Ca)",
            magnesium: "Magnesium (Mg)",
            cu: "Copper (Cu)",
        },
        tips: {
            photoTips: "Photo Tips",
            tip1: "Take photos in good natural light",
            tip2: "Focus on affected areas clearly",
            tip3: "Include healthy parts for comparison",
            tip4: "Avoid shadows and blur",
        },
    },
    hi: {
        title: "फसल सलाह और मिट्टी स्वास्थ्य",
        subtitle: "मिट्टी स्वास्थ्य एकीकरण के साथ AI-संचालित फसल विश्लेषण",
        uploadPrompt: "अपनी फसल का फोटो लें या छवि अपलोड करें",
        takePhoto: "फोटो लें",
        uploadImage: "छवि अपलोड करें",
        analyzing: "आपकी फसल का विश्लेषण कर रहे हैं...",
        results: "निदान परिणाम",
        confidence: "विश्वास स्तर",
        recommendations: "सिफारिशें",
        soilHealth: "मिट्टी स्वास्थ्य विश्लेषण",
        soilHealthCard: "मिट्टी स्वास्थ्य कार्ड",
        hasCard: "मेरे पास मिट्टी स्वास्थ्य कार्ड है",
        noCard: "मेरे पास मिट्टी स्वास्थ्य कार्ड नहीं है",
        uploadCard: "मिट्टी स्वास्थ्य कार्ड अपलोड करें",
        enterAadhaar: "आधार नंबर दर्ज करें",
        linkAadhaar: "आधार से लिंक करें",
        manualEntry: "मैन्युअल मिट्टी डेटा प्रविष्टि",
        severity: {
            low: "कम जोखिम",
            medium: "मध्यम जोखिम",
            high: "उच्च जोखिम",
        },
        actions: {
            retake: "दूसरी फोटो लें",
            speakResults: "परिणाम सुनें",
            getHelp: "विशेषज्ञ सहायता लें",
            back: "वापस",
            submitData: "डेटा जमा करें",
            getGuidance: "सलाह प्राप्त करें",
            cancel: "रद्द करें"
        },
        soilData: {
            ph: "pH स्तर",
            nitrogen: "नाइट्रोजन (N)",
            phosphorus: "फास्फोरस (P)",
            potassium: "पोटेशियम (K)",
            organicCarbon: "जैविक कार्बन",
            sulfur: "सल्फर (S)",
            zinc: "जिंक (Zn)",
            boron: "बोरॉन (B)",
            iron: "आयरन (Fe)",
            manganese: "मैंगनीज (Mn)",
            ec: "चालकता (EC)",
            calcium: "कैल्शियम (Ca)",
            magnesium: "मैग्नीशियम (Mg)",
            cu: "तांबा (Cu)",
        },
        tips: {
            photoTips: "फोटो टिप्स",
            tip1: "अच्छी प्राकृतिक रोशनी में फोटो लें",
            tip2: "प्रभावित क्षेत्रों पर स्पष्ट रूप से ध्यान दें",
            tip3: "तुलना के लिए स्वस्थ भागों को शामिल करें",
            tip4: "छाया और धुंधलेपन से बचें",
        },
    },
	mr: {
        title: "पीक सल्ला आणि मातीचे आरोग्य",
        subtitle: "मातीच्या आरोग्याच्या एकात्मिकतेसह AI-चालित पीक विश्लेषण",
        uploadPrompt: "तुमच्या पिकाचा फोटो घ्या किंवा इमेज अपलोड करा",
        takePhoto: "फोटो घ्या",
        uploadImage: "इमेज अपलोड करा",
        analyzing: "तुमच्या पिकाचे विश्लेषण करत आहे...",
        results: "निदान परिणाम",
        confidence: "आत्मविश्वास पातळी",
        recommendations: "शिफारसी",
        soilHealth: "मातीचे आरोग्य विश्लेषण",
        soilHealthCard: "मृदा आरोग्य पत्रिका",
        hasCard: "माझ्याकडे मृदा आरोग्य पत्रिका आहे",
        noCard: "माझ्याकडे मृदा आरोग्य पत्रिका नाही",
        uploadCard: "मृदा आरोग्य पत्रिका अपलोड करा",
        enterAadhaar: "आधार क्रमांक टाका",
        linkAadhaar: "आधारशी लिंक करा",
        manualEntry: "मॅन्युअल माती डेटा एंट्री",
        severity: {
            low: "कमी धोका",
            medium: "मध्यम धोका",
            high: "उच्च धोका",
        },
        actions: {
            retake: "दुसरा फोटो घ्या",
            speakResults: "निकाल ऐका",
            getHelp: "तज्ञांची मदत घ्या",
            back: "मागे",
            submitData: "माहिती सादर करा",
            getGuidance: "मार्गदर्शन मिळवा",
            cancel: "रद्द करा"
        },
        soilData: {
            ph: "pH पातळी",
            nitrogen: "नायट्रोजन (N)",
            phosphorus: "फॉस्फरस (P)",
            potassium: "पोटॅशियम (K)",
            organicCarbon: "सेंद्रिय कर्ब",
            sulfur: "गंधक (S)",
            zinc: "जस्त (Zn)",
            boron: "बोरॉन (B)",
            iron: "लोह (Fe)",
            manganese: "मॅंगनीज (Mn)",
            ec: "विद्युत चालकता (EC)",
            calcium: "कॅल्शियम (Ca)",
            magnesium: "मॅग्नेशियम (Mg)",
            cu: "तांबे (Cu)",
        },
        tips: {
            photoTips: "फोटो टिप्स",
            tip1: "चांगल्या नैसर्गिक प्रकाशात फोटो घ्या",
            tip2: "प्रभावित भागांवर स्पष्टपणे लक्ष केंद्रित करा",
            tip3: "तुलनेसाठी निरोगी भाग समाविष्ट करा",
            tip4: "सावली आणि अस्पष्टता टाळा",
        },
    },
    pa: {
        title: "ਫਸਲ ਸਲਾਹ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
        subtitle: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਏਕੀਕਰਣ ਦੇ ਨਾਲ ਏਆਈ-ਸੰਚਾਲਿਤ ਫਸਲ ਵਿਸ਼ਲੇਸ਼ਣ",
        uploadPrompt: "ਆਪਣੀ ਫਸਲ ਦੀ ਫੋਟੋ ਲਓ ਜਾਂ ਇੱਕ ਚਿੱਤਰ ਅਪਲੋਡ ਕਰੋ",
        takePhoto: "ਫੋਟੋ ਲਵੋ",
        uploadImage: "ਚਿੱਤਰ ਅਪਲੋਡ ਕਰੋ",
        analyzing: "ਤੁਹਾਡੀ ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
        results: "ਨਿਦਾਨ ਨਤੀਜੇ",
        confidence: "ਵਿਸ਼ਵਾਸ ਪੱਧਰ",
        recommendations: "ਸਿਫਾਰਸ਼ਾਂ",
        soilHealth: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ",
        soilHealthCard: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ",
        hasCard: "ਮੇਰੇ ਕੋਲ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਹੈ",
        noCard: "ਮੇਰੇ ਕੋਲ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਨਹੀਂ ਹੈ",
        uploadCard: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਅਪਲੋਡ ਕਰੋ",
        enterAadhaar: "ਆਧਾਰ ਨੰਬਰ ਦਾਖਲ ਕਰੋ",
        linkAadhaar: "ਆਧਾਰ ਨਾਲ ਲਿੰਕ ਕਰੋ",
        manualEntry: "ਮੈਨੂਅਲ ਮਿੱਟੀ ਡਾਟਾ ਐਂਟਰੀ",
        severity: {
            low: "ਘੱਟ ਖਤਰਾ",
            medium: "ਦਰਮਿਆਨਾ ਖਤਰਾ",
            high: "ਉੱਚ ਖਤਰਾ",
        },
        actions: {
            retake: "ਇਕ ਹੋਰ ਫੋਟੋ ਲਓ",
            speakResults: "ਨਤੀਜੇ ਸੁਣੋ",
            getHelp: "ਮਾਹਰ ਦੀ ਮਦਦ ਲਓ",
            back: "ਪਿੱਛੇ",
            submitData: "ਡਾਟਾ ਜਮ੍ਹਾਂ ਕਰੋ",
            getGuidance: "ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ",
            cancel: "ਰੱਦ ਕਰੋ"
        },
        soilData: {
            ph: "pH ਪੱਧਰ",
            nitrogen: "ਨਾਈਟ੍ਰੋਜਨ (N)",
            phosphorus: "ਫਾਸਫੋਰਸ (P)",
            potassium: "ਪੋਟਾਸ਼ੀਅਮ (K)",
            organicCarbon: "ਜੈਵਿਕ ਕਾਰਬਨ",
            sulfur: "ਸਲਫਰ (S)",
            zinc: "ਜ਼ਿੰਕ (Zn)",
            boron: "ਬੋਰੋਨ (B)",
            iron: "ਆਇਰਨ (Fe)",
            manganese: "ਮੈਂਗਨੀਜ਼ (Mn)",
            ec: "ਚਾਲਕਤਾ (EC)",
            calcium: "ਕੈਲਸ਼ੀਅਮ (Ca)",
            magnesium: "ਮੈਗਨੀਸ਼ੀਅਮ (Mg)",
            cu: "ਤਾਂਬਾ (Cu)",
        },
        tips: {
            photoTips: "ਫੋਟੋ ਸੁਝਾਅ",
            tip1: "ਚੰਗੀ ਕੁਦਰਤੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਫੋਟੋਆਂ ਲਓ",
            tip2: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰਾਂ 'ਤੇ ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਧਿਆਨ ਕੇਂਦਰਤ ਕਰੋ",
            tip3: "ਤੁਲਨਾ ਲਈ ਸਿਹਤਮੰਦ ਹਿੱਸੇ ਸ਼ਾਮਲ ਕਰੋ",
            tip4: "ਪਰਛਾਵੇਂ ਅਤੇ ਧੁੰਦਲੇਪਣ ਤੋਂ ਬਚੋ",
        },
    },
    kn: {
        title: "ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
        subtitle: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ஒருங்கிணைಕೆಯೊಂದಿಗೆ AI-ಚಾಲಿತ ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ",
        uploadPrompt: "ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        takePhoto: "ಫೋಟೋ ತೆಗೆ",
        uploadImage: "ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        analyzing: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        results: "ರೋಗನಿರ್ಣಯದ ಫಲಿತಾಂಶಗಳು",
        confidence: "ವಿಶ್ವಾಸದ ಮಟ್ಟ",
        recommendations: "ಶಿಫಾರಸುಗಳು",
        soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ",
        soilHealthCard: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್",
        hasCard: "ನನ್ನ ಬಳಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಇದೆ",
        noCard: "ನನ್ನ ಬಳಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಇಲ್ಲ",
        uploadCard: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        enterAadhaar: "ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
        linkAadhaar: "ಆಧಾರ್‌ನೊಂದಿಗೆ ಲಿಂಕ್ ಮಾಡಿ",
        manualEntry: "ಕೈಪಿಡಿ ಮಣ್ಣಿನ ಡೇಟಾ ನಮೂದು",
        severity: {
            low: "ಕಡಿಮೆ ಅಪಾಯ",
            medium: "ಮಧ್ಯಮ ಅಪಾಯ",
            high: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
        },
        actions: {
            retake: "ಮತ್ತೊಂದು ಫೋಟೋ ತೆಗೆ",
            speakResults: "ಫಲಿತಾಂಶಗಳನ್ನು ಆಲಿಸಿ",
            getHelp: "ತಜ್ಞರ ಸಹಾಯ ಪಡೆಯಿರಿ",
            back: "ಹಿಂದೆ",
            submitData: "ಡೇಟಾ ಸಲ್ಲಿಸಿ",
            getGuidance: "ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ",
            cancel: "ರದ್ದುಮಾಡು"
        },
        soilData: {
            ph: "pH ಮಟ್ಟ",
            nitrogen: "ಸಾರಜನಕ (N)",
            phosphorus: "ರಂಜಕ (P)",
            potassium: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)",
            organicCarbon: "ಸಾವಯವ ಇಂಗಾಲ",
            sulfur: "ಗಂಧಕ (S)",
            zinc: "ಸತು (Zn)",
            boron: "ಬೋರಾನ್ (B)",
            iron: "ಕಬ್ಬಿಣ (Fe)",
            manganese: "ಮ್ಯಾಂಗನೀಸ್ (Mn)",
            ec: "ವಾಹಕತೆ (EC)",
            calcium: "ಕ್ಯಾಲ್ಸಿಯಂ (Ca)",
            magnesium: "ಮೆಗ್ನೀಸಿಯಮ್ (Mg)",
            cu: "ತಾಮ್ರ (Cu)",
        },
        tips: {
            photoTips: "ಫೋಟೋ ಸಲಹೆಗಳು",
            tip1: "ಉತ್ತಮ ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಿರಿ",
            tip2: "ಬಾಧಿತ ಪ್ರದೇಶಗಳ ಮೇಲೆ ಸ್ಪಷ್ಟವಾಗಿ ಗಮನಹರಿಸಿ",
            tip3: "ಹೋಲಿಕೆಗಾಗಿ ಆರೋಗ್ಯಕರ ಭಾಗಗಳನ್ನು ಸೇರಿಸಿ",
            tip4: "ನೆರಳುಗಳು ಮತ್ತು ಮಸುಕುತನವನ್ನು ತಪ್ಪಿಸಿ",
        },
    },
    ta: {
        title: "பயிர் ஆலோசனை மற்றும் மண் ஆரோக்கியம்",
        subtitle: "மண் சுகாதார ஒருங்கிணைப்புடன் AI-இயங்கும் பயிர் பகுப்பாய்வு",
        uploadPrompt: "உங்கள் பயிரின் புகைப்படத்தை எடுக்கவும் அல்லது ஒரு படத்தை பதிவேற்றவும்",
        takePhoto: "புகைப்படம் எடு",
        uploadImage: "படத்தை பதிவேற்று",
        analyzing: "உங்கள் பயிரை பகுப்பாய்வு செய்கிறது...",
        results: "நோய் கண்டறிதல் முடிவுகள்",
        confidence: "நம்பிக்கை நிலை",
        recommendations: "பரிந்துரைகள்",
        soilHealth: "மண் சுகாதார பகுப்பாய்வு",
        soilHealthCard: "மண் சுகாதார அட்டை",
        hasCard: "என்னிடம் மண் சுகாதார அட்டை உள்ளது",
        noCard: "என்னிடம் மண் சுகாதார அட்டை இல்லை",
        uploadCard: "மண் சுகாதார அட்டையை பதிவேற்று",
        enterAadhaar: "ஆதார் எண்ணை உள்ளிடவும்",
        linkAadhaar: "ஆதாருடன் இணைக்கவும்",
        manualEntry: "கையேடு மண் தரவு நுழைவு",
        severity: {
            low: "குறைந்த ஆபத்து",
            medium: "நடுத்தர ஆபத்து",
            high: "அதிக ஆபத்து",
        },
        actions: {
            retake: "மற்றொரு புகைப்படம் எடு",
            speakResults: "முடிவுகளைக் கேளுங்கள்",
            getHelp: "நிபுணர் உதவியைப் பெறுங்கள்",
            back: "பின்",
            submitData: "தரவைச் சமர்ப்பி",
            getGuidance: "வழிகாட்டுதலைப் பெறுங்கள்",
            cancel: "ரத்துசெய்"
        },
        soilData: {
            ph: "pH நிலை",
            nitrogen: "நைட்ரஜன் (N)",
            phosphorus: "பாஸ்பரஸ் (P)",
            potassium: "பொட்டாசியம் (K)",
            organicCarbon: "கரிம கார்பன்",
            sulfur: "கந்தகம் (S)",
            zinc: "துத்தநாகம் (Zn)",
            boron: "போரான் (B)",
            iron: "இரும்பு (Fe)",
            manganese: "மாங்கனீசு (Mn)",
            ec: "கடத்துத்திறன் (EC)",
            calcium: "கால்சியம் (Ca)",
            magnesium: "மெக்னீசியம் (Mg)",
            cu: "தாமிரம் (Cu)",
        },
        tips: {
            photoTips: "புகைப்பட குறிப்புகள்",
            tip1: "நல்ல இயற்கை ஒளியில் புகைப்படங்களை எடுக்கவும்",
            tip2: "பாதிக்கப்பட்ட பகுதிகளில் தெளிவாக கவனம் செலுத்துங்கள்",
            tip3: "ஒப்பீட்டிற்காக ஆரோக்கியமான பாகங்களைச் சேர்க்கவும்",
            tip4: "நிழல்கள் மற்றும் மங்கலாக்குவதைத் தவிர்க்கவும்",
        },
    },
};


type DiagnosisStage = "upload" | "analyzing" | "results" | "soilInsights" | "recommendations" | "combinedGuidance";

export default function CropDiagnosis() {
    const { currentLang } = useLanguage()
    const { addAdvisory } = useAdvisory()
    const { user } = useAuth();
    const [stage, setStage] = useState<DiagnosisStage>("upload")
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [hasSoilCard, setHasSoilCard] = useState<boolean | null>(null)
    const [soilDataLoaded, setSoilDataLoaded] = useState(false)
    const [uploadedSoilCard, setUploadedSoilCard] = useState<string | null>(null)
    const [showManualEntry, setShowManualEntry] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentTab, setCurrentTab] = useState("crop");
    const [structuredGuidance, setStructuredGuidance] = useState<StructuredGuidance | null>(null);

    const [manualSoilData, setManualSoilData] = useState<SoilDataEntry>({
        ph: undefined, nitrogen: undefined, phosphorus: undefined, potassium: undefined,
        organicCarbon: undefined, sulfur: undefined, ec: undefined, calcium: undefined,
        magnesium: undefined, zinc: undefined, boron: undefined, iron: undefined,
        manganese: undefined, cu: undefined
    });

    const [cropDiagnosis, setCropDiagnosis] = useState<CropDiagnosisResults | null>(null);
    const [generatedInsights, setGeneratedInsights] = useState<Insight[]>([]);
    const [fertilizerPlan, setFertilizerPlan] = useState<FertilizerRecommendation[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null)
    const soilCardInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const t = diagnosisLanguages[currentLang] || diagnosisLanguages.en

    const getInsightsFromData = (data: SoilReportData): Insight[] => {
        const insights: Insight[] = [];
        const addInsight = (title: string, value: number, unit: string, idealRange: [number, number], icon: ReactNode, customLogic?: (val: number) => Partial<Insight>) => {
            let level: Insight["level"] = "Optimal", color: Insight["color"] = "green";
            if (value < idealRange[0]) { level = "Low"; color = "yellow"; }
            if (value > idealRange[1]) { level = "High"; color = "blue"; }
            let custom = customLogic ? customLogic(value) : {};
            insights.push({ title, value: `${(value || 0).toFixed(2)} ${unit}`, level, color, description: "", icon, ...custom });
        };
        addInsight("Soil pH", data.ph, "", [6.25, 7.5], <Thermometer className="h-6 w-6 text-blue-500" />, (val) => ({ level: val < 6.25 ? "Acidic" : val > 7.5 ? "Alkaline" : "Neutral", color: val < 6.25 ? "yellow" : val > 7.5 ? "blue" : "green", description: val < 6.25 ? "Acidic soil can lock nutrients. Consider applying lime." : val > 7.5 ? "Alkaline soil can limit micronutrient uptake. Consider gypsum." : "Excellent pH for nutrient availability." }));
        addInsight("Conductivity (EC)", data.ec, "mS/cm", [0, 1.0], <Droplets className="h-6 w-6 text-sky-500" />, (val) => ({ level: val > 1.0 ? "High" : "Optimal", color: val > 1.0 ? "red" : "green", description: val > 1.0 ? "High salinity can cause salt stress to plants." : "Ideal salt level, safe for all crops." }));
        addInsight("Organic Carbon", data.oc, "%", [0.75, Infinity], <FlaskConical className="h-6 w-6 text-amber-600" />, (val) => ({ level: val < 0.75 ? "Low" : "Optimal", color: val < 0.75 ? "red" : "green", description: val < 0.75 ? "A critical area for improvement. Add compost or FYM." : "Excellent organic matter content for soil health." }));
        addInsight("Nitrogen (N)", data.n, "kg/ha", [281, 410], <Leaf className="h-6 w-6 text-green-500" />, (val) => ({ description: "For leafy growth." }));
        addInsight("Phosphorus (P)", data.p, "kg/ha", [13, 22], <Sun className="h-6 w-6 text-orange-500" />, (val) => ({ description: "For root and flower development." }));
        addInsight("Potassium (K)", data.k, "kg/ha", [181, 240], <Award className="h-6 w-6 text-purple-500" />, (val) => ({ description: "For overall vigor and disease resistance." }));
        addInsight("Sulphur (S)", data.s, "ppm", [7, 15], <Atom className="h-6 w-6 text-yellow-500" />, (val) => ({ description: "Key for protein synthesis and oilseeds." }));
        addInsight("Calcium (Ca)", data.ca, "%", [0.3, 0.8], <Mountain className="h-6 w-6 text-gray-500" />, (val) => ({ description: "Builds strong cell walls." }));
        addInsight("Magnesium (Mg)", data.mg, "%", [0.06, 0.15], <Sprout className="h-6 w-6 text-lime-600" />, (val) => ({ description: "Central to photosynthesis." }));
        addInsight("Iron (Fe)", data.fe, "ppm", [2.5, 4.5], <Microscope className="h-6 w-6 text-red-800" />, (val) => ({ description: "For chlorophyll formation." }));
        addInsight("Manganese (Mn)", data.mn, "ppm", [1.0, 2.0], <Microscope className="h-6 w-6 text-pink-700" />, (val) => ({ description: "Aids in photosynthesis." }));
        addInsight("Zinc (Zn)", data.zn, "ppm", [0.5, 1.2], <Microscope className="h-6 w-6 text-teal-600" />, (val) => ({ description: "For enzyme function." }));
        addInsight("Copper (Cu)", data.cu, "ppm", [0.3, 0.5], <Microscope className="h-6 w-6 text-orange-700" />, (val) => ({ description: "For reproductive growth." }));
        addInsight("Boron (B)", data.b, "ppm", [0.3, 0.5], <Microscope className="h-6 w-6 text-indigo-600" />, (val) => ({ description: "Crucial for fruit and seed setting." }));
        return insights;
    };

    const getFertilizerPlan = (insights: Insight[]): FertilizerRecommendation[] => {
        const plan: FertilizerRecommendation[] = [];
        const nutrientMap: { [key: string]: string } = {
            'Nitrogen (N)': 'Urea or DAP', 'Phosphorus (P)': 'DAP or Single Super Phosphate', 'Potassium (K)': 'Muriate of Potash (MOP)',
            'Sulphur (S)': 'Bensulf or Gypsum', 'Zinc (Zn)': 'Zinc Sulphate', 'Boron (B)': 'Borax Decahydrate',
            'Magnesium (Mg)': 'Epsom Salt', 'Calcium (Ca)': 'Gypsum or Lime',
        };

        insights.forEach(insight => {
            if (insight.level === "Low" || insight.level === "Very Low" || insight.level === "Acidic" || insight.level === "Alkaline") {
                const productName = nutrientMap[insight.title];
                if (productName) {
                    plan.push({
                        nutrient: insight.title, productName, reason: `Your soil is deficient in ${insight.title}, which is crucial for ${insight.description.toLowerCase()}`,
                        icon: insight.icon,
                        links: [
                            { name: "IFFCO BAZAR", url: `https://www.iffcobazar.in/en/search?q=${encodeURIComponent(productName)}` },
                            { name: "AgriBegri", url: `https://www.agribegri.com/search?q=${encodeURIComponent(productName)}` },
                        ]
                    });
                }
            }
        });
        return plan;
    };

    const handleShowInsights = (data: SoilReportData) => {
        const insights = getInsightsFromData(data);
        setGeneratedInsights(insights);
        setSoilDataLoaded(true);
        setStage("soilInsights");
    }

    const handleCropImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            setApiError("You must be logged in to analyze crops.");
            toast.error("Authentication Required", { description: "Please log in to use this feature." });
            return;
        }
        const file = event.target.files?.[0];
        if (file) {
            setUploadedImage(URL.createObjectURL(file));
            setApiError(null);
            setStage("analyzing");
            setIsAnalyzing(true);
            setAnalysisProgress(0);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("lang", currentLang);
            formData.append("userId", user.id); // Pass authenticated user's ID

            const progressInterval = setInterval(() => {
                setAnalysisProgress(prev => Math.min(prev + 5, 95));
            }, 200);

            try {
                const response = await fetch("/api/analyze-crop-health", { method: "POST", body: formData });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }
                const result: CropDiagnosisResults = await response.json();
                setCropDiagnosis(result);
                addAdvisory({
                    title: `New Crop Diagnosis: ${result.disease}`,
                    description: `An analysis of your crop showed a ${result.disease}. It has a confidence level of ${result.confidence}%.`,
                    priority: result.severity,
                    time: "Just now",
                });
                setAnalysisProgress(100);
                setTimeout(() => setStage("results"), 500);
            } catch (error: any) {
                console.error("Crop analysis error:", error);
                setApiError(error.message);
                setStage("upload");
            } finally {
                clearInterval(progressInterval);
                setIsAnalyzing(false);
            }
        }
    };

    const handleSoilCardUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            setApiError("You must be logged in to analyze a soil card.");
            toast.error("Authentication Required", { description: "Please log in to use this feature." });
            return;
        }
        const file = event.target.files?.[0];
        if (file) {
            setUploadedSoilCard(URL.createObjectURL(file));
            setApiError(null);
            setIsAnalyzing(true);
            setAnalysisProgress(0);
            setStage("analyzing");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("lang", currentLang);
            formData.append("userId", user.id); // Pass authenticated user's ID

            const progressInterval = setInterval(() => {
                setAnalysisProgress(prev => Math.min(prev + 5, 95));
            }, 200);

            try {
                const response = await fetch("/api/analyze-soil-card", { method: "POST", body: formData });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }
                const result: SoilReportData = await response.json();
                handleShowInsights(result);
            } catch (error: any) {
                console.error("Soil card analysis error:", error);
                setApiError(error.message);
                setStage("upload");
            } finally {
                clearInterval(progressInterval);
                setIsAnalyzing(false);
            }
        }
    };

    const handleManualSoilSubmit = async () => {
        if (!user) {
            setApiError("You must be logged in to submit soil data.");
            toast.error("Authentication Required", { description: "Please log in to use this feature." });
            return;
        }
        setIsSubmitting(true);
        setApiError(null);
        
        try {
            const response = await fetch("/api/save-manual-soil-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ manualFormData: manualSoilData, userId: user.id }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            toast.success("Data saved successfully!");
            // After saving, immediately get guidance
            handleGetGuidance();
        } catch (error: any) {
            console.error("Manual submission error:", error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetGuidance = async () => {
        if (!user) {
            setApiError("You must be logged in to get guidance.");
            toast.error("Authentication Required", { description: "Please log in to use this feature." });
            return;
        }
        setIsAnalyzing(true);
        setApiError(null);
        setStage("analyzing");
        setAnalysisProgress(0);
        
        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => Math.min(prev + 5, 95));
        }, 200);

        try {
             // First, ensure data is saved
            const saveResponse = await fetch("/api/save-manual-soil-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ manualFormData: manualSoilData, userId: user.id }),
            });
            if (!saveResponse.ok) {
                throw new Error('Failed to save soil data before getting guidance.');
            }
            
            const aiResponse = await fetch("/api/guidance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ manualFormData: manualSoilData, lang: currentLang }),
            });

            if (!aiResponse.ok) {
                const errorData = await aiResponse.json();
                throw new Error(errorData.error || `Server error: ${aiResponse.status}`);
            }

            const aiResult: StructuredGuidance = await aiResponse.json();
            setStructuredGuidance(aiResult);

            const dataToGenerateInsights: SoilReportData = {
                ph: manualSoilData.ph || 0, ec: manualSoilData.ec || 0, oc: manualSoilData.organicCarbon || 0,
                n: manualSoilData.nitrogen || 0, p: manualSoilData.phosphorus || 0, k: manualSoilData.potassium || 0,
                s: manualSoilData.sulfur || 0, ca: manualSoilData.calcium || 0, mg: manualSoilData.magnesium || 0,
                zn: manualSoilData.zinc || 0, b: manualSoilData.boron || 0, fe: manualSoilData.iron || 0,
                mn: manualSoilData.manganese || 0, cu: manualSoilData.cu || 0,
            };

            const insights = getInsightsFromData(dataToGenerateInsights);
            setGeneratedInsights(insights); 
            const plan = getFertilizerPlan(insights);
            setFertilizerPlan(plan);

            setAnalysisProgress(100);
            setTimeout(() => setStage("combinedGuidance"), 500);

        } catch (error: any) {
            console.error("Guidance generation error:", error);
            setApiError(error.message);
            setStage("upload");
            setHasSoilCard(false);
            setShowManualEntry(true);
        } finally {
            clearInterval(progressInterval);
            setIsAnalyzing(false);
        }
    };

    const handleTakePhoto = () => fileInputRef.current?.click();

    const handleSpeakResults = () => {
        if (cropDiagnosis) {
            setIsSpeaking(true);
            const textToSpeak = `${cropDiagnosis.disease}. ${cropDiagnosis.description}. Treatment: ${cropDiagnosis.treatment}. Prevention: ${cropDiagnosis.prevention}`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = currentLang;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high": return "destructive";
            case "medium": return "secondary";
            default: return "default";
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "high": return <AlertTriangle className="h-4 w-4" />;
            case "medium": return <Info className="h-4 w-4" />;
            default: return <CheckCircle className="h-4 w-4" />;
        }
    }

    const InsightSection: FC<{ title: string; insights: Insight[] }> = ({ title, insights }) => {
        const badgeVariants = {
            red: "bg-red-100 text-red-800 border-red-200", green: "bg-green-100 text-green-800 border-green-200",
            yellow: "bg-yellow-100 text-yellow-800 border-yellow-200", blue: "bg-blue-100 text-blue-800 border-blue-200",
        };
        const InsightCard: FC<{ insight: Insight }> = ({ insight }) => (
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-2 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2">
                    <div className="flex-shrink-0">{insight.icon}</div><p className="font-semibold text-gray-700">{insight.title}</p>
                </div><Badge variant="outline" className={cn("text-xs font-medium", badgeVariants[insight.color])}>{insight.level}</Badge></div>
                <p className="text-3xl font-bold text-gray-900">{insight.value}</p><p className="text-sm text-gray-500 mt-1">{insight.description}</p>
            </div>
        );
        return (
            <div className="pt-4"><h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{insights.map(insight => (<InsightCard key={insight.title} insight={insight} />))}</div>
            </div>
        )
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
                        <HamburgerMenu />
                        <div className="flex items-center gap-2">
                            <Leaf className="h-6 w-6 text-primary" /><span className="text-lg font-bold text-foreground text-balance">{t.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2"><NotificationBell /><LanguageSelector /></div>
                </div>
            </header>
            <div className="container mx-auto px-4 py-6">
                {stage === "upload" && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="text-center space-y-2"><h1 className="text-2xl font-bold text-foreground text-balance">{t.subtitle}</h1>
                            <p className="text-muted-foreground text-pretty">{t.uploadPrompt}</p>
                        </div>
                        {apiError && (<Alert variant="destructive"><XCircle className="h-4 w-4" /><AlertDescription>{apiError}</AlertDescription></Alert>)}
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="crop" className="flex items-center gap-2"><Camera className="h-4 w-4" />Crop Diagnosis</TabsTrigger>
                                <TabsTrigger value="soil" className="flex items-center gap-2"><TestTube className="h-4 w-4" />{t.soilHealth}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="crop" className="space-y-6">
                                <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
                                    <CardContent className="p-12 text-center space-y-6">
                                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"><Camera className="h-10 w-10 text-primary" /></div>
                                        <div className="space-y-4">
                                            <Button size="lg" onClick={handleTakePhoto} className="w-full sm:w-auto"><Camera className="mr-2 h-5 w-5" />{t.takePhoto}</Button>
                                            <div className="text-sm text-muted-foreground">or</div>
                                            <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto"><Upload className="mr-2 h-5 w-5" />{t.uploadImage}</Button>
                                        </div>
                                        {/* FIX: Removed capture="environment" */}
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCropImageUpload} className="hidden" />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5 text-primary" />{t.tips.photoTips}</CardTitle></CardHeader>
                                    <CardContent className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span className="text-pretty">{t.tips.tip1}</span></div>
                                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span className="text-pretty">{t.tips.tip2}</span></div>
                                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span className="text-pretty">{t.tips.tip3}</span></div>
                                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /><span className="text-pretty">{t.tips.tip4}</span></div>
                                    </div></CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="soil" className="space-y-6">
                                {hasSoilCard === null ? (
                                    <Card>
                                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" />{t.soilHealthCard}</CardTitle></CardHeader>
                                        <CardContent className="space-y-4"><p className="text-muted-foreground text-pretty">Do you have a Soil Health Card? We can provide a detailed analysis based on it.</p>
                                            <div className="flex flex-col sm:flex-row gap-4"><Button onClick={() => setHasSoilCard(true)} className="flex-1"><CheckCircle className="mr-2 h-4 w-4" />{t.hasCard}</Button>
                                                <Button variant="outline" onClick={() => setHasSoilCard(false)} className="flex-1"><CreditCard className="mr-2 h-4 w-4" />{t.noCard}</Button>
                                            </div></CardContent>
                                    </Card>
                                ) : hasSoilCard && !soilDataLoaded ? (
                                    <Card>
                                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t.uploadCard}</CardTitle></CardHeader>
                                        <CardContent className="space-y-4"><p className="text-muted-foreground text-pretty">Upload your Soil Health Card to view all parameters automatically.</p>
                                            <Button onClick={() => soilCardInputRef.current?.click()} className="w-full"><Upload className="mr-2 h-4 w-4" />{t.uploadCard}</Button>
                                            <input ref={soilCardInputRef} type="file" accept="image/*,.pdf" onChange={handleSoilCardUpload} className="hidden" />
                                        </CardContent>
                                    </Card>
                                ) : hasSoilCard === false && !soilDataLoaded ? (
                                    <Card>
                                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{t.manualEntry}</CardTitle></CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(t.soilData).map(([key, label]) => (<div key={key} className="space-y-2">
                                                    <Label htmlFor={key}>{label as ReactNode}</Label><Input id={key} type="number" step="any" value={manualSoilData[key as keyof SoilDataEntry] ?? ""} onChange={(e) => setManualSoilData((prev) => ({ ...prev, [key as keyof SoilDataEntry]: parseFloat(e.target.value) }))} placeholder="Enter value" />
                                                </div>))}
                                            </div>
                                            <div className="flex gap-4 mt-6">
                                                <Button onClick={handleGetGuidance} disabled={isSubmitting || isAnalyzing} className="flex-1">
                                                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronsRight className="mr-2 h-4 w-4" />}
                                                    {isAnalyzing ? "Getting Guidance..." : t.actions.getGuidance}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : null}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
                {stage === "analyzing" && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-bold text-foreground text-balance">{isAnalyzing ? t.analyzing : "Submitting data..."}</h1>
                            {uploadedImage && (<div className="mx-auto w-48 h-48 rounded-lg overflow-hidden border-2 border-primary/20">
                                <Image src={uploadedImage || "/placeholder.svg"} alt="Uploaded crop" width={192} height={192} className="w-full h-full object-cover" />
                            </div>)}
                            <div className="space-y-2">
                                <Progress value={analysisProgress} className="w-full" />
                                <p className="text-sm text-muted-foreground">{Math.round(analysisProgress)}% complete</p>
                            </div>
                        </div>
                    </div>
                )}
                {stage === "results" && cropDiagnosis && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-foreground text-balance">{t.results}</h1>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-sm text-muted-foreground">{t.confidence}:</span>
                                <Badge variant="default">{cropDiagnosis.confidence}%</Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                {uploadedImage && (<Card>
                                    <CardHeader><CardTitle className="text-lg">Analyzed Image</CardTitle></CardHeader>
                                    <CardContent><div className="w-full aspect-square rounded-lg overflow-hidden border">
                                        <Image src={uploadedImage || "/placeholder.svg"} alt="Analyzed crop" width={300} height={300} className="w-full h-full object-cover" />
                                    </div></CardContent>
                                </Card>)}
                            </div>
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader><div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2"><Bug className="h-5 w-5 text-destructive" /><span className="text-balance">{cropDiagnosis.disease}</span></CardTitle>
                                        <Badge variant={getSeverityColor(cropDiagnosis.severity)} className="flex items-center gap-1">
                                            {getSeverityIcon(cropDiagnosis.severity)}
                                            {t.severity[cropDiagnosis.severity]}
                                        </Badge>
                                    </div></CardHeader>
                                    <CardContent><p className="text-muted-foreground text-pretty">{cropDiagnosis.description}</p></CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Droplets className="h-5 w-5 text-primary" />{t.recommendations}</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert><AlertTriangle className="h-4 w-4" /><AlertDescription><strong>Treatment:</strong> <span className="text-pretty">{cropDiagnosis.treatment}</span></AlertDescription></Alert>
                                        <Alert><Info className="h-4 w-4" /><AlertDescription><strong>Prevention:</strong> <span className="text-pretty">{cropDiagnosis.prevention}</span></AlertDescription></Alert>
                                    </CardContent>
                                </Card>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button onClick={handleSpeakResults} disabled={isSpeaking} className="flex-1"><Volume2 className="mr-2 h-4 w-4" />{isSpeaking ? "Speaking..." : t.actions.speakResults}</Button>
                                    <Button variant="outline" onClick={() => setStage("upload")} className="flex-1"><Camera className="mr-2 h-4 w-4" />{t.actions.retake}</Button>
                                    <Button variant="secondary" className="flex-1"><Phone className="mr-2 h-4 w-4" />{t.actions.getHelp}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {stage === "soilInsights" && (
                    <Card className="p-6 sm:p-8 animate-fade-in">
                        <CardHeader className="text-center pb-6"><CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Your Soil Health Report</CardTitle><CardDescription className="text-md text-gray-600 mt-2">A detailed breakdown of your soil's condition based on the provided data.</CardDescription></CardHeader>
                        <CardContent className="space-y-6">
                            <InsightSection title="Core Properties" insights={generatedInsights.slice(0, 3)} />
                            <InsightSection title="Primary Nutrients (NPK)" insights={generatedInsights.slice(3, 6)} />
                            <InsightSection title="Secondary Nutrients" insights={generatedInsights.slice(6, 9)} />
                            <InsightSection title="Micronutrients" insights={generatedInsights.slice(9)} />
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-8 mt-6 border-t border-gray-200">
                            <Button size="lg" className="w-full sm:w-auto" onClick={() => {
                                const plan = getFertilizerPlan(generatedInsights);
                                setFertilizerPlan(plan);
                                setStage('recommendations');
                            }}>
                                <ChevronsRight className="mr-2 h-5 w-5" />Get Guidance
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setStage('upload')}>
                                {t.actions.back}
                            </Button>
                            <Button size="lg" variant="ghost" className="w-full sm:w-auto" onClick={() => { setSoilDataLoaded(false); setHasSoilCard(null); setUploadedSoilCard(null); setStage('upload'); setCurrentTab('soil'); }}>
                                Reset Soil Analysis
                            </Button>
                        </CardFooter>
                    </Card>
                )}
                {stage === "recommendations" && (
                    <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-center mb-10"><h1 className="text-3xl font-bold text-gray-800">Fertilizer Guidance</h1><p className="text-lg text-gray-600 mt-2">Recommended products based on your soil report.</p></div>
                        {fertilizerPlan.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fertilizerPlan.map(item => (
                                    <Card key={item.nutrient} className="flex flex-col hover:shadow-lg transition-shadow border-gray-200">
                                        <CardHeader className="flex-row items-center gap-4">
                                            <div className="bg-green-100 p-3 rounded-full">{item.icon}</div>
                                            <div>
                                                <CardTitle>{item.productName}</CardTitle>
                                                <CardDescription>To correct {item.nutrient}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-gray-700">{item.reason}.</p>
                                        </CardContent>
                                        <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                                            <h4 className="w-full font-semibold text-sm mb-1 flex items-center gap-2">
                                                <ShoppingCart className="h-4 w-4 text-primary" /> Buying Links
                                            </h4>
                                            {item.links.map(link => (
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.name} className="w-full">
                                                    <Button variant="outline" className="w-full justify-between">{link.name} <ExternalLink className="h-4 w-4 text-gray-500" /></Button>
                                                </a>
                                            ))}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-green-50 rounded-lg">
                                <h3 className="text-2xl font-semibold text-green-800">Excellent Soil Health!</h3>
                                <p className="text-gray-600 mt-2">No specific nutrient deficiencies were found.</p>
                            </div>
                        )}
                        <div className="text-center mt-10">
                            <Button onClick={() => setStage('soilInsights')} variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
                            </Button>
                        </div>
                    </div>
                )}
                {stage === "combinedGuidance" && structuredGuidance && (
                    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                    <Leaf className="h-6 w-6 text-primary" /> AI-Powered Soil Guidance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-gray-800 space-y-6">
                                <section>
                                    <h3 className="font-semibold text-xl text-gray-900">General Analysis</h3>
                                    <p className="text-base text-gray-700">{structuredGuidance.general_analysis}</p>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-xl text-gray-900">Nutrient Recommendations</h3>
                                    <ul className="list-disc list-inside space-y-2">
                                        {structuredGuidance.nutrient_recommendations.map((rec, index) => (
                                            <li key={index} className="text-base text-gray-700">
                                                <strong>{rec.nutrient} ({rec.level}):</strong> {rec.action}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-xl text-gray-900">Actionable Steps</h3>
                                    <ul className="list-disc list-inside space-y-2">
                                        {structuredGuidance.actionable_steps.map((step, index) => (
                                            <li key={index} className="text-base text-gray-700">
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                                {fertilizerPlan.length > 0 && (
                                    <Button size="lg" className="w-full sm:w-auto" onClick={() => setStage("recommendations")}>
                                        <ChevronsRight className="mr-2 h-5 w-5" /> Get Fertilizer Guidance
                                    </Button>
                                )}
                                <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setStage("upload")}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analysis
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
            <BottomNavigation />
        </div>
    )
}