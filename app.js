/* ============ Sahakar Sathi — frontend ============ */
(function () {
  'use strict';

  /* ---------- UI i18n chrome ---------- */
  const UI = {
    en: {
      placeholder: 'Ask about rights, membership, schemes or grievances…',
      jurisdiction: 'Jurisdiction', disclaimer: 'Simplified guidance from official sources — not a substitute for legal advice.',
      cats: { all: 'All', rights: 'Laws & Rights', schemes: 'Schemes', grievance: 'Grievance', membership: 'Membership', governance: 'Governance', documents: 'Documents' },
      listening: 'Listening… speak now', notSupported: 'Voice input is not supported in this browser.',
      voiceDenied: 'Microphone access was blocked. You can still type your question.',
      send: 'Send', thinking: 'Thinking…', waPlaceholder: 'Type a message…', waWelcome: 'Namaste! Ask me anything about cooperative rights, schemes or grievances.'
    },
    hi: {
      placeholder: 'अधिकार, सदस्यता, योजनाओं या शिकायतों के बारे में पूछें…',
      jurisdiction: 'क्षेत्राधिकार', disclaimer: 'आधिकारिक स्रोतों से सरल मार्गदर्शन — कानूनी सलाह का विकल्प नहीं।',
      cats: { all: 'सभी', rights: 'कानून व अधिकार', schemes: 'योजनाएँ', grievance: 'शिकायत', membership: 'सदस्यता', governance: 'शासन', documents: 'दस्तावेज़' },
      listening: 'सुन रहा हूँ… अब बोलिए', notSupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।',
      voiceDenied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। आप प्रश्न टाइप कर सकते हैं।',
      send: 'भेजें', thinking: 'सोच रहा हूँ…', waPlaceholder: 'संदेश लिखें…', waWelcome: 'नमस्ते! सहकारी अधिकार, योजनाओं या शिकायतों के बारे में कुछ भी पूछें।'
    },
    mr: {
      placeholder: 'अधिकार, सदस्यत्व, योजना किंवा तक्रारींबद्दल विचारा…',
      jurisdiction: 'कार्यक्षेत्र', disclaimer: 'अधिकृत स्रोतांतून सुलभ मार्गदर्शन — कायदेशीर सल्लाचा पर्याय नाही.',
      cats: { all: 'सर्व', rights: 'कायदे व अधिकार', schemes: 'योजना', grievance: 'तक्रार', membership: 'सदस्यत्व', governance: 'शासन', documents: 'कागदपत्रे' },
      listening: 'ऐकत आहे… आता बोला', notSupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही.',
      voiceDenied: 'माइक्रोफोन परवानगी मिळाली नाही. आपण प्रश्न टाइप करू शकता.',
      send: 'पाठवा', thinking: 'विचार करत आहे…', waPlaceholder: 'संदेश लिहा…', waWelcome: 'नमस्कार! सहकारी अधिकार, योजना किंवा तक्रारींबद्दल काहीही विचारा.'
    },
    ta: {
      placeholder: 'உரிமைகள், உறுப்பினராகுதல், திட்டங்கள் அல்லது புகார்கள் குறித்து கேளுங்கள்…',
      jurisdiction: 'அதிகார வரம்பு', disclaimer: 'அதிகாரப்பூர்வ மூலங்களிலிருந்து எளிமையான வழிகாட்டுதல் — சட்ட ஆலோசனைக்கு மாற்றல் அல்ல.',
      cats: { all: 'அனைத்தும்', rights: 'சட்டங்கள் & உரிமைகள்', schemes: 'திட்டங்கள்', grievance: 'புகார்', membership: 'உறுப்பினராகுதல்', governance: 'ஆளுமை', documents: 'ஆவணங்கள்' },
      listening: 'கேட்கிறது… இப்போது பேசுங்கள்', notSupported: 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.',
      voiceDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. கேள்வியை தட்டச்சு செய்யலாம்.',
      send: 'அனுப்பு', thinking: 'சிந்திக்கிறது…', waPlaceholder: 'செய்தி எழுதுங்கள்…', waWelcome: 'வணக்கம்! கூட்டுறவு உரிமைகள், திட்டங்கள் அல்லது புகார்கள் பற்றி எதையும் கேளுங்கள்.'
    },
    bn: {
      placeholder: 'অধিকার, সদস্যপদ, প্রকল্প বা অভিযোগ সম্পর্কে জিজ্ঞাসা করুন…',
      jurisdiction: 'এখতিয়ার', disclaimer: 'সরকারি উৎস থেকে সহজ নির্দেশনা — আইনি পরামর্শের বিকল্প নয়।',
      cats: { all: 'সব', rights: 'আইন ও অধিকার', schemes: 'প্রকল্প', grievance: 'অভিযোগ', membership: 'সদস্যপদ', governance: 'শাসন', documents: 'নথি' },
      listening: 'শুনছি… এখন বলুন', notSupported: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।',
      voiceDenied: 'মাইক্রোফোনের অনুমতি পাওয়া যায়নি। আপনি প্রশ্ন টাইপ করতে পারেন।',
      send: 'পাঠান', thinking: 'ভাবছি…', waPlaceholder: 'বার্তা লিখুন…', waWelcome: 'নমস্কার! সমবায় অধিকার, প্রকল্প বা অভিযোগ নিয়ে যা কিছু জিজ্ঞাসা করুন।'
    },
    te: {
      placeholder: 'హక్కులు, సభ్యత్వం, పథకాలు లేదా ఫిర్యాదుల గురించి అడగండి…',
      jurisdiction: 'అధికార పరిధి', disclaimer: 'అధికారిక మూలాల నుండి సరళమైన మార్గదర్శనం — చట్టపరమైన సలహాకు ప్రత్యామ్నాయం కాదు.',
      cats: { all: 'అన్నీ', rights: 'చట్టాలు & హక్కులు', schemes: 'పథకాలు', grievance: 'ఫిర్యాదు', membership: 'సభ్యత్వం', governance: 'పాలన', documents: 'పత్రాలు' },
      listening: 'వింటున్నాను… ఇప్పుడు మాట్లాడండి', notSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ మద్దతు లేదు.',
      voiceDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. మీరు ప్రశ్నను టైప్ చేయవచ్చు.',
      send: 'పంపండి', thinking: 'ఆలోచిస్తున్నాను…', waPlaceholder: 'సందేశం టైప్ చేయండి…', waWelcome: 'నమస్కారం! సహకార హక్కులు, పథకాలు లేదా ఫిర్యాదుల గురించి ఏదైనా అడగండి.'
    },
    kn: {
      placeholder: 'ಹಕ್ಕುಗಳು, ಸದಸ್ಯತ್ವ, ಯೋಜನೆಗಳು ಅಥವಾ ದೂರುಗಳ ಬಗ್ಗೆ ಕೇಳಿ…',
      jurisdiction: 'ವ್ಯಾಪ್ತಿ', disclaimer: 'ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಸರಳ ಮಾರ್ಗದರ್ಶನ — ಕಾನೂನು ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
      cats: { all: 'ಎಲ್ಲಾ', rights: 'ಕಾನೂನುಗಳು & ಹಕ್ಕುಗಳು', schemes: 'ಯೋಜನೆಗಳು', grievance: 'ದೂರು', membership: 'ಸದಸ್ಯತ್ವ', governance: 'ಆಡಳಿತ', documents: 'ದಾಖಲೆಗಳು' },
      listening: 'ಕೇಳುತ್ತಿದ್ದೇನೆ… ಈಗ ಮಾತನಾಡಿ', notSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.',
      voiceDenied: 'ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ನೀವು ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಬಹುದು.',
      send: 'ಕಳುಹಿಸಿ', thinking: 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…', waPlaceholder: 'ಸಂದೇಶ ಬರೆಯಿರಿ…', waWelcome: 'ನಮಸ್ಕಾರ! ಸಹಕಾರಿ ಹಕ್ಕುಗಳು, ಯೋಜನೆಗಳು ಅಥವಾ ದೂರುಗಳ ಬಗ್ಗೆ ಏನನ್ನೂ ಕೇಳಿ.'
    },
    ml: {
      placeholder: 'അവകാശങ്ങൾ, അംഗത്വം, പദ്ധതികൾ അല്ലെങ്കിൽ പരാതികൾ കുറിച്ച് ചോദിക്കൂ…',
      jurisdiction: 'അധികാരപരിധി', disclaimer: 'ഔദ്യോഗിക ഉറവിടങ്ങളിൽ നിന്നുള്ള ലളിതമായ നിർദ്ദേശം — നിയമോപദേശത്തിന് പകരമല്ല.',
      cats: { all: 'എല്ലാം', rights: 'നിയമങ്ങളും അവകാശങ്ങളും', schemes: 'പദ്ധതികൾ', grievance: 'പരാതി', membership: 'അംഗത്വം', governance: 'ഭരണം', documents: 'രേഖകൾ' },
      listening: 'കേൾക്കുന്നു… ഇപ്പോൾ സംസാരിക്കൂ', notSupported: 'ഈ ബ്രൗസറിൽ വോയ്സ് ഇൻപുട്ട് പിന്തുണയ്ക്കുന്നില്ല.',
      voiceDenied: 'മൈക്രോഫോൺ അനുമതി നിഷേധിച്ചു. ചോദ്യം ടൈപ്പ് ചെയ്യാം.',
      send: 'അയയ്ക്കുക', thinking: 'ചിന്തിക്കുന്നു…', waPlaceholder: 'സന്ദേശം ടൈപ്പ് ചെയ്യൂ…', waWelcome: 'നമസ്കാരം! സഹകരണ അവകാശങ്ങൾ, പദ്ധതികൾ അല്ലെങ്കിൽ പരാതികൾ കുറിച്ച് എന്തും ചോദിക്കൂ.'
    },
    gu: {
      placeholder: 'અધિકારો, સભ્યત્વ, યોજનાઓ અથવા ફરિયાદો વિશે પૂછો…',
      jurisdiction: 'ક્ષેત્ર', disclaimer: 'સત્તાવાર સ્રોતોમાંથી સરળ માર્ગદર્શન — કાનૂની સલાહનો વિકલ્પ નથી.',
      cats: { all: 'બધા', rights: 'કાયદા અને અધિકારો', schemes: 'યોજનાઓ', grievance: 'ફરિયાદ', membership: 'સભ્યત્વ', governance: 'શાસન', documents: 'દસ્તાવેજો' },
      listening: 'સાંભળી રહ્યો છું… હવે બોલો', notSupported: 'આ બ્રાઉઝરમાં વોઇસ ઇનપુટ સમર્થિત નથી.',
      voiceDenied: 'માઇક્રોફોન પરવાનગી નકારાઈ. તમે પ્રશ્ન ટાઇપ કરી શકો છો.',
      send: 'મોકલો', thinking: 'વિચારી રહ્યો છું…', waPlaceholder: 'સંદેશ લખો…', waWelcome: 'નમસ્તે! સહકારી અધિકારો, યોજનાઓ અથવા ફરિયાદો વિશે કંઈપણ પૂછો.'
    },
    pa: {
      placeholder: 'ਅਧਿਕਾਰ, ਮੈਂਬਰਸ਼ਿਪ, ਸਕੀਮਾਂ ਜਾਂ ਸ਼ਿਕਾਇਤਾਂ ਬਾਰੇ ਪੁੱਛੋ…',
      jurisdiction: 'ਖੇਤਰ', disclaimer: 'ਸਰਕਾਰੀ ਸਰੋਤਾਂ ਤੋਂ ਸਰਲ ਰਾਹ ਨਿਰਦੇਸ਼ — ਕਾਨੂੰਨੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ।',
      cats: { all: 'ਸਭ', rights: 'ਕਾਨੂੰਨ ਅਤੇ ਅਧਿਕਾਰ', schemes: 'ਸਕੀਮਾਂ', grievance: 'ਸ਼ਿਕਾਇਤ', membership: 'ਮੈਂਬਰਸ਼ਿਪ', governance: 'ਸਾਸ਼ਨ', documents: 'ਦਸਤਾਵੇਜ਼' },
      listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ… ਹੁਣ ਬੋਲੋ', notSupported: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਇਨਪੁੱਟ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।',
      voiceDenied: 'ਮਾਈਕ੍ਰੋਫੋਨ ਅਨੁਮਤੀ ਨਕਾਰ ਦਿੱਤੀ ਗਈ। ਤੁਸੀਂ ਸਵਾਲ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ।',
      send: 'ਭੇਜੋ', thinking: 'ਸੋਚ ਰਿਹਾ ਹਾਂ…', waPlaceholder: 'ਸੰਦੇਸ਼ ਲਿਖੋ…', waWelcome: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਸਹਿਕਾਰੀ ਅਧਿਕਾਰ, ਸਕੀਮਾਂ ਜਾਂ ਸ਼ਿਕਾਇਤਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।'
    }
  };

  const SPEECH_LOCALES = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', bn: 'bn-IN', te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN', gu: 'gu-IN', pa: 'pa-IN' };

  const state = {
    lang: localStorage.getItem('ss_lang') || 'en',
    jurisdiction: localStorage.getItem('ss_jur') || 'all',
    voiceOut: localStorage.getItem('ss_voiceOut') === '1',
    category: 'all',
    busy: false,
    samples: []
  };

  /* ---------- elements ---------- */
  const $ = id => document.getElementById(id);
  const chatBody = $('chatBody'), chipsRow = $('chipsRow'), chatForm = $('chatForm'),
    chatInput = $('chatInput'), langSel = $('langSel'), jurSel = $('jurSel'),
    micBtn = $('micBtn'), voiceOutBtn = $('voiceOutBtn'), catTabs = $('catTabs'),
    waForm = $('waForm'), waInput = $('waInput'), waMsgs = $('waMsgs');

  const ui = () => UI[state.lang] || UI.en;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- config ---------- */
  async function loadConfig() {
    try {
      const cfg = await (await fetch('/api/config')).json();
      langSel.innerHTML = cfg.languages.map(l =>
        `<option value="${l.id}">${esc(l.label)}</option>`).join('');
      jurSel.innerHTML = cfg.jurisdictions.map(j =>
        `<option value="${j.id}">${esc((j.label && (j.label[state.lang] || j.label.en)) || j.id)}</option>`).join('');
      langSel.value = state.lang;
      jurSel.value = state.jurisdiction;
    } catch (e) { console.warn('config load failed', e); }
  }

  async function loadSamples() {
    try {
      const r = await (await fetch('/api/samples?lang=' + state.lang)).json();
      state.samples = r.samples || [];
      renderChips();
      renderCatTabs();
    } catch (e) { /* ignore */ }
  }

  /* ---------- categories & chips ---------- */
  const CAT_ORDER = ['all', 'rights', 'schemes', 'grievance', 'membership', 'governance', 'documents'];
  function renderCatTabs() {
    catTabs.innerHTML = CAT_ORDER.map(c =>
      `<button type="button" class="cat-tab${state.category === c ? ' active' : ''}" data-cat="${c}">${esc(ui().cats[c] || c)}</button>`).join('');
  }
  function filteredSamples() {
    if (state.category === 'all') return state.samples.slice(0, 4);
    const inCat = state.samples.filter(s => s.cat === state.category);
    return (inCat.length ? inCat : state.samples).slice(0, 4);
  }
  function renderChips() {
    chipsRow.innerHTML = filteredSamples().map(s =>
      `<button type="button" class="chip">${esc(s.q)}</button>`).join('');
  }

  /* ---------- messages ---------- */
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function addUserMsg(text) {
    chatBody.appendChild(el(`<div class="msg user"><div class="user-bubble">${esc(text)}</div></div>`));
    scrollBottom();
  }

  function addTyping() {
    const n = el(`<div class="msg bot" id="typingMsg"><div class="bot-card"><div class="typing"><i></i><i></i><i></i></div></div></div>`);
    chatBody.appendChild(n);
    scrollBottom();
    return n;
  }

  function scrollBottom() { chatBody.scrollTop = chatBody.scrollHeight; }

  function sourceChips(sources) {
    return (sources || []).map(s =>
      `<a class="src-chip" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">🔗 ${esc(s.name)}</a>`).join('');
  }

  function addBotGreeting(text) {
    const node = el(`
      <div class="msg bot">
        <div class="bot-card">
          <div class="bot-section">
            <span class="sec-label">❖ Sahakar Sathi</span>
            <div class="ans-body"><p>${esc(text)}</p></div>
          </div>
        </div>
      </div>`);
    chatBody.appendChild(node);
    scrollBottom();
  }

  function addAnswer(res) {
    const S = res.strings || {};
    let html = `<div class="msg bot"><div class="bot-card">`;

    if (res.mode === 'verified' || res.mode === 'related') {
      const a = res.answer;
      // Understand strip
      if (res.interpret) {
        html += `
        <div class="bot-section">
          <span class="sec-label grey">🎯 ${esc(res.interpret.askLabel)}</span>
          <div class="ask-echo">“${esc(lastQuery)}” — <b>${esc(res.interpret.intentLabel)}</b></div>
        </div>`;
      }
      // Verified answer
      html += `
        <div class="bot-section">
          <div class="badge-row">
            <span class="badge ${res.confidence === 'high' ? 'ok' : 'warn'}">${res.confidence === 'high' ? '✓ ' + esc(S.verifiedLabel || 'Verified answer') : '⚠ ' + esc(S.relatedLabel || 'Related information')}</span>
            <span class="badge jur">📍 ${esc(res.interpret ? res.interpret.jurisdictionLabel : '')}</span>
          </div>
          <span class="sec-label">✅ ${esc(S.verifiedLabel || 'Verified answer')}</span>
          <h4 class="ans-title">${esc(a.title)}</h4>
          <div class="ans-body">${(a.body || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
          ${res.interpret && res.interpret.stateNote ? `<p class="hint">ℹ️ ${esc(res.interpret.stateNote)}</p>` : ''}
        </div>`;
      // State-specific portal card (jurisdiction-aware)
      if (res.stateSpecific) {
        html += `
        <div class="bot-section state-card">
          <span class="sec-label blue">📍 ${esc(res.interpret ? res.interpret.jurisdictionLabel : '')}</span>
          <h4 class="ans-title small">${esc(res.stateSpecific.title)}</h4>
          <div class="ans-body"><p>${esc(res.stateSpecific.body || '')}</p></div>
          <div class="src-row" style="margin-top:6px">${sourceChips(res.stateSpecific.sources)}</div>
        </div>`;
      }
      // Act
      if (a.act && ((a.act.steps && a.act.steps.length) || (a.act.documents && a.act.documents.length))) {
        html += `<div class="bot-section"><span class="sec-label blue">▶ ${esc(S.actLabel || 'Next steps — Act')}</span>`;
        if (a.act.steps && a.act.steps.length) {
          html += `<ol class="act-steps">${a.act.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
        }
        if (a.act.documents && a.act.documents.length) {
          html += `<div style="margin-top:8px"><span class="sec-label grey">📄 ${esc(S.docsLabel || 'Documents you may need')}</span>
            <ul class="doc-list">${a.act.documents.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>`;
        }
        html += `</div>`;
      }
      // Cite
      html += `
        <div class="bot-section">
          <span class="sec-label grey">📎 ${esc(S.sourcesLabel || 'Official sources')}</span>
          <div class="src-row">${sourceChips(a.sources)}</div>
        </div>`;
    } else if (res.mode === 'no-answer') {
      html += `
        <div class="bot-section">
          <div class="badge-row"><span class="badge warn">⚠ ${esc(S.relatedLabel || 'Not verified')}</span></div>
          <div class="ans-body"><p>${esc(res.message)}</p><p class="hint">${esc(res.hint || '')}</p></div>
          ${res.fallbackSources ? `<div class="fallback-src"><b>${esc(S.fallbackSources || '')}</b><div class="src-row" style="margin-top:6px">${sourceChips(res.fallbackSources)}</div></div>` : ''}
        </div>`;
    } else {
      html += `<div class="bot-section"><div class="ans-body"><p>${esc(res.message || '')}</p></div></div>`;
    }

    // suggestions
    if (res.suggestions && res.suggestions.length) {
      html += `<div class="bot-section"><span class="sec-label grey">💡 ${esc(res.relatedLabel || S.relatedQ || 'Related questions')}</span>
        <div class="src-row" style="margin-top:4px">${res.suggestions.map(s => `<button type="button" class="chip" data-q="${esc(s.q)}">${esc(s.q)}</button>`).join('')}</div></div>`;
    }

    const speakable = res.mode === 'verified' || res.mode === 'related'
      ? (res.answer.title + '. ' + (res.answer.body || []).join(' '))
      : (res.message || '');

    html += `
        <div class="bot-footer">
          <button type="button" class="listen-btn" data-speak="${esc(speakable)}">🔊 ${esc(S.listen || 'Listen')}</button>
          <span class="followup">→ ${esc(S.askFollowUp || 'Ask a follow-up question')}</span>
        </div>
      </div></div>`;

    chatBody.appendChild(el(html));
    scrollBottom();
  }

  /* ---------- chat flow ---------- */
  let lastQuery = '';

  async function sendQuery(text) {
    text = String(text || '').trim();
    if (!text || state.busy) return;
    state.busy = true;
    lastQuery = text;
    addUserMsg(text);
    chatInput.value = '';
    const typing = addTyping();

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang: state.lang, jurisdiction: state.jurisdiction })
      });
      const res = await r.json();
      typing.remove();
      if (res.ok) {
        addAnswer(res);
        if (state.voiceOut && (res.mode === 'verified' || res.mode === 'related' || res.mode === 'greeting' || res.mode === 'no-answer')) {
          speak(res.mode === 'verified' || res.mode === 'related'
            ? res.answer.title + '. ' + res.answer.body.join(' ')
            : res.message);
        }
      } else {
        addBotGreeting('Sorry, something went wrong. Please try again.');
      }
    } catch (e) {
      typing.remove();
      addBotGreeting('Network error — please try again.');
    } finally {
      state.busy = false;
      chatInput.focus();
    }
  }

  /* ---------- WhatsApp simulator (uses the real /webhook endpoint) ---------- */
  function waBubble(text, who) {
    const cls = who === 'user' ? 'wa-out' : 'wa-in';
    const node = el(`<div class="wa-msg ${cls}"><div class="wa-bubble">${esc(text)}</div></div>`);
    waMsgs.appendChild(node);
    waMsgs.scrollTop = waMsgs.scrollHeight;
    return node;
  }

  async function waSend(text) {
    text = String(text || '').trim();
    if (!text) return;
    waBubble(text, 'user');
    waInput.value = '';
    const typing = waBubble('…', 'user-wait');
    try {
      const r = await fetch('/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang: state.lang, jurisdiction: state.jurisdiction })
      });
      const d = await r.json();
      typing.remove();
      waBubble(d.reply || d.text?.body || '…', 'bot');
    } catch (e) {
      typing.remove();
      waBubble('Network error — please try again.', 'bot');
    }
  }

  /* ---------- speech: input (STT) ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, listening = false;

  function toggleMic() {
    if (!SR) {
      alert(ui().notSupported);
      return;
    }
    if (listening && rec) { rec.stop(); return; }
    rec = new SR();
    rec.lang = SPEECH_LOCALES[state.lang] || 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => { listening = true; micBtn.classList.add('listening'); chatInput.placeholder = ui().listening; };
    rec.onresult = e => {
      const text = e.results[0][0].transcript;
      chatInput.value = text;
      sendQuery(text);
    };
    rec.onerror = e => {
      listening = false; micBtn.classList.remove('listening');
      chatInput.placeholder = ui().placeholder;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        addBotGreeting(ui().voiceDenied);
      }
    };
    rec.onend = () => { listening = false; micBtn.classList.remove('listening'); chatInput.placeholder = ui().placeholder; };
    try { rec.start(); } catch (e) { /* ignore */ }
  }

  /* ---------- speech: output (TTS) ---------- */
  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = SPEECH_LOCALES[state.lang] || 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(state.lang));
    if (match) utter.voice = match;
    utter.rate = 0.98;
    window.speechSynthesis.speak(utter);
  }

  /* ---------- apply language ---------- */
  function applyLang() {
    document.documentElement.lang = state.lang;
    chatInput.placeholder = ui().placeholder;
    if (waInput) waInput.placeholder = ui().waPlaceholder || 'Type a message…';
    const jurLabel = document.querySelector('.filter span');
    if (jurLabel) jurLabel.textContent = ui().jurisdiction;
    const disc = document.querySelector('.chat-disclaimer');
    if (disc) disc.textContent = ui().disclaimer;
    renderCatTabs();
    renderChips();
  }

  /* ---------- events ---------- */
  chatForm.addEventListener('submit', e => { e.preventDefault(); sendQuery(chatInput.value); });

  chatBody.addEventListener('click', e => {
    const chip = e.target.closest('.chip[data-q]');
    if (chip) { sendQuery(chip.getAttribute('data-q')); return; }
    const listen = e.target.closest('.listen-btn');
    if (listen) {
      const txt = listen.getAttribute('data-speak') || '';
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        listen.textContent = '🔊 ' + (ui().listen || 'Listen');
      } else {
        speak(txt);
        listen.textContent = '⏹ ' + (ui().stop || 'Stop');
      }
    }
  });

  chipsRow.addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (c) sendQuery(c.textContent);
  });

  catTabs.addEventListener('click', e => {
    const b = e.target.closest('.cat-tab');
    if (!b) return;
    state.category = b.dataset.cat;
    renderCatTabs();
    renderChips();
  });

  langSel.addEventListener('change', () => {
    state.lang = langSel.value;
    localStorage.setItem('ss_lang', state.lang);
    loadConfig().then(() => { jurSel.value = state.jurisdiction; applyLang(); loadSamples(); });
  });

  jurSel.addEventListener('change', () => {
    state.jurisdiction = jurSel.value;
    localStorage.setItem('ss_jur', state.jurisdiction);
  });

  micBtn.addEventListener('click', toggleMic);

  voiceOutBtn.addEventListener('click', () => {
    state.voiceOut = !state.voiceOut;
    voiceOutBtn.setAttribute('aria-pressed', String(state.voiceOut));
    localStorage.setItem('ss_voiceOut', state.voiceOut ? '1' : '0');
    if (!state.voiceOut && window.speechSynthesis) window.speechSynthesis.cancel();
    if (state.voiceOut) speak(state.lang === 'hi' ? 'आवाज़ जवाब चालू है।' : 'Voice replies enabled.');
  });

  if (waForm) {
    waForm.addEventListener('submit', e => { e.preventDefault(); waSend(waInput.value); });
  }

  // nav active state
  document.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  }));

  /* ---------- init ---------- */
  (async function init() {
    await loadConfig();
    applyLang();
    voiceOutBtn.setAttribute('aria-pressed', String(state.voiceOut));
    await loadSamples();
    // welcome message in main chat (localized via /api/chat greeting)
    const r = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hello', lang: state.lang, jurisdiction: state.jurisdiction })
    });
    const res = await r.json();
    addBotGreeting(res.message || 'Namaste!');
    // WhatsApp simulator welcome bubble
    if (waMsgs) waBubble(ui().waWelcome || 'Namaste!', 'bot');
    chatInput.focus({ preventScroll: true });
  })();
})();
