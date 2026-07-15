import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const APP_JS = path.join(__dirname, '../app.js');

/** Longest-first replacements; values match stages 1–6 naming style */
const REPLACEMENTS = [
  // English fields corrupted
  ['against 앙zhu French', 'against Angevin French'],
  ['over the 앙zhu Empire', 'over the Angevin Empire'],
  ['four 앙zhu kings', 'four Angevin kings'],
  ['앙zhu lands', 'Angevin lands'],
  ['breaking 앙zhu dominance', 'breaking Angevin dominance'],

  ['워워orms 협약', '볼ms 협약'],
  ['워orms 협약', '볼ms 협약'],

  ['힐데ga르트 von 빙en', "빙en's 힐데가르트"],
  ['힐데ga르트 fon 빙en', "빙en's 힐데가르트"],
  ['힐데가르트 von 빙en', "빙en's 힐데가르트"],
  ['힐데가르트 fon 빙en', "빙en's 힐데가르트"],

  ['北条時宗(1251–1284)', '호조 도키무네(1251–1284)'],
  ['北条時宗', '호조 도키무네'],

  ['동서 schism', '동서 교회 대분열'],
  ['서부 schism', '서방 교회 대분열'],

  ['Las Navas de Tolosa', '나바스 데 톨로사'],
  ['las navas de tolosa', '나바스 데 톨로사'],
  ['마그na 카르타', '마그나 카르타'],
  ['슬루ys 해전', '슬루이스 해전'],
  ['lepanto 해전', '레판토 해전'],
  ['varna 십자군', '바르나 십자군'],
  ['varna에서', '바르나에서'],
  ['1444년 varna', '1444년 바르나'],
  ['오스만에 패한 varna', '오스만에 패한 바르나'],
  ['sturlung 시대', '스투를lung 시대'],
  ['sturlung', '스투를lung'],
  ['런don', '런던'],
  ['harald hardrada', '하랄드 하르드라다'],
  ['yorkshire', '요크셔'],
  ['윌리am wallace', '윌리엄 월리스'],
  ['robert the bruce', '로버트 더 브루스'],
  ['레gnica 전투', '레그니차 전투'],
  ['정conquista', '정복'],
  ['그ra나다', '그라나다'],
  ['송na라', '송나라'],
  ['당na라', '당나라'],
  ['krump', '크룸'],
  ['크rum이', '크룸이'],
  ['크rum가', '크룸이'],
  ['크rum', '크룸'],
  ['노rse-켈트', '노르드-켈트'],
  ['노rse', '노르드'],
  ['노orman의', '노르만'],
  ['노orman', '노르만'],
  ['브루nanburh', '브루nanburh'],
  ['brunanburh', '브루nanburh'],
  ['애thelstan', '애셀stan'],
  ['브riton', '브ritons'],
  ['stamford bridge', '스탬퍼드 브리지'],
  ['에dington', '에딩턴'],
  ['아헬loos', '아cheloos'],
  ['아헬lo', '아chelo'],
  ['acheloos', '아cheloos'],
  ['achelous', '아cheloos'],
  ['모ra via', '모ra via'],
  ['모라via', '모ra via'],
  ['글agolitic', '글agolitic'],
  ['대heathen 군', '위험한 이방인 대군'],
  ['대heathen', '이방인'],
  ['알fred', '알프레드'],
  ['wendish 십자군', '벤트 십자군'],
  ['wendish', '벤트'],
  ['앙zhu', '앙주'],
  ['랑그doc', '남부 프랑스어권'],
  ['레vant', '레vant'],
  ['almohad를', '무와히드를'],
  ['almohad', '무와히드'],
  ['아fonso', '아fonso'],
  ['오urique', '오urique'],
  ['트리폴리의 leo', '트리폴리의 레o'],
  [' aegean', ' 에게'],
  ['압d al-rahman', '압d al-rahman'],
  ['이khshidid', '이khshidid'],
  ['al-qahira', 'al-qahira'],
  ['이smaili', '이smaili'],
  ['셀ju크', '셀ju크'],
  ['tughril beg', '투그릴 베그'],
  ['술tan', '술tan'],
  ['buyid', 'buyid'],
  ['레if', '레if'],
  ['binland', 'binland'],
  ['odo의', '오do의'],
  [' odo', ' 오do'],
  ['부vines', '부vines'],
  ['멜fi', '멜fi'],
  ['자ffa', '자ffa'],
  ['메erssen', '메erssen'],
  ['수tri', '수tri'],
  ['크nut', '크nut'],
  ['보lesław', '보lesław'],
  ['władysław', 'władysław'],
  ['홍wu제', '홍wu제'],
  ['채石', '采石'],
  ['아bbasid', '아바스'],
  ['바格dad', '바그dad'],
  ['바그da드', '바그dad'],
  ['히즈ra', '히즈ra'],
  ['카노sa', '카노sa'],
  ['이bn al-아thir', '이bn al-아thir'],
  ['이븐 al-아thir', '이bn al-아thir'],
  ['이븐 알아시르', '이bn al-아thir'],
  ['헤이케와 genji', '헤이케와 源氏'],
  ['genji', '源氏'],
  ['源平合战', '源平合戦'],
  ['리투아nia', '리투아nia'],
  ['빌nius', '빌nius'],
  ['오ckham', '오캄'],
  ['로ger 2세', '로ger 2세'],
  ['로ger', '로ger'],
  ['바이king', '바이킹'],
  ['??', '?'],
];

const FINAL = [
  ['볼ms 협약', '볼ms 협약'],
  ['브루nanburh', '브루nanburh'],
  ['애셀stan', '애thelstan'],
  ['브ritons', '브리ton'],
  ['아cheloos', '아cheloos'],
  ['모ra via', '모ra via'],
  ['글agolitic', '글agolitic'],
  ['아fonso', '아fonso'],
  ['오urique', '오urique'],
  ['압d al-rahman', '압d al-rahman'],
  ['이khshidid', '이khshidid'],
  ['이smaili', '이smaili'],
  ['셀ju크', '셀ju크'],
  ['술tan', '술tan'],
  ['buyid', 'buyid'],
  ['레if', '레if'],
  ['binland', 'binland'],
  ['오do의', '오do의'],
  [' 오do', ' 오do'],
  ['부vines', '부vines'],
  ['멜fi', '멜fi'],
  ['자ffa', '자ffa'],
  ['메erssen', '메erssen'],
  ['수tri', '수tri'],
  ['크nut', '크nut'],
  ['보lesław', '보lesław'],
  ['władysław', 'władysław'],
  ['홍wu제', '홍wu제'],
  ['바그dad', '바그dad'],
  ['히즈ra', '히즈ra'],
  ['카노sa', '카노sa'],
  ['이bn al-아thir', '이bn al-아thir'],
  ['리투아nia', '리투아nia'],
  ['빌nius', '빌nius'],
  ['로ger 2세', '로ger 2세'],
  ['로ger', '로ger'],
  ['레vant', '레vant'],
];

function applyPairs(text, pairs) {
  let out = text;
  for (const [from, to] of pairs) {
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
  let text = fs.readFileSync(f, 'utf8');
  text = applyPairs(text, REPLACEMENTS);
  text = applyPairs(text, FINAL);
  text = text.replace(/\?\?+/g, '?');
  fs.writeFileSync(f, text, 'utf8');
  console.log('fixed:', path.basename(f));
}

let appJs = fs.readFileSync(APP_JS, 'utf8');
if (!appJs.includes('medieval: 10')) {
  appJs = appJs.replace(
    'const ERA_TOTAL_STAGES = {\n  ancient: 10,\n};',
    'const ERA_TOTAL_STAGES = {\n  ancient: 10,\n  medieval: 10,\n};',
  );
  fs.writeFileSync(APP_JS, appJs, 'utf8');
  console.log('Updated app.js: medieval: 10');
}

console.log('Done.');
