import fs from 'fs';

const file = process.argv[2];
if (!file) throw new Error('Missing json file path');

const ERA_LABEL_EN = {
  early_modern: 'the early modern period',
};

const ERA_LABEL_KO = {
  early_modern: '근대(초기)사',
};

function norm(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function extractYear(text) {
  const t = norm(text);
  const m = t.match(/\b(14\d{2}|15\d{2}|16\d{2}|17\d{2}|18\d{2}|19\d{2}|20\d{2}|1\d{3})\b/);
  return m ? m[1] : '';
}

function pickById(seed, arr) {
  if (!arr.length) return '';
  const idx = Math.abs(Number(seed) || 0) % arr.length;
  return arr[idx];
}

function significanceEn(q) {
  const t = (q.question_en || '').toLowerCase();
  if (t.includes('begin') || t.includes('begins') || t.includes('start') || t.includes('began')) {
    return 'it marked the opening of a major historical phase';
  }
  if (t.includes('end') || t.includes('ended') || t.includes('fall') || t.includes('collapse') || t.includes('ended')) {
    return 'it represents the culmination or breakdown of the earlier order';
  }
  if (t.includes('signed') || t.includes('treaty') || t.includes('accord') || t.includes('agreement') || t.includes('document') || t.includes('declaration')) {
    return 'it formalized a political or legal decision';
  }
  if (t.includes('founded') || t.includes('established') || t.includes('created') || t.includes('created') || t.includes('passed')) {
    return 'it created a lasting institution or rule';
  }
  if (t.includes('war') || t.includes('conflict') || t.includes('battle') || t.includes('mass') || t.includes('campaign')) {
    return 'it intensified conflict and reshaped power';
  }
  if (t.includes('rebellion') || t.includes('uprising') || t.includes('revolution') || t.includes('insurrection')) {
    return 'it revealed social pressure and changed political dynamics';
  }
  return 'it became a milestone within the broader early modern transformations';
}

function significanceKo(q) {
  const t = (q.question_ko || '').toLowerCase();
  if (t.includes('시작') || t.includes('개시') || t.includes('begin')) {
    return '이 시기의 큰 흐름이 시작되는 분기점이었습니다';
  }
  if (t.includes('끝') || t.includes('종료') || t.includes('종식') || t.includes('붕괴') || t.includes('패배')) {
    return '앞선 질서가 무너지고 새로운 국면으로 넘어가는 계기입니다';
  }
  if (t.includes('조약') || t.includes('협정') || t.includes('서명') || t.includes('선언') || t.includes('법') || t.includes('문서')) {
    return '정치·법적 결정이 공식화된 사건입니다';
  }
  if (t.includes('수립') || t.includes('창설') || t.includes('설립') || t.includes('제정') || t.includes('통과') || t.includes('패스')) {
    return '새로운 제도나 규칙이 만들어진 해로 기억됩니다';
  }
  if (t.includes('전쟁') || t.includes('갈등') || t.includes('전투') || t.includes('전역') || t.includes('캠페인')) {
    return '전쟁의 향방이 권력 관계를 크게 바꿉니다';
  }
  if (t.includes('봉기') || t.includes('혁명') || t.includes('반란') || t.includes('독립')) {
    return '사회적 압력이 정치 지형을 바꾼 사건입니다';
  }
  return '근대 초의 큰 변화 속에서 중요한 이정표로 남았습니다';
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
    `This quiz item identifies the person described by: "${qEn}".`,
    `The key requirement is to name the correct individual for: "${qEn}".`,
  ];
  const koVariants = [
    `이 문항은 질문 속 조건을 충족하는 인물을 묻습니다: "${qKo}".`,
    `정답은 "${qKo}"에서 요구하는 역할의 주인공이어야 합니다.`,
    `"${qKo}"에 가장 정확히 대응하는 인물은 누구인지 찾는 문제입니다.`,
  ];

  const enTail = year
    ? `The clue includes the timeframe ${year}, and ${ans} is the closest match within ${ERA_LABEL_EN[q.era] || 'the era'}.`
    : `${ans} matches the role described in the prompt within ${ERA_LABEL_EN[q.era] || 'the era'}.`;

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

  const enEvent = qEn.replace(/^In what year did\s*/i, '').replace(/\?$/, '').trim();
  const koLead = pickById(seed, [
    `이 문항은 "${qKo}"에 해당하는 정확한 연도를 묻습니다.`,
    `정답 연도는 "${qKo}"에서 제시된 사건과 1:1로 대응해야 합니다.`,
    `"${qKo}"에서 요구하는 사건이 일어난 해가 무엇인지 찾는 문제입니다.`,
  ]);

  const enLead = pickById(seed, [
    `The question asks for the exact year connected to: "${qEn}".`,
    `This item is asking you to match a single date to: "${qEn}".`,
    `We are matching the year to the event described in: "${qEn}".`,
  ]);

  const sigEn = significanceEn(q);
  const sigKo = significanceKo(q);

  return {
    en: `${ans} is correct because it is the year when ${enEvent}. ${sigEn}.`,
    ko: `${ansKo}이(가) 정답인 연도입니다. ${koLead} 또한 ${sigKo}.`,
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
    `"${qKo}"에 가장 정확히 대응하는 사건을 찾는 문제입니다.`,
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
  if (Number(item.stage) === 1) continue; // keep stage 1
  let built = null;
  if (item.type === 'person') built = buildPerson(item);
  else if (item.type === 'year') built = buildYear(item);
  else built = buildEvent(item);

  if (!built) continue;
  if (item.explanation_en !== built.en || item.explanation_ko !== built.ko) {
    item.explanation_en = built.en;
    item.explanation_ko = built.ko;
    updated += 1;
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`early_modern: updated ${updated} items (stage!=1)`);

