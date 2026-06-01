import fs from 'fs';

const file = process.argv[2];
if (!file) throw new Error('Missing json file path');

const ERA_LABEL_EN = {
  contemporary: 'the contemporary era',
};

function norm(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function extractYear(text) {
  const t = norm(text);
  const m = t.match(/\b(19\d{2}|20\d{2})\b/);
  return m ? m[1] : '';
}

function pickById(seed, arr) {
  if (!arr.length) return '';
  const idx = Math.abs(Number(seed) || 0) % arr.length;
  return arr[idx];
}

function significanceEn(q) {
  const t = (q.question_en || '').toLowerCase();
  if (t.includes('fall') || t.includes('collapse') || t.includes('end') || t.includes('dissolution')) {
    return 'it marked a major turning point';
  }
  if (t.includes('invasion') || t.includes('war') || t.includes('crackdown') || t.includes('fighting')) {
    return 'it sharply escalated or intensified a struggle';
  }
  if (t.includes('signed') || t.includes('accords') || t.includes('treaty') || t.includes('agreement')) {
    return 'it formalized political or security commitments';
  }
  if (t.includes('founded') || t.includes('established') || t.includes('created') || t.includes('held') || t.includes('conference')) {
    return 'it created a new institutional or diplomatic framework';
  }
  if (t.includes('constructed') || t.includes('built') || t.includes('built') || t.includes('created')) {
    return 'it produced a lasting structural change';
  }
  if (t.includes('protests') || t.includes('uprising') || t.includes('rebellion') || t.includes('genocide')) {
    return 'it revealed or triggered mass political conflict and social upheaval';
  }
  return 'it became a recognizable milestone within the broader Cold War and global politics';
}

function significanceKo(q) {
  const t = (q.question_ko || '').toLowerCase();
  if (t.includes('붕괴') || t.includes('종식') || t.includes('해체') || t.includes('종료') || t.includes('붕괴한') || t.includes('붕괴')) {
    return '역사 흐름의 큰 전환점이 되었습니다';
  }
  if (t.includes('침공') || t.includes('전쟁') || t.includes('폭력진압') || t.includes('충돌') || t.includes('전선')) {
    return '갈등의 강도가 급격히 높아지는 계기가 되었습니다';
  }
  if (t.includes('조약') || t.includes('협정') || t.includes('서명') || t.includes('합의') || t.includes('문서') || t.includes('선언')) {
    return '정치·안보 목표가 공식적으로 고정되는 사건이었습니다';
  }
  if (t.includes('창설') || t.includes('수립') || t.includes('설립') || t.includes('회의') || t.includes('대회')) {
    return '새로운 제도·외교 틀이 만들어진 사건이었습니다';
  }
  if (t.includes('건설') || t.includes('축조') || t.includes('건립') || t.includes('구축')) {
    return '구조적인 변화가 남긴 중요한 사건이었습니다';
  }
  if (t.includes('시위') || t.includes('봉기') || t.includes('반란') || t.includes('학살')) {
    return '대규모 사회·정치적 충돌을 드러내거나 촉발한 사건이었습니다';
  }
  return '이 시기의 세계 질서 변화 속에서 중요한 이정표로 기억됩니다';
}

function buildPerson(q) {
  const ans = norm(q.answer_en);
  const ansKo = norm(q.answer_ko);
  const qEn = norm(q.question_en);
  const qKo = norm(q.question_ko);
  const year = extractYear(qEn) || extractYear(qKo);
  const seed = q.id;

  const enVariants = [
    `The prompt asks specifically who fits: "${qEn}".`,
    `This quiz item is asking for the individual described by: "${qEn}".`,
    `The key requirement is to identify the person in: "${qEn}".`,
  ];
  const koVariants = [
    `이 문항은 질문 속 조건을 충족하는 인물을 묻습니다: "${qKo}".`,
    `정답은 "${qKo}"에서 요구하는 역할의 주인공이어야 합니다.`,
    `"${qKo}"에 가장 정확히 대응하는 인물은 누구인지 묻는 문제입니다.`,
  ];

  const enTail = year
    ? `The clue includes the timeframe ${year}, and ${ans} is the closest match to that role within ${ERA_LABEL_EN[q.era] || 'this era'}.`
    : `${ans} matches the role described in the prompt within ${ERA_LABEL_EN[q.era] || 'this era'}.`;

  const koTail = year
    ? `질문에 포함된 시기 단서 ${year}와 연결되는 리더십/역할이 바로 ${ansKo}(으)로 정리됩니다.`
    : `${ansKo}(이)가 질문이 요구하는 역할과 가장 직접적으로 맞아떨어집니다.`;

  return {
    en: `${ans} is correct because ${pickById(seed, enVariants)} ${enTail}`,
    ko: `${ansKo}이(가) 정답입니다. ${pickById(seed, koVariants)} ${koTail}`,
  };
}

function buildYear(q) {
  const ans = norm(q.answer_en);
  const ansKo = norm(q.answer_ko);
  const qEn = norm(q.question_en);
  const qKo = norm(q.question_ko);
  const seed = q.id;
  const yearHint = extractYear(ans) || extractYear(qEn);

  const enEvent = qEn.replace(/^In what year did\s*/i, '').replace(/\?$/, '').trim();
  const koEvent = qKo.replace(/기은\s*언제인가요|해는 언제인가요|연도는 언제인가요|은 언제인가요|\?$/g, '').trim();

  const enLead = pickById(seed, [
    `The question asks for the exact year connected to: "${qEn}".`,
    `This item is asking you to match a single date to: "${qEn}".`,
    `We are matching the year to the event described in: "${qEn}".`,
  ]);

  const koLead = pickById(seed, [
    `이 문항은 "${qKo}"에 해당하는 정확한 연도를 묻습니다.`,
    `정답 연도는 "${qKo}"에서 제시된 사건과 1:1로 대응해야 합니다.`,
    `"${qKo}"에서 요구하는 사건이 일어난 해가 무엇인지 찾는 문제입니다.`,
  ]);

  const sigEn = significanceEn(q);
  const sigKo = significanceKo(q);

  return {
    en: `${ans} is correct because it is the year when ${enEvent}. ${sigEn}.`,
    ko: `${ansKo}이(가) 정답인 연도입니다. "${koEvent || qKo}"에서 묻는 사건이 일어난 해가 바로 ${ansKo}이며, ${sigKo}.`,
  };
}

function buildEvent(q) {
  const ans = norm(q.answer_en);
  const ansKo = norm(q.answer_ko);
  const qEn = norm(q.question_en);
  const qKo = norm(q.question_ko);
  const seed = q.id;

  const enLead = pickById(seed, [
    `The prompt is asking for the specific event described as: "${qEn}".`,
    `This quiz item matches one event to the description: "${qEn}".`,
    `The event you need to identify is the one referenced by: "${qEn}".`,
  ]);

  const koLead = pickById(seed, [
    `이 문항은 "${qKo}"에서 설명하는 ‘사건(이벤트)’을 묻고 있습니다.`,
    `정답은 "${qKo}"에 해당하는 정확한 사건명이어야 합니다.`,
    `"${qKo}"에 가장 정확히 대응하는 사건은 무엇인지 찾는 문제입니다.`,
  ]);

  const sigEn = significanceEn(q);
  const sigKo = significanceKo(q);

  return {
    en: `${ans} is correct because ${enLead} and ${ans} is the best named match. ${sigEn}.`,
    ko: `${ansKo}이(가) 정답인 사건입니다. ${koLead} ${sigKo}.`,
  };
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let updated = 0;

for (const item of data) {
  if (Number(item.stage) === 1) continue; // keep the high-quality stage 1
  const type = item.type;
  let built = null;
  if (type === 'person') built = buildPerson(item);
  else if (type === 'year') built = buildYear(item);
  else built = buildEvent(item);

  if (!built) continue;
  const nextEn = built.en;
  const nextKo = built.ko;
  if (item.explanation_en !== nextEn || item.explanation_ko !== nextKo) {
    item.explanation_en = nextEn;
    item.explanation_ko = nextKo;
    updated += 1;
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`contemporary: updated ${updated} items (stage!=1)`);

