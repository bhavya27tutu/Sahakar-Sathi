/**
 * Sahakar Sathi — AI-powered legal & citizen assistance platform (prototype)
 * Zero-dependency Node.js server.
 *
 * Pipeline (Technical USP):  Retrieve → Verify → Generate → Cite
 *   1. Retrieve   — intent + keyword scoring over the verified knowledge base
 *   2. Verify     — confidence threshold; refuse to answer below it (no guessing)
 *   3. Generate   — compose answer strictly from retrieved, source-backed content
 *   4. Cite       — attach official sources & next actions ("Ask → Understand → Act")
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const KB = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'kb.json'), 'utf8'));

/* ------------------------------------------------------------------ *
 *  i18n strings (UI chrome + message-level labels)
 * ------------------------------------------------------------------ */
const STRINGS = {
  en: {
    greeting: "Namaste! I'm Sahakar Sathi. Ask me about cooperative rights, membership, schemes or grievances — I answer only from verified official sources.",
    askLabel: "What you asked",
    verifiedLabel: "Verified answer",
    relatedLabel: "Related information — please verify with official sources",
    actLabel: "Next steps — Act",
    docsLabel: "Documents you may need",
    sourcesLabel: "Official sources",
    noAnswer: "I don't have verified information on that yet. To avoid giving wrong guidance, I won't guess.",
    noAnswerHint: "Try rephrasing, or contact your District Registrar of Cooperative Societies / the Ministry of Cooperation portal.",
    listen: "Listen",
    stop: "Stop",
    relatedQ: "Related questions",
    jurisdiction: "Jurisdiction",
    disclaimer: "Simplified guidance from official sources — not a substitute for legal advice.",
    stateNote: "Selected jurisdiction: {state}. State-specific rules may differ — confirm with your State Cooperative Department.",
    fallbackSources: "Official portals to check:",
    askFollowUp: "Ask a follow-up question"
  },
  hi: {
    greeting: "नमस्ते! मैं सहकार साथी हूँ। सहकारी अधिकार, सदस्यता, योजनाओं या शिकायतों के बारे में पूछें — मैं केवल सत्यापित आधिकारिक स्रोतों से उत्तर देता हूँ।",
    askLabel: "आपने क्या पूछा",
    verifiedLabel: "सत्यापित उत्तर",
    relatedLabel: "संबंधित जानकारी — कृपया आधिकारिक स्रोतों से पुष्टि करें",
    actLabel: "अगले कदम — करें",
    docsLabel: "ज़रूरी दस्तावेज़",
    sourcesLabel: "आधिकारिक स्रोत",
    noAnswer: "इस पर मेरे पास अभी सत्यापित जानकारी नहीं है। गलत मार्गदर्शन से बचने के लिए मैं अनुमान नहीं लगाऊँगा।",
    noAnswerHint: "प्रश्न दोबारा लिखकर पूछें, या अपने ज़िला सहकारी पंजीयक / सहकारिता मंत्रालय के पोर्टल से संपर्क करें।",
    listen: "सुनें",
    stop: "रोकें",
    relatedQ: "संबंधित प्रश्न",
    jurisdiction: "क्षेत्राधिकार",
    disclaimer: "आधिकारिक स्रोतों से सरल मार्गदर्शन — कानूनी सलाह का विकल्प नहीं।",
    stateNote: "चयनित क्षेत्राधिकार: {state}। राज्य-विशिष्ट नियम भिन्न हो सकते हैं — राज्य सहकारी विभाग से पुष्टि करें।",
    fallbackSources: "जाँचने के लिए आधिकारिक पोर्टल:",
    askFollowUp: "अगला प्रश्न पूछें"
  },
  mr: {
    greeting: "नमस्कार! मी सहकार साथी आहे. सहकारी अधिकार, सदस्यत्व, योजना किंवा तक्रारींबद्दल विचारा — मी केवळ पडताळलेल्या अधिकृत स्रोतांतून उत्तर देतो.",
    askLabel: "आपण काय विचारले",
    verifiedLabel: "पडताळलेले उत्तर",
    relatedLabel: "संबंधित माहिती — कृपया अधिकृत स्रोतांतून पडताळा",
    actLabel: "पुढील पावले — करा",
    docsLabel: "आवश्यक कागदपत्रे",
    sourcesLabel: "अधिकृत स्रोत",
    noAnswer: "याबद्दल माझ्याकडे अद्याप पडताळलेली माहिती नाही. चुकीच्या मार्गदर्शनापासून टाळण्यासाठी मी अंदाज करणार नाही.",
    noAnswerHint: "प्रश्न पुन्हा विचारा किंवा आपल्या जिल्हा सहकारी नोंदणीकर्त्याकडे / सहकारिता मंत्रालयाच्या पोर्टलशी संपर्क साधा.",
    listen: "ऐका",
    stop: "थांबवा",
    relatedQ: "संबंधित प्रश्न",
    jurisdiction: "कार्यक्षेत्र",
    disclaimer: "अधिकृत स्रोतांतून सुलभ मार्गदर्शन — कायदेशीर सल्लाचा पर्याय नाही.",
    stateNote: "निवडलेले कार्यक्षेत्र: {state}. राज्य-विशिष्ट नियम वेगळे असू शकतात — राज्य सहकारी विभागाशी पडताळा.",
    fallbackSources: "तपासण्यासाठी अधिकृत पोर्टल:",
    askFollowUp: "पुढील प्रश्न विचारा"
  },
  ta: {
    greeting: "வணக்கம்! நான் சகாகர் சாத்தி. கூட்டுறவு உரிமைகள், உறுப்பினராகுதல், திட்டங்கள் அல்லது புகார்கள் குறித்து கேளுங்கள் — சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ மூலங்களிலிருந்து மட்டுமே பதில் அளிப்பேன்.",
    askLabel: "நீங்கள் கேட்டது",
    verifiedLabel: "சரிபார்க்கப்பட்ட பதில்",
    relatedLabel: "தொடர்புடைய தகவல் — அதிகாரப்பூர்வ மூலங்களுடன் சரிபார்க்கவும்",
    actLabel: "அடுத்த படிகள் — செயல்படுத்துங்கள்",
    docsLabel: "தேவையான ஆவணங்கள்",
    sourcesLabel: "அதிகாரப்பூர்வ மூலங்கள்",
    noAnswer: "இதுகுறித்து என்னிடம் இன்னும் சரிபார்க்கப்பட்ட தகவல் இல்லை. தவறான வழிகாட்டுதலைத் தவிர்க்க, நான் யூகிக்க மாட்டேன்.",
    noAnswerHint: "கேள்வியை மாற்றிக் கேளுங்கள், அல்லது உங்கள் மாவட்ட கூட்டுறவு பதிவாளர் / கூட்டுறவுத் துறை இணையதளத்தைத் தொடர்புகொள்ளுங்கள்.",
    listen: "கேளுங்கள்",
    stop: "நிறுத்து",
    relatedQ: "தொடர்புடைய கேள்விகள்",
    jurisdiction: "அதிகார வரம்பு",
    disclaimer: "அதிகாரப்பூர்வ மூலங்களிலிருந்து எளிமையான வழிகாட்டுதல் — சட்ட ஆலோசனைக்கு மாற்றல் அல்ல.",
    stateNote: "தேர்ந்தெடுக்கப்பட்ட அதிகார வரம்பு: {state}. மாநில விதிகள் வேறுபடலாம் — மாநில கூட்டுறவுத் துறையுடன் உறுதிப்படுத்திக்கொள்ளுங்கள்.",
    fallbackSources: "சரிபார்க்க வேண்டிய அதிகாரப்பூர்வ இணையதளங்கள்:",
    askFollowUp: "அடுத்த கேள்வியைக் கேளுங்கள்"
  },
  bn: {
    greeting: "নমস্কার! আমি সহকার সাথী। সমবায় অধিকার, সদস্যপদ, প্রকল্প বা অভিযোগ সম্পর্কে জিজ্ঞাসা করুন — আমি শুধু যাচাইকৃত সরকারি উৎস থেকে উত্তর দিই।",
    askLabel: "আপনি যা জিজ্ঞাসা করেছেন",
    verifiedLabel: "যাচাইকৃত উত্তর",
    relatedLabel: "সম্পর্কিত তথ্য — সরকারি উৎস থেকে যাচাই করুন",
    actLabel: "পরবর্তী পদক্ষেপ — করুন",
    docsLabel: "প্রয়োজনীয় নথি",
    sourcesLabel: "সরকারি উৎস",
    noAnswer: "এ বিষয়ে আমার কাছে এখনো যাচাইকৃত তথ্য নেই। ভুল নির্দেশনা এড়াতে আমি অনুমান করব না।",
    noAnswerHint: "প্রশ্নটি পুনরায় লিখে জিজ্ঞাসা করুন, অথবা আপনার জেলা সমবায় নিবন্ধক / সমবায় মন্ত্রণালয়ের পোর্টালে যোগাযোগ করুন।",
    listen: "শুনুন",
    stop: "থামুন",
    relatedQ: "সম্পর্কিত প্রশ্ন",
    jurisdiction: "এখতিয়ার",
    disclaimer: "সরকারি উৎস থেকে সহজ নির্দেশনা — আইনি পরামর্শের বিকল্প নয়।",
    stateNote: "নির্বাচিত এখতিয়ার: {state}। রাজ্য-নির্দিষ্ট নিয়ম ভিন্ন হতে পারে — রাজ্য সমবায় বিভাগের সঙ্গে নিশ্চিত করুন।",
    fallbackSources: "যাচাই করার জন্য সরকারি পোর্টাল:",
    askFollowUp: "পরবর্তী প্রশ্ন করুন"
  },
  te: {
    greeting: "నమస్కారం! నేను సహకార్ సాథి. సహకార హక్కులు, సభ్యత్వం, పథకాలు లేదా ఫిర్యాదుల గురించి అడగండి — ధృవీకరించబడిన అధికారిక మూలాల నుండి మాత్రమే సమాధానం ఇస్తాను.",
    askLabel: "మీరు అడిగింది",
    verifiedLabel: "ధృవీకరించబడిన సమాధానం",
    relatedLabel: "సంబంధిత సమాచారం — అధికారిక మూలాలతో నిర్ధారించుకోండి",
    actLabel: "తదుపరి దశలు — చేయండి",
    docsLabel: "అవసరమైన పత్రాలు",
    sourcesLabel: "అధికారిక మూలాలు",
    noAnswer: "దీనిపై నా వద్ద ఇంకా ధృవీకరించబడిన సమాచారం లేదు. తప్పుడు మార్గదర్శనం నివారించడానికి నేను ఊహించను.",
    noAnswerHint: "ప్రశ్నను మార్చి అడగండి, లేదా మీ జిల్లా సహకార రిజిస్ట్రార్ / సహకార శాఖ పోర్టల్‌ను సంప్రదించండి.",
    listen: "వినండి",
    stop: "ఆపండి",
    relatedQ: "సంబంధిత ప్రశ్నలు",
    jurisdiction: "అధికార పరిధి",
    disclaimer: "అధికారిక మూలాల నుండి సరళమైన మార్గదర్శనం — చట్టపరమైన సలహాకు ప్రత్యామ్నాయం కాదు.",
    stateNote: "ఎంపిక చేసిన అధికార పరిధి: {state}. రాష్ట్ర నిబంధనలు భిన్నంగా ఉండవచ్చు — రాష్ట్ర సహకార శాఖతో నిర్ధారించుకోండి.",
    fallbackSources: "తనిఖీ చేయడానికి అధికారిక పోర్టల్‌లు:",
    askFollowUp: "మరో ప్రశ్న అడగండి"
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಸಹಕಾರ್ ಸಾಥಿ. ಸಹಕಾರಿ ಹಕ್ಕುಗಳು, ಸದಸ್ಯತ್ವ, ಯೋಜನೆಗಳು ಅಥವಾ ದೂರುಗಳ ಬಗ್ಗೆ ಕೇಳಿ — ನಾನು ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಮಾತ್ರ ಉತ್ತರಿಸುತ್ತೇನೆ.",
    askLabel: "ನೀವು ಕೇಳಿದ್ದು",
    verifiedLabel: "ಪರಿಶೀಲಿಸಿದ ಉತ್ತರ",
    relatedLabel: "ಸಂಬಂಧಿತ ಮಾಹಿತಿ — ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ",
    actLabel: "ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು — ಕ್ರಮ ತೆಗೆದುಕೊಳ್ಳಿ",
    docsLabel: "ಬೇಕಾಗಬಹುದಾದ ದಾಖಲೆಗಳು",
    sourcesLabel: "ಅಧಿಕೃತ ಮೂಲಗಳು",
    noAnswer: "ಇದರ ಬಗ್ಗೆ ನನ್ನ ಬಳಿ ಇನ್ನೂ ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ಇಲ್ಲ. ತಪ್ಪು ಮಾರ್ಗದರ್ಶನ ನೀಡದಿರಲು ನಾನು ಊಹಿಸುವುದಿಲ್ಲ.",
    noAnswerHint: "ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಬರೆದು ಕೇಳಿ ಅಥವಾ ನಿಮ್ಮ ಜಿಲ್ಲಾ ಸಹಕಾರಿ ನೋಂದಣಿದಾರರು / ಸಹಕಾರಿತಾ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    listen: "ಕೇಳಿ", stop: "ನಿಲ್ಲಿಸಿ", relatedQ: "ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳು", jurisdiction: "ವ್ಯಾಪ್ತಿ",
    disclaimer: "ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಸರಳ ಮಾರ್ಗದರ್ಶನ — ಕಾನೂನು ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.",
    stateNote: "ಆಯ್ಕೆ ಮಾಡಿದ ವ್ಯಾಪ್ತಿ: {state}. ರಾಜ್ಯ-ವಿಶೇಷ ನಿಯಮಗಳು ಭಿನ್ನವಾಗಿರಬಹುದು — ರಾಜ್ಯ ಸಹಕಾರಿ ಇಲಾಖೆಯೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.",
    fallbackSources: "ಪರಿಶೀಲಿಸಲು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು:",
    askFollowUp: "ಮುಂದಿನ ಪ್ರಶ್ನೆ ಕೇಳಿ"
  },
  ml: {
    greeting: "നമസ്കാരം! ഞാൻ സഹകാർ സാഥി. സഹകരണ അവകാശങ്ങൾ, അംഗത്വം, പദ്ധതികൾ അല്ലെങ്കിൽ പരാതികൾ ചോദിക്കൂ — പരിശോധിച്ച ഔദ്യോഗിക ഉറവിടങ്ങളിൽ നിന്ന് മാത്രമേ ഞാൻ ഉത്തരം നൽകൂ.",
    askLabel: "നിങ്ങൾ ചോദിച്ചത്",
    verifiedLabel: "പരിശോധിച്ച ഉത്തരം",
    relatedLabel: "ബന്ധപ്പെട്ട വിവരം — ഔദ്യോഗിക ഉറവിടങ്ങളിൽ ഉറപ്പാക്കുക",
    actLabel: "അടുത്ത ഘട്ടങ്ങൾ — പ്രവർത്തിക്കൂ",
    docsLabel: "ആവശ്യമായേക്കാവുന്ന രേഖകൾ",
    sourcesLabel: "ഔദ്യോഗിക ഉറവിടങ്ങൾ",
    noAnswer: "ഇക്കാര്യത്തിൽ എന്റെ കയ്യിൽ ഇതുവരെ പരിശോധിച്ച വിവരമില്ല. തെറ്റായ നിർദ്ദേശം ഒഴിവാക്കാൻ ഞാൻ ഊഹിക്കില്ല.",
    noAnswerHint: "ചോദ്യം വീണ്ടും ചോദിക്കുക അല്ലെങ്കിൽ ജില്ലാ സഹകരണ രജിസ്ട്രാർ / സഹകരണ വകുപ്പുമായി ബന്ധപ്പെടുക.",
    listen: "കേൾക്കുക", stop: "നിർത്തുക", relatedQ: "ബന്ധപ്പെട്ട ചോദ്യങ്ങൾ", jurisdiction: "അധികാരപരിധി",
    disclaimer: "ഔദ്യോഗിക ഉറവിടങ്ങളിൽ നിന്നുള്ള ലളിതമായ നിർദ്ദേശം — നിയമോപദേശത്തിന് പകരമല്ല.",
    stateNote: "തിരഞ്ഞെടുത്ത അധികാരപരിധി: {state}. സംസ്ഥാന-നിശ്ചിത നിയമങ്ങൾ വ്യത്യസ്തമായിരിക്കാം — സംസ്ഥാന സഹകരണ വകുപ്പുമായി ഉറപ്പാക്കുക.",
    fallbackSources: "പരിശോധിക്കാനുള്ള ഔദ്യോഗിക പോർട്ടലുകൾ:",
    askFollowUp: "അടുത്ത ചോദ്യം ചോദിക്കൂ"
  },
  gu: {
    greeting: "નમસ્તે! હું સહકાર સાથી છું. સહકારી અધિકારો, સભ્યત્વ, યોજનાઓ અથવા ફરિયાદો વિશે પૂછો — હું ચકાસાયેલા સત્તાવાર સ્રોતોમાંથી જ જવાબ આઉં છું.",
    askLabel: "તમે શું પૂછ્યું",
    verifiedLabel: "ચકાસાયેલો જવાબ",
    relatedLabel: "સંબંધિત માહિતી — સત્તાવાર સ્રોતોથી ચકાસો",
    actLabel: "આગળના પગલાં — કરો",
    docsLabel: "જરૂરી થઈ શકે તે દસ્તાવેજો",
    sourcesLabel: "સત્તાવાર સ્રોતો",
    noAnswer: "આ વિશે મારી પાસે હજુ ચકાસાયેલી માહિતી નથી. ખોટું માર્ગદર્શન ટાળવા હું અનુમાન લગાવીશ નહીં.",
    noAnswerHint: "પ્રશ્ન ફરી લખીને પૂછો અથવા તમારા જિલ્લા સહકારી નોંદણીકર્તા / સહકારિતા વિભાગનો સંપર્ક કરો.",
    listen: "સાંભળો", stop: "બંધ કરો", relatedQ: "સંબંધિત પ્રશ્નો", jurisdiction: "ક્ષેત્ર",
    disclaimer: "સત્તાવાર સ્રોતોમાંથી સરળ માર્ગદર્શન — કાનૂની સલાહનો વિકલ્પ નથી.",
    stateNote: "પસંદ કરેલું ક્ષેત્ર: {state}. રાજ્ય-વિશિષ્ટ નિયમો અલગ હોઈ શકે છે — રાજ્ય સહકારી વિભાગ સાથે ખાતરી કરો.",
    fallbackSources: "ચકાસવા માટે સત્તાવાર પોર્ટલ:",
    askFollowUp: "આગળનો પ્રશ્ન પૂછો"
  },
  pa: {
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਹਿਕਾਰ ਸਾਥੀ ਹਾਂ। ਸਹਿਕਾਰੀ ਅਧਿਕਾਰ, ਮੈਂਬਰਸ਼ਿਪ, ਸਕੀਮਾਂ ਜਾਂ ਸ਼ਿਕਾਇਤਾਂ ਬਾਰੇ ਪੁੱਛੋ — ਮੈਂ ਸਤਿਆਪਤ ਸਰਕਾਰੀ ਸਰੋਤਾਂ ਤੋਂ ਹੀ ਜਵਾਬ ਦਿੰਦਾ ਹਾਂ।",
    askLabel: "ਤੁਸੀਂ ਕੀ ਪੁੱਛਿਆ",
    verifiedLabel: "ਸਤਿਆਪਤ ਜਵਾਬ",
    relatedLabel: "ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ — ਸਰਕਾਰੀ ਸਰੋਤਾਂ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ",
    actLabel: "ਅਗਲੇ ਕਦਮ — ਕਰੋ",
    docsLabel: "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼",
    sourcesLabel: "ਸਰਕਾਰੀ ਸਰੋਤ",
    noAnswer: "ਇਸ ਬਾਰੇ ਮੇਰੇ ਕੋਲ ਅਜੇ ਸਤਿਆਪਤ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ। ਗ਼ਲਤ ਰਾਹ ਨਿਰਦੇਸ਼ ਦੇਣ ਲਈ ਮੈਂ ਅੰਦਾਜ਼ਾ ਨਹੀਂ ਲਗਾਉਂਦਾ।",
    noAnswerHint: "ਸਵਾਲ ਦੁਬਾਰਾ ਲਿਖ ਕੇ ਪੁੱਛੋ, ਜਾਂ ਆਪਣੇ ਜ਼ਿਲ੍ਹਾ ਸਹਿਕਾਰੀ ਰਜਿਸਟ੍ਰਾਰ / ਸਹਿਕਾਰਿਤਾ ਵਿਭਾਗ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    listen: "ਸੁਣੋ", stop: "ਰੋਕੋ", relatedQ: "ਸੰਬੰਧਿਤ ਸਵਾਲ", jurisdiction: "ਖੇਤਰ",
    disclaimer: "ਸਰਕਾਰੀ ਸਰੋਤਾਂ ਤੋਂ ਸਰਲ ਰਾਹ ਨਿਰਦੇਸ਼ — ਕਾਨੂੰਨੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ।",
    stateNote: "ਚੁਣਿਆ ਖੇਤਰ: {state}. ਰਾਜ ਵਿਸ਼ੇਸ਼ ਨਿਯਮ ਵੱਖ ਹੋ ਸਕਦੇ ਹਨ — ਰਾਜ ਸਹਿਕਾਰੀ ਵਿਭਾਗ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ।",
    fallbackSources: "ਜਾਂਚ ਲਈ ਸਰਕਾਰੀ ਪੋਰਟਲ:",
    askFollowUp: "ਅਗਲਾ ਸਵਾਲ ਪੁੱਛੋ"
  }
};

/* ------------------------------------------------------------------ *
 *  Intent detection (Language + Intent + State detection)
 * ------------------------------------------------------------------ */
const INTENTS = [
  { id: 'greeting', words: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'good morning', 'good evening', 'नमस्ते', 'नमस्कार', 'हैलो', 'வணக்கம்', 'నమస్కారం', 'नमस्कार', 'নমস্কার', 'ನಮಸ್ಕಾರ', 'നമസ്കാരം', 'નમસ્તે', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ']},
  { id: 'rights', words: ['right', 'rights', 'member', 'members', 'voting', 'vote', 'inspect', 'inspection', 'dividend', 'bylaw', 'bylaws', 'by-laws', 'records', 'minutes', 'अधिकार', 'सदस्य', 'अधिकारांची', 'सदस्याचे', 'உரிமை', 'உறுப்பினர்', 'హక్కులు', 'సభ్యుని', 'অধিকার', 'ভোট', 'ಹಕ್ಕುಗಳು', 'ಸದಸ್ಯ', 'അവകാശങ്ങൾ', 'അംഗം', 'અધિકારો', 'સભ્ય', 'ਅਧਿਕਾਰ', 'ਮੈਂਬਰ']},
  { id: 'membership', words: ['join', 'become', 'membership', 'admission', 'apply', 'application', 'form', 'register', 'सदस्यता', 'शामिल', 'आवेदन', 'सदस्यत्व', 'अर्ज', 'உறுப்பினராக', 'விண்ணப்பம்', 'సభ్యత్వం', 'దరఖాస్తు', 'సభ్యుడిగా', 'సభ్యుడు', 'সদস্য', 'আবেদন', 'ಸದಸ್ಯತ್ವ', 'ಅರ್ಜಿ', 'അംഗത്വം', 'അപേക്ഷ', 'સભ્યત્વ', 'અરજી', 'ਮੈਂਬਰਸ਼ਿਪ', 'ਅਰਜ਼ੀ']},
  { id: 'governance', words: ['election', 'elections', 'committee', 'management', 'governance', 'term', 'chairman', 'president', 'administrator', 'agm', 'चुनाव', 'समिति', 'प्रबंधन', 'निवडणुक', 'समिती', 'तेर्ती', 'தேர்தல்', 'குழு', 'ఎన్నికలు', 'కమిటీ', 'নির্বাচন', 'কমিটি', 'ಚುನಾವಣೆ', 'ಸಮಿತಿ', 'തിരഞ്ഞെടുപ്പ്', 'കമ്മിറ്റി', 'ચૂંટણી', 'સમિતિ', 'ਚੋਣਾਂ', 'ਕਮੇਟੀ']},
  { id: 'appeal', words: ['appeal', 'order', 'rejection', 'rejected', 'tribunal', 'court', 'decision', 'against', 'limitation', 'अपील', 'आदेश', 'अस्वीकृति', 'अपील', 'आदेश', 'மேல்முறையீடு', 'நிராகரிப்பு', 'అప్పీలు', 'తిరస్కరణ', 'আপিল', 'প্রত্যাখ্যাত', 'ಮೇಲ್ಮನವಿ', 'അപ്പീൽ', 'અપીલ', 'ਅਪੀਲ']},
  { id: 'grievance', words: ['grievance', 'complaint', 'complain', 'file', 'problem', 'delay', 'denial', 'corruption', 'misuse', 'shikayat', 'शिकायत', 'दर्ज', 'तक्रार', 'पुकार', 'புகார்', 'ఫిర్యాదు', 'గోడు', 'অভিযোগ', 'জানান', 'ದೂರು', 'ಶಿಕಾಯತ್', 'പരാതി', 'ફરિયાદ', 'ਸ਼ਿਕਾਇਤ']},
  { id: 'schemes', words: ['scheme', 'schemes', 'fund', 'funding', 'loan', 'ncdc', 'nrlm', 'sfurti', 'dairy', 'storage', 'warehouse', 'yojana', 'subsidy', 'योजना', 'ऋण', 'फंड', 'निधी', 'कर्ज', 'திட்டம்', 'கடன்', 'పథకం', 'రుణం', 'প্রকল্প', 'ঋণ', 'ಯೋಜನೆ', 'ಸಾಲ', 'പദ്ധതി', 'വായ്പ', 'યોજના', 'લોન', 'ਸਕੀਮ', 'ਕਰਜ਼ਾ']},
  { id: 'documents', words: ['document', 'documents', 'papers', 'checklist', 'required', 'photos', 'proof', 'fee', 'दस्तावेज़', 'कागज़ात', 'सूची', 'कागदपत्रे', 'यादी', 'ஆவணங்கள்', 'பட்டியல்', 'పత్రాలు', 'జాబితా', 'নথি', 'তালিকা', 'ದಾಖಲೆ', 'ಪಟ್ಟಿ', 'രേഖകൾ', 'പട്ടിക', 'દસ્તાવેજ', 'યાદી', 'ਦਸਤਾਵੇਜ਼', 'ਸੂਚੀ'] }
];

const INTENT_LABELS = {
  rights: { en: 'cooperative member rights', hi: 'सहकारी सदस्य के अधिकार', mr: 'सहकारी सदस्याचे अधिकार', ta: 'கூட்டுறவு உறுப்பினர் உரிமைகள்', bn: 'সমবায় সদস্যের অধিকার', te: 'సహకార సభ్య హక్కులు' , kn: 'ಸಹಕಾರಿ ಸದಸ್ಯರ ಹಕ್ಕುಗಳು', ml: 'സഹകരണ അംഗ അവകാശങ്ങൾ', gu: 'સહકારી સભ્યના અધિકારો', pa: 'ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਅਧਿਕਾਰ'  },
  membership: { en: 'becoming a cooperative member', hi: 'सहकारी सदस्य बनना', mr: 'सहकारी सदस्य व्हणे', ta: 'கூட்டுறவு உறுப்பினராகுதல்', bn: 'সমবায় সদস্য হওয়া', te: 'సహకార సభ్యుడిగా మారడం' , kn: 'ಸಹಕಾರಿ ಸದಸ್ಯನಾಗುವುದು', ml: 'സഹകരണ അംഗമാകൽ', gu: 'સહકારી સભ્ય બનવું', pa: 'ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਬਣਨਾ'  },
  governance: { en: 'cooperative governance & elections', hi: 'सहकारी शासन और चुनाव', mr: 'सहकारी शासन व निवडणुका', ta: 'கூட்டுறவு ஆளுமை மற்றும் தேர்தல்', bn: 'সমবায় শাসন ও নির্বাচন', te: 'సహకార పాలన & ఎన్నికలు' , kn: 'ಸಹಕಾರಿ ಆಡಳಿತ ಮತ್ತು ಚುನಾವಣೆಗಳು', ml: 'സഹകരണ ഭരണവും തിരഞ്ഞെടുപ്പുകളും', gu: 'સહકારી શાસન અને ચૂંટણીઓ', pa: 'ਸਹਿਕਾਰੀ ਸਾਸ਼ਨ ਅਤੇ ਚੋਣਾਂ'  },
  grievance: { en: 'filing a grievance', hi: 'शिकायत दर्ज करना', mr: 'तक्रार नोंदवणे', ta: 'புகார் தாக்கல்', bn: 'অভিযোগ জানানো', te: 'ఫిర్యాదు దాఖలు' , kn: 'ದೂರು ದಾಖಲಿಸುವುದು', ml: 'പരാതി നൽകൽ', gu: 'ફરિયાદ નોંધાવવી', pa: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨਾ'  },
  appeal: { en: 'appealing a decision', hi: 'निर्णय के विरुद्ध अपील', mr: 'निर्णयाविरुद्ध अपील', ta: 'முடிவுக்கு எதிரான மேல்முறையீடு', bn: 'সিদ্ধান্তের বিরুদ্ধে আপিল', te: 'నిర్ణయంపై అప్పీలు' , kn: 'ನಿರ್ಧಾರದ ವಿರುದ್ಧ ಮೇಲ್ಮನವಿ', ml: 'തീരുമാനത്തിനെതിരെ അപ്പീൽ', gu: 'નિર્ણય સામે અપીલ', pa: 'ਫੈਸਲੇ ਦੇ ਵਿਰੁੱਧ ਅਪੀਲ'  },
  schemes: { en: 'cooperative schemes & funding', hi: 'सहकारी योजनाएँ और फंडिंग', mr: 'सहकारी योजना व निधी', ta: 'கூட்டுறவுத் திட்டங்கள் மற்றும் நிதி', bn: 'সমবায় প্রকল্প ও তহবিল', te: 'సహకార పథకాలు & నిధులు' , kn: 'ಸಹಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಧನಸಹಾಯ', ml: 'സഹകരണ പദ്ധതികളും ധനസഹായവും', gu: 'સહકારી યોજનાઓ અને ભંડોળ', pa: 'ਸਹਿਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਫੰਡ'  },
  documents: { en: 'documents & paperwork', hi: 'दस्तावेज़ और कागज़ी कार्रवाई', mr: 'कागदपत्रे व कागदपत्र प्रक्रिया', ta: 'ஆவணங்கள் மற்றும் பணிச்சுட்டு', bn: 'নথি ও কাগজপত্র', te: 'పత్రాలు & పేపర్‌వర్క్', kn: 'ದಾಖಲೆಗಳು ಮತ್ತು ಕಾಗದಪತ್ರ', ml: 'രേഖകളും രേഖാപരമായ നടപടികളും', gu: 'દસ્તાવેજો અને કાગળપત્ર', pa: 'ਦਸਤਾਵੇਜ਼ ਅਤੇ ਕਾਗਜ਼ੀ ਕਾਰਵਾਈ'  },
  general: { en: 'your question', hi: 'आपका प्रश्न', mr: 'आपला प्रश्न', ta: 'உங்கள் கேள்வி', bn: 'আপনার প্রশ্ন', te: 'మీ ప్రశ్న', kn: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ', ml: 'നിങ്ങളുടെ ചോദ്യം', gu: 'તમારો પ્રશ્ન', pa: 'ਤੁਹਾਡਾ ਸਵਾਲ' }
};

/* ------------------------------------------------------------------ *
 *  Helpers
 * ------------------------------------------------------------------ */
const STOPWORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on', 'for',
  'and', 'or', 'do', 'does', 'did', 'i', 'my', 'me', 'we', 'you', 'it', 'at', 'by', 'with', 'how',
  'what', 'can', 'should', 'please', 'tell', 'about', 'from', 'that', 'this', 'be', 'have', 'has',
  'am', 'as', 'if', 'so', 'not', 'no', 'any', 'all', 'out', 'up', 'get', 'got', 'will', 'would']);

function normalize(text) {
  // keep letters, combining marks (essential for Tamil/Devanagari), numbers, spaces, hyphens
  return String(text || '').toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(text) {
  return normalize(text).split(' ').filter(w => w && !STOPWORDS.has(w) && w.length > 1);
}

function detectIntent(text) {
  const norm = ' ' + normalize(text).replace(/['']/g, '') + ' ';
  const scores = [];
  for (const intent of INTENTS) {
    let score = 0;
    for (const w of intent.words) {
      // word-boundary match only — avoid "hi" matching inside "delhi"
      if (norm.includes(' ' + w + ' ')) score += w.length > 6 ? 2 : 1.5;
      // prefix match catches inflected forms (e.g. প্রকল্প → প্রকল্পে), only for longer words
      else if (w.length >= 5) {
        const hit = norm.split(' ').some(tok => tok.startsWith(w));
        if (hit) score += 0.8;
      }
    }
    if (score > 0) scores.push({ id: intent.id, score });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores.map(s => s.id); // top intents, best first
}

function detectJurisdiction(text) {
  const norm = ' ' + normalize(text) + ' ';
  const stateIds = (KB.meta.jurisdictions || []).filter(j => j.id !== 'all');
  for (const j of stateIds) {
    const labels = Object.values(j.label).map(normalize);
    const aliases = {
      up: ['uttar pradesh', 'cooperativeup', 'upgovin', 'up'],
      mh: ['maharashtra', 'mahasahakar', 'mahagov'],
      tn: ['tamil nadu', 'tamilnadu', 'rcstn', 'tn gov'],
      ka: ['karnataka', 'kar nataka'],
      br: ['bihar']
    };
    const words = [...labels, ...(aliases[j.id] || [])];
    // short aliases need word boundaries; long ones (domains, full names) match as substrings
    if (words.some(w => w && (w.length <= 4 ? norm.includes(' ' + w + ' ') : norm.includes(w)))) return j.id;
  }
  return null;
}

/** Step 1 — RETRIEVE: score every doc against the query. */
function retrieve(query, intents, jurisdiction) {
  const tokens = tokenize(query);
  const norm = normalize(query);
  const scored = KB.docs.map(doc => {
    let score = 0;
    const kw = doc.kw.map(normalize);
    const titles = Object.values(doc.t).map(normalize);

    for (const tok of tokens) {
      if (kw.some(k => k === tok || k.includes(tok) || tok.includes(k))) score += 2.5;
      if (titles.some(t => t.includes(tok))) score += 3;
      // light substring check in bodies for multi-char tokens
      if (tok.length >= 4) {
        const bodies = Object.values(doc.b).join(' \u0001 ');
        if (normalize(bodies).includes(tok)) score += 0.8;
      }
    }
    // whole-phrase bonus
    if (norm.length > 8 && kw.some(k => norm.includes(k))) score += 1.5;
    // intent bonuses: top intent +2, second +1
    if (Array.isArray(intents)) {
      if (intents[0] && doc.cat === intents[0]) score += 2;
      else if (intents[1] && doc.cat === intents[1]) score += 1;
    }
    const isStateDoc = doc.jur !== 'all' && doc.jur !== 'central';
    if (isStateDoc) {
      if (jurisdiction === doc.jur) score += 3;           // user's selected/mentioned state
      else score *= 0.35;                                  // don't leak other states' docs
    } else if (jurisdiction && jurisdiction !== 'all' && doc.jur === jurisdiction) score += 1;
    return { doc, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function localize(obj, lang) {
  if (!obj) return obj;
  return obj[lang] || obj.en;
}

function jurisdictionLabel(id, lang) {
  const j = (KB.meta.jurisdictions || []).find(x => x.id === id);
  return j ? localize(j.label, lang) : id;
}

/* ------------------------------------------------------------------ *
 *  /api/chat — the main pipeline
 * ------------------------------------------------------------------ */
function handleChat(body) {
  const lang = STRINGS[body.lang] ? body.lang : 'en';
  const S = STRINGS[lang];
  const query = String(body.message || '').trim();
  const stateSel = body.jurisdiction && jurisdictionLabel(body.jurisdiction, 'en') ? body.jurisdiction : 'all';

  if (!query) {
    return { ok: false, error: 'empty' };
  }

  const intents = detectIntent(query);
  const intent = intents[0] || null;
  const mentionedState = detectJurisdiction(query);
  const jurisdiction = mentionedState || (stateSel !== 'all' ? stateSel : 'all');

  // Greeting / small talk
  if (intent === 'greeting') {
    return {
      ok: true,
      mode: 'greeting',
      lang,
      strings: S,
      message: S.greeting,
      suggestions: sampleQuestions(lang, 4),
      detected: { intent, jurisdiction }
    };
  }

  const results = retrieve(query, intents, jurisdiction);
  const top = results[0];
  const second = results[1];
  const VERIFIED_THRESHOLD = 2.5;
  const MIN_THRESHOLD = 1.4;

  // Step 2 — VERIFY: refuse to answer when confidence is low (no guessing)
  if (!top || top.score < MIN_THRESHOLD) {
    return {
      ok: true,
      mode: 'no-answer',
      lang,
      strings: S,
      message: S.noAnswer,
      hint: S.noAnswerHint,
      fallbackSources: [
        { name: 'Ministry of Cooperation, Government of India', url: 'https://cooperation.gov.in/' },
        { name: 'India Code — Cooperative Societies Acts', url: 'https://www.indiacode.nic.in/' }
      ],
      suggestions: sampleQuestions(lang, 4),
      detected: { intent, jurisdiction, topScore: top ? +top.score.toFixed(2) : 0 }
    };
  }

  const doc = top.doc;
  const confidence = top.score >= VERIFIED_THRESHOLD ? 'high' : 'medium';

  // Step 3 — GENERATE: compose strictly from retrieved KB content
  const title = localize(doc.t, lang);
  const bodyPara = localize(doc.b, lang);
  const steps = localize(doc.s, lang);
  const docsNeed = localize(doc.d, lang);

  const stateNote = jurisdiction !== 'all'
    ? S.stateNote.replace('{state}', jurisdictionLabel(jurisdiction, lang))
    : null;

  const relatedPool = results.slice(1, 4)
    .filter(r => r.score >= MIN_THRESHOLD && r.doc.id !== doc.id)
    .slice(0, 2)
    .map(r => ({ id: r.doc.id, title: localize(r.doc.t, lang) }));

  // Jurisdiction extra: surface the selected state's own portal/grievance doc
  const stateDoc = jurisdiction !== 'all'
    ? KB.docs.find(dd => dd.jur === jurisdiction && dd.id !== doc.id)
    : null;

  // Step 4 — CITE: attach official sources
  return {
    ok: true,
    mode: confidence === 'high' ? 'verified' : 'related',
    lang,
    strings: S,
    answer: {
      id: doc.id,
      title,
      body: bodyPara,
      act: { steps: steps || [], documents: docsNeed || [] },
      sources: doc.src || []
    },
    interpret: {
      askLabel: S.askLabel,
      intentLabel: INTENT_LABELS[intent] ? INTENT_LABELS[intent][lang] : INTENT_LABELS.general[lang],
      jurisdictionLabel: jurisdictionLabel(jurisdiction, lang),
      stateNote
    },
    confidence,
    suggestions: relatedPool.length ? relatedPool : sampleQuestions(lang, 3),
    relatedLabel: S.relatedQ,
    stateSpecific: stateDoc ? {
      id: stateDoc.id,
      title: localize(stateDoc.t, lang),
      body: (localize(stateDoc.b, lang) || [])[0],
      sources: stateDoc.src || []
    } : null,
    detected: { intent, jurisdiction, topScore: +top.score.toFixed(2) },
    candidates: results.slice(0, 3).map(r => ({ id: r.doc.id, score: +r.score.toFixed(1) }))
  };
}

function sampleQuestions(lang, n) {
  return (KB.meta.samples || []).slice(0, n).map(s => ({
    cat: s.cat,
    q: localize(s.q, lang)
  }));
}


/* ------------------------------------------------------------------ *
 *  WhatsApp helpers: language detection from script + plain-text reply
 * ------------------------------------------------------------------ */
function detectLang(text) {
  const t = String(text || '');
  if (/[\u0B80-\u0BFF]/.test(t)) return 'ta';
  if (/[\u0980-\u09FF]/.test(t)) return 'bn';
  if (/[\u0C00-\u0C7F]/.test(t)) return 'te';
  if (/[\u0C80-\u0CFF]/.test(t)) return 'kn';
  if (/[\u0D00-\u0D7F]/.test(t)) return 'ml';
  if (/[\u0A80-\u0AFF]/.test(t)) return 'gu';
  if (/[\u0A00-\u0A7F]/.test(t)) return 'pa';
  if (/[\u0900-\u097F]/.test(t)) return 'hi'; // Devanagari → Hindi (Marathi falls back gracefully)
  return 'en';
}

function plainText(res) {
  if (res.mode === 'greeting') return res.message;
  if (res.mode === 'no-answer') return res.message + '\n\n' + (res.hint || '');
  const a = res.answer, S = res.strings || STRINGS.en;
  let out = '✅ ' + a.title + '\n\n' + (a.body || []).join('\n\n');
  if (res.stateSpecific) out += '\n\n📍 ' + res.stateSpecific.title + '\n' + res.stateSpecific.body;
  if (a.act && a.act.steps && a.act.steps.length)
    out += '\n\n▶ ' + (S.actLabel || 'Next steps') + ':\n' + a.act.steps.map((x, i) => (i + 1) + '. ' + x).join('\n');
  if (a.act && a.act.documents && a.act.documents.length)
    out += '\n\n📄 ' + (S.docsLabel || 'Documents') + ':\n' + a.act.documents.map(x => '• ' + x).join('\n');
  if (a.sources && a.sources.length)
    out += '\n\n📎 ' + (S.sourcesLabel || 'Sources') + ':\n' + a.sources.map(x => '• ' + x.name + ': ' + x.url).join('\n');
  out += '\n\n_' + (S.disclaimer || '') + '_';
  return out;
}

/* ------------------------------------------------------------------ *
 *  Static file server
 * ------------------------------------------------------------------ */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  // --- API ---
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, name: 'Sahakar Sathi', docs: KB.docs.length }));
    return;
  }

  if (pathname === '/api/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      jurisdictions: KB.meta.jurisdictions,
      languages: [
        { id: 'en', label: 'English' }, { id: 'hi', label: 'हिन्दी' }, { id: 'mr', label: 'मराठी' },
        { id: 'ta', label: 'தமிழ்' }, { id: 'bn', label: 'বাংলা' }, { id: 'te', label: 'తెలుగు' },
        { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'ml', label: 'മലയാളം' },
        { id: 'gu', label: 'ગુજરાતી' }, { id: 'pa', label: 'ਪੰਜਾਬੀ' }
      ]
    }));
    return;
  }

  if (pathname === '/api/samples' && req.method === 'GET') {
    const lang = url.searchParams.get('lang') || 'en';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ samples: sampleQuestions(STRINGS[lang] ? lang : 'en', 6) }));
    return;
  }

  if (pathname === '/api/chat' && req.method === 'POST') {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let result;
      try {
        result = handleChat(JSON.parse(data || '{}'));
      } catch (e) {
        result = { ok: false, error: 'bad-request' };
      }
      const status = result.ok ? 200 : 400;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }

  /* ---- WhatsApp Cloud API webhook (Meta) + simulator endpoint ---- */
  if (pathname === '/webhook' && req.method === 'GET') {
    const p = url.searchParams;
    const token = process.env.WHATSAPP_VERIFY_TOKEN || 'sahakar-sathi-2026';
    if (p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') === token) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(p.get('hub.challenge') || '');
    } else {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Verification failed');
    }
    return;
  }

  if (pathname === '/webhook' && req.method === 'POST') {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let j = {};
      try { j = JSON.parse(data || '{}'); } catch (e) { j = {}; }

      let message = null, from = 'user', lang = null, jurisdiction = 'all', msgId = null;
      if (j.object === 'whatsapp_business_account') {
        // Meta Cloud API payload
        const value = (j.entry && j.entry[0] && j.entry[0].changes && j.entry[0].changes[0] && j.entry[0].changes[0].value) || {};
        const m = (value.messages && value.messages[0]) || null;
        if (!m) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{}'); return; }
        from = m.from; msgId = m.id;
        if (m.type === 'text') message = m.text && m.text.body;
        else if (m.type === 'button') message = m.button && m.button.text;
        else {
          // voice/media note: transcription needs cloud STT — acknowledge gracefully (demo)
          const reply = '🎙 Voice notes are supported in the app demo. For this webhook demo, please send a text message (you can type in any Indian language).';
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ messaging_product: 'whatsapp', to: from, type: 'text', text: { body: reply, preview_url: false } }));
          return;
        }
        lang = detectLang(message);
      } else {
        // Simulator / simple format: { message, lang?, jurisdiction? }
        message = j.message;
        const validLang = j.lang && j.lang !== 'auto' && STRINGS[j.lang];
        lang = validLang ? j.lang : (message ? detectLang(message) : 'en');
        jurisdiction = j.jurisdiction || 'all';
        from = j.from || 'user';
      }

      if (!message || !String(message).trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'empty message' }));
        return;
      }

      const result = handleChat({ message, lang, jurisdiction });
      const reply = plainText(result);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (j.object === 'whatsapp_business_account') {
        const payload = { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: reply, preview_url: false } };
        if (msgId) payload.context = { message_id: msgId };
        res.end(JSON.stringify(payload));
      } else {
        res.end(JSON.stringify({ ok: true, reply, lang: result.lang, mode: result.mode }));
      }
    });
    return;
  }

  // --- Static ---
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
  const abs = path.join(PUBLIC_DIR, filePath);
  if (!abs.startsWith(PUBLIC_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }

  fs.readFile(abs, (err, buf) => {
    if (err) {
      // SPA-ish fallback to index for unknown non-file paths
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, b2) => {
        if (e2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(b2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(abs)] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sahakar Sathi server running at http://0.0.0.0:${PORT}`);
  console.log(`Knowledge base: ${KB.docs.length} verified documents`);
});
