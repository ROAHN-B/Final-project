"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft, ExternalLink, Phone, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
import { HamburgerMenu } from "@/components/hamburger-menu" // Import HamburgerMenu

interface SchemeContact {
  phone: string
  email: string
  website: string
}

interface Scheme {
  id: number
  title: string
  description: string
  category: string
  eligibility: string
  amount: string
  deadline: string
  status: string
  details: string
  benefits: string[]
  documents: string[]
  contact: SchemeContact
}

interface SchemesTranslations {
  title: string
  subtitle: string
  searchPlaceholder: string
  categories: {
    all: string
    subsidy: string
    insurance: string
    loan: string
    training: string
    equipment: string
  }
  schemes: Scheme[]
  applyNow: string
  viewDetails: string
  backToHome: string
  eligibility: string
  amount: string
  deadline: string
  status: string
  benefits: string
  documents: string
  contact: string
  phone: string
  email: string
  website: string
}

const translations: Record<string, SchemesTranslations> = {
  en: {
    title: "Government Schemes",
    subtitle: "Agricultural schemes and subsidies for farmers",
    searchPlaceholder: "Search schemes...",
    categories: {
      all: "All Schemes",
      subsidy: "Subsidies",
      insurance: "Insurance",
      loan: "Loans",
      training: "Training",
      equipment: "Equipment",
    },
    schemes: [
      {
        id: 1,
        title: "PM-KISAN Scheme",
        description: "Direct income support of ₹6000 per year to farmer families",
        category: "subsidy",
        eligibility: "Small and marginal farmers",
        amount: "₹6,000/year",
        deadline: "Ongoing",
        status: "Active",
        details:
          "The PM-KISAN scheme provides direct income support to farmer families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.",
        benefits: ["₹2000 every 4 months", "Direct bank transfer", "No paperwork required", "Online application"],
        documents: ["Aadhaar Card", "Bank Account Details", "Land Records", "Mobile Number"],
        contact: {
          phone: "155261",
          email: "pmkisan-ict@gov.in",
          website: "pmkisan.gov.in",
        },
      },
      {
        id: 2,
        title: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance scheme to protect farmers against crop losses",
        category: "insurance",
        eligibility: "All farmers",
        amount: "Up to ₹2 lakh coverage",
        deadline: "Before sowing season",
        status: "Active",
        details:
          "PMFBY provides insurance coverage and financial support to farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.",
        benefits: [
          "Low premium rates",
          "Quick claim settlement",
          "Coverage for all crops",
          "Technology-based assessment",
        ],
        documents: ["Aadhaar Card", "Bank Account", "Land Documents", "Sowing Certificate"],
        contact: {
          phone: "18001801551",
          email: "support@pmfby.gov.in",
          website: "pmfby.gov.in",
        },
      },
      {
        id: 3,
        title: "Kisan Credit Card",
        description: "Credit facility for farmers to meet agricultural expenses",
        category: "loan",
        eligibility: "All farmers",
        amount: "Based on land holding",
        deadline: "Anytime",
        status: "Active",
        details:
          "KCC provides adequate and timely credit support from the banking system to farmers for their cultivation and other needs.",
        benefits: ["Low interest rates", "Flexible repayment", "Insurance coverage", "ATM facility"],
        documents: ["Identity Proof", "Address Proof", "Land Documents", "Income Certificate"],
        contact: {
          phone: "1800118001",
          email: "kcc@nabard.org",
          website: "kcc.nabard.org",
        },
      },
      {
        id: 4,
        title: "Soil Health Card Scheme",
        description: "Free soil testing and nutrient management advice",
        category: "training",
        eligibility: "All farmers",
        amount: "Free",
        deadline: "Ongoing",
        status: "Active",
        details:
          "The scheme aims to issue soil health cards to farmers which will carry crop-wise recommendations of nutrients and fertilizers required for the individual farms.",
        benefits: [
          "Free soil testing",
          "Nutrient recommendations",
          "Increased productivity",
          "Reduced fertilizer cost",
        ],
        documents: ["Aadhaar Card", "Land Records", "Mobile Number"],
        contact: {
          phone: "18001801551",
          email: "soilhealth@gov.in",
          website: "soilhealth.dac.gov.in",
        },
      },
      {
        id: 5,
        title: "Sub-Mission on Agricultural Mechanization",
        description: "Financial assistance for purchasing agricultural machinery",
        category: "equipment",
        eligibility: "Small and marginal farmers",
        amount: "40-50% subsidy",
        deadline: "Check with local office",
        status: "Active",
        details:
          "SMAM promotes farm mechanization through financial assistance for purchasing agricultural machinery and equipment.",
        benefits: ["40-50% subsidy", "Custom hiring centers", "Training programs", "Technology demonstration"],
        documents: ["Aadhaar Card", "Bank Account", "Land Records", "Caste Certificate (if applicable)"],
        contact: {
          phone: "18001801551",
          email: "mechanization@gov.in",
          website: "agrimachinery.nic.in",
        },
      },
      {
        id: 6,
        title: "National Mission for Sustainable Agriculture",
        description: "Promoting sustainable agriculture practices",
        category: "training",
        eligibility: "All farmers",
        amount: "Varies by component",
        deadline: "Ongoing",
        status: "Active",
        details:
          "NMSA promotes sustainable agriculture through climate resilient practices, soil health management, and efficient water use.",
        benefits: ["Training programs", "Technology support", "Financial assistance", "Climate resilient practices"],
        documents: ["Aadhaar Card", "Land Records", "Bank Account"],
        contact: {
          phone: "18001801551",
          email: "nmsa@gov.in",
          website: "nmsa.dac.gov.in",
        },
      },
    ],
    applyNow: "Apply Now",
    viewDetails: "View Details",
    backToHome: "Back to Home",
    eligibility: "Eligibility",
    amount: "Amount",
    deadline: "Deadline",
    status: "Status",
    benefits: "Benefits",
    documents: "Required Documents",
    contact: "Contact Information",
    phone: "Phone",
    email: "Email",
    website: "Website",
  },
  hi: {
    title: "सरकारी योजनाएं",
    subtitle: "किसानों के लिए कृषि योजनाएं और सब्सिडी",
    searchPlaceholder: "योजनाएं खोजें...",
    categories: {
      all: "सभी योजनाएं",
      subsidy: "सब्सिडी",
      insurance: "बीमा",
      loan: "ऋण",
      training: "प्रशिक्षण",
      equipment: "उपकरण",
    },
    schemes: [
      {
        id: 1,
        title: "पीएम-किसान योजना",
        description: "किसान परिवारों को ₹6000 प्रति वर्ष प्रत्यक्ष आय सहायता",
        category: "subsidy",
        eligibility: "छोटे और सीमांत किसान",
        amount: "₹6,000/वर्ष",
        deadline: "निरंतर",
        status: "सक्रिय",
        details:
          "पीएम-किसान योजना देश भर के किसान परिवारों को कृषि और संबद्ध गतिविधियों के साथ-साथ घरेलू जरूरतों के लिए विभिन्न इनपुट खरीदने की वित्तीय आवश्यकताओं को पूरा करने के लिए प्रत्यक्ष आय सहायता प्रदान करती है।",
        benefits: ["हर 4 महीने में ₹2000", "सीधे बैंक ट्रांसफर", "कोई कागजी कार्रवाई नहीं", "ऑनलाइन आवेदन"],
        documents: ["आधार कार्ड", "बैंक खाता विवरण", "भूमि रिकॉर्ड", "मोबाइल नंबर"],
        contact: {
          phone: "155261",
          email: "pmkisan-ict@gov.in",
          website: "pmkisan.gov.in",
        },
      },
      {
        id: 2,
        title: "प्रधानमंत्री फसल बीमा योजना",
        description: "फसल नुकसान से किसानों की सुरक्षा के लिए फसल बीमा योजना",
        category: "insurance",
        eligibility: "सभी किसान",
        amount: "₹2 लाख तक कवरेज",
        deadline: "बुवाई के मौसम से पहले",
        status: "सक्रिय",
        details:
          "पीएमएफबीवाई प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण अधिसूचित फसल की विफलता की स्थिति में किसानों को बीमा कवरेज और वित्तीय सहाय्ता प्रदान करती है।",
        benefits: ["कम प्रीमियम दरें", "त्वरित दावा निपटान", "सभी फसलों के लिए कवरेज", "प्रौद्योगिकी आधारित मूल्यांकन"],
        documents: ["आधार कार्ड", "बैंक खाता", "भूमि दस्तावेज", "बुवाई प्रमाणपत्र"],
        contact: {
          phone: "18001801551",
          email: "support@pmfby.gov.in",
          website: "pmfby.gov.in",
        },
      },
      {
        id: 3,
        title: "किसान क्रेडिट कार्ड",
        description: "कृषि खर्चों को पूरा करने के लिए किसानों के लिए ऋण सुविधा",
        category: "loan",
        eligibility: "सभी किसान",
        amount: "भूमि जोत के आधार पर",
        deadline: "कभी भी",
        status: "सक्रिय",
        details: "केसीसी किसानों को उनकी खेती और अन्य जरूरतों के लिए बैंकिंग प्रणाली से पर्याप्त और समय पर ऋण सहायता प्रदान करता है।",
        benefits: ["कम ब्याज दरें", "लचीली चुकौती", "बीमा कवरेज", "एटीएम सुविधा"],
        documents: ["पहचान प्रमाण", "पता प्रमाण", "भूमि दस्तावेज", "आय प्रमाणपत्र"],
        contact: {
          phone: "1800118001",
          email: "kcc@nabard.org",
          website: "kcc.nabard.org",
        },
      },
      {
        id: 4,
        title: "मृदा स्वास्थ्य कार्ड योजना",
        description: "मुफ्त मिट्टी परीक्षण और पोषक तत्व प्रबंधन सलाह",
        category: "training",
        eligibility: "सभी किसान",
        amount: "मुफ्त",
        deadline: "निरंतर",
        status: "सक्रिय",
        details:
          "इस योजना का उद्देश्य किसानों को मृदा स्वास्थ्य कार्ड जारी करना है जिसमें व्यक्तिगत खेतों के लिए आवश्यक पोषक तत्वों और उर्वरकों की फसल-वार सिफारिशें होंगी।",
        benefits: ["मुफ्त मिट्टी परीक्षण", "पोषक तत्व सिफारिशें", "बढ़ी हुई उत्पादकता", "कम उर्वरक लागत"],
        documents: ["आधार कार्ड", "भूमि रिकॉर्ड", "मोबाइल नंबर"],
        contact: {
          phone: "18001801551",
          email: "soilhealth@gov.in",
          website: "soilhealth.dac.gov.in",
        },
      },
      {
        id: 5,
        title: "कृषि यंत्रीकरण पर उप-मिशन",
        description: "कृषि मशीनरी खरीदने के लिए वित्तीय सहायता",
        category: "equipment",
        eligibility: "छोटे और सीमांत किसान",
        amount: "40-50% सब्सिडी",
        deadline: "स्थानीय कार्यालय से जांचें",
        status: "सक्रिय",
        details: "एसएमएएम कृषि मशीनरी और उपकरण खरीदने के लिए वित्तीय सहायता के माध्यम से कृषि यंत्रीकरण को बढ़ावा देता है।",
        benefits: ["40-50% सब्सिडी", "कस्टम हायरिंग सेंटर", "प्रशिक्षण कार्यक्रम", "प्रौद्योगिकी प्रदर्शन"],
        documents: ["आधार कार्ड", "बँक खाते", "जमीन नोंदी", "जात प्रमाणपत्र (लागू असल्यास)"],
        contact: {
          phone: "18001801551",
          email: "mechanization@gov.in",
          website: "agrimachinery.nic.in",
        },
      },
      {
        id: 6,
        title: "सतत कृषि के लिए राष्ट्रीय मिशन",
        description: "सतत कृषि प्रथाओं को बढ़ावा देना",
        category: "training",
        eligibility: "सभी किसान",
        amount: "घटक के अनुसार अलग-अलग",
        deadline: "निरंतर",
        status: "सक्रिय",
        details:
          "एनएमएसए हवामान प्रतिरोधी पद्धती, मृदा स्वास्थ्य प्रबंधन और कार्यक्षम पाणी उपयोग के माध्यम से सतत कृषि को बढ़ावा देता है।",
        benefits: ["प्रशिक्षण कार्यक्रम", "प्रौद्योगिकी सहायता", "वित्तीय सहायता", "हवामान प्रतिरोधी पद्धती"],
        documents: ["आधार कार्ड", "भूमि रिकॉर्ड", "बँक खाते"],
        contact: {
          phone: "18001801551",
          email: "nmsa@gov.in",
          website: "nmsa.dac.gov.in",
        },
      },
    ],
    applyNow: "Apply Now",
    viewDetails: "View Details",
    backToHome: "Back to Home",
    eligibility: "Eligibility",
    amount: "Amount",
    deadline: "Deadline",
    status: "Status",
    benefits: "Benefits",
    documents: "Required Documents",
    contact: "Contact Information",
    phone: "Phone",
    email: "Email",
    website: "Website",
  },
  hi: {
    title: "सरकारी योजनाएं",
    subtitle: "किसानों के लिए कृषि योजनाएं और सब्सिडी",
    searchPlaceholder: "योजनाएं खोजें...",
    categories: {
      all: "सभी योजनाएं",
      subsidy: "सब्सिडी",
      insurance: "बीमा",
      loan: "ऋण",
      training: "प्रशिक्षण",
      equipment: "उपकरण",
    },
    schemes: [
      {
        id: 1,
        title: "पीएम-किसान योजना",
        description: "किसान परिवारों को ₹6000 प्रति वर्ष थेट उत्पन्न सहाय्य",
        category: "subsidy",
        eligibility: "छोटे और सीमांत किसान",
        amount: "₹6,000/वर्ष",
        deadline: "सतत",
        status: "सक्रिय",
        details:
          "पीएम-किसान योजना देशभरातील शेतकरी कुटुंबांना कृषी आणि संबंधित क्रियाकलाप तसेच घरगुती गरजांसाठी विविध इनपुट खरेदी करण्यासाठी त्यांच्या आर्थिक गरजा पूर्ण करण्यासाठी थेट उत्पन्न सहाय्य प्रदान करते.",
        benefits: ["दर 4 महिन्यांत ₹2000", "थेट बँक हस्तांतरण", "कागदी कामकाज नाही", "ऑनलाइन अर्ज"],
        documents: ["आधार कार्ड", "बँक खाते तपशील", "जमीन नोंदी", "मोबाइल नंबर"],
        contact: {
          phone: "155261",
          email: "pmkisan-ict@gov.in",
          website: "pmkisan.gov.in",
        },
      },
      {
        id: 2,
        title: "प्रधानमंत्री फसल बीमा योजना",
        description: "पीक नुकसानीपासून शेतकऱ्यांचे संरक्षण करण्यासाठी पीक विमा योजना",
        category: "insurance",
        eligibility: "सर्व शेतकरी",
        amount: "₹2 लाख पर्यंत कव्हरेज",
        deadline: "पेरणी हंगामापूर्वी",
        status: "सक्रिय",
        details:
          "पीएमएफबीवाई नैसर्गिक आपत्ती, कीड आणि रोगांमुळे अधिसूचित पिकाच्या अपयशाच्या घटनेत शेतकऱ्यांना विमा संरक्षण आणि आर्थिक सहाय्य प्रदान करते.",
        benefits: ["कमी प्रीमियम दर", "जलद दावा निपटारा", "सर्व पिकांसाठी कव्हरेज", "तंत्रज्ञान आधारित मूल्यांकन"],
        documents: ["आधार कार्ड", "बँक खाते", "जमीन कागदपत्रे", "पेरणी प्रमाणपत्र"],
        contact: {
          phone: "18001801551",
          email: "support@pmfby.gov.in",
          website: "pmfby.gov.in",
        },
      },
      {
        id: 3,
        title: "किसान क्रेडिट कार्ड",
        description: "कृषी खर्च भागवण्यासाठी शेतकऱ्यांसाठी कर्ज सुविधा",
        category: "loan",
        eligibility: "सर्व शेतकरी",
        amount: "जमीन धारणेच्या आधारावर",
        deadline: "कधीही",
        status: "सक्रिय",
        details: "केसीसी शेतकऱ्यांना त्यांच्या लागवड आणि इतर गरजांसाठी बँकिंग प्रणालीकडून पुरेसे आणि वेळेवर कर्ज सहाय्य प्रदान करते।",
        benefits: ["कमी व्याज दर", "लवचिक परतफेड", "विमा संरक्षण", "एटीएम सुविधा"],
        documents: ["ओळख पुरावा", "पत्ता पुरावा", "जमीन कागदपत्रे", "उत्पन्न प्रमाणपत्र"],
        contact: {
          phone: "1800118001",
          email: "kcc@nabard.org",
          website: "kcc.nabard.org",
        },
      },
      {
        id: 4,
        title: "मृदा आरोग्य कार्ड योजना",
        description: "मोफत माती चाचणी आणि पोषक व्यवस्थापन सल्ला",
        category: "training",
        eligibility: "सर्व शेतकरी",
        amount: "मोफत",
        deadline: "सतत",
        status: "सक्रिय",
        details:
          "या योजनेचे उद्दिष्ट शेतकऱ्यांना मृदा आरोग्य कार्ड जारी करणे आहे ज्यामध्ये वैयक्तिक शेतांसाठी आवश्यक पोषक तत्वे आणि खतांच्या पीक-वार शिफारसी असतील。",
        benefits: ["मोफत माती चाचणी", "पोषक तत्व शिफारसी", "वाढलेली उत्पादकता", "कमी खत खर्च"],
        documents: ["आधार कार्ड", "जमीन नोंदी", "मोबाइल नंबर"],
        contact: {
          phone: "18001801551",
          email: "soilhealth@gov.in",
          website: "soilhealth.dac.gov.in",
        },
      },
      {
        id: 5,
        title: "कृषी यंत्रीकरणावर उप-मिशन",
        description: "कृषी यंत्रसामग्री खरेदीसाठी आर्थिक सहाय्य",
        category: "equipment",
        eligibility: "लहान आणि सीमांत शेतकरी",
        amount: "40-50% अनुदान",
        deadline: "स्थानिक कार्यालयाशी तपासा",
        status: "सक्रिय",
        details: "एसएमएएम कृषी यंत्रसामग्री आणि उपकरणे खरेदीसाठी आर्थिक सहाय्याद्वारे शेती यंत्रीकरणाला प्रोत्साहन देते।",
        benefits: ["40-50% अनुदान", "कस्टम हायरिंग केंद्रे", "प्रशिक्षण कार्यक्रम", "तंत्रज्ञान प्रदर्शन"],
        documents: ["आधार कार्ड", "बँक खाते", "जमीन नोंदी", "जात प्रमाणपत्र (लागू असल्यास)"],
        contact: {
          phone: "18001801551",
          email: "mechanization@gov.in",
          website: "agrimachinery.nic.in",
        },
      },
      {
        id: 6,
        title: "शाश्वत कृषीसाठी राष्ट्रीय मिशन",
        description: "शाश्वत कृषी पद्धतींना प्रोत्साहन देणे",
        category: "training",
        eligibility: "सर्व शेतकरी",
        amount: "घटकानुसार वेगवेगळे",
        deadline: "सतत",
        status: "सक्रिय",
        details:
          "एनएमएसए हवामान प्रतिरोधी पद्धती, मृदा आरोग्य व्यवस्थापन आणि कार्यक्षम पाणी वापराद्वारे शाश्वत कृषीला प्रोत्साहन देते।",
        benefits: ["प्रशिक्षण कार्यक्रम", "तंत्रज्ञान सहाय्य", "आर्थिक सहाय्य", "हवामान प्रतिरोधी पद्धती"],
        documents: ["आधार कार्ड", "जमीन नोंदी", "बँक खाते"],
        contact: {
          phone: "18001801551",
          email: "nmsa@gov.in",
          website: "nmsa.dac.gov.in",
        },
      },
    ],
    applyNow: "आता अर्ज करा",
    viewDetails: "तपशील पहा",
    backToHome: "होमवर परत",
    eligibility: "पात्रता",
    amount: "रक्कम",
    deadline: "अंतिम तारीख",
    status: "स्थिती",
    benefits: "फायदे",
    documents: "आवश्यक कागदपत्रे",
    contact: "संपर्क माहिती",
    phone: "फोन",
    email: "ईमेल",
    website: "वेबसाइट",
  },
  mr: {
    title: "सरकारी योजना",
    subtitle: "शेतकऱ्यांसाठी कृषी योजना आणि अनुदान",
    searchPlaceholder: "योजना शोधा...",
    categories: {
      all: "सर्व योजना",
      subsidy: "अनुदान",
      insurance: "विमा",
      loan: "कर्ज",
      training: "प्रशिक्षण",
      equipment: "उपकरणे",
    },
    schemes: [
      {
        id: 1,
        title: "पीएम-किसान योजना",
        description: "शेतकरी कुटुंबांना ₹6000 प्रति वर्ष थेट उत्पन्न सहाय्य",
        category: "subsidy",
        eligibility: "लहान आणि सीमांत शेतकरी",
        amount: "₹6,000/वर्ष",
        deadline: "सतत",
        status: "सक्रिय",
        details:
          "पीएम-किसान योजना देशभरातील शेतकरी कुटुंबांना कृषी आणि संबंधित क्रियाकलाप द्वारे घरगुती गरजांसाठी विविध इनपुट खरेदी करण्यासाठी त्यांच्या आर्थिक गरजा पूर्ण करण्यासाठी थेट उत्पन्न सहाय्य प्रदान करते.",
        benefits: ["दर 4 महिन्यांत ₹2000", "थेट बँक हस्तांतरण", "कोई कागदी कारवाई नाही", "ऑनलाइन अर्ज"],
        documents: ["आधार कार्ड", "बँक खाते तपशील", "जमीन नोंदी", "मोबाइल नंबर"],
        contact: {
          phone: "155261",
          email: "pmkisan-ict@gov.in",
          website: "pmkisan.gov.in",
        },
      },
      {
        id: 2,
        title: "प्रधानमंत्री फसल बीमा योजना",
        description: "पीक नुकसानीपासून शेतकऱ्यांचे संरक्षण करण्यासाठी पीक विमा योजना",
        category: "insurance",
        eligibility: "सर्व शेतकरी",
        amount: "₹2 लाख पर्यंत कव्हरेज",
        deadline: "पेरणी हंगामापूर्वी",
        status: "सक्रिय",
        details:
          "पीएमएफबीवाई नैसर्गिक आपत्ती, कीड आणि रोगांमुळे अधिसूचित पिकाच्या अपयशाच्या घटनेत शेतकऱ्यांना विमा संरक्षण आणि आर्थिक सहाय्य प्रदान करते.",
        benefits: ["कमी प्रीमियम दर", "जलद दावा निपटारा", "सर्व पिकांसाठी कव्हरेज", "तंत्रज्ञान आधारित मूल्यांकन"],
        documents: ["आधार कार्ड", "बँक खाते", "जमीन कागदपत्रे", "पेरणी प्रमाणपत्र"],
        contact: {
          phone: "18001801551",
          email: "support@pmfby.gov.in",
          website: "pmfby.gov.in",
        },
      },
      {
        id: 3,
        title: "किसान क्रेडिट कार्ड",
        description: "कृषी खर्च भागवण्यासाठी शेतकऱ्यांसाठी कर्ज सुविधा",
        category: "loan",
        eligibility: "सर्व शेतकरी",
        amount: "जमीन धारणेच्या आधारावर",
        deadline: "कधीही",
        status: "सक्रिय",
        details: "केसीसी शेतकऱ्यांना त्यांच्या लागवड आणि इतर गरजांसाठी बँकिंग प्रणालीकडून पुरेसे आणि वेळेवर कर्ज सहाय्य प्रदान करते।",
        benefits: ["कमी व्याज दर", "लवचिक परतफेड", "विमा संरक्षण", "एटीएम सुविधा"],
        documents: ["ओळख पुरावा", "पत्ता पुरावा", "जमीन कागदपत्रे", "उत्पन्न प्रमाणपत्र"],
        contact: {
          phone: "1800118001",
          email: "kcc@nabard.org",
          website: "kcc.nabard.org",
        },
      },
      {
        id: 4,
        title: "मृदा आरोग्य कार्ड योजना",
        description: "मोफत माती चाचणी आणि पोषक व्यवस्थापन सल्ला",
        category: "training",
        eligibility: "सर्व शेतकरी",
        amount: "मोफत",
        deadline: "सतत",
        status: "सक्रिय",
        details:
          "या योजनेचे उद्दिष्ट शेतकऱ्यांना मृदा आरोग्य कार्ड जारी करणे आहे ज्यामध्ये वैयक्तिक शेतांसाठी आवश्यक पोषक तत्वे आणि खतांच्या पीक-वार शिफारसी असतील。",
        benefits: ["मोफत माती चाचणी", "पोषक तत्व शिफारसी", "वाढलेली उत्पादकता", "कमी खत खर्च"],
        documents: ["आधार कार्ड", "जमीन नोंदी", "मोबाइल नंबर"],
        contact: {
          phone: "18001801551",
          email: "soilhealth@gov.in",
          website: "soilhealth.dac.gov.in",
        },
      },
      {
        id: 5,
        title: "कृषी यंत्रीकरणावर उप-मिशन",
        description: "कृषी यंत्रसामग्री खरेदीसाठी आर्थिक सहाय्य",
        category: "equipment",
        eligibility: "लहान आणि सीमांत शेतकरी",
        amount: "40-50% अनुदान",
        deadline: "स्थानिक कार्यालयाशी तपासा",
        status: "सक्रिय",
        details: "एसएमएएम कृषी यंत्रसामग्री आणि उपकरणे खरेदीसाठी आर्थिक सहाय्याद्वारे शेती यंत्रीकरणाला प्रोत्साहन देते।",
        benefits: ["40-50% अनुदान", "कस्टम हायरिंग केंद्रे", "प्रशिक्षण कार्यक्रम", "तंत्रज्ञान प्रदर्शन"],
        documents: ["आधार कार्ड", "बँक खाते", "जमीन नोंदी", "जात प्रमाणपत्र (लागू असल्यास)"],
        contact: {
          phone: "18001801551",
          email: "mechanization@gov.in",
          website: "agrimachinery.nic.in",
        },
      },
      {
        id: 6,
        title: "शाश्वत कृषीसाठी राष्ट्रीय मिशन",
        description: "शाश्वत कृषी पद्धतींना प्रोत्साहन देणे",
        category: "training",
        eligibility: "सर्व शेतकरी",
        amount: "घटकानुसार वेगवेगळे",
        deadline: "सतत",
        status: "सक्रिय",
        details:
          "एनएमएसए हवामान प्रतिरोधी पद्धती, मृदा आरोग्य व्यवस्थापन आणि कार्यक्षम पाणी वापराद्वारे शाश्वत कृषीला प्रोत्साहन देते।",
        benefits: ["प्रशिक्षण कार्यक्रम", "तंत्रज्ञान सहाय्य", "आर्थिक सहाय्य", "हवामान प्रतिरोधी पद्धती"],
        documents: ["आधार कार्ड", "जमीन नोंदी", "बँक खाते"],
        contact: {
          phone: "18001801551",
          email: "nmsa@gov.in",
          website: "nmsa.dac.gov.in",
        },
      },
    ],
    applyNow: "आता अर्ज करा",
    viewDetails: "तपशील पहा",
    backToHome: "होमवर परत",
    eligibility: "पात्रता",
    amount: "रक्कम",
    deadline: "अंतिम तारीख",
    status: "स्थिती",
    benefits: "फायदे",
    documents: "आवश्यक कागदपत्रे",
    contact: "संपर्क माहिती",
    phone: "फोन",
    email: "ईमेल",
    website: "वेबसाइट",
  },
  pa: {
    title: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    subtitle: "ਕਿਸਾਨਾਂ ਲਈ ਖੇਤੀਬਾੜੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀ",
    searchPlaceholder: "ਸਕੀਮਾਂ ਖੋਜੋ...",
    categories: {
      all: "ਸਾਰੀਆਂ ਸਕੀਮਾਂ",
      subsidy: "ਸਬਸਿਡੀ",
      insurance: "ਬੀਮਾ",
      loan: "ਕਰਜ਼ਾ",
      training: "ਸਿਖਲਾਈ",
      equipment: "ਉਪਕਰਣ",
    },
    schemes: [
      {
        id: 1,
        title: "ਪੀਐਮ-ਕਿਸਾਨ ਸਕੀਮ",
        description: "ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਨੂੰ ₹6000 ਪ੍ਰਤੀ ਸਾਲ ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ",
        category: "subsidy",
        eligibility: "ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨ",
        amount: "₹6,000/ਸਾਲ",
        deadline: "ਨਿਰੰਤਰ",
        status: "ਸਰਗਰਮ",
        details:
          "ਪੀਐਮ-ਕਿਸਾਨ ਸਕੀਮ ਦੇਸ਼ ਭਰ ਦੇ ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਨੂੰ ਖੇਤੀਬਾੜੀ ਅਤੇ ਸੰਬੰਧਿਤ ਗਤੀਵਿਧੀਆਂ ਦੇ ਨਾਲ-ਨਾਲ ਘਰੇਲੂ ਲੋੜਾਂ ਲਈ ਵੱਖ-ਵੱਖ ਇਨਪੁਟ ਖਰੀਦਣ ਦੀਆਂ ਵਿੱਤੀ ਲੋੜਾਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ।",
        benefits: ["ਹਰ 4 ਮਹੀਨਿਆਂ ਵਿੱਚ ₹2000", "ਸਿੱਧਾ ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ", "ਕੋਈ ਕਾਗਜ਼ੀ ਕਾਰਵਾਈ ਨਹੀਂ", "ਔਨਲਾਈਨ ਅਰਜ਼ੀ"],
        documents: ["ਆਧਾਰ ਕਾਰਡ", "ਬੈਂਕ ਖਾਤਾ ਵੇਰਵਾ", "ਜ਼ਮੀਨ ਰਿਕਾਰਡ", "ਮੋਬਾਈਲ ਨੰਬਰ"],
        contact: {
          phone: "155261",
          email: "pmkisan-ict@gov.in",
          website: "pmkisan.gov.in",
        },
      },
      {
        id: 2,
        title: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ",
        description: "ਫਸਲ ਨੁਕਸਾਨ ਤੋਂ ਕਿਸਾਨਾਂ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਫਸਲ ਬੀਮਾ ਸਕੀਮ",
        category: "insurance",
        eligibility: "ਸਾਰੇ ਕਿਸਾਨ",
        amount: "₹2 ਲੱਖ ਤੱਕ ਕਵਰੇਜ",
        deadline: "ਬੀਜਾਈ ਸੀਜ਼ਨ ਤੋਂ ਪਹਿਲਾਂ",
        status: "ਸਰਗਰਮ",
        details:
          "ਪੀਐਮਐਫਬੀਵਾਈ ਕੁਦਰਤੀ ਆਫ਼ਤਾਂ, ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀਆਂ ਦੇ ਕਾਰਨ ਅਧਿਸੂਚਿਤ ਫਸਲ ਦੀ ਅਸਫਲਤਾ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਕਿਸਾਨਾਂ ਨੂੰ ਬੀਮਾ ਕਵਰੇਜ ਅਤੇ ਵਿੱਤੀ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ।",
        benefits: ["ਘੱਟ ਪ੍ਰੀਮੀਅਮ ਦਰਾਂ", "ਤੇਜ਼ ਦਾਅਵਾ ਨਿਪਟਾਰਾ", "ਸਾਰੀਆਂ ਫਸਲਾਂ ਲਈ ਕਵਰੇਜ", "ਤਕਨਾਲੋਜੀ ਅਧਾਰਿਤ ਮੁਲਾਂਕਣ"],
        documents: ["ਆਧਾਰ ਕਾਰਡ", "ਬੈਂਕ ਖਾਤਾ", "ਜ਼ਮੀਨ ਦਸਤਾਵੇਜ਼", "ਬੀਜਾਈ ਸਰਟੀਫਿਕੇਟ"],
        contact: {
          phone: "18001801551",
          email: "support@pmfby.gov.in",
          website: "pmfby.gov.in",
        },
      },
      {
        id: 3,
        title: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ",
        description: "ਖੇਤੀਬਾੜੀ ਖਰਚਿਆਂ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿਸਾਨਾਂ ਲਈ ਕ੍ਰੈਡਿਟ ਸਹੂਲਤ",
        category: "loan",
        eligibility: "ਸਾਰੇ ਕਿਸਾਨ",
        amount: "ਜ਼ਮੀਨ ਦੀ ਮਲਕੀਅਤ ਦੇ ਆਧਾਰ 'ਤੇ",
        deadline: "ਕਦੇ ਵੀ",
        status: "ਸਰਗਰਮ",
        details: "ਕੇਸੀਸੀ ਕਿਸਾਨਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਖੇਤੀ ਅਤੇ ਹੋਰ ਲੋੜਾਂ ਲਈ ਬੈਂਕਿੰਗ ਸਿਸਟਮ ਤੋਂ ਢੁਕਵੀਂ ਅਤੇ ਸਮੇਂ ਸਿਰ ਕ੍ਰੈਡਿਟ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।",
        benefits: ["ਘੱਟ ਵਿਆਜ ਦਰਾਂ", "ਲਚਕਦਾਰ ਵਾਪਸੀ", "ਬੀਮਾ ਕਵਰੇਜ", "ਏਟੀਐਮ ਸਹੂਲਤ"],
        documents: ["ਪਛਾਣ ਪ੍ਰਮਾਣ", "ਪਤਾ ਪ੍ਰਮਾਣ", "ਜ਼ਮੀਨ ਦਸਤਾਵੇਜ਼", "ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ"],
        contact: {
          phone: "1800118001",
          email: "kcc@nabard.org",
          website: "kcc.nabard.org",
        },
      },
      {
        id: 4,
        title: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਸਕੀਮ",
        description: "ਮੁਫਤ ਮਿੱਟੀ ਜਾਂਚ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤ ਪ੍ਰਬੰਧਨ ਸਲਾਹ",
        category: "training",
        eligibility: "ਸਾਰੇ ਕਿਸਾਨ",
        amount: "ਮੁਫਤ",
        deadline: "ਨਿਰੰਤਰ",
        status: "ਸਰਗਰਮ",
        details:
          "ਇਸ ਸਕੀਮ ਦਾ ਉਦੇਸ਼ ਕਿਸਾਨਾਂ ਨੂੰ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਜਾਰੀ ਕਰਨਾ ਹੈ ਜਿਸ ਵਿੱਚ ਵਿਅਕਤੀਗਤ ਖੇਤਾਂ ਲਈ ਲੋੜੀਂਦੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਅਤੇ ਖਾਦਾਂ ਦੀਆਂ ਫਸਲ-ਵਾਰ ਸਿਫਾਰਸ਼ਾਂ ਹੋਣਗੀਆਂ।",
        benefits: ["ਮੁਫਤ ਮਿੱਟੀ ਜਾਂਚ", "ਪੋਸ਼ਕ ਤੱਤ ਸਿਫਾਰਸ਼ਾਂ", "ਵਧੀ ਹੋਈ ਉਤਪਾਦਕਤਾ", "ਘੱਟ ਖਾਦ ਲਾਗਤ"],
        documents: ["ਆਧਾਰ ਕਾਰਡ", "ਜਮੀਨ ਰਿਕਾਰਡ", "ਮੋਬਾਈਲ ਨੰਬਰ"],
        contact: {
          phone: "18001801551",
          email: "soilhealth@gov.in",
          website: "soilhealth.dac.gov.in",
        },
      },
      {
        id: 5,
        title: "ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨੀਕਰਨ 'ਤੇ ਸਬ-ਮਿਸ਼ਨ",
        description: "ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨਰੀ ਖਰੀਦਣ ਲਈ ਵਿੱਤੀ ਸਹਾਇਤਾ",
        category: "equipment",
        eligibility: "ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨ",
        amount: "40-50% ਸਬਸਿਡੀ",
        deadline: "ਸਥਾਨਕ ਦਫਤਰ ਨਾਲ ਜਾਂਚ ਕਰੋ",
        status: "ਸਰਗਰਮ",
        details: "ਐਸਐਮਏਐਮ ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨਰੀ ਅਤੇ ਉਪਕਰਣ ਖਰੀਦਣ ਲਈ ਵਿੱਤੀ ਸਹਾਇਤਾ ਰਾਹੀਂ ਖੇਤ ਮਸ਼ੀਨੀਕਰਨ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦਾ ਹੈ।",
        benefits: ["40-50% ਸਬਸਿਡੀ", "ਕਸਟਮ ਹਾਇਰਿੰਗ ਸੈਂਟਰ", "ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ", "ਤਕਨਾਲੋਜੀ ਪ੍ਰਦਰਸ਼ਨ"],
        documents: ["ਆਧਾਰ ਕਾਰਡ", "ਬੈਂਕ ਖਾਤਾ", "ਜਮੀਨ ਰਿਕਾਰਡ", "ਜਾਤੀ ਸਰਟੀਫਿਕੇਟ (ਜੇ ਲਾਗੂ ਹੋਵੇ)"],
        contact: {
          phone: "18001801551",
          email: "mechanization@gov.in",
          website: "agrimachinery.nic.in",
        },
      },
      {
        id: 6,
        title: "ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ ਲਈ ਰਾਸ਼ਟਰੀ ਮਿਸ਼ਨ",
        description: "ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ ਅਭਿਆਸਾਂ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਨਾ",
        category: "training",
        eligibility: "ਸਾਰੇ ਕਿਸਾਨ",
        amount: "ਕੰਪੋਨੈਂਟ ਦੇ ਅਨੁਸਾਰ ਵੱਖਰਾ",
        deadline: "ਨਿਰੰਤਰ",
        status: "ਸਰਗਰਮ",
        details:
          "ਐਨਐਮਐਸਏ ਜਲਵਾਯੂ ਪ੍ਰਤੀਰੋਧੀ ਅਭਿਆਸਾਂ, ਮਿੱਟੀ ਸਿਹਤ ਪ੍ਰਬੰਧਨ ਅਤੇ ਕੁਸ਼ਲ ਪਾਣੀ ਦੀ ਵਰਤੋਂ ਰਾਹੀਂ ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦਾ ਹੈ।",
        benefits: ["ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ", "ਤਕਨਾਲੋਜੀ ਸਹਾਇਤਾ", "ਵਿੱਤੀ ਸਹਾਇਤਾ", "ਜਲਵਾਯੂ ਪ੍ਰਤੀਰੋਧੀ ਅਭਿਆਸ"],
        documents: ["ਆਧਾਰ ਕਾਰਡ", "ਬੈਂਕ ਖਾਤਾ", "ਜਮੀਨ ਰਿਕਾਰਡ"],
        contact: {
          phone: "18001801551",
          email: "nmsa@gov.in",
          website: "nmsa.dac.gov.in",
        },
      },
    ],
    applyNow: "ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ",
    viewDetails: "ਵੇਰਵੇ ਵੇਖੋ",
    backToHome: "ਘਰ ਵਾਪਸ",
    eligibility: "ਯੋਗਤਾ",
    amount: "ਰਕਮ",
    deadline: "ਅੰਤਿਮ ਮਿਤੀ",
    status: "ਸਥਿਤੀ",
    benefits: "ਫਾਇਦੇ",
    documents: "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼",
    contact: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
    phone: "ਫੋਨ",
    email: "ਈਮੇਲ",
    website: "ਵੈਬਸਾਈਟ",
  },
}

export default function SchemesPage() {
  const { currentLang } = useLanguage()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)

  const t = translations[currentLang] || translations.en

  const filteredSchemes = t.schemes.filter((scheme) => {
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      subsidy: "bg-green-100 text-green-800",
      insurance: "bg-blue-100 text-blue-800",
      loan: "bg-purple-100 text-purple-800",
      training: "bg-orange-100 text-orange-800",
      equipment: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    return status === "Active" || status === "सक्रिय" || status === "ਸਰਗਰਮ"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800"
  }

  if (selectedScheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedScheme(null)}
            variant="ghost"
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Button>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="text-2xl">{selectedScheme.title}</CardTitle>
              <CardDescription className="text-green-100">{selectedScheme.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t.eligibility}</h3>
                    <p className="text-gray-700">{selectedScheme.eligibility}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t.amount}</h3>
                    <p className="text-green-600 font-semibold">{selectedScheme.amount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t.deadline}</h3>
                    <p className="text-gray-700">{selectedScheme.deadline}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t.status}</h3>
                    <Badge className={getStatusColor(selectedScheme.status)}>{selectedScheme.status}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t.benefits}</h3>
                    <ul className="space-y-1">
                      {selectedScheme.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t.documents}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedScheme.documents.map((doc: string, index: number) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t.contact}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t.phone}</p>
                      <p className="font-medium">{selectedScheme.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t.email}</p>
                      <p className="font-medium">{selectedScheme.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t.website}</p>
                      <p className="font-medium">{selectedScheme.contact.website}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">{t.applyNow}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={() => router.push("/")} variant="ghost" className="text-green-700 hover:text-green-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Button>
          <HamburgerMenu /> {/* Added HamburgerMenu */}
          {/* Language Selector and Notification Bell */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600 text-lg">{t.subtitle}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(t.categories).map(([key, label]) => (
              <Button
                key={key}
                onClick={() => setSelectedCategory(key)}
                variant={selectedCategory === key ? "default" : "outline"}
                className={
                  selectedCategory === key
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-green-200 text-green-700 hover:bg-green-50"
                }
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme: Scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(scheme.category)}>
                    {t.categories[scheme.category as keyof typeof t.categories]}
                  </Badge>
                  <Badge className={getStatusColor(scheme.status)}>{scheme.status}</Badge>
                </div>
                <CardTitle className="text-lg text-green-800">{scheme.title}</CardTitle>
                <CardDescription className="text-gray-600">{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t.amount}:</span>
                    <span className="text-sm font-semibold text-green-600">{scheme.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t.deadline}:</span>
                    <span className="text-sm">{scheme.deadline}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedScheme(scheme)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {t.viewDetails}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No schemes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
