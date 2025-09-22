// lib/translations.ts
import { type Language } from "@/contexts/language-context";

export interface GlobalTranslations {
  menu: {
    chatbot: string;
  };
  chatbotUI: {
    online: string;
    initialMessage: {
      text: string;
      html: string;
    };
    initialSuggestions: string[];
    thinking: string;
    placeholder: string;
    fetchingLocation: string;
    shareLocation: string;
    locationError: string;
    speechError: (error: string) => string;
  };
}

export const translations: Record<Language, GlobalTranslations> = {
  en: {
    menu: { chatbot: "Chat Bot" },
    chatbotUI: {
      online: "Online",
      initialMessage: {
        text: "Hello! I am Krishi-Mitra, your agricultural assistant. How can I help you today?",
        html: "Hello! I am <strong>Krishi-Mitra</strong>, your agricultural assistant. How can I help you today?",
      },
      initialSuggestions: ["What crops suit my region?", "Identify this plant disease", "When should I plant rice?"],
      thinking: "Thinking...",
      placeholder: "Ask a farming question...",
      fetchingLocation: "Fetching...",
      shareLocation: "Share Location",
      locationError: "Could not get location. Please check browser permissions.",
      speechError: (error: string) => `Speech error: ${error}. Please try again.`,
    },
  },
  hi: {
    menu: { chatbot: "चैट बॉट" },
    chatbotUI: {
      online: "ऑनलाइन",
      initialMessage: {
        text: "नमस्ते! मैं कृषि-मित्र हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?",
        html: "नमस्ते! मैं <strong>कृषि-मित्र</strong> हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?",
      },
      initialSuggestions: ["मेरे क्षेत्र के लिए कौन सी फसलें उपयुक्त हैं?", "इस पौधे की बीमारी को पहचानें", "चावल कब लगाएं?"],
      thinking: "सोच रहा हूँ...",
      placeholder: "खेती से जुड़ा कोई सवाल पूछें...",
      fetchingLocation: "ढूंढ रहा है...",
      shareLocation: "स्थान साझा करें",
      locationError: "स्थान नहीं मिल सका। कृपया ब्राउज़र अनुमतियों की जाँच करें।",
      speechError: (error: string) => `बोलने में त्रुटि: ${error}। कृपया पुनः प्रयास करें।`,
    },
  },
  mr: {
    menu: { chatbot: "चॅट बॉट" },
    chatbotUI: {
      online: "ऑनलाइन",
      initialMessage: {
        text: "नमस्कार! मी कृषि-मित्र आहे. मी आज तुमची कशी मदत करू शकतो?",
        html: "नमस्कार! मी <strong>कृषि-मित्र</strong> आहे. मी आज तुमची कशी मदत करू शकतो?",
      },
      initialSuggestions: ["माझ्या प्रदेशासाठी कोणती पिके योग्य आहेत?", "या वनस्पतीचा रोग ओळखा", "मी भात कधी लावावे?"],
      thinking: "विचार करत आहे...",
      placeholder: "शेतीबद्दल प्रश्न विचारा...",
      fetchingLocation: "शोधत आहे...",
      shareLocation: "स्थान शेअर करा",
      locationError: "स्थान मिळू शकले नाही. कृपया ब्राउझर परवानग्या तपासा.",
      speechError: (error: string) => `बोलण्यात त्रुटी: ${error}. कृपया पुन्हा प्रयत्न करा.`,
    },
  },
  pa: { 
    menu: { chatbot: "ਚੈਟ ਬੋਟ" }, 
    chatbotUI: { 
      online: "ਆਨਲਾਈਨ", 
      initialMessage: { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕ੍ਰਿਸ਼ੀ-ਮਿੱਤਰ ਹਾਂ, ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ।", html: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ <strong>ਕ੍ਰਿਸ਼ੀ-ਮਿੱਤਰ</strong> ਹਾਂ, ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ।" }, 
      initialSuggestions: ["ਮੇਰੇ ਖੇਤਰ ਲਈ ਕਿਹੜੀਆਂ ਫਸਲਾਂ ਢੁਕਵੀਆਂ ਹਨ?", "ਇਸ ਪੌਦੇ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ ਕਰੋ", "ਮੈਨੂੰ ਝੋਨਾ ਕਦੋਂ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?"], 
      thinking: "ਸੋਚ ਰਿਹਾ ਹਾਂ...", 
      placeholder: "ਖੇਤੀਬਾੜੀ ਦਾ ਸਵਾਲ ਪੁੱਛੋ...", 
      fetchingLocation: "ਖੋਜ ਰਿਹਾ ਹੈ...", 
      shareLocation: "ਸਥਾਨ ਸਾਂਝਾ ਕਰੋ", 
      locationError: "ਸਥਾਨ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਬ੍ਰਾਊਜ਼ਰ ਅਨੁਮਤੀਆਂ ਦੀ ਜਾਂਚ ਕਰੋ।", 
      speechError: (e) => `ਬੋਲਣ ਵਿੱਚ ਗਲਤੀ: ${e}` 
    }
  },
  kn: { 
    menu: { chatbot: "ಚಾಟ್ ಬೋಟ್" }, 
    chatbotUI: { 
      online: "ಆನ್‌ಲೈನ್", 
      initialMessage: { text: "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿ-ಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ.", html: "ನಮಸ್ಕಾರ! ನಾನು <strong>ಕೃಷಿ-ಮಿತ್ರ</strong>, ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ." }, 
      initialSuggestions: ["ನನ್ನ ಪ್ರದೇಶಕ್ಕೆ ಯಾವ ಬೆಳೆಗಳು ಸೂಕ್ತ?", "ಈ ಸಸ್ಯದ ರೋಗವನ್ನು ಗುರುತಿಸಿ", "ನಾನು ಭತ್ತವನ್ನು ಯಾವಾಗ ನೆಡಬೇಕು?"], 
      thinking: "ಯೋಚಿಸುತ್ತಿದೆ...", 
      placeholder: "ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...", 
      fetchingLocation: "ಪಡೆಯುತ್ತಿದೆ...", 
      shareLocation: "ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ", 
      locationError: "ಸ್ಥಳವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ। ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ।", 
      speechError: (e) => `ಮಾತಿನ ದೋಷ: ${e}` 
    }
  },
  ta: { 
    menu: { chatbot: "அரட்டை போட்" }, 
    chatbotUI: { 
      online: "ஆன்லைனில்", 
      initialMessage: { text: "வணக்கம்! நான் கிருஷி-மித்ரா, உங்கள் விவசாய உதவியாளர்.", html: "வணக்கம்! நான் <strong>கிருஷி-மித்ரா</strong>, உங்கள் விவசாய உதவியாளர்." }, 
      initialSuggestions: ["என் பகுதிக்கு எந்த பயிர்கள் ஏற்றது?", "இந்த தாவர நோயை அடையாளம் காணவும்", "நான் எப்போது நெல் நடவு செய்ய வேண்டும்?"], 
      thinking: "சிந்திக்கிறேன்...", 
      placeholder: "விவசாயம் தொடர்பான கேள்வி கேளுங்கள்...", 
      fetchingLocation: "பெறப்படுகிறது...", 
      shareLocation: "இருப்பிடத்தைப் பகிரவும்", 
      locationError: "இருப்பிடத்தைப் பெற முடியவில்லை। உலாவியின் அனுமதிகளைச் சரிபார்க்கவும்।", 
      speechError: (e) => `பேச்சுப் பிழை: ${e}` 
    }
  },
};