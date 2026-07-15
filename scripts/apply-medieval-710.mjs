import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const APP_JS = path.join(__dirname, '../app.js');
const FACTS_FILE = path.join(__dirname, 'medieval-facts.mjs');
const SOURCE = path.join(__dirname, 'medieval-stages-7-10-data.json');

const KO_CLEANUP = [
  ["빙en's 힐데가르트", '힐데가르트 fon 빙en'],
  ['배annockburn', '배녹번'],
  ['서부 schism', '서방 교회 대분열'],
  ['동서 schism', '동서 교회 대분열'],
  ['마rtin 5세', '마르틴 5세'],
  ['wendish 십자군', '벤트 십자군'],
  ['자크erie', '자크리'],
  ['노orman', '노르만'],
  ['sicily', '시칠리아'],
  ['roger 2세', '로ger 2세'],
  ['stamford bridge', '스탬퍼드 브리지'],
  ['아bbasid', 'Abbasid'],
  ['당na라', '당나라'],
  ['talas', '탈라스'],
  ['알fonso', '알fonso'],
  ['그ra나다', '그라나다'],
  ['대heathen 군', '대헤then 군'],
  ['brunanburh', '브루nanburh'],
  ['애thelstan', '애thelstan'],
  ['알fred', '알fred'],
  ['에dington', '에dington'],
  ['guthrum', 'guthrum'],
  ['danelaw', 'danelaw'],
  ['wessex', 'wessex'],
  ['kleidion', 'kleidion'],
  ['acheloos', 'acheloos'],
  ['meerssen', 'meerssen'],
  ['sutri', 'sutri'],
  ['krump', 'krump'],
  ['글agolitic', '글agolitic'],
  ['sigfred', 'sigfred'],
  ['바이king', '바이king'],
  ['압d al-rahman', '압d al-rahman'],
  ['이khshidid', '이khshidid'],
  ['이smaili', '이smaili'],
  ['셀ju크', '셀ju크'],
  ['tughril beg', 'tughril beg'],
  ['술tan', '술tan'],
  ['buyid', 'buyid'],
  ['레if', '레if'],
  ['binland', 'binland'],
  ['아vi센na', '아비센na'],
  ['프riedrich', '프riedrich'],
  ['varna', 'varna'],
  ['władysław', 'władysław'],
  ['홍wu제', '홍wu제'],
  ['sluys', 'sluys'],
  ['legnica', 'legnica'],
  ['jaffa', 'jaffa'],
  ['부vines', '부vines'],
  ['angevin', 'angevin'],
  ['melfi', 'melfi'],
  ['langdoc', 'langdoc'],
  ['워orms', '워orms'],
  ['Levant', '레vant'],
  ['sturlung', 'sturlung'],
  ['utraquist', 'utraquist'],
  ['wat tyler', 'wat tyler'],
  ['john ball', 'john ball'],
  ['런don', '런don'],
  ['William wallace', 'William wallace'],
  ['安史之亂', '안록산의 난'],
  ['바그da드', '바그da드'],
  ['히즈ra', '히즈ra'],
  ['카노sa', '카노sa'],
  ['대담한 샤를', '대담한 샤를'],
  ['일族', '일族'],
  ['源平合戦', '源平合战'],
  ['縮影', '縮影'],
  ['沿', '沿'],
  ['오ckham', '오캄'],
  ['이븐 al-아thir', '이븐 al-아thir'],
  ['빙en', '빙en'],
  ['리투아nia', '리투아nia'],
  ['빌nius', '빌nius'],
  ['Afonso', 'Afonso'],
  ['Ourique', 'Ourique'],
  ['Canute', 'Canute'],
  ['크nut', '크nut'],
  ['Bolesław', 'Bolesław'],
  ['보lesław', '보lesław'],
  ['Yu Yunwen', 'Yu Yunwen'],
  ['채石', '采石'],
  ['레냐노', '레냐노'],
  ['las navas de tolosa', 'Las Navas de Tolosa'],
  ['Afonso Henriques', 'Afonso Henriques'],
  ['Robert the Bruce', 'Robert the Bruce'],
  ['Edward II', 'Edward II'],
  ['Charles IV', 'Charles IV'],
  ['Wladyslaw III', 'Wladyslaw III'],
  ['Sigismund', 'Sigismund'],
  ['Leo of Tripoli', 'Leo of Tripoli'],
  ['aegean', 'aegean'],
  ['Nikephoros I', 'Nikephoros I'],
  ['Cyril and Methodius', 'Cyril and Methodius'],
  ['Moravia', 'Moravia'],
  ['Abd al-Rahman III', 'Abd al-Rahman III'],
  ['Tughril Beg', 'Tughril Beg'],
  ['Carloman', 'Carloman'],
  ['Leif Erikson', 'Leif Erikson'],
  ['Vinland', 'Vinland'],
  ['An Lushan Rebellion', 'An Lushan Rebellion'],
  ['Battle of Talas', 'Battle of Talas'],
  ['Great Heathen Army', 'Great Heathen Army'],
  ['Abbasid Revolution', 'Abbasid Revolution'],
  ['Triumph of Orthodoxy', 'Triumph of Orthodoxy'],
  ['East-West Schism', 'East-West Schism'],
  ['Western Schism', 'Western Schism'],
  ['Investiture Controversy', 'Investiture Controversy'],
  ['English Peasants\' Revolt', 'English Peasants\' Revolt'],
  ['Crusade of Varna', 'Crusade of Varna'],
  ['Wendish Crusade', 'Wendish Crusade'],
  ['Sturlung Age', 'Sturlung Age'],
  ['Treaty of Jaffa', 'Treaty of Jaffa'],
  ['Golden Bull of 1356', 'Golden Bull of 1356'],
  ['Fourth Lateran Council', 'Fourth Lateran Council'],
  ['Battle of Las Navas de Tolosa', 'Battle of Las Navas de Tolosa'],
  ['Concordat of Worms', 'Concordat of Worms'],
  ['Third Crusade', 'Third Crusade'],
  ['First War of Scottish Independence', 'First War of Scottish Independence'],
  ['Battle of Stamford Bridge', 'Battle of Stamford Bridge'],
  ['Norman Conquest of Southern Italy', 'Norman Conquest of Southern Italy'],
  ['Christianization of Kievan Rus', 'Christianization of Kievan Rus'],
  ['Synod of Sutri', 'Synod of Sutri'],
  ['Battle of Kleidion', 'Battle of Kleidion'],
  ['Battle of Edington', 'Battle of Edington'],
  ['Battle of Pliska', 'Battle of Pliska'],
  ['Battle of Achelous', 'Battle of Achelous'],
  ['Mission of Cyril and Methodius', 'Mission of Cyril and Methodius'],
  ['Siege of Paris', 'Siege of Paris'],
  ['Partition of Verdun', 'Partition of Verdun'],
  ['Battle of Brunanburh', 'Battle of Brunanburh'],
  ['Reconquest of Toledo', 'Reconquest of Toledo'],
  ['Hussite Wars', 'Hussite Wars'],
  ['Council of Constance', 'Council of Constance'],
  ['Battle of Sluys', 'Battle of Sluys'],
  ['Battle of Bannockburn', 'Battle of Bannockburn'],
  ['Albigensian Crusade', 'Albigensian Crusade'],
  ['Battle of Legnano', 'Battle of Legnano'],
  ['Battle of Bouvines', 'Battle of Bouvines'],
  ['University of Bologna', 'University of Bologna'],
  ['Genpei War', 'Genpei War'],
];

// Proper Korean replacements for corrupted strings
const KO_PROPER = [
  ["빙en's 힐데가르트", '힐데가르트 fon 빙en'],
  ['배annockburn', '배녹번'],
  ['서부 schism', '서방 교회 대분열'],
  ['동서 schism', '동서 교회 대분열'],
  ['마rtin 5세', '마르틴 5세'],
  ['wendish 십자군', '벤트 십자군'],
  ['자크erie', '자크리'],
  ['노orman', '노르만'],
  ['sicily', '시칠리아'],
  ['roger 2세', '로ger 2세'],
  ['stamford bridge', '스탬퍼드 브리지'],
  ['아bbasid', '아bbasid'],
  ['당na라', '당나라'],
  ['talas', '탈라스'],
  ['알fonso 6세', '알fonso 6세'],
  ['그ra나다', '그라나다'],
  ['대heathen 군', '대헤then군'],
  ['brunanburh', '브루nanburh'],
  ['알fred', '알fred'],
  ['에dington', '에dington'],
  ['kleidion', '클레이디온'],
  ['acheloos', '아헬로os'],
  ['meerssen', '메erssen'],
  ['sutri', '수tri'],
  ['krump', '크rum'],
  ['sigfred', '시그fred'],
  ['바이king', '바이king'],
  ['압d al-rahman 3세', '압d al-rahman 3세'],
  ['바그da드', '바그da드'],
  ['히즈ra', '히즈ra'],
  ['카노sa', '카노sa'],
  ['langdoc', '랑그doc'],
  ['워orms', '워orms'],
  ['sturlung', 'sturlung'],
  ['런don', '런don'],
  ['安史之亂', '안록산의 난'],
  ['源平合戦', '源平合战'],
  ['일族', '일族'],
  ['오ckham', '오캄'],
  ['이븐 al-아thir', '이븐 al-아thir'],
  ['리투아nia', '리투아nia'],
  ['빌nius', '빌nius'],
  ['크nut', '크nut'],
  ['보lesław', '보lesław'],
  ['채石', '采石'],
  ['varna', 'varna'],
  ['władysław 3세', 'władysław 3세'],
  ['홍wu제', '홍wu제'],
  ['sluys', '슬루ys'],
  ['jaffa', '자ffa'],
  ['부vines', '부vines'],
  ['melfi', '멜fi'],
  ['legnica', '레gnica'],
  ['las navas de tolosa', 'Las Navas de Tolosa'],
  ['源平合戦', '源平合战'],
  ['沿', '沿'],
  ['縮影', '縮影'],
];

function applyReplacements(text, pairs) {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.split(from).join(to);
  }
  return out;
}

function deepClean(obj) {
  if (typeof obj === 'string') {
    let s = obj;
    s = applyReplacements(s, KO_PROPER);
    // Fix double question marks from prior fix pass
    s = s.replace(/\?\?+/g, '?');
    return s;
  }
  if (Array.isArray(obj)) return obj.map(deepClean);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = deepClean(v);
    return out;
  }
  return obj;
}

function ensureQuestionMark(ko) {
  if (!ko) return ko;
  return ko.endsWith('?') ? ko : `${ko}?`;
}

function applyFixesToFile(filePath, pairs) {
  if (!fs.existsSync(filePath)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of pairs) {
    text = text.split(from).join(to);
  }
  // Add ? to Korean questions missing it (without doubling)
  text = text.replace(/"question_ko": "([^"]*[^?])"/g, '"question_ko": "$1?"');
  text = text.replace(/\?\?/g, '?');
  fs.writeFileSync(filePath, text, 'utf8');
}

const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));

// Apply fixes to existing files
const medievalFiles = ['medieval_person.json', 'medieval_year.json', 'medieval_event.json'];
for (const f of medievalFiles) {
  const filePath = path.join(DATA_DIR, f);
  applyFixesToFile(filePath, source.fixes.all_files);
  if (source.fixes[f]) applyFixesToFile(filePath, source.fixes[f]);
}
if (fs.existsSync(FACTS_FILE)) {
  applyFixesToFile(FACTS_FILE, source.fixes.all_files);
  if (source.fixes['medieval-facts.mjs']) applyFixesToFile(FACTS_FILE, source.fixes['medieval-facts.mjs']);
}

// Merge new entries
for (const type of ['person', 'year', 'event']) {
  const filePath = path.join(DATA_DIR, `medieval_${type}.json`);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const newItems = deepClean(source[type]).map((item) => ({
    id: 0,
    era: 'medieval',
    type,
    ...item,
    question_ko: ensureQuestionMark(item.question_ko),
    image: null,
  }));
  const merged = [...existing, ...newItems].map((item, index) => ({
    ...item,
    id: index + 1,
    era: 'medieval',
    type,
  }));
  fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  const stages = {};
  merged.forEach((q) => {
    stages[q.stage] = (stages[q.stage] || 0) + 1;
  });
  console.log(`medieval_${type}.json: ${merged.length} items, stages:`, stages);
}

// Update app.js
let appJs = fs.readFileSync(APP_JS, 'utf8');
if (!appJs.includes('medieval: 10')) {
  appJs = appJs.replace(
    'const ERA_TOTAL_STAGES = {\n  ancient: 10,\n};',
    'const ERA_TOTAL_STAGES = {\n  ancient: 10,\n  medieval: 10,\n};',
  );
  fs.writeFileSync(APP_JS, appJs, 'utf8');
  console.log('Updated app.js: medieval: 10');
} else {
  console.log('app.js already has medieval: 10');
}

console.log('Apply complete.');
