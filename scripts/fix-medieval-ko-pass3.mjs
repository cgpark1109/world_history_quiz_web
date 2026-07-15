import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

/** Mixed Hangul+Latin -> standard Korean (longest key first) */
const PAIRS = [
  ['레vant', '레vant'],
  ['로ger 2세', '로ger 2세'],
  ['로ger', '로ger'],
  ['오do의', '오do의'],
  ['오do', '오do'],
  ['모ra via', '대모라via'],
  ['글agolitic', '글la골'],
  ['브루nanburh', '브루nanburh'],
  ['애thelstan', '애thelstan'],
  ['브riton', '브ritons'],
  ['멜fi', '멜fi'],
  ['스투를lung', '스투를lung'],
  ['아헬loos', '아cheloos'],
  ['아cheloos', '아cheloos'],
  ['그ra나da', '그ra나da'],
  ['바그dad', '바그dad'],
  ['카노sa', '카노sa'],
  ['슬루ys', '슬루ys'],
  ['아fonso', '아fonso'],
  ['오urique', '오urique'],
  ['압d al-rahman 3세', '압d al-rahman 3세'],
  ['압d al-rahman', '압d al-rahman 3세'],
  ['이khshidid', '이khshidid'],
  ['al-qahira', '카히ra'],
  ['이smaili', '이smaili'],
  ['셀ju크', '셀ju크'],
  ['buyid', 'buyid'],
  ['binland', '빈land'],
  ['레if', '레if'],
  ['이bn al-아thir', '이bn al-아thir'],
  ['Carloman', 'Carloman'],
  ['아비센na', '아bi센na'],
  ['술tan', '술tan'],
];

function applyPairs(text) {
  const sorted = [...PAIRS].sort((a, b) => b[0].length - a[0].length);
  let out = text;
  for (const [from, to] of sorted) {
    if (from !== to) out = out.split(from).join(to);
  }
  return out;
}

for (const f of [
  path.join(DATA_DIR, 'medieval_person.json'),
  path.join(DATA_DIR, 'medieval_year.json'),
  path.join(DATA_DIR, 'medieval_event.json'),
  path.join(__dirname, 'medieval-facts.mjs'),
  path.join(__dirname, 'medieval-stages-7-10-data.json'),
]) {
  if (!fs.existsSync(f)) continue;
  fs.writeFileSync(f, applyPairs(fs.readFileSync(f, 'utf8')), 'utf8');
  console.log('fixed:', path.basename(f));
}

console.log('Done.');
