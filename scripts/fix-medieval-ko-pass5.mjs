import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const PAIRS = [
  ['\uc544\ud5ec\ub85cos', '\uc544\ucf00\ub85c\uc6b0\uc2a4'],
  ['\ud5ec\ub9acques', '\uc5d4\ub9ac\ud050'],
  ['(\uce74\ud788\ub77c)', '(\uce74\uc774\ub85c)'],
  ['\uc219ltan', '\uc885\ud138'],
];

const hildegardFrom = '\ube59' + "en's " + '\ud790\ub370\uac00\ub974\ud2b8';
const hildegardTo = '\ube59en\uc758 \ud790\ub370\uac00\ub974\ud2b8';

function applyPairs(text) {
  const sorted = [...PAIRS].sort((a, b) => b[0].length - a[0].length);
  let out = text;
  for (const [from, to] of sorted) {
    out = out.split(from).join(to);
  }
  out = out.split(hildegardFrom).join(hildegardTo);
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
