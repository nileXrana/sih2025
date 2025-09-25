// Translation configurations for the healthcare system
export type Language = 'en' | 'hi' | 'pa';

export interface Translations {
  [key: string]: {
    en: string | string[];
    hi: string | string[];
    pa: string | string[];
  };
}

export const translations: Translations = {
  // Header
  appTitle: {
    en: "Nabha Sehat Saathi",
    hi: "नाभा सेहत साथी",
    pa: "ਨਾਭਾ ਸਿਹਤ ਸਾਥੀ"
  },
  
  // Hero Section
  heroTitle: {
    en: "Decentralized Healthcare Solution",
    hi: "विकेंद्रीकृत स्वास्थ्य सेवा समाधान",
    pa: "ਵਿਕੇਂਦਰੀਕਰਤ ਸਿਹਤ ਸੇਵਾ ਸਮਾਧਾਨ"
  },
  
  heroSubtitle: {
    en: "Connecting Rural MI Rooms of 173 Villages with Nabha Civil Hospital",
    hi: "173 गांवों के ग्रामीण MI रूम को नाभा सिविल अस्पताल से जोड़ना",
    pa: "173 ਪਿੰਡਾਂ ਦੇ ਦਿਹਾਤੀ MI ਰੂਮ ਨੂੰ ਨਾਭਾ ਸਿਵਲ ਹਸਪਤਾਲ ਨਾਲ ਜੋੜਨਾ"
  },
  
  // MI Room Portal
  miRoomTitle: {
    en: "MI Room Incharge",
    hi: "MI रूम प्रभारी",
    pa: "MI ਰੂਮ ਇੰਚਾਰਜ"
  },
  
  miRoomDescription: {
    en: "Register patients, conduct initial examinations, record vital signs, and connect with doctors for consultations.",
    hi: "मरीजों को पंजीकृत करें, प्रारंभिक जांच करें, महत्वपूर्ण संकेत रिकॉर्ड करें, और सलाह के लिए डॉक्टरों से जुड़ें।",
    pa: "ਮਰੀਜ਼ਾਂ ਨੂੰ ਰਜਿਸਟਰ ਕਰੋ, ਸ਼ੁਰੂਆਤੀ ਜਾਂਚ ਕਰੋ, ਮਹੱਤਵਪੂਰਨ ਸੰਕੇਤ ਰਿਕਾਰਡ ਕਰੋ, ਅਤੇ ਸਲਾਹ ਲਈ ਡਾਕਟਰਾਂ ਨਾਲ ਜੁੜੋ।"
  },
  
  miRoomFeatures: {
    en: ["Patient registration and management", "Vital signs recording", "Virtual doctor consultations", "Appointment scheduling"],
    hi: ["रोगी पंजीकरण और प्रबंधन", "महत्वपूर्ण संकेत रिकॉर्डिंग", "वर्चुअल डॉक्टर परामर्श", "अपॉइंटमेंट शेड्यूलिंग"],
    pa: ["ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਪ੍ਰਬੰਧਨ", "ਮਹੱਤਵਪੂਰਨ ਸੰਕੇਤ ਰਿਕਾਰਡਿੰਗ", "ਵਰਚੁਅਲ ਡਾਕਟਰ ਸਲਾਹ", "ਮੁਲਾਕਾਤ ਸਮਾਂ ਨਿਰਧਾਰਣ"]
  },
  
  miRoomLogin: {
    en: "MI Room Login",
    hi: "MI रूम लॉगिन",
    pa: "MI ਰੂਮ ਲਾਗਇਨ"
  },
  
  // Doctor Portal
  doctorTitle: {
    en: "Hospital Doctor",
    hi: "अस्पताल डॉक्टर",
    pa: "ਹਸਪਤਾਲ ਡਾਕਟਰ"
  },
  
  doctorDescription: {
    en: "Review consultation requests, access patient records, conduct virtual consultations, and manage referrals.",
    hi: "परामर्श अनुरोधों की समीक्षा करें, रोगी रिकॉर्ड तक पहुंचें, वर्चुअल परामर्श करें, और रेफरल प्रबंधित करें।",
    pa: "ਸਲਾਹ ਬੇਨਤੀਆਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ, ਮਰੀਜ਼ ਰਿਕਾਰਡ ਤੱਕ ਪਹੁੰਚ ਕਰੋ, ਵਰਚੁਅਲ ਸਲਾਹ ਕਰੋ, ਅਤੇ ਰੈਫਰਲ ਪ੍ਰਬੰਧਿਤ ਕਰੋ।"
  },
  
  doctorFeatures: {
    en: ["Real-time consultation queue", "Complete patient history access", "Virtual consultations", "E-prescription management"],
    hi: ["रियल-टाइम परामर्श कतार", "पूर्ण रोगी इतिहास पहुंच", "वर्चुअल परामर्श", "ई-प्रिस्क्रिप्शन प्रबंधन"],
    pa: ["ਰੀਅਲ-ਟਾਈਮ ਸਲਾਹ ਕਤਾਰ", "ਪੂਰਾ ਮਰੀਜ਼ ਇਤਿਹਾਸ ਪਹੁੰਚ", "ਵਰਚੁਅਲ ਸਲਾਹ", "ਈ-ਨੁਸਖਾ ਪ੍ਰਬੰਧਨ"]
  },
  
  doctorLogin: {
    en: "Doctor Login",
    hi: "डॉक्टर लॉगिन",
    pa: "ਡਾਕਟਰ ਲਾਗਇਨ"
  },
  
  // System Benefits
  systemBenefitsTitle: {
    en: "System Benefits",
    hi: "सिस्टम के फायदे",
    pa: "ਸਿਸਟਮ ਦੇ ਫਾਇਦੇ"
  },
  
  reducedLoadTitle: {
    en: "Reduced Doctor Load",
    hi: "डॉक्टर का कम बोझ",
    pa: "ਘਟਿਆ ਡਾਕਟਰ ਲੋਡ"
  },
  
  reducedLoadDesc: {
    en: "Filters 60-70% of non-critical cases, allowing doctors to focus on patients who need expertise.",
    hi: "60-70% गैर-महत्वपूर्ण मामलों को फिल्टर करता है, जिससे डॉक्टर उन मरीजों पर ध्यान दे सकते हैं जिन्हें विशेषज्ञता की आवश्यकता है।",
    pa: "60-70% ਗੈਰ-ਮਹੱਤਵਪੂਰਨ ਮਾਮਲਿਆਂ ਨੂੰ ਫਿਲਟਰ ਕਰਦਾ ਹੈ, ਡਾਕਟਰਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਮਰੀਜ਼ਾਂ 'ਤੇ ਧਿਆਨ ਦੇਣ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਨੂੰ ਮਾਹਰਤਾ ਦੀ ਲੋੜ ਹੈ।"
  },
  
  improvedAccessTitle: {
    en: "Improved Access",
    hi: "बेहतर पहुंच",
    pa: "ਸੁਧਾਰੀ ਪਹੁੰਚ"
  },
  
  improvedAccessDesc: {
    en: "Patients get healthcare services in their villages without traveling long distances.",
    hi: "मरीजों को अपने गांवों में स्वास्थ्य सेवाएं मिलती हैं बिना लंबी दूरी तय किए बिना।",
    pa: "ਮਰੀਜ਼ਾਂ ਨੂੰ ਆਪਣੇ ਪਿੰਡਾਂ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾਵਾਂ ਮਿਲਦੀਆਂ ਹਨ ਲੰਬੀ ਦੂਰੀ ਦੀ ਯਾਤਰਾ ਕੀਤੇ ਬਿਨਾਂ।"
  },
  
  efficientTriageTitle: {
    en: "Efficient Triage",
    hi: "कुशल ट्राइएज",
    pa: "ਕੁਸ਼ਲ ਟਰਾਈਏਜ"
  },
  
  efficientTriageDesc: {
    en: "Smart system to differentiate between minor and critical cases for better resource allocation.",
    hi: "बेहतर संसाधन आवंटन के लिए मामूली और गंभीर मामलों के बीच अंतर करने के लिए स्मार्ट सिस्टम।",
    pa: "ਬਿਹਤਰ ਸਰੋਤ ਵੰਡ ਲਈ ਮਾਮੂਲੀ ਅਤੇ ਗੰਭੀਰ ਮਾਮਲਿਆਂ ਵਿਚਕਾਰ ਅੰਤਰ ਕਰਨ ਲਈ ਸਮਾਰਟ ਸਿਸਟਮ।"
  },
  
  // Village Awareness
  villageAwarenessTitle: {
    en: "🏥 Healthcare at Your Doorstep!",
    hi: "🏥 आपके दरवाजे पर स्वास्थ्य सेवा!",
    pa: "🏥 ਆਪਣੇ ਪਿੰਡ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ!"
  },
  
  villageAwarenessSubtitle: {
    en: "Healthcare at Your Doorstep!",
    hi: "आपके दरवाजे पर स्वास्थ्य सेवा!",
    pa: "ਤੁਹਾਡੇ ਦਰਵਾਜ਼ੇ 'ਤੇ ਸਿਹਤ ਸੇਵਾ!"
  },
  
  villageAwarenessDesc: {
    en: "Every village now has an MI Room facility! Tell your neighbors, friends, and family members about this amazing healthcare service. Visit your local MI Room for health checkups, connect with expert doctors virtually, and get treatment without traveling far. Help spread awareness - Every village deserves better healthcare!",
    hi: "अब हर गांव में MI रूम की सुविधा है! इस अद्भुत स्वास्थ्य सेवा के बारे में अपने पड़ोसियों, दोस्तों और परिवार के सदस्यों को बताएं। स्वास्थ्य जांच के लिए अपने स्थानीय MI रूम पर जाएं, विशेषज्ञ डॉक्टरों से वर्चुअल रूप से जुड़ें, और दूर यात्रा किए बिना इलाज करवाएं। जागरूकता फैलाने में मदद करें - हर गांव बेहतर स्वास्थ्य सेवा का हकदार है!",
    pa: "ਹੁਣ ਹਰ ਪਿੰਡ ਵਿੱਚ MI ਰੂਮ ਦੀ ਸਹੂਲਤ ਹੈ! ਇਸ ਸ਼ਾਨਦਾਰ ਸਿਹਤ ਸੇਵਾ ਬਾਰੇ ਆਪਣੇ ਗੁਆਂਢੀਆਂ, ਦੋਸਤਾਂ ਅਤੇ ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਨੂੰ ਦੱਸੋ। ਸਿਹਤ ਜਾਂਚ ਲਈ ਆਪਣੇ ਸਥਾਨਕ MI ਰੂਮ ਵਿੱਚ ਜਾਓ, ਮਾਹਰ ਡਾਕਟਰਾਂ ਨਾਲ ਵਰਚੁਅਲ ਰੂਪ ਵਿੱਚ ਜੁੜੋ, ਅਤੇ ਦੂਰ ਯਾਤਰਾ ਕੀਤੇ ਬਿਨਾਂ ਇਲਾਜ ਕਰਵਾਓ। ਜਾਗਰੂਕਤਾ ਫੈਲਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰੋ - ਹਰ ਪਿੰਡ ਬਿਹਤਰ ਸਿਹਤ ਸੇਵਾ ਦਾ ਹੱਕਦਾਰ ਹੈ!"
  },
  
  // Benefits Tags
  freeCheckups: {
    en: "✅ Free Checkups",
    hi: "✅ मुफ्त जांच",
    pa: "✅ ਮੁਫਤ ਜਾਂਚ"
  },
  
  expertDoctors: {
    en: "👨‍⚕️ Expert Doctors",
    hi: "👨‍⚕️ विशेषज्ञ डॉक्टर",
    pa: "👨‍⚕️ ਮਾਹਰ ਡਾਕਟਰ"
  },
  
  villageLocation: {
    en: "🏠 Village Location",
    hi: "🏠 गांव की स्थिति",
    pa: "🏠 ਪਿੰਡ ਦੀ ਸਥਿਤੀ"
  },
  
  saveMoneyTime: {
    en: "💸 Save Money & Time",
    hi: "💸 पैसे और समय बचाएं",
    pa: "💸 ਪੈਸੇ ਅਤੇ ਸਮਾਂ ਬਚਾਓ"
  },
  
  // Footer
  footerText: {
    en: "Healthcare Hub-and-Spoke System - Connecting Rural Health with Expert Care",
    hi: "हेल्थकेयर हब-एंड-स्पोक सिस्टम - ग्रामीण स्वास्थ्य को विशेषज्ञ देखभाल से जोड़ना",
    pa: "ਹੈਲਥਕੇਅਰ ਹੱਬ-ਐਂਡ-ਸਪੋਕ ਸਿਸਟਮ - ਦਿਹਾਤੀ ਸਿਹਤ ਨੂੰ ਮਾਹਰ ਦੇਖਭਾਲ ਨਾਲ ਜੋੜਨਾ"
  },
  
  demoInstructions: {
    en: "📋 View Demo Instructions & Testing Guide",
    hi: "📋 डेमो निर्देश और परीक्षण गाइड देखें",
    pa: "📋 ਡੈਮੋ ਹਦਾਇਤਾਂ ਅਤੇ ਟੈਸਟਿੰਗ ਗਾਈਡ ਦੇਖੋ"
  }
};

export function getTranslation(key: string, language: Language): string | string[] {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  return translation[language];
}

export function getTranslationArray(key: string, language: Language): string[] {
  const translation = getTranslation(key, language);
  return Array.isArray(translation) ? translation : [translation as string];
}