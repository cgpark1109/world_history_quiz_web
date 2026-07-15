import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const PAIRS = [
  ['\uc544\ud3ec\ub860', '\uc544\ud3ec\uc18c'],
  ['\ud5e8\ub9acques', '\uc5d4\ub9ac\ud050'],
  ['(\uce74\ud788ra)', ''],
  ['\uc220tan', '\uc885\ud138'],
  ['\ube59en\uc758 \ud790\ub370\uac00\ub974\ud2b8', '\ud790\ub370\uac00\ub974\ud2b8 \ubcfc \ube59\uc775'],
];

function applyPairs(text) {
  const sorted = [...PAIRS].sort((a, b) => b[0].length - a[0].length);
  let out = text;
  for (const [from, to] of sorted) {
    out = out.split(from).join(to);
  }
  return out;
}

for (const f of [
  path.join(DATA_DIR, 'medieval_person.json'),
  path.join(DATA_DIR, 'medieval_year.json'),
  path.join(__dirname, 'medieval-facts.mjs'),
]) {
  if (!fs.existsSync(f)) continue;
  fs.writeFileSync(f, applyPairs(fs.readFileSync(f, 'utf8')), 'utf8');
  console.log('fixed:', path.basename(f));
}

console.log('Done.');
