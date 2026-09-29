/* One-shot patch: state-specific docs + kn/ml/gu/pa titles, samples, labels, keywords */
const fs = require('fs');
const P = __dirname + '/../data/kb.json';
const KB = JSON.parse(fs.readFileSync(P, 'utf8'));

/* ---------- 1. titles for the 10 core docs in kn/ml/gu/pa ---------- */
const titles = {
  'member-rights': { kn: 'ಸಹಕಾರಿ ಸದಸ್ಯರ ಹಕ್ಕುಗಳು', ml: 'സഹകരണ അംഗത്തിന്റെ അവകാശങ്ങൾ', gu: 'સહકારી સભ્યના અધિકારો', pa: 'ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਦੇ ਅਧਿਕਾਰ' },
  'become-member': { kn: 'ಸಹಕಾರಿ ಸದಸ್ಯನಾಗುವುದು ಹೇಗೆ', ml: 'എങ്ങനെ സഹകരണ അംഗമാകാം', gu: 'સહકારી સભ્ય કેવી રીતે બનવું', pa: 'ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਕਿਵੇਂ ਬਣੀਏ' },
  'governance-elections': { kn: 'ಸಹಕಾರಿಗಳಲ್ಲಿ ಆಡಳಿತ ಮತ್ತು ಸಕಾಲದ ಚುನಾವಣೆಗಳು', ml: 'സഹകരണത്തിലെ ഭരണവും സമയബോധമുള്ള തിരഞ്ഞെടുപ്പുകളും', gu: 'સહકારીમાં શાસન અને સમયસર ચૂંટણીઓ', pa: 'ਸਹਿਕਾਰੀ ਵਿੱਚ ਸਾਸ਼ਨ ਅਤੇ ਸਮੇਂ ਸਿਰ ਚੋਣਾਂ' },
  'grievance-filing': { kn: 'ದೂರು (ಶಿಕಾಯತ್) ದಾಖಲಿಸುವುದು ಹೇಗೆ', ml: 'എങ്ങനെ പരാതി നൽകാം', gu: 'ફરિયાદ કેવી રીતે નોંધાવવી', pa: 'ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰੀਏ' },
  'grievance-appeal': { kn: 'ಸಹಕಾರಿಯ ನಿರ್ಧಾರದ ವಿರುದ್ಧ ಮೇಲ್ಮನವಿ', ml: 'സഹകരണത്തിന്റെ തീരുമാനത്തിനെതിരെ അപ്പീൽ', gu: 'સહકારીના નિર્ણય સામે અપીલ', pa: 'ਸਹਿਕਾਰੀ ਦੇ ਫੈਸਲੇ ਦੇ ਵਿਰੁੱਧ ਅਪੀਲ' },
  'bylaws-records': { kn: 'ಬೈಲಾವುಗಳು, ನೋಂದಣಿ ಪುಸ್ತಕಗಳು ಮತ್ತು ದಾಖಲೆಗಳಿಗೆ ಪ್ರವೇಶ', ml: 'ബൈലോ, രജിസ്റ്ററുകൾ, രേഖകൾ എന്നിവയിലേക്കുള്ള പ്രവേശനം', gu: 'બાયલો, રજિસ્ટર અને નોંધણીઓ સુધી પ્રવેશ', pa: 'ਬਾਇਲੋ, ਰਜਿਸਟਰ ਅਤੇ ਰਿਕਾਰਡਾਂ ਤੱਕ ਪਹੁੰਚ' },
  'scheme-ncdc': { kn: 'ಸಹಕಾರಿಗಳಿಗೆ NCDC ಧನಸಹಾಯ ಯೋಜನೆಗಳು', ml: 'സഹകരണങ്ങൾക്കുള്ള NCDC ധനസഹായ പദ്ധതികൾ', gu: 'સહકારી માટે NCDC ભંડોળ યોજનાઓ', pa: 'ਸਹਿਕਾਰੀਆਂ ਲਈ NCDC ਫੰਡ ਸਕੀਮਾਂ' },
  'scheme-nrlm': { kn: 'ಮಹಿಳಾ SHG ಮತ್ತು ಸಹಕಾರಿ ಬೆಂಬಲ (DAY-NRLM)', ml: 'സ്ത്രീ SHG സഹകരണ പിന്തുണ (DAY-NRLM)', gu: 'મહિલા SHG અને સહકારી સહાય (DAY-NRLM)', pa: 'ਮਹਿਲਾ SHG ਅਤੇ ਸਹਿਕਾਰੀ ਸਹਾਇਤਾ (DAY-NRLM)' },
  'scheme-sfurti': { kn: 'ಸಹಕಾರಿ ಮತ್ತು ಕರಕುಶಲ ಕ್ಲಸ್ಟರ್‌ಗಳಿಗೆ SFURTI ಬೆಂಬಲ', ml: 'സഹകരണ-കരകുശല ക്ലസ്റ്ററുകൾക്കുള്ള SFURTI പിന്തുണ', gu: 'સહકારી અને હસ્તકલા ક્લસ્ટર માટે SFURTI સહાય', pa: 'ਸਹਿਕਾਰੀ ਅਤੇ ਹੁਨਰ ਕਲਸਟਰਾਂ ਲਈ SFURTI ਸਹਾਇਤਾ' },
  'documents-checklist': { kn: 'ಸದಸ್ಯತ್ವ ಮತ್ತು ಸೇವೆಗಳಿಗೆ ಅಗತ್ಯ ದಾಖಲೆಗಳು', ml: 'അംഗത്വത്തിനും സേവനങ്ങൾക്കും ആവശ്യമായ രേഖകൾ', gu: 'સભ્યત્વ અને સેવાઓ માટે જરૂરી દસ્તાવેજો', pa: 'ਮੈਂਬਰਸ਼ਿਪ ਅਤੇ ਸੇਵਾਵਾਂ ਲਈ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼' }
};
for (const d of KB.docs) if (titles[d.id]) Object.assign(d.t, titles[d.id]);

/* ---------- 2. sample questions in kn/ml/gu/pa ---------- */
const samples = [
  { kn: 'ಸಹಕಾರಿ ಸದಸ್ಯನಾಗಿ ನನ್ನ ಹಕ್ಕುಗಳೇನು?', ml: 'സഹകരണ അംഗമെന്ന നിലയിൽ എന്റെ അവകാശങ്ങൾ എന്താണ്?', gu: 'સહકારી સભ્ય તરીકે મારા અધિકારો શું છે?', pa: 'ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਵਜੋਂ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?' },
  { kn: 'ನಾನು ಹೇಗೆ ಸಹಕಾರಿ ಸದಸ್ಯನಾಗಬಹುದು?', ml: 'എങ്ങനെ ഞാൻ സഹകരണ അംഗമാകും?', gu: 'હું સહકારી સભ્ય કેવી રીતે બનું?', pa: 'ਮੈਂ ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਕਿਵੇਂ ਬਣ ਸਕਦਾ ਹਾਂ?' },
  { kn: 'ದೂರು ಹೇಗೆ ದಾಖಲಿಸಬೇಕು?', ml: 'എങ്ങനെ പരാതി നൽകും?', gu: 'ફરિયાદ કેવી રીતે નોંધાવવી?', pa: 'ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰਾਈਏ?' },
  { kn: 'ನಮ್ಮ ಸಹಕಾರಿ ಯಾವ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?', ml: 'ഞങ്ങളുടെ സഹകരണത്തിന് ഏതൊക്കെ പദ്ധതികൾക്ക് അപേക്ഷിക്കാം?', gu: 'અમારી સહકારી કઈ યોજનાઓ માટે અરજી કરી શકે?', pa: 'ਸਾਡੀ ਸਹਿਕਾਰੀ ਕਿਸ ਸਕੀਮ ਲਈ ਅਰਜ਼ੀ ਦੇ ਸਕਦੀ ਹੈ?' },
  { kn: 'ಸಹಕಾರಿ ಚುನಾವಣೆಗಳು ಯಾವಾಗ ನಡೆಯಬೇಕು?', ml: 'സഹകരണ തിരഞ്ഞെടുപ്പുകൾ എപ്പോൾ നടത്തണം?', gu: 'સહકારી ચૂંટણીઓ ક્યારે યોજાવી જોઈએ?', pa: 'ਸਹਿਕਾਰੀ ਚੋਣਾਂ ਕਦੋਂ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?' },
  { kn: 'ನನಗೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?', ml: 'എനിക്ക് ഏതൊക്കെ രേഖകൾ വേണം?', gu: 'મને કયા દસ્તાવેજો જોઈએ?', pa: 'ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?' }
];
KB.meta.samples.forEach((s, i) => Object.assign(s.q, samples[i]));

/* ---------- 3. jurisdiction labels in kn/ml/gu/pa ---------- */
const jurLabels = {
  all: { kn: 'ಇಡೀ ಭಾರತ', ml: 'ഇന്ത്യ മുഴുവൻ', gu: 'સમગ્ર ભારત', pa: 'ਸਾਰਾ ਭਾਰਤ' },
  up: { kn: 'ಉತ್ತರ ಪ್ರದೇಶ', ml: 'ഉത്തർപ്രദേശ്', gu: 'ઉત્તર પ્રદેશ', pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼' },
  mh: { kn: 'ಮಹಾರಾಷ್ಟ್ರ', ml: 'മഹാരാഷ്ട്ര', gu: 'મહારાષ્ટ્ર', pa: 'ਮਹਾਰਾਸ਼ਟਰ' },
  tn: { kn: 'ತಮಿಳುನಾಡು', ml: 'തമിഴ്നാട്', gu: 'તમિલનાડુ', pa: 'ਤਮਿਲਨਾਡੂ' },
  ka: { kn: 'ಕರ್ನಾಟಕ', ml: 'കർണാടക', gu: 'કર્ણાટક', pa: 'ਕਰਨਾਟਕ' },
  br: { kn: 'ಬಿಹಾರ', ml: 'ബിഹാർ', gu: 'બિહાર', pa: 'ਬਿਹਾਰ' }
};
KB.meta.jurisdictions.forEach(j => Object.assign(j.label, jurLabels[j.id]));

/* ---------- 4. category keywords in kn/ml/gu/pa ---------- */
const kwMap = {
  'member-rights':      { kn: ['ಹಕ್ಕುಗಳು', 'ಸದಸ್ಯ', 'ಮತ'], ml: ['അവകാശങ്ങൾ', 'അംഗം', 'വോട്ട്'], gu: ['અધિકારો', 'સભ્ય', 'મત'], pa: ['ਅਧਿਕਾਰ', 'ਮੈਂਬਰ', 'ਵੋਟ'] },
  'become-member':      { kn: ['ಸದಸ್ಯತ್ವ', 'ಅರ್ಜಿ', 'ಸೇರ'], ml: ['അംഗത്വം', 'അപേക്ഷ', 'ചേരുക'], gu: ['સભ્યત્વ', 'અરજી', 'જોડા'], pa: ['ਮੈਂਬਰਸ਼ਿਪ', 'ਅਰਜ਼ੀ', 'ਸ਼ਾਮਲ'] },
  'governance-elections': { kn: ['ಚುನಾವಣೆ', 'ಸಮಿತಿ'], ml: ['തിരഞ്ഞെടുപ്പ്', 'കമ്മിറ്റി'], gu: ['ચૂંટણી', 'સમિતિ'], pa: ['ਚੋਣਾਂ', 'ਕਮੇਟੀ'] },
  'grievance-filing': { kn: ['ದೂರು', 'ಶಿಕಾಯತ್'], ml: ['പരാതി'], gu: ['ફરિયાદ'], pa: ['ਸ਼ਿਕਾਇਤ'] },
  'grievance-appeal': { kn: ['ಮೇಲ್ಮನವಿ', 'ತಿರಸ್ಕಾರ'], ml: ['അപ്പീൽ', 'നിരാകരണം'], gu: ['અપીલ', 'નકાર'], pa: ['ਅਪੀਲ', 'ਖਾਰਜ'] },
  'bylaws-records':   { kn: ['ಬೈಲಾ', 'ದಾಖಲೆ'], ml: ['ബൈലോ', 'രേഖകൾ'], gu: ['બાયલો', 'નોંધણી'], pa: ['ਬਾਇਲੋ', 'ਰਿਕਾਰਡ'] },
  'scheme-ncdc':      { kn: ['ಯೋಜನೆ', 'ಸಾಲ', 'ಅನುದಾನ'], ml: ['പദ്ധതി', 'വായ്പ'], gu: ['યોજના', 'લોન'], pa: ['ਸਕੀਮ', 'ਕਰਜ਼ਾ'] },
  'scheme-nrlm':      { kn: ['ಯೋಜನೆ', 'ಸಾಲ'], ml: ['പദ്ധതി', 'വായ്പ'], gu: ['યોજના', 'લોન'], pa: ['ਸਕੀਮ', 'ਕਰਜ਼ਾ'] },
  'scheme-sfurti':    { kn: ['ಯೋಜನೆ', 'ಅನುದಾನ'], ml: ['പദ്ധതി', 'ധനസഹായം'], gu: ['યોજના', 'ભંડોળ'], pa: ['ਸਕੀਮ', 'ਫੰਡ'] },
  'documents-checklist': { kn: ['ದಾಖಲೆ', 'ಪಟ್ಟಿ'], ml: ['രേഖകൾ', 'പട്ടിക'], gu: ['દસ્તાવેજ', 'યાદી'], pa: ['ਦਸਤਾਵੇਜ਼', 'ਸੂਚੀ'] }
};
for (const d of KB.docs) {
  const add = kwMap[d.id];
  if (!add) continue;
  for (const lang of ['kn', 'ml', 'gu', 'pa'])
    for (const w of (add[lang] || [])) if (!d.kw.includes(w)) d.kw.push(w);
}

/* ---------- 5. state-specific docs (jur: up / mh / tn) ---------- */
const stateDocs = [
  {
    id: 'up-portal', cat: 'grievance', jur: 'up',
    kw: ['up', 'uttar pradesh', 'cooperativeup', 'jansunwai', '1076', 'lucknow', 'उत्तर प्रदेश', 'सहकारिता', 'ई-सेवा', 'आयुक्त', 'कार्यालय', 'उप्र'],
    t: {
      en: 'UP Cooperative Department — online services & grievance',
      hi: 'उत्तर प्रदेश सहकारी विभाग — ऑनलाइन सेवाएँ और शिकायत'
    },
    b: {
      en: [
        'The Office of the Commissioner & Registrar, Cooperative, Uttar Pradesh (cooperativeup.gov.in) runs citizen services online: registration of cooperative societies, e-MPR, e-HRMS, e-Court and a grievance section for complaints related to cooperative offices.',
        'For general state-level grievances you can also use the UP Jansunwai–Samadhan system or the CM Helpline (1076). Always keep the registration/reference number to track status and escalate if needed.'
      ],
      hi: [
        'आयुक्त एवं निबंधक सहकारिता, उत्तर प्रदेश का कार्यालय (cooperativeup.gov.in) नागरिक सेवाएँ ऑनलाइन चलाता है: सहकारी समितियों का पंजीकरण, ई-एमपीआर, ई-एचआरएमएस, ई-कोर्ट तथा सहकारी कार्यालयों से संबंधित शिकायतों के लिए शिकायत अनुभाग।',
        'राज्य-स्तर की सामान्य शिकायतों के लिए आप यूपी जनसुनवाई–समाधान या मुख्यमंत्री हेल्पलाइन (1076) का भी उपयोग कर सकते हैं। स्थिति ट्रैक करने के लिए पंजीकरण/संदर्भ संख्या अवश्य रखें।'
      ]
    },
    s: {
      en: ['Visit cooperativeup.gov.in → Online Services / Grievance section.', 'For society registration, use the online registration link with ID proof and proposed by-laws.', 'For complaints, submit via the grievance section or Jansunwai with your mobile number (OTP).', 'Track with the reference number; escalate to the Commissioner, Cooperative if unresolved.'],
      hi: ['cooperativeup.gov.in खोलें → ऑनलाइन सेवाएँ / शिकायत अनुभाग।', 'समिति पंजीकरण के लिए पहचान-प्रमाण और प्रस्तावित बाय-लॉ के साथ ऑनलाइन लिंक उपयोग करें।', 'शिकायत के लिए शिकायत अनुभाग या जनसुनवाई में मोबाइल नंबर (OTP) सहित भेजें।', 'संदर्भ संख्या से ट्रैक करें; समाधान न होने पर आयुक्त सहकारिता को बढ़ाएँ।']
    },
    d: {
      en: ['ID & address proof', 'Proposed by-laws / society details', 'Mobile number (OTP) for tracking'],
      hi: ['पहचान व पता प्रमाण', 'प्रस्तावित बाय-लॉ / समिति विवरण', 'ट्रैकिंग हेतु मोबाइल नंबर (OTP)']
    },
    src: [
      { name: 'Office of Commissioner & Registrar, Cooperative, UP', url: 'https://cooperativeup.gov.in/' },
      { name: 'Government of Uttar Pradesh Portal', url: 'https://up.gov.in/' }
    ]
  },
  {
    id: 'mh-portal', cat: 'grievance', jur: 'mh',
    kw: ['maharashtra', 'mahasahakar', 'aaple', 'sarkar', 'e-qj', 'eqj', 'महाराष्ट्र', 'सहकारिता', 'तक्रार', 'आपले सरकार', 'पणन', 'विभाग'],
    t: {
      en: 'Maharashtra Cooperation Dept — e-services & grievance (Aaple Sarkar)',
      mr: 'महाराष्ट्र सहकारिता विभाग — ई-सेवा व तक्रार (आपले सरकार)',
      hi: 'महाराष्ट्र सहकारिता विभाग — ई-सेवाएँ और शिकायत (आपले सरकार)'
    },
    b: {
      en: [
        'The Department of Cooperation, Marketing and Textiles, Maharashtra (mahasahakar.maharashtra.gov.in) provides citizen services online: registration of cooperative societies, amendments to by-laws, moneylending licences, and the e-QJ system for applications, appeals and revision applications under the Maharashtra Co-operative Societies Act, 1960.',
        'Grievances can be filed on the Aaple Sarkar portal (grievances.maharashtra.gov.in) in Marathi or English — you get an e-acknowledgment and can track status. Citizen call centre: 1800 120 8040 (toll free).'
      ],
      mr: [
        'सहकारिता, पणन आणि वस्त्रोद्योग विभाग, महाराष्ट्र (mahasahakar.maharashtra.gov.in) नागरिक सेवा ऑनलाइन देतो: सहकारी संस्थांची नोंदणी, बाय-लॉ दुरुस्ती, सुक्काव्याचा परवाना आणि महाराष्ट्र सहकारी संस्था अधिनियम, १९६० अंतर्गत अर्ज, अपील व पुनर्विचार अर्जांसाठी e-QJ प्रणाली.',
        'तक्रार आपले सरकार पोर्टलवर (grievances.maharashtra.gov.in) मराठी किंवा इंग्रजीत नोंदवता येतात — ई-पावती मिळते आणि स्थिती तपासता येते. नागरी कॉल सेंटर: १८०० १२० ८०४० (टोल फ्री).'
      ],
      hi: [
        'सहकारिता, पणन और वस्त्रोद्योग विभाग, महाराष्ट्र (mahasahakar.maharashtra.gov.in) नागरिक सेवाएँ ऑनलाइन देता है: सहकारी समितियों का पंजीकरण, बाय-लॉ संशोधन, सुदूध व्यवसाय लाइसेंस तथा महाराष्ट्र सहकारी समितियाँ अधिनियम, 1960 के तहत आवेदन-अपील-पुनर्विचार के लिए e-QJ प्रणाली।',
        'शिकायतें आपले सरकार पोर्टल (grievances.maharashtra.gov.in) पर मराठी या अंग्रेज़ी में दर्ज की जा सकती हैं — ई-पावती मिलती है और स्थिति ट्रैक कर सकते हैं। नागरिक कॉल सेंटर: 1800 120 8040 (टोल फ्री)।'
      ]
    },
    s: {
      en: ['Visit mahasahakar.maharashtra.gov.in → Services / Grievance Redressal.', 'For appeals under the Act, use the e-QJ system with the order copy.', 'File grievances on grievances.maharashtra.gov.in (Marathi/English) with mobile OTP.', 'Track with the token number; escalate to the superior authority if unsatisfied.'],
      mr: ['mahasahakar.maharashtra.gov.in उघडा → सेवा / तक्रार निवारण.', 'अधिनियमांतर्गत अपीलीसाठी आदेशाची प्रत घेऊन e-QJ प्रणाली वापरा.', 'grievances.maharashtra.gov.in वर मोबाइल OTP सह तक्रार नोंदवा.', 'टोकन क्रमांकाने स्थिती तपासा; तृप्ती न आल्यास वरिष्ठ अधिकाऱ्याकडे वाढवा.'],
      hi: ['mahasahakar.maharashtra.gov.in खोलें → सेवाएँ / शिकायत निवारण।', 'अधिनियम के तहत अपील के लिए आदेश-प्रत के साथ e-QJ प्रणाली उपयोग करें।', 'grievances.maharashtra.gov.in पर मोबाइल OTP सहित शिकायत दर्ज करें।', 'टोकन नंबर से स्थिति ट्रैक करें; संतुष्टि न होने पर वरिष्ठ अधिकारी को बढ़ाएँ।']
    },
    d: {
      en: ['Aadhaar / ID + mobile number (OTP)', 'Order copy / case details for appeals', 'Society registration details'],
      mr: ['आधार / ओळखपत्र + मोबाइल क्रमांक (OTP)', 'अपीलीसाठी आदेशाची प्रत / प्रकरण तपशील', 'संस्थेची नोंदणी तपशील'],
      hi: ['आधार / पहचान + मोबाइल नंबर (OTP)', 'अपील हेतु आदेश-प्रत / प्रकरण विवरण', 'समिति पंजीकरण विवरण']
    },
    src: [
      { name: 'Dept of Cooperation, Marketing & Textiles, Maharashtra', url: 'https://mahasahakar.maharashtra.gov.in/en/services/' },
      { name: 'Aaple Sarkar Grievance Portal', url: 'https://grievances.maharashtra.gov.in/en' }
    ]
  },
  {
    id: 'tn-portal', cat: 'grievance', jur: 'tn',
    kw: ['tamil nadu', 'rcs', 'kooturavu', 'vaadagai', 'chennai', 'தமிழ்நாடு', 'பதிவாளர்', 'கூட்டுறவு', 'மனு', 'இணையம்', 'சேவை'],
    t: {
      en: 'Tamil Nadu RCS portal — e-services for cooperatives',
      ta: 'தமிழ்நாடு கூட்டுறவுப் பதிவாளர் இணையதளம் — கூட்டுறவு மின் சேவைகள்'
    },
    b: {
      en: [
        'The Registrar of Cooperative Societies, Tamil Nadu (rcs.tn.gov.in) offers e-services including Co-op e-Vaadagai online applications, online loan applications, e-RCS status checks and RTI filing for cooperative societies.',
        'Members can use the portal for society-related applications and status tracking. The office is at NVN Natarajan Maligai, Kilpauk, Chennai – 600 010 (phone: 044 2836 4858).'
      ],
      ta: [
        'தமிழ்நாடு கூட்டுறவுச் சங்கங்களின் பதிவாளர் (rcs.tn.gov.in) இணைய விண்ணப்பங்கள், ஆன்லைன் கடன் விண்ணப்பங்கள், e-RCS நிலை சரிபார்ப்பு மற்றும் கூட்டுறவுச் சங்கங்களுக்கான RTI தாக்கல் உள்ளிட்ட மின் சேவைகளை வழங்குகிறது.',
        'உறுப்பினர்கள் சங்கம் தொடர்பான விண்ணப்பங்கள் மற்றும் நிலை கண்காணிப்புக்கு இந்த இணையதளத்தைப் பயன்படுத்தலாம். அலுவலகம்: என்விஎன் நடராஜன் மாளிகை, கிளப்பூர், சென்னை – 600 010 (தொலைபேசி: 044 2836 4858).'
      ]
    },
    s: {
      en: ['Visit rcs.tn.gov.in → Co-op e-Vaadagai / e-services.', 'Choose the service and fill the online application with society details.', 'Attach ID and society documents; note the application number.', 'Check status in e-RCS; contact the district Registrar if delayed.'],
      ta: ['rcs.tn.gov.in செல்லவும் → கூட்டுறவு இ-வாதகை / மின் சேவைகள்.', 'சேவையைத் தேர்ந்தெடுத்து, சங்க விவரங்களுடன் ஆன்லைன் மனுவை நிரப்பவும்.', 'அடையாளச் சான்று மற்றும் சங்க ஆவணங்களை இணைக்கவும்; விண்ணப்ப எண்ணைக் குறிக்கவும்.', 'e-RCS-ல் நிலையைச் சரிபார்க்கவும்; தாமதமானால் மாவட்ட பதிவாளரைத் தொடர்புகொள்ளவும்.']
    },
    d: {
      en: ['ID proof & society registration number', 'Request letter / application form', 'Supporting records of the society'],
      ta: ['அடையாளச் சான்று & சங்கப் பதிவு எண்', 'கோரிக்கைக் கடிதம் / விண்ணப்பப் படிவம்', 'சங்கத்தின் ஆதார ஆவணங்கள்']
    },
    src: [
      { name: 'Registrar of Cooperative Societies, Tamil Nadu', url: 'https://www.rcs.tn.gov.in/' },
      { name: 'RCS TN Portal (Kooturavu)', url: 'https://kooturavu.tn.gov.in/' }
    ]
  }
];
for (const sd of stateDocs) if (!KB.docs.find(d => d.id === sd.id)) KB.docs.push(sd);

fs.writeFileSync(P, JSON.stringify(KB, null, 2));
console.log('kb.json patched — docs:', KB.docs.length, '| samples:', KB.meta.samples.length);
