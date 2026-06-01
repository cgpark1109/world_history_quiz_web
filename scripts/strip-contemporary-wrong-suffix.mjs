import fs from 'fs';

/**
 * 오답 비교 접미 문장만 제거 (스테이지1 고도화 시 붙였던 패턴과 동형).
 */

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const enMarker =
  ' is misleading here because the question targets a different context than that option represents.';

/** "... 남았습니다. 덩샤오핑은(는) 문제의 ..." 접미 부분 시작 */
const koMiddle = '은(는) 문제의 핵심 맥락과 다른 선택지라 정답 조건과 맞지 않습니다.';

function stripEnSuffix(s) {
  if (!s || typeof s !== 'string') return s;
  const i = s.indexOf(enMarker);
  if (i === -1) return s;
  const head = s.slice(0, i).trimEnd();
  const dot = Math.max(head.lastIndexOf('. '), head.lastIndexOf('\n'));
  if (dot >= 0) return head.slice(0, dot + 1).trimEnd();
  return head;
}

function stripKoSuffix(s) {
  if (!s || typeof s !== 'string') return s;
  const i = s.indexOf(koMiddle);
  if (i === -1) return s;
  const head = s.slice(0, i).trimEnd();
  const dot = Math.max(head.lastIndexOf('.'), head.lastIndexOf('。'));
  if (dot >= 0) return head.slice(0, dot + 1).trimEnd();
  return head;
}

let fixed = 0;
for (const item of data) {
  const nextEn = stripEnSuffix(item.explanation_en);
  const nextKo = stripKoSuffix(item.explanation_ko);
  if (nextEn !== item.explanation_en || nextKo !== item.explanation_ko) {
    item.explanation_en = nextEn;
    item.explanation_ko = nextKo;
    fixed++;
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`stripped wrong-answer suffix from ${fixed} items`);
