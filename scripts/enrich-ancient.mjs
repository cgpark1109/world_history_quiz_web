import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { EXPLANATIONS } from './ancient-explanations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');
const TYPES = ['person', 'year', 'event'];

/** 사건형 설명 등 해체체를 앱 전체와 맞추기 위한 간단한 합니다체 변환 */
function toPoliteKo(text) {
  return text
    .replace(/전해진다\./g, '전해집니다.')
    .replace(/로마 제국의 시작으로 본다\./g, '역사가들은 이를 로마 제국의 시작으로 봅니다.')
    .replace(/전환점이었다\./g, '전환점이었습니다.')
    .replace(/([가-힣])다\./g, (_, ch) => `${ch}습니다.`)
    .replace(/습니다습니다\./g, '습니다.')
    .replace(/집니습니다\./g, '집니다.')
    .replace(/점였습니다\./g, '점이었습니다.');
}

let merged = 0;
let total = 0;
const missing = [];

for (const type of TYPES) {
  const dataPath = join(DATA_DIR, `ancient_${type}.json`);
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  total += data.length;

  for (const item of data) {
    const exp = EXPLANATIONS[item.id];
    if (exp) {
      item.explanation_en = exp.explanation_en;
      item.explanation_ko =
        item.type === 'event' ? toPoliteKo(exp.explanation_ko) : exp.explanation_ko;
      merged++;
    } else {
      missing.push(item.id);
    }
  }

  writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`ancient_${type}.json: ${data.length} items`);
}

console.log(`Merged ${merged} / ${total} explanations into ancient_*.json`);

if (missing.length) {
  console.error('Missing explanation ids:', missing.join(', '));
  process.exit(1);
}
