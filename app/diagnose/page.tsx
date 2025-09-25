"use client";

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
    ChevronsRight,
    Search
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
    level: "Very Low" | "Low" | "Optimal" | "High" | "Very High" | "Acidic" | "Neutral" | "Alkaline" | string;
    color: "red" | "yellow" | "green" | "blue";
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

interface Lab {
    name: string;
    address: string;
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
        manualEntry: "Manual Soil Data Entry",
        severity: { low: "Low Risk", medium: "Medium Risk", high: "High Risk" },
        actions: {
            retake: "Take Another Photo",
            speakResults: "Listen to Results",
            getHelp: "Get Expert Help",
            back: "Back",
            getGuidance: "Get Guidance",
            cancel: "Cancel"
        },
        soilData: {
            ph: "pH Level", nitrogen: "Nitrogen (N)", phosphorus: "Phosphorus (P)", potassium: "Potassium (K)",
            organicCarbon: "Organic Carbon", sulfur: "Sulfur (S)", zinc: "Zinc (Zn)", boron: "Boron (B)",
            iron: "Iron (Fe)", manganese: "Manganese (Mn)", ec: "Conductivity (EC)", calcium: "Calcium (Ca)",
            magnesium: "Magnesium (Mg)", cu: "Copper (Cu)"
        },
        soilReport: {
            reportTitle: "Your Soil Health Report",
            reportSubtitle: "A detailed breakdown of your soil's condition based on the provided data.",
            coreProperties: "Core Properties",
            primaryNutrients: "Primary Nutrients (NPK)",
            secondaryNutrients: "Secondary Nutrients",
            micronutrients: "Micronutrients",
            levels: {
                low: "Low",
                optimal: "Optimal",
                high: "High",
                acidic: "Acidic",
                neutral: "Neutral",
                alkaline: "Alkaline"
            },
            descriptions: {
                ph_acidic: "Acidic soil can lock nutrients. Consider applying lime.",
                ph_alkaline: "Alkaline soil can limit micronutrient uptake. Consider gypsum.",
                ph_neutral: "Excellent pH for nutrient availability.",
                ec_high: "High salinity can cause salt stress to plants.",
                ec_optimal: "Ideal salt level, safe for all crops.",
                oc_low: "A critical area for improvement. Add compost or FYM.",
                oc_optimal: "Excellent organic matter content for soil health.",
                n: "For leafy growth.",
                p: "For root and flower development.",
                k: "For overall vigor and disease resistance.",
                s: "Key for protein synthesis and oilseeds.",
                ca: "Builds strong cell walls.",
                mg: "Central to photosynthesis.",
                fe: "For chlorophyll formation.",
                mn: "Aids in photosynthesis.",
                zn: "For enzyme function.",
                cu: "For reproductive growth.",
                b: "Crucial for fruit and seed setting."
            }
        },
        fertilizerRecs: {
            title: "Fertilizer Guidance",
            subtitle: "Recommended products based on your soil report.",
            reasonTemplate: "Your soil is deficient in {nutrient}, which is crucial for {description}.",
            toCorrect: "To correct {nutrient}",
            buyLinks: "Buying Links",
            noRecsTitle: "Excellent Soil Health!",
            noRecsSubtitle: "No specific nutrient deficiencies were found."
        },
        tips: {
            photoTips: "Photo Tips",
            tip1: "Take photos in good natural light",
            tip2: "Focus on affected areas clearly",
            tip3: "Include healthy parts for comparison",
            tip4: "Avoid shadows and blur"
        },
        labFinder: {
            title: "Find a Soil Testing Lab",
            description: "To get a Soil Health Card, please visit one of the nearest government-approved laboratories.",
            findingLabs: "Finding nearby labs using your location...",
            locationError: "Could not access your location. Please enable location services in your browser settings or enter data manually.",
            noLabsFound: "No government labs found nearby. Please try searching online or enter data manually.",
            enterManuallyButton: "Enter Data Manually Instead"
        }
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
        manualEntry: "मैन्युअल मिट्टी डेटा प्रविष्टि",
        severity: { low: "कम जोखिम", medium: "मध्यम जोखिम", high: "उच्च जोखिम" },
        actions: {
            retake: "दूसरी फोटो लें",
            speakResults: "परिणाम सुनें",
            getHelp: "विशेषज्ञ सहायता लें",
            back: "वापस",
            getGuidance: "सलाह प्राप्त करें",
            cancel: "रद्द करें"
        },
        soilData: {
            ph: "pH स्तर", nitrogen: "नाइट्रोजन (N)", phosphorus: "फास्फोरस (P)", potassium: "पोटेशियम (K)",
            organicCarbon: "जैविक कार्बन", sulfur: "सल्फर (S)", zinc: "जिंक (Zn)", boron: "बोरॉन (B)",
            iron: "आयरन (Fe)", manganese: "मैंगनीज (Mn)", ec: "चालकता (EC)", calcium: "कैल्शियम (Ca)",
            magnesium: "मैग्नीशियम (Mg)", cu: "तांबा (Cu)"
        },
        soilReport: {
            reportTitle: "आपकी मिट्टी स्वास्थ्य रिपोर्ट",
            reportSubtitle: "दिए गए डेटा के आधार पर आपकी मिट्टी की स्थिति का विस्तृत विश्लेषण।",
            coreProperties: "मुख्य गुण",
            primaryNutrients: "प्राथमिक पोषक तत्व (NPK)",
            secondaryNutrients: "द्वितीयक पोषक तत्व",
            micronutrients: "सूक्ष्म पोषक तत्व",
            levels: {
                low: "कम",
                optimal: "इष्टतम",
                high: "उच्च",
                acidic: "अम्लीय",
                neutral: "तटस्थ",
                alkaline: "क्षारीय"
            },
            descriptions: {
                ph_acidic: "अम्लीय मिट्टी पोषक तत्वों को रोक सकती है। चूना डालने पर विचार करें।",
                ph_alkaline: "क्षारीय मिट्टी सूक्ष्म पोषक तत्वों के अवशोषण को सीमित कर सकती है। जिप्सम पर विचार करें।",
                ph_neutral: "पोषक तत्वों की उपलब्धता के लिए उत्कृष्ट पीएच।",
                ec_high: "उच्च लवणता पौधों पर नमक का तनाव पैदा कर सकती है।",
                ec_optimal: "आदर्श नमक स्तर, सभी फसलों के लिए सुरक्षित।",
                oc_low: "सुधार के लिए एक महत्वपूर्ण क्षेत्र। खाद या FYM डालें।",
                oc_optimal: "मिट्टी के स्वास्थ्य के लिए उत्कृष्ट जैविक पदार्थ।",
                n: "पत्तेदार विकास के लिए।",
                p: "जड़ और फूल के विकास के लिए।",
                k: "समग्र शक्ति और रोग प्रतिरोध के लिए।",
                s: "प्रोटीन संश्लेषण और तिलहन के लिए महत्वपूर्ण।",
                ca: "मजबूत कोशिका दीवारों का निर्माण करता है।",
                mg: "प्रकाश संश्लेषण के लिए केंद्रीय।",
                fe: "क्लोरोफिल निर्माण के लिए।",
                mn: "प्रकाश संश्लेषण में सहायक।",
                zn: "एंजाइम फ़ंक्शन के लिए।",
                cu: "प्रजनन वृद्धि के लिए।",
                b: "फल और बीज सेटिंग के लिए महत्वपूर्ण।"
            }
        },
        fertilizerRecs: {
            title: "उर्वरक मार्गदर्शन",
            subtitle: "आपकी मिट्टी की रिपोर्ट के आधार पर अनुशंसित उत्पाद।",
            reasonTemplate: "आपकी मिट्टी में {nutrient} की कमी है, जो {description} के लिए महत्वपूर्ण है।",
            toCorrect: "{nutrient} को ठीक करने के लिए",
            buyLinks: "खरीदने के लिंक",
            noRecsTitle: "उत्कृष्ट मिट्टी स्वास्थ्य!",
            noRecsSubtitle: "कोई विशेष पोषक तत्व की कमी नहीं पाई गई।"
        },
        tips: {
            photoTips: "फोटो टिप्स",
            tip1: "अच्छी प्राकृतिक रोशनी में फोटो लें",
            tip2: "प्रभावित क्षेत्रों पर स्पष्ट रूप से ध्यान दें",
            tip3: "तुलना के लिए स्वस्थ भागों को शामिल करें",
            tip4: "छाया और धुंधलेपन से बचें"
        },
        labFinder: {
            title: "मिट्टी परीक्षण प्रयोगशाला खोजें",
            description: "मिट्टी स्वास्थ्य कार्ड प्राप्त करने के लिए, कृपया निकटतम सरकारी-अनुमोदित प्रयोगशालाओं में से किसी एक पर जाएँ।",
            findingLabs: "आपके स्थान का उपयोग करके आस-पास की प्रयोगशालाएं खोजी जा रही हैं...",
            locationError: "आपका स्थान एक्सेस नहीं हो सका। कृपया अपनी ब्राउज़र सेटिंग्स में स्थान सेवाएं सक्षम करें या मैन्युअल रूप से डेटा दर्ज करें।",
            noLabsFound: "आस-पास कोई सरकारी प्रयोगशाला नहीं मिली। कृपया ऑनलाइन खोजने का प्रयास करें या मैन्युअल रूप से डेटा दर्ज करें।",
            enterManuallyButton: "इसके बजाय मैन्युअल रूप से डेटा दर्ज करें"
        }
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
        manualEntry: "मॅन्युअल माती डेटा एंट्री",
        severity: { low: "कमी धोका", medium: "मध्यम धोका", high: "उच्च धोका" },
        actions: {
            retake: "दुसरा फोटो घ्या",
            speakResults: "निकाल ऐका",
            getHelp: "तज्ञांची मदत घ्या",
            back: "मागे",
            getGuidance: "मार्गदर्शन मिळवा",
            cancel: "रद्द करा"
        },
        soilData: {
            ph: "pH पातळी", nitrogen: "नायट्रोजन (N)", phosphorus: "फॉस्फरस (P)", potassium: "पोटॅशियम (K)",
            organicCarbon: "सेंद्रिय कर्ब", sulfur: "गंधक (S)", zinc: "जस्त (Zn)", boron: "बोरॉन (B)",
            iron: "लोह (Fe)", manganese: "मॅंगनीज (Mn)", ec: "विद्युत चालकता (EC)", calcium: "कॅल्शियम (Ca)",
            magnesium: "मॅग्नेशियम (Mg)", cu: "तांबे (Cu)"
        },
        soilReport: {
            reportTitle: "तुमचा मृदा आरोग्य अहवाल",
            reportSubtitle: "प्रदान केलेल्या डेटावर आधारित तुमच्या मातीच्या स्थितीचे तपशीलवार विश्लेषण.",
            coreProperties: "मुख्य गुणधर्म",
            primaryNutrients: "प्राथमिक पोषक तत्वे (NPK)",
            secondaryNutrients: "दुय्यम पोषक तत्वे",
            micronutrients: "सूक्ष्म पोषक तत्वे",
            levels: {
                low: "कमी",
                optimal: "उत्तम",
                high: "जास्त",
                acidic: "आम्लयुक्त",
                neutral: "उदासीन",
                alkaline: "अल्कधर्मी"
            },
            descriptions: {
                ph_acidic: "आम्लयुक्त माती पोषक तत्वे रोखू शकते. चुना वापरण्याचा विचार करा.",
                ph_alkaline: "अल्कधर्मी माती सूक्ष्म पोषक तत्वांचे शोषण मर्यादित करू शकते. जिप्समचा विचार करा.",
                ph_neutral: "पोषक तत्वांच्या उपलब्धतेसाठी उत्कृष्ट पीएच.",
                ec_high: "जास्त क्षारता वनस्पतींवर क्षारांचा ताण निर्माण करू शकते.",
                ec_optimal: "आदर्श क्षार पातळी, सर्व पिकांसाठी सुरक्षित.",
                oc_low: "सुधारणेसाठी एक महत्त्वाचे क्षेत्र. कंपोस्ट किंवा FYM टाका.",
                oc_optimal: "मातीच्या आरोग्यासाठी उत्कृष्ट सेंद्रिय पदार्थ.",
                n: "पानांच्या वाढीसाठी.",
                p: "मूळ आणि फुलांच्या विकासासाठी.",
                k: "एकूण जोम आणि रोग प्रतिकारशक्तीसाठी.",
                s: "प्रोटीन संश्लेषण आणि तेलबियांसाठी महत्त्वाचे.",
                ca: "मजबूत पेशींच्या भिंती तयार करते.",
                mg: "प्रकाशसंश्लेषणासाठी केंद्रीय.",
                fe: "हरितद्रव्य निर्मितीसाठी.",
                mn: "प्रकाशसंश्लेषणात मदत करते.",
                zn: "एंजाइम कार्यासाठी.",
                cu: "प्रजनन वाढीसाठी.",
                b: "फळे आणि बियांच्या सेटिंगसाठी महत्त्वपूर्ण."
            }
        },
        fertilizerRecs: {
            title: "खत मार्गदर्शन",
            subtitle: "तुमच्या मातीच्या अहवालानुसार शिफारस केलेली उत्पादने.",
            reasonTemplate: "तुमच्या मातीत {nutrient} ची कमतरता आहे, जे {description} साठी महत्त्वाचे आहे.",
            toCorrect: "{nutrient} दुरुस्त करण्यासाठी",
            buyLinks: "खरेदी लिंक",
            noRecsTitle: "उत्कृष्ट मातीचे आरोग्य!",
            noRecsSubtitle: "कोणत्याही विशिष्ट पोषक तत्वांची कमतरता आढळली नाही."
        },
        tips: {
            photoTips: "फोटो टिप्स",
            tip1: "चांगल्या नैसर्गिक प्रकाशात फोटो घ्या",
            tip2: "प्रभावित भागांवर स्पष्टपणे लक्ष केंद्रित करा",
            tip3: "तुलनेसाठी निरोगी भाग समाविष्ट करा",
            tip4: "सावली आणि अस्पष्टता टाळा"
        },
        labFinder: {
            title: "माती परीक्षण प्रयोगशाळा शोधा",
            description: "मृदा आरोग्य पत्रिका मिळवण्यासाठी, कृपया जवळच्या सरकारी-मान्यताप्राप्त प्रयोगशाळांपैकी एकाला भेट द्या.",
            findingLabs: "तुमचे स्थान वापरून जवळच्या प्रयोगशाळा शोधत आहे...",
            locationError: "तुमचे स्थान मिळवू शकलो नाही. कृपया तुमच्या ब्राउझर सेटिंग्जमध्ये स्थान सेवा सक्षम करा किंवा व्यक्तिचलितपणे डेटा प्रविष्ट करा.",
            noLabsFound: "जवळपास कोणतीही सरकारी प्रयोगशाळा आढळली नाही. कृपया ऑनलाइन शोधण्याचा प्रयत्न करा किंवा व्यक्तिचलितपणे डेटा प्रविष्ट करा.",
            enterManuallyButton: "त्याऐवजी व्यक्तिचलितपणे डेटा प्रविष्ट करा"
        }
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
        manualEntry: "ਮੈਨੂਅਲ ਮਿੱਟੀ ਡਾਟਾ ਐਂਟਰੀ",
        severity: { low: "ਘੱਟ ਖਤਰਾ", medium: "ਦਰਮਿਆਨਾ ਖਤਰਾ", high: "ਉੱਚ ਖਤਰਾ" },
        actions: {
            retake: "ਇਕ ਹੋਰ ਫੋਟੋ ਲਓ",
            speakResults: "ਨਤੀਜੇ ਸੁਣੋ",
            getHelp: "ਮਾਹਰ ਦੀ ਮਦਦ ਲਓ",
            back: "ਪਿੱਛੇ",
            getGuidance: "ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ",
            cancel: "ਰੱਦ ਕਰੋ"
        },
        soilData: {
            ph: "pH ਪੱਧਰ", nitrogen: "ਨਾਈਟ੍ਰੋਜਨ (N)", phosphorus: "ਫਾਸਫੋਰਸ (P)", potassium: "ਪੋਟਾਸ਼ੀਅਮ (K)",
            organicCarbon: "ਜੈਵਿਕ ਕਾਰਬਨ", sulfur: "ਸਲਫਰ (S)", zinc: "ਜ਼ਿੰਕ (Zn)", boron: "ਬੋਰੋਨ (B)",
            iron: "ਆਇਰਨ (Fe)", manganese: "ਮੈਂਗਨੀਜ਼ (Mn)", ec: "ਚਾਲਕਤਾ (EC)", calcium: "ਕੈਲਸ਼ੀਅਮ (Ca)",
            magnesium: "ਮੈਗਨੀਸ਼ੀਅਮ (Mg)", cu: "ਤਾਂਬਾ (Cu)"
        },
        soilReport: {
            reportTitle: "ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਰਿਪੋਰਟ",
            reportSubtitle: "ਦਿੱਤੇ ਗਏ ਡੇਟਾ ਦੇ ਆਧਾਰ 'ਤੇ ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਸਥਿਤੀ ਦਾ ਵਿਸਤ੍ਰਿਤ ਵਿਸ਼ਲੇਸ਼ਣ।",
            coreProperties: "ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
            primaryNutrients: "ਪ੍ਰਾਇਮਰੀ ਪੋਸ਼ਕ ਤੱਤ (NPK)",
            secondaryNutrients: "ਸੈਕੰਡਰੀ ਪੋਸ਼ਕ ਤੱਤ",
            micronutrients: "ਸੂਖਮ ਪੋਸ਼ਕ ਤੱਤ",
            levels: {
                low: "ਘੱਟ",
                optimal: "ਅਨੁਕੂਲ",
                high: "ਉੱਚ",
                acidic: "ਤੇਜ਼ਾਬੀ",
                neutral: "ਨਿਰਪੱਖ",
                alkaline: "ਖਾਰੀ"
            },
            descriptions: {
                ph_acidic: "ਤੇਜ਼ਾਬੀ ਮਿੱਟੀ ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਨੂੰ ਬੰਦ ਕਰ ਸਕਦੀ ਹੈ। ਚੂਨਾ ਲਗਾਉਣ 'ਤੇ ਵਿਚਾਰ ਕਰੋ।",
                ph_alkaline: "ਖਾਰੀ ਮਿੱਟੀ ਸੂਖਮ ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਦੇ ਗ੍ਰਹਿਣ ਨੂੰ ਸੀਮਤ ਕਰ ਸਕਦੀ ਹੈ। ਜਿਪਸਮ 'ਤੇ ਵਿਚਾਰ ਕਰੋ।",
                ph_neutral: "ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਦੀ ਉਪਲਬਧਤਾ ਲਈ ਸ਼ਾਨਦਾਰ pH।",
                ec_high: "ਉੱਚੀ ਲੂਣਤਾ ਪੌਦਿਆਂ ਨੂੰ ਲੂਣ ਦਾ ਤਣਾਅ ਪੈਦਾ ਕਰ ਸਕਦੀ ਹੈ।",
                ec_optimal: "ਆਦਰਸ਼ ਲੂਣ ਪੱਧਰ, ਸਾਰੀਆਂ ਫਸਲਾਂ ਲਈ ਸੁਰੱਖਿਅਤ।",
                oc_low: "ਸੁਧਾਰ ਲਈ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਖੇਤਰ। ਖਾਦ ਜਾਂ FYM ਸ਼ਾਮਲ ਕਰੋ।",
                oc_optimal: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਲਈ ਸ਼ਾਨਦਾਰ ਜੈਵਿਕ ਪਦਾਰਥ।",
                n: "ਪੱਤੇਦਾਰ ਵਿਕਾਸ ਲਈ।",
                p: "ਜੜ੍ਹ ਅਤੇ ਫੁੱਲ ਦੇ ਵਿਕਾਸ ਲਈ।",
                k: "ਸਮੁੱਚੀ ਤਾਕਤ ਅਤੇ ਰੋਗ ਪ੍ਰਤੀਰੋਧ ਲਈ।",
                s: "ਪ੍ਰੋਟੀਨ ਸੰਸਲੇਸ਼ਣ ਅਤੇ ਤੇਲ ਬੀਜਾਂ ਲਈ ਕੁੰਜੀ।",
                ca: "ਮਜ਼ਬੂਤ ਸੈੱਲ ਦੀਵਾਰਾਂ ਬਣਾਉਂਦਾ ਹੈ।",
                mg: "ਪ੍ਰਕਾਸ਼ ਸੰਸ਼ਲੇਸ਼ਣ ਲਈ ਕੇਂਦਰੀ।",
                fe: "ਕਲੋਰੋਫਿਲ ਦੇ ਗਠਨ ਲਈ।",
                mn: "ਪ੍ਰਕਾਸ਼ ਸੰਸ਼ਲੇਸ਼ਣ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰਦਾ ਹੈ।",
                zn: "ਐਨਜ਼ਾਈਮ ਫੰਕਸ਼ਨ ਲਈ।",
                cu: "ਪ੍ਰਜਨਨ ਵਿਕਾਸ ਲਈ।",
                b: "ਫਲ ਅਤੇ ਬੀਜ ਸੈਟਿੰਗ ਲਈ ਮਹੱਤਵਪੂਰਨ।"
            }
        },
        fertilizerRecs: {
            title: "ਖਾਦ ਮਾਰਗਦਰਸ਼ਨ",
            subtitle: "ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਰਿਪੋਰਟ ਦੇ ਆਧਾਰ 'ਤੇ ਸਿਫਾਰਸ਼ ਕੀਤੇ ਉਤਪਾਦ।",
            reasonTemplate: "ਤੁਹਾਡੀ ਮਿੱਟੀ ਵਿੱਚ {nutrient} ਦੀ ਕਮੀ ਹੈ, ਜੋ {description} ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
            toCorrect: "{nutrient} ਨੂੰ ਠੀਕ ਕਰਨ ਲਈ",
            buyLinks: "ਖਰੀਦਣ ਦੇ ਲਿੰਕ",
            noRecsTitle: "ਸ਼ਾਨਦਾਰ ਮਿੱਟੀ ਦੀ ਸਿਹਤ!",
            noRecsSubtitle: "ਕੋਈ ਖਾਸ ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਦੀ ਕਮੀ ਨਹੀਂ ਮਿਲੀ।"
        },
        tips: {
            photoTips: "ਫੋਟੋ ਸੁਝਾਅ",
            tip1: "ਚੰਗੀ ਕੁਦਰਤੀ ਰੌਸ਼ਨੀ ਵਿੱਚ ਫੋਟੋਆਂ ਲਓ",
            tip2: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰਾਂ 'ਤੇ ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਧਿਆਨ ਕੇਂਦਰਤ ਕਰੋ",
            tip3: "ਤੁਲਨਾ ਲਈ ਸਿਹਤਮੰਦ ਹਿੱਸੇ ਸ਼ਾਮਲ ਕਰੋ",
            tip4: "ਪਰਛਾਵੇਂ ਅਤੇ ਧੁੰਦਲੇਪਣ ਤੋਂ ਬਚੋ"
        },
        labFinder: {
            title: "ਮਿੱਟੀ ਪਰਖ ਪ੍ਰਯੋਗਸ਼ਾਲਾ ਲੱਭੋ",
            description: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਨਜ਼ਦੀਕੀ ਸਰਕਾਰੀ-ਪ੍ਰਵਾਨਿਤ ਪ੍ਰਯੋਗਸ਼ਾਲਾਵਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ 'ਤੇ ਜਾਓ।",
            findingLabs: "ਤੁਹਾਡੇ ਸਥਾਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਨੇੜਲੀਆਂ ਪ੍ਰਯੋਗਸ਼ਾਲਾਵਾਂ ਲੱਭ ਰਿਹਾ ਹੈ...",
            locationError: "ਤੁਹਾਡਾ ਸਥਾਨ ਐਕਸੈਸ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਸਥਾਨ ਸੇਵਾਵਾਂ ਨੂੰ ਸਮਰੱਥ ਕਰੋ ਜਾਂ ਹੱਥੀਂ ਡਾਟਾ ਦਾਖਲ ਕਰੋ।",
            noLabsFound: "ਨੇੜੇ ਕੋਈ ਸਰਕਾਰੀ ਪ੍ਰਯੋਗਸ਼ਾਲਾ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਔਨਲਾਈਨ ਖੋਜਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਹੱਥੀਂ ਡਾਟਾ ਦਾਖਲ ਕਰੋ।",
            enterManuallyButton: "ਇਸਦੀ ਬਜਾਏ ਹੱਥੀਂ ਡਾਟਾ ਦਾਖਲ ਕਰੋ"
        }
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
        manualEntry: "ಕೈಪಿಡಿ ಮಣ್ಣಿನ ಡೇಟಾ ನಮೂದು",
        severity: { low: "ಕಡಿಮೆ ಅಪಾಯ", medium: "ಮಧ್ಯಮ ಅಪಾಯ", high: "ಹೆಚ್ಚಿನ ಅಪಾಯ" },
        actions: {
            retake: "ಮತ್ತೊಂದು ಫೋಟೋ ತೆಗೆ",
            speakResults: "ಫಲಿತಾಂಶಗಳನ್ನು ಆಲಿಸಿ",
            getHelp: "ತಜ್ಞರ ಸಹಾಯ ಪಡೆಯಿರಿ",
            back: "ಹಿಂದೆ",
            getGuidance: "ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ",
            cancel: "ರದ್ದುಮಾಡು"
        },
        soilData: {
            ph: "pH ಮಟ್ಟ", nitrogen: "ಸಾರಜನಕ (N)", phosphorus: "ರಂಜಕ (P)", potassium: "ಪೊಟ್ಯಾಸಿಯಮ್ (K)",
            organicCarbon: "ಸಾವಯವ ಇಂಗಾಲ", sulfur: "ಗಂಧಕ (S)", zinc: "ಸತು (Zn)", boron: "ಬೋರಾನ್ (B)",
            iron: "ಕಬ್ಬಿಣ (Fe)", manganese: "ಮ್ಯಾಂಗನೀಸ್ (Mn)", ec: "ವಾಹಕತೆ (EC)", calcium: "ಕ್ಯಾಲ್ಸಿಯಂ (Ca)",
            magnesium: "ಮೆಗ್ನೀಸಿಯಮ್ (Mg)", cu: "ತಾಮ್ರ (Cu)"
        },
        soilReport: {
            reportTitle: "ನಿಮ್ಮ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವರದಿ",
            reportSubtitle: "ಒದಗಿಸಿದ ಡೇಟಾದ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಮಣ್ಣಿನ ಸ್ಥಿತಿಯ ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ.",
            coreProperties: "ಪ್ರಮುಖ ಗುಣಲಕ್ಷಣಗಳು",
            primaryNutrients: "ಪ್ರಾಥಮಿಕ ಪೋಷಕಾಂಶಗಳು (NPK)",
            secondaryNutrients: "ದ್ವಿತೀಯ ಪೋಷಕಾಂಶಗಳು",
            micronutrients: "ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು",
            levels: {
                low: "ಕಡಿಮೆ",
                optimal: "ಸೂಕ್ತ",
                high: "ಹೆಚ್ಚು",
                acidic: "ಆಮ್ಲೀಯ",
                neutral: "ತಟಸ್ಥ",
                alkaline: "ಕ್ಷಾರೀಯ"
            },
            descriptions: {
                ph_acidic: "ಆಮ್ಲೀಯ ಮಣ್ಣು ಪೋಷಕಾಂಶಗಳನ್ನು ಲಾಕ್ ಮಾಡಬಹುದು. ಸುಣ್ಣವನ್ನು ಅನ್ವಯಿಸುವುದನ್ನು ಪರಿಗಣಿಸಿ.",
                ph_alkaline: "ಕ್ಷಾರೀಯ ಮಣ್ಣು ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳ ಹೀರಿಕೊಳ್ಳುವಿಕೆಯನ್ನು ಸೀಮಿತಗೊಳಿಸಬಹುದು. ಜಿಪ್ಸಮ್ ಅನ್ನು ಪರಿಗಣಿಸಿ.",
                ph_neutral: "ಪೋಷಕಾಂಶಗಳ ಲಭ್ಯತೆಗೆ ಅತ್ಯುತ್ತಮ pH.",
                ec_high: "ಹೆಚ್ಚಿನ ಲವಣಾಂಶವು ಸಸ್ಯಗಳಿಗೆ ಉಪ್ಪಿನ ಒತ್ತಡವನ್ನು ಉಂಟುಮಾಡಬಹುದು.",
                ec_optimal: "ಆದರ್ಶ ಉಪ್ಪಿನ ಮಟ್ಟ, ಎಲ್ಲಾ ಬೆಳೆಗಳಿಗೆ ಸುರಕ್ಷಿತ.",
                oc_low: "ಸುಧಾರಣೆಗೆ ಒಂದು ನಿರ್ಣಾಯಕ ಪ್ರದೇಶ. ಕಾಂಪೋಸ್ಟ್ ಅಥವಾ FYM ಸೇರಿಸಿ.",
                oc_optimal: "ಮಣ್ಣಿನ ಆರೋಗ್ಯಕ್ಕೆ ಅತ್ಯುತ್ತਮ సేంద్రియ పదార్థం.",
                n: "ಎಲೆಗಳ ಬೆಳವಣಿಗೆಗೆ.",
                p: "ಬೇರು ಮತ್ತು ಹೂವಿನ ಅಭಿವೃದ್ಧಿಗೆ.",
                k: "ಒಟ್ಟಾರೆ ಚೈತನ್ಯ ಮತ್ತು ರೋಗ ನಿರೋಧಕತೆಗಾಗಿ.",
                s: "ಪ್ರೋಟೀನ್ ಸಂಶ್ಲೇಷಣೆ ಮತ್ತು ಎಣ್ಣೆಬೀಜಗಳಿಗೆ ಪ್ರಮುಖ.",
                ca: "ಬಲವಾದ ಕೋಶ ಗೋಡೆಗಳನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ.",
                mg: "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಗೆ ಕೇಂದ್ರ.",
                fe: "ಕ್ಲೋರೊಫಿಲ್ ರಚನೆಗೆ.",
                mn: "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
                zn: "ಕಿಣ್ವ ಕಾರ್ಯಕ್ಕಾಗಿ.",
                cu: "ಸಂತಾನೋತ್ಪತ್ತಿ ಬೆಳವಣಿಗೆಗೆ.",
                b: "ಹಣ್ಣು ಮತ್ತು ಬೀಜಗಳ ಸೆಟ್ಟಿಂಗ್‌ಗೆ ನಿರ್ಣಾಯಕ."
            }
        },
        fertilizerRecs: {
            title: "ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶನ",
            subtitle: "ನಿಮ್ಮ ಮಣ್ಣಿನ ವರದಿಯ ಆಧಾರದ ಮೇಲೆ ಶಿಫಾರಸು ಮಾಡಲಾದ ಉತ್ಪನ್ನಗಳು.",
            reasonTemplate: "ನಿಮ್ಮ ಮಣ್ಣಿನಲ್ಲಿ {nutrient} ಕೊರತೆಯಿದೆ, ಇದು {description} ಗೆ ನಿರ್ಣಾಯಕವಾಗಿದೆ.",
            toCorrect: "{nutrient} ಸರಿಪಡಿಸಲು",
            buyLinks: "ಖರೀದಿ ಲಿಂಕ್‌ಗಳು",
            noRecsTitle: "ಅತ್ಯುತ್ತಮ ಮಣ್ಣಿನ ಆರೋಗ್ಯ!",
            noRecsSubtitle: "ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಕಂಡುಬಂದಿಲ್ಲ."
        },
        tips: {
            photoTips: "ಫೋಟೋ ಸಲಹೆಗಳು",
            tip1: "ಉತ್ತಮ ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಿರಿ",
            tip2: "ಬಾಧಿತ ಪ್ರದೇಶಗಳ ಮೇಲೆ ಸ್ಪಷ್ಟವಾಗಿ ಗಮನಹರಿಸಿ",
            tip3: "ಹೋಲಿಕೆಗಾಗಿ ಆರೋಗ್ಯಕರ ಭಾಗಗಳನ್ನು ಸೇರಿಸಿ",
            tip4: "ನೆರಳುಗಳು ಮತ್ತು ಮಸುಕುತನವನ್ನು ತಪ್ಪಿಸಿ"
        },
        labFinder: {
            title: "ಮಣ್ಣು ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯವನ್ನು ಹುಡುಕಿ",
            description: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯಲು, ದಯವಿಟ್ಟು ಹತ್ತಿರದ ಸರ್ಕಾರಿ-ಅನುಮೋದಿತ ಪ್ರಯೋಗಾಲಯಗಳಲ್ಲಿ ಒಂದಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.",
            findingLabs: "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಬಳಸಿಕೊಂಡು ಹತ್ತಿರದ ಪ್ರಯೋಗಾಲಯಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
            locationError: "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪ್ರವೇಶಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ। ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ ಅಥವಾ ಡೇಟಾವನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ.",
            noLabsFound: "ಹತ್ತಿರದಲ್ಲಿ ಯಾವುದೇ ಸರ್ಕಾರಿ ಪ್ರಯೋಗಾಲಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ। ದಯವಿಟ್ಟು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಹುಡುಕಲು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಡೇಟಾವನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ.",
            enterManuallyButton: "ಬದಲಿಗೆ ಡೇಟಾವನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ"
        }
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
        manualEntry: "கையேடு மண் தரவு நுழைவு",
        severity: { low: "குறைந்த ஆபத்து", medium: "நடுத்தர ஆபத்து", high: "அதிக ஆபத்து" },
        actions: {
            retake: "மற்றொரு புகைப்படம் எடு",
            speakResults: "முடிவுகளைக் கேளுங்கள்",
            getHelp: "நிபுணர் உதவியைப் பெறுங்கள்",
            back: "பின்",
            getGuidance: "வழிகாட்டுதலைப் பெறுங்கள்",
            cancel: "ரத்துசெய்"
        },
        soilData: {
            ph: "pH நிலை", nitrogen: "நைட்ரஜன் (N)", phosphorus: "பாஸ்பரஸ் (P)", potassium: "பொட்டாசியம் (K)",
            organicCarbon: "கரிம கார்பன்", sulfur: "கந்தகம் (S)", zinc: "துத்தநாகம் (Zn)", boron: "போரான் (B)",
            iron: "இரும்பு (Fe)", manganese: "மாங்கனீசு (Mn)", ec: "கடத்துத்திறன் (EC)", calcium: "கால்சியம் (Ca)",
            magnesium: "மெக்னீசியம் (Mg)", cu: "தாமிரம் (Cu)"
        },
        soilReport: {
            reportTitle: "உங்கள் மண் சுகாதார அறிக்கை",
            reportSubtitle: "வழங்கப்பட்ட தரவுகளின் அடிப்படையில் உங்கள் மண்ணின் நிலையின் விரிவான முறிவு.",
            coreProperties: "முக்கிய பண்புகள்",
            primaryNutrients: "முதன்மை ஊட்டச்சத்துக்கள் (NPK)",
            secondaryNutrients: "இரண்டாம் நிலை ஊட்டச்சத்துக்கள்",
            micronutrients: "நுண்ணூட்டச்சத்துக்கள்",
            levels: {
                low: "குறைந்த",
                optimal: "உகந்த",
                high: "அதிக",
                acidic: "அமில",
                neutral: "நடுநிலை",
                alkaline: "கார"
            },
            descriptions: {
                ph_acidic: "அமில மண் ஊட்டச்சத்துக்களைப் பூட்டக்கூடும். சுண்ணாம்பு இடவும்.",
                ph_alkaline: "கார மண் நுண்ணூட்டச்சத்துக்களைக் கட்டுப்படுத்தலாம். ஜிப்சம் இடவும்.",
                ph_neutral: "ஊட்டச்சத்து கிடைப்பதற்கு சிறந்த pH.",
                ec_high: "அதிக உப்புத்தன்மை தாவரங்களுக்கு உப்பு அழுத்தத்தை ஏற்படுத்தும்.",
                ec_optimal: "சிறந்த உப்பு நிலை, அனைத்து பயிர்களுக்கும் பாதுகாப்பானது.",
                oc_low: "மேம்பாட்டிற்கான ஒரு முக்கியமான பகுதி. உரம் அல்லது FYM சேர்க்கவும்.",
                oc_optimal: "மண் ஆரோக்கியத்திற்கான சிறந்த கரிமப் பொருள் உள்ளடக்கம்.",
                n: "இலை வளர்ச்சிக்கு.",
                p: "வேர் மற்றும் மலர் வளர்ச்சிக்கு.",
                k: "ஒட்டுமொத்த வீரியம் மற்றும் நோய் எதிர்ப்புக்காக.",
                s: "புரத தொகுப்பு மற்றும் எண்ணெய் வித்துக்களுக்கு முக்கியம்.",
                ca: "வலுவான செல் சுவர்களை உருவாக்குகிறது.",
                mg: "ஒளிச்சேர்க்கைக்கு மையமானது.",
                fe: "குளோரோபில் உருவாவதற்கு.",
                mn: "ஒளிச்சேர்க்கைக்கு உதவுகிறது.",
                zn: "நொதி செயல்பாட்டிற்கு.",
                cu: "இனப்பெருக்க வளர்ச்சிக்கு.",
                b: "பழம் மற்றும் விதை அமைப்பிற்கு முக்கியமானது."
            }
        },
        fertilizerRecs: {
            title: "உர வழிகாட்டுதல்",
            subtitle: "உங்கள் மண் அறிக்கையின் அடிப்படையில் பரிந்துரைக்கப்பட்ட தயாரிப்புகள்.",
            reasonTemplate: "உங்கள் மண்ணில் {nutrient} குறைவாக உள்ளது, இது {description} க்கு முக்கியமானது.",
            toCorrect: "{nutrient} ஐ சரிசெய்ய",
            buyLinks: "வாங்கும் இணைப்புகள்",
            noRecsTitle: "சிறந்த மண் ஆரோக்கியம்!",
            noRecsSubtitle: "குறிப்பிட்ட ஊட்டச்சத்து குறைபாடுகள் எதுவும் கண்டறியப்படவில்லை."
        },
        tips: {
            photoTips: "புகைப்பட குறிப்புகள்",
            tip1: "நல்ல இயற்கை ஒளியில் புகைப்படங்களை எடுக்கவும்",
            tip2: "பாதிக்கப்பட்ட பகுதிகளில் தெளிவாக கவனம் செலுத்துங்கள்",
            tip3: "ஒப்பீட்டிற்காக ஆரோக்கியமான பாகங்களைச் சேர்க்கவும்",
            tip4: "நிழல்கள் மற்றும் மங்கலாக்குவதைத் தவிர்க்கவும்"
        },
        labFinder: {
            title: "மண் பரிசோதனை ஆய்வகத்தைக் கண்டறியவும்",
            description: "மண் சுகாதார அட்டையைப் பெற, அருகிலுள்ள அரசாங்கத்தால் அங்கீகரிக்கப்பட்ட ஆய்வகங்களில் ஒன்றைப் பார்வையிடவும்.",
            findingLabs: "உங்கள் இருப்பிடத்தைப் பயன்படுத்தி அருகிலுள்ள ஆய்வகங்களைக் கண்டறிகிறது...",
            locationError: "உங்கள் இருப்பிடத்தை அணுக முடியவில்லை. உங்கள் உலாவி அமைப்புகளில் இருப்பிடச் சேவைகளை இயக்கவும் அல்லது தரவை கைமுறையாக உள்ளிடவும்.",
            noLabsFound: "அருகில் அரசு ஆய்வகங்கள் எதுவும் இல்லை. ஆன்லைனில் தேட முயற்சிக்கவும் அல்லது தரவை கைமுறையாக உள்ளிடவும்.",
            enterManuallyButton: "அதற்கு பதிலாக தரவை கைமுறையாக உள்ளிடவும்"
        }
    },
};

type DiagnosisStage = "upload" | "analyzing" | "results" | "soilInsights" | "recommendations" | "combinedGuidance";

export default function CropDiagnosis() {
    const { currentLang } = useLanguage()
    const { addAdvisory, setLatestSoilReport } = useAdvisory()
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

    // New states for lab finder
    const [showLabFinder, setShowLabFinder] = useState(false);
    const [nearbyLabs, setNearbyLabs] = useState<Lab[]>([]);
    const [isFindingLabs, setIsFindingLabs] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

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

	const handleFindLabs = () => {
        setIsFindingLabs(true);
        setLocationError(null);
        setHasSoilCard(false); // Move to the next screen
        setShowLabFinder(true); // Show the lab finder UI

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // SIMULATE API CALL to find labs based on lat/lon
                // In a real app, you would fetch this from a backend service or Google Maps API
                console.log(`Searching for labs near ${latitude}, ${longitude}`);
                setTimeout(() => {
                    setNearbyLabs([
                        { name: "District Soil Testing Laboratory, Krishibhavan", address: "Shivajinagar, Pune-411005" },
                        { name: "Agricultural College Soil Lab", address: "College Of Agriculture, Pune" },
                        { name: "KVK Narayangaon Soil Testing", address: "Narayangaon, Pune District" }
                    ]);
                    setIsFindingLabs(false);
                }, 2000);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError(t.labFinder.locationError);
                setIsFindingLabs(false);
            }
        );
    };

    const getInsightsFromData = (data: SoilReportData): Insight[] => {
        const insights: Insight[] = [];
        const levels = t.soilReport.levels;
        const descriptions = t.soilReport.descriptions;

        const addInsight = (title: string, value: number, unit: string, idealRange: [number, number], icon: ReactNode, customLogic?: (val: number) => Partial<Insight>) => {
            let level: Insight["level"] = levels.optimal, color: Insight["color"] = "green";
            if (value < idealRange[0]) { level = levels.low; color = "yellow"; }
            if (value > idealRange[1]) { level = levels.high; color = "blue"; }
            let custom = customLogic ? customLogic(value) : {};
            insights.push({ title, value: `${(value || 0).toFixed(2)} ${unit}`, level, color, description: "", icon, ...custom });
        };
        addInsight(t.soilData.ph, data.ph, "", [6.25, 7.5], <Thermometer className="h-6 w-6 text-blue-500" />, (val) => ({ level: val < 6.25 ? levels.acidic : val > 7.5 ? levels.alkaline : levels.neutral, color: val < 6.25 ? "yellow" : val > 7.5 ? "blue" : "green", description: val < 6.25 ? descriptions.ph_acidic : val > 7.5 ? descriptions.ph_alkaline : descriptions.ph_neutral }));
        addInsight(t.soilData.ec, data.ec, "mS/cm", [0, 1.0], <Droplets className="h-6 w-6 text-sky-500" />, (val) => ({ level: val > 1.0 ? levels.high : levels.optimal, color: val > 1.0 ? "red" : "green", description: val > 1.0 ? descriptions.ec_high : descriptions.ec_optimal }));
        addInsight(t.soilData.organicCarbon, data.oc, "%", [0.75, Infinity], <FlaskConical className="h-6 w-6 text-amber-600" />, (val) => ({ level: val < 0.75 ? levels.low : levels.optimal, color: val < 0.75 ? "red" : "green", description: val < 0.75 ? descriptions.oc_low : descriptions.oc_optimal }));
        addInsight(t.soilData.nitrogen, data.n, "kg/ha", [281, 410], <Leaf className="h-6 w-6 text-green-500" />, () => ({ description: descriptions.n }));
        addInsight(t.soilData.phosphorus, data.p, "kg/ha", [13, 22], <Sun className="h-6 w-6 text-orange-500" />, () => ({ description: descriptions.p }));
        addInsight(t.soilData.potassium, data.k, "kg/ha", [181, 240], <Award className="h-6 w-6 text-purple-500" />, () => ({ description: descriptions.k }));
        addInsight(t.soilData.sulfur, data.s, "ppm", [7, 15], <Atom className="h-6 w-6 text-yellow-500" />, () => ({ description: descriptions.s }));
        addInsight(t.soilData.calcium, data.ca, "%", [0.3, 0.8], <Mountain className="h-6 w-6 text-gray-500" />, () => ({ description: descriptions.ca }));
        addInsight(t.soilData.magnesium, data.mg, "%", [0.06, 0.15], <Sprout className="h-6 w-6 text-lime-600" />, () => ({ description: descriptions.mg }));
        addInsight(t.soilData.iron, data.fe, "ppm", [2.5, 4.5], <Microscope className="h-6 w-6 text-red-800" />, () => ({ description: descriptions.fe }));
        addInsight(t.soilData.manganese, data.mn, "ppm", [1.0, 2.0], <Microscope className="h-6 w-6 text-pink-700" />, () => ({ description: descriptions.mn }));
        addInsight(t.soilData.zinc, data.zn, "ppm", [0.5, 1.2], <Microscope className="h-6 w-6 text-teal-600" />, () => ({ description: descriptions.zn }));
        addInsight(t.soilData.cu, data.cu, "ppm", [0.3, 0.5], <Microscope className="h-6 w-6 text-orange-700" />, () => ({ description: descriptions.cu }));
        addInsight(t.soilData.boron, data.b, "ppm", [0.3, 0.5], <Microscope className="h-6 w-6 text-indigo-600" />, () => ({ description: descriptions.b }));
        return insights;
    };

    const getFertilizerPlan = (insights: Insight[]): FertilizerRecommendation[] => {
        const plan: FertilizerRecommendation[] = [];
        const nutrientMap: { [key: string]: string } = {
            [t.soilData.nitrogen]: 'Urea or DAP',
            [t.soilData.phosphorus]: 'DAP or Single Super Phosphate',
            [t.soilData.potassium]: 'Muriate of Potash (MOP)',
            [t.soilData.sulfur]: 'Bensulf or Gypsum',
            [t.soilData.zinc]: 'Zinc Sulphate',
            [t.soilData.boron]: 'Borax Decahydrate',
            [t.soilData.magnesium]: 'Epsom Salt',
            [t.soilData.calcium]: 'Gypsum or Lime',
        };

        const reasonTemplate = t.fertilizerRecs.reasonTemplate;

        insights.forEach(insight => {
            if (insight.level === t.soilReport.levels.low || insight.level === t.soilReport.levels.acidic || insight.level === t.soilReport.levels.alkaline) {
                const productName = nutrientMap[insight.title];
                if (productName) {
                    const reason = reasonTemplate
                        .replace('{nutrient}', insight.title)
                        .replace('{description}', insight.description.toLowerCase());
                    
                    plan.push({
                        nutrient: insight.title,
                        productName,
                        reason,
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
        setLatestSoilReport({ ...data, timestamp: Date.now() });
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

            setLatestSoilReport({ ...dataToGenerateInsights, timestamp: Date.now() });
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
                                            <div className="flex flex-col sm:flex-row gap-4">
												<Button onClick={() => setHasSoilCard(true)} className="flex-1"><CheckCircle className="mr-2 h-4 w-4" />{t.hasCard}</Button>
                                                <Button variant="outline" onClick={handleFindLabs} className="flex-1"><CreditCard className="mr-2 h-4 w-4" />{t.noCard}</Button>
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
								// Lab Finder UI
                                ) : showLabFinder ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2"><Search className="h-5 w-5 text-primary" />{t.labFinder.title}</CardTitle>
                                            <CardDescription>{t.labFinder.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isFindingLabs ? (
                                                <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.labFinder.findingLabs}</div>
                                            ) : locationError ? (
                                                <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{locationError}</AlertDescription></Alert>
                                            ) : nearbyLabs.length > 0 ? (
                                                <div className="space-y-3">
                                                    {nearbyLabs.map((lab, index) => (
                                                        <div key={index} className="p-3 border rounded-lg flex items-start gap-3">
                                                            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-semibold">{lab.name}</p>
                                                                <p className="text-sm text-muted-foreground">{lab.address}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">{t.labFinder.noLabsFound}</p>
                                            )}
                                            <Button variant="outline" onClick={() => { setShowLabFinder(false); setShowManualEntry(true); }} className="w-full mt-4">
                                                {t.labFinder.enterManuallyButton}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : showManualEntry || (hasSoilCard === false && !soilDataLoaded) ? (
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
                        <CardHeader className="text-center pb-6">
                            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">{t.soilReport.reportTitle}</CardTitle>
                            <CardDescription className="text-md text-gray-600 mt-2">{t.soilReport.reportSubtitle}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <InsightSection title={t.soilReport.coreProperties} insights={generatedInsights.slice(0, 3)} />
                            <InsightSection title={t.soilReport.primaryNutrients} insights={generatedInsights.slice(3, 6)} />
                            <InsightSection title={t.soilReport.secondaryNutrients} insights={generatedInsights.slice(6, 9)} />
                            <InsightSection title={t.soilReport.micronutrients} insights={generatedInsights.slice(9)} />
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-8 mt-6 border-t border-gray-200">
                            <Button size="lg" className="w-full sm:w-auto" onClick={() => {
                                const plan = getFertilizerPlan(generatedInsights);
                                setFertilizerPlan(plan);
                                setStage('recommendations');
                            }}>
                                <ChevronsRight className="mr-2 h-5 w-5" />{t.actions.getGuidance}
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setStage('upload')}>
                                {t.actions.back}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
                {stage === "recommendations" && (
                    <div className="animate-fade-in bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800">{t.fertilizerRecs.title}</h1>
                            <p className="text-lg text-gray-600 mt-2">{t.fertilizerRecs.subtitle}</p>
                        </div>
                        {fertilizerPlan.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fertilizerPlan.map(item => (
                                    <Card key={item.nutrient} className="flex flex-col hover:shadow-lg transition-shadow border-gray-200">
                                        <CardHeader className="flex-row items-center gap-4">
                                            <div className="bg-green-100 p-3 rounded-full">{item.icon}</div>
                                            <div>
                                                <CardTitle>{item.productName}</CardTitle>
                                                <CardDescription>{t.fertilizerRecs.toCorrect.replace('{nutrient}', item.nutrient)}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-gray-700">{item.reason}</p>
                                        </CardContent>
                                        <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                                            <h4 className="w-full font-semibold text-sm mb-1 flex items-center gap-2">
                                                <ShoppingCart className="h-4 w-4 text-primary" /> {t.fertilizerRecs.buyLinks}
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
                                <h3 className="text-2xl font-semibold text-green-800">{t.fertilizerRecs.noRecsTitle}</h3>
                                <p className="text-gray-600 mt-2">{t.fertilizerRecs.noRecsSubtitle}</p>
                            </div>
                        )}
                        <div className="text-center mt-10">
                            <Button onClick={() => setStage('soilInsights')} variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" /> {t.actions.back} to Insights
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
                                        <ChevronsRight className="mr-2 h-5 w-5" /> {t.actions.getGuidance}
                                    </Button>
                                )}
                                <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setStage("upload")}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.actions.back} to Analysis
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