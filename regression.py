#!/usr/bin/env python3
"""Sahakar Sathi regression suite — Phase 1 + Phase 2."""
import json, urllib.request, urllib.parse, sys

BASE = "http://localhost:3000"

def post(path, obj):
    req = urllib.request.Request(BASE + path, data=json.dumps(obj).encode(),
                                 headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=10).read())

def get(path):
    return json.loads(urllib.request.urlopen(BASE + path, timeout=10).read())

def chat_case(name, q, lang, jur, exp):
    d = post("/api/chat", {"message": q, "lang": lang, "jurisdiction": jur})
    mode = d.get("mode")
    got = (d.get("answer") or {}).get("id") if mode in ("verified", "related") else mode
    ok = (exp is None and got not in (None, "no-answer")) or got == exp
    return ok, f"{name:20s} mode={mode} intent={(d.get('detected') or {}).get('intent')} got={got} exp={exp}"

results = []

# ---- Phase 1: original 24 ----
p1 = [
 ("en rights",   "What are my rights as a cooperative member?", "en", "all", "member-rights"),
 ("en become",   "How do I become a member of a cooperative society?", "en", "all", "become-member"),
 ("en griev",    "How do I file a grievance?", "en", "all", "grievance-filing"),
 ("en scheme",   "What government schemes help cooperatives?", "en", "all", None),
 ("en elect",    "When are elections for the managing committee?", "en", "all", "governance-elections"),
 ("en docs",     "Which documents do I need for registration?", "en", "all", "documents-checklist"),
 ("en appeal",   "How do I appeal against a decision?", "en", "all", "grievance-appeal"),
 ("en bylaws",   "Where can I see the bylaws of a society?", "en", "all", "bylaws-records"),
 ("en ncdc",     "Tell me about NCDC funding", "en", "all", "scheme-ncdc"),
 ("en shg",      "How do women self-help groups get loans?", "en", "all", "scheme-nrlm"),
 ("en sfurti",   "What is the Sfurti scheme for MSMEs?", "en", "all", "scheme-sfurti"),
 ("tomato",      "What is the price of tomatoes?", "en", "all", "no-answer"),
 ("joke",        "Tell me a joke", "en", "all", "no-answer"),
 ("hello",       "hello", "en", "all", "greeting"),
 ("hi griev",    "मैं शिकायत कैसे दर्ज करूँ?", "hi", "all", "grievance-filing"),
 ("mr become",   "मी सहकारी सदस्य कसा व्हावा?", "mr", "all", "become-member"),
 ("ta scheme",   "கூட்டுறவுக்கு என்ன திட்டம் இருக்கிறது?", "ta", "all", None),
 ("bn member",   "কীভাবে আমি সমবায় সদস্য হতে পারি?", "bn", "all", "become-member"),
 ("bn rights",   "সমবায়ের সদস্যর অধিকার কী?", "bn", "all", "member-rights"),
 ("te become",   "నేను సహకార సభ్యుడిగా ఎలా మారాలి?", "te", "all", "become-member"),
 ("te griev",    "నేను ఫిర్యాదు ఎలా దాఖలు చేయాలి?", "te", "all", "grievance-filing"),
 ("mr bylaws",   "सहकारी संस्थेचे नियमावली कुठे बघता येतील?", "mr", "all", "bylaws-records"),
 ("ta rights",   "கூட்டுறவு உறுப்பினராக என் உரிமைகள் என்ன?", "ta", "all", "member-rights"),
 ("en juris up", "What are my rights?", "en", "up", "member-rights"),
]
for c in p1: results.append(("P1", ) + chat_case(*c))

# ---- Phase 2: new languages ----
p2 = [
 ("kn greet",   "ನಮಸ್ಕಾರ", "kn", "all", "greeting"),
 ("kn rights",  "ಸಹಕಾರಿ ಸದಸ್ಯನಾಗಿ ನನ್ನ ಹಕ್ಕುಗಳೇನು?", "kn", "all", "member-rights"),
 ("kn scheme",  "ನಮ್ಮ ಸಹಕಾರಿ ಯಾವ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?", "kn", "all", None),
 ("kn griev",   "ದೂರು ಹೇಗೆ ದಾಖಲಿಸಬೇಕು?", "kn", "all", "grievance-filing"),
 ("ml greet",   "നമസ്കാരം", "ml", "all", "greeting"),
 ("ml member",  "എങ്ങനെ ഞാൻ സഹകരണ അംഗമാകും?", "ml", "all", "become-member"),
 ("ml scheme",  "ഞങ്ങളുടെ സഹകരണത്തിന് ഏതൊക്കെ പദ്ധതികൾക്ക് അപേക്ഷിക്കാം?", "ml", "all", None),
 ("ml docs",    "എനിക്ക് ഏതൊക്കെ രേഖകൾ വേണം?", "ml", "all", "documents-checklist"),
 ("gu greet",   "નમસ્તે", "gu", "all", "greeting"),
 ("gu docs",    "મને કયા દસ્તાવેજો જોઈએ?", "gu", "all", "documents-checklist"),
 ("gu appeal",  "સહકારીના નિર્ણય સામે અપીલ કેવી રીતે કરવી?", "gu", "all", "grievance-appeal"),
 ("pa greet",   "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "pa", "all", "greeting"),
 ("pa elect",   "ਸਹਿਕਾਰੀ ਚੋਣਾਂ ਕਦੋਂ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?", "pa", "all", "governance-elections"),
 ("pa griev",   "ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰਾਈਏ?", "pa", "all", "grievance-filing"),
 ("pa rights",  "ਸਹਿਕਾਰੀ ਮੈਂਬਰ ਵਜੋਂ ਮੇਰੇ ਅਧਿਕਾਰ ਕੀ ਹਨ?", "pa", "all", "member-rights"),
 ("en greet in","नमस्ते", "en", "all", "greeting"),
]
for c in p2: results.append(("P2", ) + chat_case(*c))

# ---- Phase 2: state-specific ----
for jur, exp in [("up", "up-portal"), ("mh", "mh-portal"), ("tn", "tn-portal")]:
    d = post("/api/chat", {"message": "What are the online services in my state?", "lang": "en", "jurisdiction": jur})
    got = (d.get("answer") or {}).get("id")
    ok = got == exp
    results.append(("STATE", ok, f"state query {jur:10s} got={got} exp={exp}"))

# state-specific attach on generic answer
for jur, exp in [("up", "up-portal"), ("mh", "mh-portal"), ("tn", "tn-portal")]:
    d = post("/api/chat", {"message": "How do I file a grievance?", "lang": "en", "jurisdiction": jur})
    ss = (d.get("stateSpecific") or {}).get("id")
    top = (d.get("answer") or {}).get("id")
    ok = ss == exp and top == "grievance-filing"
    results.append(("STATE", ok, f"stateSpecific {jur:10s} ss={ss} top={top}"))

# generic query must NOT surface state docs
d = post("/api/chat", {"message": "How do I file a grievance?", "lang": "en", "jurisdiction": "all"})
ss = d.get("stateSpecific")
ok = not ss
results.append(("STATE", ok, f"all-India no stateSpecific: {ss}"))

# state query mentioned in text
d = post("/api/chat", {"message": "cooperativeup.gov.in pe kya seva milti hai", "lang": "en", "jurisdiction": "all"})
got = (d.get("answer") or {}).get("id")
ok = got == "up-portal"
results.append(("STATE", ok, f"UP mentioned in text  got={got}"))

# Marathi query hits MH portal
d = post("/api/chat", {"message": "महाराष्ट्र सहकारिता विभाग ई-सेवा", "lang": "mr", "jurisdiction": "all"})
got = (d.get("answer") or {}).get("id")
ok = got == "mh-portal"
results.append(("STATE", ok, f"mr MH e-services      got={got}"))

# ---- Webhook ----
url = BASE + "/webhook?" + urllib.parse.urlencode(
    {"hub.mode": "subscribe", "hub.verify_token": "sahakar-sathi-2026", "hub.challenge": "999"})
ch = urllib.request.urlopen(url).read().decode()
results.append(("HOOK", ch == "999", f"verify challenge returned {ch}"))

try:
    url2 = BASE + "/webhook?" + urllib.parse.urlencode(
        {"hub.mode": "subscribe", "hub.verify_token": "WRONG", "hub.challenge": "999"})
    urllib.request.urlopen(url2); results.append(("HOOK", False, "wrong token accepted!"))
except Exception as e:
    results.append(("HOOK", getattr(e, "code", None) == 403, "wrong token rejected 403"))

d = post("/webhook", {"message": "सहकारी सदस्य के अधिकार क्या हैं?"})
results.append(("HOOK", d.get("lang") == "hi" and d.get("mode") == "verified",
                f"simple auto-lang hi -> {d.get('lang')}/{d.get('mode')}"))

d = post("/webhook", {"message": "தமிழ்நாட்டில் புகார் எப்படி?"})
results.append(("HOOK", d.get("lang") == "ta", f"simple auto-lang ta -> {d.get('lang')}"))

d = post("/webhook", {"message": "ದೂರು ಹೇಗೆ ದಾಖಲಿಸಬೇಕು?"})
results.append(("HOOK", d.get("lang") == "kn", f"simple auto-lang kn -> {d.get('lang')}"))

meta = {"object": "whatsapp_business_account",
        "entry": [{"changes": [{"value": {
            "messaging_product": "whatsapp",
            "messages": [{"from": "919999999999", "id": "wamid.x", "type": "text",
                          "text": {"body": "What are my rights?"}}]
        }, "field": "messages"}]}]}
req = urllib.request.Request(BASE + "/webhook", data=json.dumps(meta).encode(),
                             headers={"Content-Type": "application/json"})
d = json.loads(urllib.request.urlopen(req).read())
ok = d.get("type") == "text" and d.get("to") == "919999999999" and "rights" in d.get("text", {}).get("body", "").lower()
results.append(("HOOK", ok, f"Meta Cloud API shape reply to={d.get('to')}"))

# audio-type message gets graceful text reply
meta2 = json.loads(json.dumps(meta))
meta2["entry"][0]["changes"][0]["value"]["messages"][0] = {
    "from": "919999999999", "id": "wamid.y", "type": "audio", "audio": {"id": "abc"}}
req = urllib.request.Request(BASE + "/webhook", data=json.dumps(meta2).encode(),
                             headers={"Content-Type": "application/json"})
d = json.loads(urllib.request.urlopen(req).read())
ok = d.get("type") == "text" and "text" in str(d.get("text", {}).get("body", "")).lower()
results.append(("HOOK", ok, "audio note -> graceful text reply"))

# ---- Config / samples ----
cfg = get("/api/config")
results.append(("CFG", len(cfg["languages"]) == 10, f"10 languages: {[l['id'] for l in cfg['languages']]}"))
results.append(("CFG", len(cfg["jurisdictions"]) == 6, f"6 jurisdictions: {[j['id'] for j in cfg['jurisdictions']]}"))
for l in ["en", "hi", "mr", "ta", "bn", "te", "kn", "ml", "gu", "pa"]:
    s = get(f"/api/samples?lang={l}")["samples"]
    results.append(("CFG", len(s) == 6, f"samples[{l}] = {len(s)}"))
h = get("/api/health")
results.append(("CFG", h.get("ok") and h.get("docs") == 13, f"health: {h}"))

# ---- output ----
fails = 0
for grp, ok, msg in results:
    if not ok:
        fails += 1
        print(f"FAIL [{grp}] {msg}")
print(f"\n{len(results) - fails}/{len(results)} passed", "✅" if fails == 0 else f"❌ {fails} failed")
sys.exit(1 if fails else 0)
