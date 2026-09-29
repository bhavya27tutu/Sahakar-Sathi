/* Patch server.js: add kn/ml/gu/pa to INTENT_LABELS, add detectLang, webhook helpers, config langs */
const fs = require('fs');
const P = __dirname + '/../server.js';
let s = fs.readFileSync(P, 'utf8');

/* ---- 1. INTENT_LABELS: append new languages to each intent line ---- */
const start = s.indexOf('const INTENT_LABELS');
const end = s.indexOf('};', start);
let block = s.slice(start, end);

const extras = {
  'rights: {': "kn: '\u0cb8\u0cb9\u0c95\u0cbe\u0cb0\u0cbf \u0cb8\u0ca6\u0cb8\u0ccd\u0caf\u0cb0 \u0cb9\u0c95\u0ccd\u0c95\u0cc1\u0c97\u0cb3\u0cc1', ml: '\u0d38\u0d39\u0d15\u0d30\u0d23 \u0d05\u0d02\u0d17 \u0d05\u0d35\u0d15\u0d3e\u0d36\u0d19\u0d4d\u0d15\u0d33\u0d4d', gu: '\u0ab8\u0ac9\u0a95\u0abe\u0ab0\u0acb \u0ab8\u0aad\u0acd\u0aaf\u0a86\u0aa8\u0abe \u0a85\u0a27\u0bf1\u0a15\u0abe\u0ab0\u0acb', pa: '\u0a38\u0a39\u0a3f\u0a15\u0a3e\u0a30\u0a40 \u0a2e\u0a48\u0a70\u0a2c\u0a30 \u0a05\u0a27\u0a3f\u0a15\u0a3e\u0a30'",
  'membership: {': "kn: '\u0cb8\u0ca6\u0cb8\u0ccd\u0caf\u0ca4\u0ccd\u0cb5\u0ca8\u0cbe\u0c97\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1 \u0cb9\u0cc7\u0c97\u0cc6', ml: '\u0d38\u0d39\u0d15\u0d30\u0d23 \u0d05\u0d02\u0d17\u0d2e\u0d3e\u0d15\u0d32\u0d4d', gu: '\u0ab8\u0ac9\u0a95\u0abe\u0ab0\u0acb \u0a38\u0aad\u0acd\u0aaf \u0a15\u0ac7\u0ab5\u0acb \u0ab0\u0ac0\u0aa4\u0ac7 \u0aac\u0aa8\u0ab5\u0ac1\u0a82', pa: '\u0a38\u0a39\u0a3f\u0a15\u0a3e\u0a30\u0a40 \u0a2e\u0a48\u0a70\u0a2c\u0a30 \u0a2c\u0a23\u0a28\u0a3e'",
  'governance: {': "kn: '\u0cb8\u0ca6\u0cb8\u0ccd\u0caf\u0cbf \u0c86\u0ca1\u0cb3\u0cbf\u0ca4 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c9a\u0cc1\u0ca8\u0abe\u0cb5\u0ca3\u0cc6\u0c97\u0cb3\u0cbf\u0c97\u0cb3\u0cc1', ml: '\u0d38\u0d39\u0d15\u0d30\u0d23\u0d24\u0d4d\u0d24\u0d3f\u0d32\u0d46 \u0d2d\u0d30\u0d23\u0d35\u0d41\u0d02 \u0d24\u0d3f\u0d30\u0d02\u0d1e\u0d4d\u0d1e\u0d46\u0d21\u0d41\u0d2a\u0d4d\u0d2a\u0d41\u0d15\u0d33\u0d4d', gu: '\u0ab8\u0ac9\u0a95\u0abe\u0ab0\u0acb \u0ab6\u0abe\u0ab8\u0aa8 \u0a85\u0a28\u0ac7 \u0a9a\u0ac2\u0a82\u0a9f\u0aa3\u0ac0\u0a93', pa: '\u0a38\u0a39\u0a3f\u0a15\u0a3e\u0a30\u0a40 \u0a38\u0a3e\u0a36\u0a28 \u0a05\u0a24\u0a47 \u0a1a\u0a4b\u0a23\u0a3e\u0a02'",
  'grievance: {': "kn: '\u0ca6\u0cc2\u0cb0\u0cc1 \u0ca6\u0cbe\u0c96\u0cb2\u0cbf\u0cb8\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1 \u0cb9\u0cc7\u0c97\u0cc6', ml: '\u0d2a\u0d30\u0d3e\u0d24\u0d3f \u0d28\u0d32\u0d4d\u0d15\u0d3e\u0d02', gu: '\u0a2b\u0ab0\u0bf1\u0a2f\u0a3e\u0a26 \u0a28\u0a4b\u0a02\u0aa7\u0abe\u0ab5\u0ac0', pa: '\u0a38\u0a39\u0a3f\u0a15\u0a3e\u0a07\u0a24 \u0a26\u0a30\u0a1c \u0a15\u0a30\u0a40\u0a0f'",
  'appeal: {': "kn: '\u0ca8\u0cbf\u0cb0\u0ccd\u0ca7\u0cbe\u0cb0\u0ca6 \u0cb5\u0cbf\u0cb0\u0cc1\u0ca6\u0ccd\u0ca7 \u0cae\u0cc7\u0cb2\u0cc5\u0cae\u0ca8\u0cb5\u0cbf', ml: '\u0d24\u0d40\u0d30\u0d41\u0d2e\u0d3e\u0d28\u0d24\u0d4d\u0d24\u0d3f\u0d28\u0d4d\u0d3e\u0d32\u0d47\u0d24\u0d3f\u0d30\u0d46 \u0d05\u0d2a\u0d4d\u0d2a\u0d40\u0d32\u0d4d', gu: '\u0a28\u0abf\u0ab0\u0acd\u0a23\u0a2f \u0ab8\u0abe\u0aae\u0ac7 \u0a05\u0aaa\u0ac0\u0ab2', pa: '\u0a2b\u0a48\u0a38\u0a32\u0a47 \u0a26\u0a47 \u0a35\u0a3f\u0a30\u0a41\u0a71\u0a27 \u0a05\u0a2a\u0a40\u0a32'",
  'schemes: {': "kn: '\u0cb8\u0ca6\u0cb8\u0ccd\u0caf \u0caf\u0cbf\u0c9c\u0ca8\u0cc6\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0ca7\u0ca8\u0cb8\u0cb9\u0cbe\u0caf', ml: '\u0d38\u0d39\u0d15\u0d30\u0d23 \u0d2a\u0d26\u0d4d\u0d27\u0d24\u0d3f\u0d15\u0d33\u0d41\u0d02 \u0d27\u0d28\u0d38\u0d39\u0d3e\u0d2f\u0d02', gu: '\u0ab8\u0ac9\u0a95\u0abe\u0ab0\u0acb \u0a2f\u0acb\u0a1c\u0a28\u0abe\u0a93 \u0a85\u0a28\u0ac7 \u0aad\u0a82\u0aa1\u0acb\u0ab3', pa: '\u0a38\u0a39\u0a3f\u0a15\u0a3e\u0a30\u0a40 \u0a38\u0a15\u0a40\u0a2e\u0a3e\u0a02 \u0a05\u0a24\u0a47 \u0a2b\u0a70\u0a21'"
};

let patched = 0;
for (const [key, extra] of Object.entries(extras)) {
  const idx = block.indexOf(key);
  if (idx < 0) { console.log('MISS', key); continue; }
  const lineEnd = block.indexOf('},', idx);
  if (lineEnd < 0) { console.log('MISS end', key); continue; }
  block = block.slice(0, lineEnd) + ', ' + extra + block.slice(lineEnd);
  patched++;
}
s = s.slice(0, start) + block + s.slice(end);

/* ---- 2. detectLang + plainText helpers, inserted before the static file server section ---- */
const anchor = "/* ------------------------------------------------------------------ *\n *  Static file server";
const helpers = `
/* ------------------------------------------------------------------ *
 *  WhatsApp helpers: language detection from script + plain-text reply
 * ------------------------------------------------------------------ */
function detectLang(text) {
  const t = String(text || '');
  if (/[\\u0B80-\\u0BFF]/.test(t)) return 'ta';
  if (/[\\u0980-\\u09FF]/.test(t)) return 'bn';
  if (/[\\u0C00-\\u0C7F]/.test(t)) return 'te';
  if (/[\\u0C80-\\u0CFF]/.test(t)) return 'kn';
  if (/[\\u0D00-\\u0D7F]/.test(t)) return 'ml';
  if (/[\\u0A80-\\u0AFF]/.test(t)) return 'gu';
  if (/[\\u0A00-\\u0A7F]/.test(t)) return 'pa';
  if (/[\\u0900-\\u097F]/.test(t)) return 'hi'; // Devanagari → Hindi (Marathi falls back gracefully)
  return 'en';
}

function plainText(res) {
  if (res.mode === 'greeting') return res.message;
  if (res.mode === 'no-answer') return res.message + '\\n\\n' + (res.hint || '');
  const a = res.answer, S = res.strings || STRINGS.en;
  let out = '\u2705 ' + a.title + '\\n\\n' + (a.body || []).join('\\n\\n');
  if (res.stateSpecific) out += '\\n\\n\ud83d\udccd ' + res.stateSpecific.title + '\\n' + res.stateSpecific.body;
  if (a.act && a.act.steps && a.act.steps.length)
    out += '\\n\\n\u25b6 ' + (S.actLabel || 'Next steps') + ':\\n' + a.act.steps.map((x, i) => (i + 1) + '. ' + x).join('\\n');
  if (a.act && a.act.documents && a.act.documents.length)
    out += '\\n\\n\ud83d\udcc4 ' + (S.docsLabel || 'Documents') + ':\\n' + a.act.documents.map(x => '\u2022 ' + x).join('\\n');
  if (a.sources && a.sources.length)
    out += '\\n\\n\ud83d\udcce ' + (S.sourcesLabel || 'Sources') + ':\\n' + a.sources.map(x => '\u2022 ' + x.name + ': ' + x.url).join('\\n');
  out += '\\n\\n_' + (S.disclaimer || '') + '_';
  return out;
}

`;
if (!s.includes('function detectLang')) {
  if (!s.includes(anchor)) { console.log('MISS anchor for helpers'); process.exit(1); }
  s = s.replace(anchor, helpers + anchor);
}

/* ---- 3. retrieve(): state gating + stronger jurisdiction bonus ---- */
const oldBonus = `    if (jurisdiction && jurisdiction !== 'all' && doc.jur === jurisdiction) score += 1;`;
const newBonus = `    const isStateDoc = doc.jur !== 'all' && doc.jur !== 'central';
    if (isStateDoc) {
      if (jurisdiction === doc.jur) score += 3;           // user's selected/mentioned state
      else score *= 0.35;                                  // don't leak other states' docs
    } else if (jurisdiction && jurisdiction !== 'all' && doc.jur === jurisdiction) score += 1;`;
if (s.includes(oldBonus)) s = s.replace(oldBonus, newBonus);
else console.log('MISS retrieve bonus line');

/* ---- 4. handleChat(): attach state-specific doc to verified/related answers ---- */
const oldConf = `  // Step 4 — CITE: attach official sources
  return {`;
const newConf = `  // Jurisdiction extra: surface the selected state's own portal/grievance doc
  const stateDoc = jurisdiction !== 'all'
    ? KB.docs.find(dd => dd.jur === jurisdiction && dd.id !== doc.id)
    : null;

  // Step 4 — CITE: attach official sources
  return {`;
if (s.includes(oldConf)) s = s.replace(oldConf, newConf);
else console.log('MISS cite anchor');

const oldRel = `    relatedLabel: S.relatedQ,
    detected: { intent, jurisdiction, topScore: +top.score.toFixed(2) },`;
const newRel = `    relatedLabel: S.relatedQ,
    stateSpecific: stateDoc ? {
      id: stateDoc.id,
      title: localize(stateDoc.t, lang),
      body: (localize(stateDoc.b, lang) || [])[0],
      sources: stateDoc.src || []
    } : null,
    detected: { intent, jurisdiction, topScore: +top.score.toFixed(2) },`;
if (s.includes(oldRel)) s = s.replace(oldRel, newRel);
else console.log('MISS relatedLabel anchor');

/* ---- 5. /api/config languages += kn, ml, gu, pa ---- */
const oldLangs = `{ id: 'ta', label: 'தமிழ்' },
        { id: 'bn', label: 'বাংলা' }, { id: 'te', label: 'తెలుగు' }`;
const newLangs = `{ id: 'ta', label: 'தமிழ்' },
        { id: 'bn', label: 'বাংলা' }, { id: 'te', label: 'తెలుగు' },
        { id: 'kn', label: 'ಕನ್ನಡ' }, { id: 'ml', label: 'മലയാളം' },
        { id: 'gu', label: 'ગુજરાતી' }, { id: 'pa', label: 'ਪੰਜਾਬੀ' }`;
if (s.includes(oldLangs)) s = s.replace(oldLangs, newLangs);
else console.log('MISS languages list');

fs.writeFileSync(P, s);
console.log('server.js patched — intent labels:', patched);
