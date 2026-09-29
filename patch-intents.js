/* Add kn/ml/gu/pa words to INTENTS + application keywords to scheme docs */
const fs = require('fs');
const SP = __dirname + '/../server.js';
const KP = __dirname + '/../data/kb.json';

let s = fs.readFileSync(SP, 'utf8');
const start = s.indexOf('const INTENTS = [');
const end = s.indexOf('];', start);
let block = s.slice(start, end);

const extras = {
  "id: 'greeting'": "kn: ['ನಮಸ್ಕಾರ'], ml: ['നമസ്കാരം'], gu: ['નમસ્તે'], pa: ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ']",
  "id: 'rights'": "kn: ['ಹಕ್ಕುಗಳು', 'ಸದಸ್ಯ'], ml: ['അവകാശങ്ങൾ', 'അംഗം'], gu: ['અધિકારો', 'સભ્ય'], pa: ['ਅਧਿਕਾਰ', 'ਮੈਂਬਰ']",
  "id: 'membership'": "kn: ['ಸದಸ್ಯತ್ವ', 'ಅರ್ಜಿ'], ml: ['അംഗത്വം', 'അപേക്ഷ'], gu: ['સભ્યત્વ', 'અરજી'], pa: ['ਮੈਂਬਰਸ਼ਿਪ', 'ਅਰਜ਼ੀ']",
  "id: 'governance'": "kn: ['ಚುನಾವಣೆ', 'ಸಮಿತಿ'], ml: ['തിരഞ്ഞെടുപ്പ്', 'കമ്മിറ്റി'], gu: ['ચૂંટણી', 'સમિતિ'], pa: ['ਚੋਣਾਂ', 'ਕਮੇਟੀ']",
  "id: 'appeal'": "kn: ['ಮೇಲ್ಮನವಿ'], ml: ['അപ്പീൽ'], gu: ['અપીલ'], pa: ['ਅਪੀਲ']",
  "id: 'grievance'": "kn: ['ದೂರು', 'ಶಿಕಾಯತ್'], ml: ['പരാതി'], gu: ['ફરિયાદ'], pa: ['ਸ਼ਿਕਾਇਤ']",
  "id: 'schemes'": "kn: ['ಯೋಜನೆ', 'ಸಾಲ'], ml: ['പദ്ധതി', 'വായ്പ'], gu: ['યોજના', 'લોન'], pa: ['ਸਕੀਮ', 'ਕਰਜ਼ਾ']",
  "id: 'documents'": "kn: ['ದಾಖಲೆ', 'ಪಟ್ಟಿ'], ml: ['രേഖകൾ', 'പട്ടിക'], gu: ['દસ્તાવેજ', 'યાદી'], pa: ['ਦਸਤਾਵੇਜ਼', 'ਸੂਚੀ']"
};

let n = 0;
for (const [anchor, extra] of Object.entries(extras)) {
  const idx = block.indexOf(anchor);
  if (idx < 0) { console.log('MISS', anchor); continue; }
  const lineEnd = block.indexOf('},', idx);
  if (lineEnd < 0) { console.log('MISS end', anchor); continue; }
  block = block.slice(0, lineEnd) + ', ' + extra + block.slice(lineEnd);
  n++;
}
s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(SP, s);
console.log('INTENTS patched:', n);

/* scheme docs: application keywords in kn/ml/gu/pa */
const KB = JSON.parse(fs.readFileSync(KP, 'utf8'));
const appKw = { kn: ['ಅರ್ಜಿ'], ml: ['അപേക്ഷ'], gu: ['અરજી'], pa: ['ਅਰਜ਼ੀ'] };
for (const d of KB.docs) {
  if (!['scheme-ncdc', 'scheme-nrlm', 'scheme-sfurti'].includes(d.id)) continue;
  for (const words of Object.values(appKw))
    for (const w of words) if (!d.kw.includes(w)) d.kw.push(w);
}
fs.writeFileSync(KP, JSON.stringify(KB, null, 2));
console.log('scheme docs: application keywords added');
