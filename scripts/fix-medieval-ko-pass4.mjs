import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const PAIRS = [
  ['\uc544\ud5ecloos', '\uc544\ucf00\ub85c\uc6b0\uc2a4'],
  ['\uadf8\ub77cna\ub2e4', '\uadf8\ub77c\ub098\ub2e4'],
  ['\uc219ltan', '\uc885\ud138'],
  ['\ud5ec\ub9acques', '\uc5d4\ub9ac\ud050'],
  ['\uc544\ud3ec\uc18c', '\uc544\ud3ec\ub860'],
  ['\uce74\ud788\ub77c', '\uce74\uc774\ub85c'],
  ['\ub808\uc774\ud504 \uc5d0\ub9adsson', '\ub808\uc774\ud504 \uc5d0\ub9ad\uc2a4\uc628'],
  ['\ud788\uc988ra', '\ud788\uc988\ub77c'],
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
  path.join(DATA_DIR, 'medieval_event.json'),
  path.join(__dirname, 'medieval-facts.mjs'),
]) {
  if (!fs.existsSync(f)) continue;
  fs.writeFileSync(f, applyPairs(fs.readFileSync(f, 'utf8')), 'utf8');
  console.log('fixed:', path.basename(f));
}

console.log('Done.');
