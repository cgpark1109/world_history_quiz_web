import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const APP_JS = path.join(__dirname, '../app.js');

const ERAS = ['early_modern', 'modern1', 'contemporary'];
const TYPES = ['person', 'year', 'event'];

function ensureQuestionMark(ko) {
  if (!ko) return ko;
  const trimmed = String(ko).trim();
  return trimmed.endsWith('?') ? trimmed : `${trimmed}?`;
}

function mergeEra(era) {
  const sourcePath = path.join(__dirname, `${era}-stages-7-10-data.json`);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source file: ${sourcePath}`);
  }

  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  for (const type of TYPES) {
    const filePath = path.join(DATA_DIR, `${era}_${type}.json`);
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newItems = (source[type] || []).map((item) => ({
      question_en: item.question_en,
      question_ko: ensureQuestionMark(item.question_ko),
      answer_en: item.answer_en,
      answer_ko: item.answer_ko,
      wrong1_en: item.wrong1_en,
      wrong1_ko: item.wrong1_ko,
      wrong2_en: item.wrong2_en,
      wrong2_ko: item.wrong2_ko,
      wrong3_en: item.wrong3_en,
      wrong3_ko: item.wrong3_ko,
      stage: Number(item.stage),
      explanation_en: item.explanation_en,
      explanation_ko: item.explanation_ko,
      image: null,
    }));

    if (newItems.length !== 40) {
      throw new Error(`${era}_${type}: expected 40 new items, got ${newItems.length}`);
    }

    const alreadyHasStage7 = existing.some((q) => Number(q.stage) >= 7);
    if (alreadyHasStage7) {
      console.warn(`skip ${era}_${type}.json: already has stage >= 7 (${existing.length} items)`);
      continue;
    }

    const merged = [...existing, ...newItems].map((item, index) => ({
      id: index + 1,
      era,
      type,
      question_en: item.question_en,
      question_ko: ensureQuestionMark(item.question_ko),
      answer_en: item.answer_en,
      answer_ko: item.answer_ko,
      wrong1_en: item.wrong1_en,
      wrong1_ko: item.wrong1_ko,
      wrong2_en: item.wrong2_en,
      wrong2_ko: item.wrong2_ko,
      wrong3_en: item.wrong3_en,
      wrong3_ko: item.wrong3_ko,
      stage: Number(item.stage),
      image: item.image ?? null,
      explanation_en: item.explanation_en,
      explanation_ko: item.explanation_ko,
    }));

    fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

    const stages = {};
    for (const q of merged) {
      stages[q.stage] = (stages[q.stage] || 0) + 1;
    }
    console.log(`${era}_${type}.json: ${merged.length} items, stages:`, stages);
  }
}

function updateAppJs() {
  let appJs = fs.readFileSync(APP_JS, 'utf8');
  const target = `const ERA_TOTAL_STAGES = {
  ancient: 10,
  medieval: 10,
  early_modern: 10,
  modern1: 10,
  contemporary: 10,
};`;

  if (appJs.includes('early_modern: 10') && appJs.includes('modern1: 10') && appJs.includes('contemporary: 10')) {
    console.log('app.js already has early_modern/modern1/contemporary: 10');
    return;
  }

  const regex = /const ERA_TOTAL_STAGES\s*=\s*\{[\s\S]*?\};/;
  if (!regex.test(appJs)) {
    throw new Error('Could not locate ERA_TOTAL_STAGES block in app.js');
  }
  appJs = appJs.replace(regex, target);

  fs.writeFileSync(APP_JS, appJs, 'utf8');
  console.log('Updated app.js: early_modern/modern1/contemporary: 10');
}

for (const era of ERAS) {
  mergeEra(era);
}
updateAppJs();
console.log('Apply complete.');
