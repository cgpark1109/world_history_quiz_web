import fs from 'fs';

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

function splitSentences(text) {
  if (!text) return [];
  return String(text)
    .split(/(?<=[.!?。])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasWrongMention(sentence, q, lang) {
  const keys = lang === 'en'
    ? [q.wrong1_en, q.wrong2_en, q.wrong3_en]
    : [q.wrong1_ko, q.wrong2_ko, q.wrong3_ko];
  return keys.filter(Boolean).some((w) => sentence.includes(w));
}

let updated = 0;
for (const q of data) {
  const enParts = splitSentences(q.explanation_en);
  const koParts = splitSentences(q.explanation_ko);

  const nextEn = enParts.filter((s) => !hasWrongMention(s, q, 'en')).join(' ').trim();
  const nextKo = koParts.filter((s) => !hasWrongMention(s, q, 'ko')).join(' ').trim();

  if ((nextEn && nextEn !== q.explanation_en) || (nextKo && nextKo !== q.explanation_ko)) {
    if (nextEn) q.explanation_en = nextEn;
    if (nextKo) q.explanation_ko = nextKo;
    updated += 1;
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`ancient updated: ${updated}`);
