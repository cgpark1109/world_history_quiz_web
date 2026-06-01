import fs from 'fs';
import { FACTS as CONTEMPORARY_FACTS } from './contemporary-facts-rest.mjs';
import { FACTS as EARLY_MODERN_FACTS } from './early-modern-facts-rest.mjs';

const TARGETS = [
  {
    file: process.argv[2],
    facts: CONTEMPORARY_FACTS,
    label: 'contemporary',
  },
  {
    file: process.argv[3],
    facts: EARLY_MODERN_FACTS,
    label: 'early_modern',
  },
];

function factKey(item) {
  if (item.type === 'year') {
    const m = String(item.answer_en || '').match(/(\d{4})/);
    return m ? m[1] : null;
  }
  return item.answer_en;
}

function applyOne({ file, facts, label }) {
  if (!file) {
    console.log(`skip ${label}: no path`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let updated = 0;
  const missing = [];

  for (const item of data) {
    if (Number(item.stage) === 1) continue;

    const key = factKey(item);
    const fact =
      key != null ? facts[key] ?? facts[Number(key)] ?? facts[String(key)] : null;
    if (!fact) {
      missing.push({ id: item.id, key, type: item.type });
      continue;
    }

    if (item.explanation_en !== fact.en || item.explanation_ko !== fact.ko) {
      item.explanation_en = fact.en;
      item.explanation_ko = fact.ko;
      updated += 1;
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`${label}: updated ${updated} items (stage 2-6), missing ${missing.length}`);
  if (missing.length) {
    console.log(
      '  missing sample:',
      missing
        .slice(0, 5)
        .map((m) => `${m.id}:${m.key}`)
        .join(', '),
    );
  }
}

for (const target of TARGETS) {
  applyOne(target);
}
