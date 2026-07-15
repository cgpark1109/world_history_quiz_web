import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const FIXES = [
  ['힐데가르트 fon 빙en', '힐데ga르트 von 빙en'],
  ['부vines', '부빈'],
  ['알fred', '알프레드'],
  ['에ddington', '에ddington'],
  ['에dington', '에ddington'],
  ['guthrum', '구thrum'],
  ['danelaw', '데인Law'],
  ['wessex', '웨sex'],
  ['아bbasid', '아바스'],
  ['바그da드', '바格da드'],
  ['대헤then군', '위험한 이방인 대군'],
  ['시그fred', '시그fred'],
  ['바이king', '바이king'],
  ['홍wu제', '홍무제'],
  ['angevin', '앙zhu'],
  ['krump', '크rum'],
  ['krump가', '크rum이'],
  ['brunanburh', '브루南burh'],
  ['acheloos', '아헬로os'],
  ['meerssen', '메erssen'],
  ['sutri', '수tri'],
  ['kleidion', '클레이디온'],
  ['legnica', '레gnica'],
  ['jaffa', '야ffa'],
  ['sluys', '슬루ys'],
  ['władysław', 'władysław'],
  ['프riedrich', '프riedrich'],
  ['워orms', '워orms'],
  ['langdoc', '랑그doc'],
  ['sturlung', 'sturlung'],
  ['utraquist', '우트raquist'],
  ['런don', '런don'],
  ['William wallace', '윌리am wallace'],
  ['오ckham', '오캄'],
  ['오ckham의', '오캄의'],
  ['이븐 al-아thir', '이bn al-아thir'],
  ['리투아nia', '리투아nia'],
  ['빌nius', '빌nius'],
  ['크nut', '크nut'],
  ['보lesław', '보lesław'],
  ['채石', '采石'],
  ['源平合戦', '겐페이 전쟁'],
  ['일族', '헤이케 일族'],
  ['노orman', '노르만'],
  ['sicily', '시칠리아'],
  ['roger 2세', '로ger 2세'],
  ['stamford bridge', '스탬퍼드 브리지'],
  ['마rtin 5세', '마르틴 5세'],
  ['서부 schism', '서방 교회 대분열'],
  ['동서 schism', '동서 교회 대분열'],
  ['배annockburn', '배녹번'],
  ['wendish', '벤트'],
  ['자크erie', '자크리'],
  ['melfi', '멜fi'],
  ['las navas de tolosa', 'Las Navas de Tolosa'],
  ['??', '?'],
];

const targets = [
  path.join(DATA_DIR, 'medieval_person.json'),
  path.join(DATA_DIR, 'medieval_year.json'),
  path.join(DATA_DIR, 'medieval_event.json'),
  path.join(__dirname, 'medieval-facts.mjs'),
];

for (const filePath of targets) {
  if (!fs.existsSync(filePath)) continue;
  let text = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of FIXES) {
    if (from !== to) text = text.split(from).join(to);
  }
  fs.writeFileSync(filePath, text, 'utf8');
  console.log('fixed', path.basename(filePath));
}

console.log('Second pass complete.');
