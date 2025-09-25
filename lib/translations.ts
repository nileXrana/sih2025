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
  },

  // MI Room Dashboard
  dashboardTitle: {
    en: "MI Room Dashboard",
    hi: "MI रूम डैशबोर्ड",
    pa: "MI ਰੂਮ ਡੈਸ਼ਬੋਰਡ"
  },
  
  welcomeMessage: {
    en: "Welcome",
    hi: "स्वागत है",
    pa: "ਸਵਾਗਤ ਹੈ"
  },
  
  logout: {
    en: "Logout",
    hi: "लॉग आउट",
    pa: "ਲਾਗ ਆਊਟ"
  },
  
  // Dashboard Tabs
  overview: {
    en: "Overview",
    hi: "अवलोकन",
    pa: "ਸੰਖੇਪ"
  },
  
  patientRegistration: {
    en: "Patient Registration",
    hi: "रोगी पंजीकरण",
    pa: "ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ"
  },
  
  symptomDetection: {
    en: "Symptom Detection",
    hi: "लक्षण पहचान",
    pa: "ਲੱਛਣ ਪਛਾਣ"
  },
  
  // Overview Tab
  totalPatients: {
    en: "Total Patients",
    hi: "कुल मरीज़",
    pa: "ਕੁੱਲ ਮਰੀਜ਼"
  },
  
  todayConsultations: {
    en: "Today's Consultations",
    hi: "आज के परामर्श",
    pa: "ਅੱਜ ਦੇ ਸਲਾਹ"
  },
  
  avgWaitTime: {
    en: "Avg. Wait Time",
    hi: "औसत प्रतीक्षा समय",
    pa: "ਔਸਤ ਉਡੀਕ ਸਮਾਂ"
  },
  
  recentPatients: {
    en: "Recent Patients",
    hi: "हाल के मरीज़",
    pa: "ਹਾਲ ਦੇ ਮਰੀਜ਼"
  },
  
  videoCall: {
    en: "Video Call",
    hi: "वीडियो कॉल",
    pa: "ਵੀਡੀਓ ਕਾਲ"
  },
  
  // Patient Registration Form
  patientName: {
    en: "Patient Name",
    hi: "मरीज़ का नाम",
    pa: "ਮਰੀਜ਼ ਦਾ ਨਾਮ"
  },
  
  age: {
    en: "Age",
    hi: "उम्र",
    pa: "ਉਮਰ"
  },
  
  gender: {
    en: "Gender",
    hi: "लिंग",
    pa: "ਜਿਨਸ"
  },
  
  male: {
    en: "Male",
    hi: "पुरुष",
    pa: "ਮਰਦ"
  },
  
  female: {
    en: "Female",
    hi: "महिला",
    pa: "ਔਰਤ"
  },
  
  phoneNumber: {
    en: "Phone Number",
    hi: "फ़ोन नंबर",
    pa: "ਫੋਨ ਨੰਬਰ"
  },
  
  address: {
    en: "Address",
    hi: "पता",
    pa: "ਪਤਾ"
  },
  
  village: {
    en: "Village",
    hi: "गांव",
    pa: "ਪਿੰਡ"
  },
  
  aadharNumber: {
    en: "Aadhar Number",
    hi: "आधार संख्या",
    pa: "ਆਧਾਰ ਨੰਬਰ"
  },
  
  bloodGroup: {
    en: "Blood Group",
    hi: "रक्त समूह",
    pa: "ਖੂਨ ਦਾ ਗਰੁੱਪ"
  },
  
  allergies: {
    en: "Allergies",
    hi: "एलर्जी",
    pa: "ਐਲਰਜੀ"
  },
  
  registerPatient: {
    en: "Register Patient",
    hi: "मरीज़ रजिस्टर करें",
    pa: "ਮਰੀਜ਼ ਰਜਿਸਟਰ ਕਰੋ"
  },
  
  registering: {
    en: "Registering...",
    hi: "पंजीकरण हो रहा है...",
    pa: "ਰਜਿਸਟਰ ਹੋ ਰਿਹਾ ਹੈ..."
  },
  
  // Symptom Detection
  selectPatient: {
    en: "Select Patient",
    hi: "मरीज़ चुनें",
    pa: "ਮਰੀਜ਼ ਚੁਣੋ"
  },
  
  enterSymptoms: {
    en: "Enter symptoms reported by the patient",
    hi: "मरीज़ द्वारा बताए गए लक्षण दर्ज करें",
    pa: "ਮਰੀਜ਼ ਦੁਆਰਾ ਦੱਸੇ ਗਏ ਲੱਛਣ ਦਰਜ ਕਰੋ"
  },
  
  symptoms: {
    en: "Symptoms",
    hi: "लक्षण",
    pa: "ਲੱਛਣ"
  },
  
  vitalSigns: {
    en: "Vital Signs",
    hi: "महत्वपूर्ण संकेत",
    pa: "ਮਹੱਤਵਪੂਰਨ ਸੰਕੇਤ"
  },
  
  bloodPressure: {
    en: "Blood Pressure",
    hi: "रक्तचाप",
    pa: "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ"
  },
  
  temperature: {
    en: "Temperature (°F)",
    hi: "तापमान (°F)",
    pa: "ਤਾਪਮਾਨ (°F)"
  },
  
  heartRate: {
    en: "Heart Rate (bpm)",
    hi: "हृदय गति (bpm)",
    pa: "ਦਿਲ ਦੀ ਗਤੀ (bpm)"
  },
  
  respiratoryRate: {
    en: "Respiratory Rate",
    hi: "श्वसन दर",
    pa: "ਸਾਹ ਦੀ ਗਤੀ"
  },
  
  oxygenSaturation: {
    en: "Oxygen Saturation (%)",
    hi: "ऑक्सीजन संतृप्ति (%)",
    pa: "ਆਕਸੀਜਨ ਸੰਤ੍ਰਿਪਤਾ (%)"
  },
  
  analyzeSymptoms: {
    en: "Analyze Symptoms",
    hi: "लक्षणों का विश्लेषण करें",
    pa: "ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ"
  },
  
  analyzing: {
    en: "Analyzing...",
    hi: "विश्लेषण हो रहा है...",
    pa: "ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ..."
  },
  
  aiAnalysisResults: {
    en: "AI Analysis Results",
    hi: "AI विश्लेषण परिणाम",
    pa: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ"
  },
  
  urgencyLevel: {
    en: "Urgency Level",
    hi: "तात्कालिकता स्तर",
    pa: "ਤਤਕਾਲਤਾ ਪੱਧਰ"
  },
  
  possibleConditions: {
    en: "Possible Conditions",
    hi: "संभावित स्थितियां",
    pa: "ਸੰਭਾਵਿਤ ਸਥਿਤੀਆਂ"
  },
  
  recommendations: {
    en: "Recommendations",
    hi: "सिफारिशें",
    pa: "ਸਿਫਾਰਸ਼ਾਂ"
  },
  
  doctorConsultationNeeded: {
    en: "Doctor consultation needed",
    hi: "डॉक्टर से परामर्श आवश्यक",
    pa: "ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਦੀ ਲੋੜ ਹੈ"
  },
  
  startVideoConsultation: {
    en: "Start Video Consultation",
    hi: "वीडियो परामर्श शुरू करें",
    pa: "ਵੀਡੀਓ ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ"
  },
  
  saveAnalysis: {
    en: "💾 Save Analysis",
    hi: "💾 विश्लेषण सहेजें",
    pa: "💾 ਵਿਸ਼ਲੇਸ਼ਣ ਸੇਵ ਕਰੋ"
  },
  
  printReport: {
    en: "📋 Print Report",
    hi: "📋 रिपोर्ट प्रिंট करें",
    pa: "📋 ਰਿਪੋਰਟ ਪ੍ਰਿੰਟ ਕਰੋ"
  },

  // Login Page
  miRoomInchargeLogin: {
    en: "MI Room Incharge Login",
    hi: "MI रूम प्रभारी लॉगिन",
    pa: "MI ਰੂਮ ਇੰਚਾਰਜ ਲਾਗਇਨ"
  },
  
  hospitalDoctorLogin: {
    en: "Hospital Doctor Login",
    hi: "अस्पताल डॉक्टर लॉगिन",
    pa: "ਹਸਪਤਾਲ ਡਾਕਟਰ ਲਾਗਇਨ"
  },
  
  pleaseSignIn: {
    en: "Please sign in to continue",
    hi: "जारी रखने के लिए कृपया साइन इन करें",
    pa: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ ਇਨ ਕਰੋ"
  },
  
  prototypeMode: {
    en: "🚀 Prototype Mode: Direct Access",
    hi: "🚀 प्रोटोटाइप मोड: सीधी पहुंच",
    pa: "🚀 ਪ੍ਰੋਟੋਟਾਈਪ ਮੋਡ: ਸਿੱਧੀ ਪਹੁੰਚ"
  },
  
  prototypeInstructions: {
    en: "Enter any email and password to access the dashboard instantly",
    hi: "डैशबोर्ड तक तुरंत पहुंचने के लिए कोई भी ईमेल और पासवर्ड दर्ज करें",
    pa: "ਡੈਸ਼ਬੋਰਡ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚਣ ਲਈ ਕੋਈ ਵੀ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ"
  },
  
  emailAddress: {
    en: "Email Address",
    hi: "ईमेल पता",
    pa: "ਈਮੇਲ ਪਤਾ"
  },
  
  password: {
    en: "Password",
    hi: "पासवर्ड",
    pa: "ਪਾਸਵਰਡ"
  },
  
  emailPlaceholderMI: {
    en: "e.g., incharge@miroom.com",
    hi: "जैसे, incharge@miroom.com",
    pa: "ਜਿਵੇਂ, incharge@miroom.com"
  },
  
  emailPlaceholderDoctor: {
    en: "e.g., doctor@hospital.com",
    hi: "जैसे, doctor@hospital.com",
    pa: "ਜਿਵੇਂ, doctor@hospital.com"
  },
  
  passwordPlaceholder: {
    en: "Enter any password (demo mode)",
    hi: "कोई भी पासवर्ड दर्ज करें (डेमो मोड)",
    pa: "ਕੋਈ ਵੀ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ (ਡੈਮੋ ਮੋਡ)"
  },
  
  fillAllFields: {
    en: "Please fill in all fields",
    hi: "कृपया सभी फ़ील्ड भरें",
    pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ"
  },
  
  signIn: {
    en: "Sign In",
    hi: "साइन इन करें",
    pa: "ਸਾਈਨ ਇਨ ਕਰੋ"
  },
  
  signingIn: {
    en: "Signing in...",
    hi: "साइन इन हो रहा है...",
    pa: "ਸਾਈਨ ਇਨ ਹੋ ਰਿਹਾ ਹੈ..."
  },
  
  backToHome: {
    en: "← Back to Home",
    hi: "← होम पर वापस",
    pa: "← ਘਰ ਵਾਪਸ"
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