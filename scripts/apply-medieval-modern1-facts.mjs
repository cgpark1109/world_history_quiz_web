import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FACTS as MEDIEVAL_FACTS } from './medieval-facts.mjs';
import { FACTS as MODERN1_FACTS } from './modern1-facts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const TYPES = ['person', 'year', 'event'];

const ERAS = [
  { era: 'medieval', facts: MEDIEVAL_FACTS },
  { era: 'modern1', facts: MODERN1_FACTS },
];

function applyOne({ file, facts, label }) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let updated = 0;
  const missing = [];

  for (const item of data) {
    const fact = facts[item.id];
    if (!fact) {
      missing.push(item.id);
      continue;
    }
    if (item.explanation_en !== fact.en || item.explanation_ko !== fact.ko) {
      item.explanation_en = fact.en;
      item.explanation_ko = fact.ko;
      updated += 1;
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`${label}: updated ${updated}/${data.length}, missing ${missing.length}`);
  if (missing.length) {
    console.log('  missing ids:', missing.slice(0, 20).join(', '), missing.length > 20 ? '...' : '');
  }
}

for (const { era, facts } of ERAS) {
  for (const type of TYPES) {
    const file = path.join(DATA_DIR, `${era}_${type}.json`);
    if (!fs.existsSync(file)) {
      console.log(`skip ${era}_${type}: file not found`);
      continue;
    }
    applyOne({ file, facts, label: `${era}_${type}` });
  }
}
