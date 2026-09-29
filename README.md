# Sahakar Sathi — Multilingual AI Chatbot for the Cooperative Sector

Built from the three SIH slides (`uploads/sih1–3.png`): a **voice + text, 6→10-language RAG chatbot** for cooperative societies with verified answers, a real **WhatsApp webhook**, **state-specific knowledge** that changes answers by jurisdiction, and an embedded **demo narration**.

**Run it**

```bash
cd sahakar-sathi
node server.js          # http://localhost:3000  (zero npm dependencies)
```

**Test it**

```bash
python3 scripts/regression.py    # 69 checks — languages, states, webhook, config
```

---

## Slide → Code map

| Slide requirement | Where it lives |
|---|---|
| Ask → Understand → Act flow | hero pipeline + chat panel sections (`public/index.html`, `addAnswer()` in `public/app.js`) |
| Multilingual + voice | `STRINGS`/`INTENTS`/`UI` i18n in `server.js` & `app.js`; SpeechRecognition STT, speechSynthesis TTS |
| RAG pipeline Retrieve → Verify → Generate → Cite | `retrieve()` → confidence gate → `plainText()`/answer build → `sources` (`server.js`) |
| WhatsApp access flow | on-page **live simulator** → real `POST /webhook` (Meta Cloud API format) |
| Website access flow | `public/app.js` → `POST /api/chat` |
| Feasibility & risks section | mirrored in `public/index.html` |

## Features

1. **Verified RAG answers** — every sentence is grounded in retrieved knowledge-base documents; below the confidence threshold the bot says *"I don't have verified information"* instead of guessing (with official fallback links).
2. **Ask → Understand → Act** — each answer shows: your interpreted question (intent + jurisdiction), the verified answer, numbered next steps, required documents, and cited official sources.
3. **10 languages** — English, हिन्दी, मराठी, தமிழ், বাংলা, తెలుగు, ಕನ್ನಡ, മലയാളം, ગુજરાતી, ਪੰਜਾਬੀ. UI chrome, titles, samples, jurisdiction labels and intent keywords are translated; detailed answer bodies fall back to English for the newer languages (same pattern as bn/te). Voice input + read-aloud via browser speech APIs.
4. **Jurisdiction-aware (state-specific knowledge)** — the jurisdiction selector actually changes answers: selecting **UP / Maharashtra / Tamil Nadu** attaches that state's official portal card, state-named queries surface the matching state doc, and another state's document can never leak into your answer.
5. **WhatsApp** —
   - `GET /webhook` — Meta verification handshake (`hub.verify_token`, default `sahakar-sathi-2026`, override with `WHATSAPP_VERIFY_TOKEN`).
   - `POST /webhook` — accepts the **Meta Cloud API** payload (`entry[0].changes[0].value.messages[0]`, text/button; audio gets a graceful "please type" reply) **or** the simulator form `{message, lang, jurisdiction}`. Replies in Cloud API shape. Language is auto-detected from script (Devanagari→hi, Bengali→bn, Tamil→ta, Telugu→te, Kannada→kn, Malayalam→ml, Gujarati→gu, Gurmukhi→pa, else en).
   - The page ships a **phone-frame simulator** in "How citizens access it" that calls this same endpoint live.
6. **Demo narration** — an embedded `<audio>` player (`public/demo-narration.mp3`) walking through the Ask → Understand → Act journey.

## API

| Route | Method | Description |
|---|---|---|
| `/api/chat` | POST | `{message, lang, jurisdiction}` → `{ok, mode, answer{title, body, act{steps, documents}, sources}, interpret, confidence, suggestions, stateSpecific, detected, candidates}` |
| `/api/config` | GET | languages (10) + jurisdictions (6) for the selectors |
| `/api/samples?lang=` | GET | 6 sample questions in the given language |
| `/api/health` | GET | status + document count |
| `/webhook` | GET | Meta Cloud API verification handshake |
| `/webhook` | POST | WhatsApp message in, plain-text reply out (Cloud API or simulator JSON) |

`mode`: `verified` (confidence ≥ 2.5) · `related` (≥ 1.4, flagged as unconfirmed) · `no-answer` · `greeting`.

## Knowledge base (`data/kb.json`, 13 docs)

Core (All-India): `member-rights`, `become-member`, `governance-elections`, `grievance-filing`, `grievance-appeal`, `bylaws-records`, `scheme-ncdc`, `scheme-nrlm`, `scheme-sfurti`, `documents-checklist`.

State-specific: `up-portal`, `mh-portal`, `tn-portal` — sourced from cooperativeup.gov.in, mahasahakar.maharashtra.gov.in, rcs.tn.gov.in. State docs get **+3** when the jurisdiction matches and are **penalised ×0.35** otherwise, so they surface only when relevant.

Doc fields: `cat` · `jur` (`all|up|mh|tn|ka|br|central`) · `kw` (multilingual) · `t` (titles) · `b` (bodies) · `s` (summary) · `d` (documents) · `src` (citations). Add a doc, restart, done.

## Scoring (retrieve)

```
score = kw×2.5 + title×3 + body-token×0.8 + phrase-bonus×1.5
      + intent bonus (+2 top / +1 second) + jurisdiction (+1 all-docs, +3 state-doc match; ×0.35 state-doc mismatch)
```

Intent detection: word-boundary exact match (+1.5, +2 if word > 6 chars) and prefix match (+0.8, word ≥ 5). Language detection for voice/webhook is script-range based.

## Layout

```
sahakar-sathi/
├── server.js               # zero-dep HTTP server, RAG, i18n, webhook
├── data/kb.json            # 13 verified docs (en/hi/mr/ta full; bn/te/kn/ml/gu/pa titles+kw)
├── scripts/
│   ├── regression.py       # 69-check test suite
│   ├── patch-kb.js         # one-shot Phase-2 KB patch
│   ├── patch-server.js     # one-shot Phase-2 server patch
│   └── patch-intents.js    # one-shot intent patch
└── public/
    ├── index.html          # landing page (slides mirror + WhatsApp simulator + narration)
    ├── app.js              # chat UI, speech, simulator
    ├── styles.css
    └── demo-narration.mp3  # voice-over of the citizen journey
```

## Disclaimer

Content is simplified guidance compiled from official sources (cooperation.gov.in, indiacode.nic.in, ncdc.coop, nrlm.gov.in, msme.gov.in, nalsa.nic.in, state portals), not legal advice. Verify against the cited sources before acting.
