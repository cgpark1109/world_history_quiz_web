import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { NEW_PERSON, NEW_YEAR, NEW_EVENT } from './add-ancient-stages-9-10-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');

function toItem(raw, type) {
  return {
    id: raw.id,
    era: 'ancient',
    type,
    question_en: raw.question_en,
    question_ko: raw.question_ko,
    answer_en: raw.answer_en,
    answer_ko: raw.answer_ko,
    wrong1_en: raw.wrong1_en,
    wrong1_ko: raw.wrong1_ko,
    wrong2_en: raw.wrong2_en,
    wrong2_ko: raw.wrong2_ko,
    wrong3_en: raw.wrong3_en,
    wrong3_ko: raw.wrong3_ko,
    stage: raw.stage,
    explanation_en: raw.explanation_en,
    explanation_ko: raw.explanation_ko,
    image: null,
  };
}

function appendType(type, newItems) {
  const file = join(DATA_DIR, `ancient_${type}.json`);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const existingIds = new Set(data.map((item) => item.id));

  for (const raw of newItems) {
    if (existingIds.has(raw.id)) {
      console.warn(`skip duplicate id ${raw.id} in ancient_${type}.json`);
      continue;
    }
    data.push(toItem(raw, type));
  }

  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  const stages = [...new Set(data.map((item) => item.stage))].sort((a, b) => a - b);
  const counts = Object.fromEntries(
    [9, 10].map((s) => [s, data.filter((item) => item.stage === s).length]),
  );
  console.log(`ancient_${type}.json: ${data.length} items, stages ${stages.join(',')}, stage9=${counts[9]}, stage10=${counts[10]}`);
}

appendType('person', NEW_PERSON);
appendType('year', NEW_YEAR);
appendType('event', NEW_EVENT);
