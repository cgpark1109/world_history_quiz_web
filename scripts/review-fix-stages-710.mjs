import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

// 종성(받침) 유무로 은/는 조사 결정
function topicParticle(word) {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return '는'; // 한글 음절이 아니면 기본 는
  const hasFinal = (code - 0xac00) % 28 !== 0;
  return hasFinal ? '은' : '는';
}

function capitalizeFirst(s) {
  return s.replace(/^(\s*)([a-z])/, (m, sp, c) => sp + c.toUpperCase());
}

function load(era, type) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${era}_${type}.json`), 'utf8'));
}
function save(era, type, data) {
  fs.writeFileSync(path.join(DATA_DIR, `${era}_${type}.json`), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const isNew = (q) => Number(q.stage) >= 7;

// ---------- early_modern ----------
{
  // person: "... <명사> 무엇일까요?" -> "... <명사>은/는 누구인가요?"
  const person = load('early_modern', 'person');
  for (const q of person) {
    if (!isNew(q)) continue;
    q.question_ko = q.question_ko.replace(/(\S+) 무엇일까요\?\s*$/, (m, noun) => `${noun}${topicParticle(noun)} 누구인가요?`);
  }
  save('early_modern', 'person', person);

  // event: "... <명사> 무엇일까요?" -> "... <명사>은/는 무엇인가요?"
  const event = load('early_modern', 'event');
  for (const q of event) {
    if (!isNew(q)) continue;
    q.question_ko = q.question_ko.replace(/(\S+) 무엇일까요\?\s*$/, (m, noun) => `${noun}${topicParticle(noun)} 무엇인가요?`);
  }
  save('early_modern', 'event', event);

  // year: EN에 did 누락 + KO 조사 누락 + 사실 오류
  const year = load('early_modern', 'year');
  for (const q of year) {
    if (!isNew(q)) continue;
    // EN: "In which year X?" -> "In which year did this occur: X."
    if (!/did this occur:/.test(q.question_en)) {
      const m = q.question_en.match(/^In which year\s+(.+?)\?\s*$/);
      if (m) q.question_en = `In which year did this occur: ${capitalizeFirst(m[1])}.`;
    }
    // KO: "... 해 몇 년일까요?" -> "... 해는 언제인가요?"
    q.question_ko = q.question_ko.replace(/해 몇 년일까요\?\s*$/, '해는 언제인가요?');
  }
  // 사실 오류 #75: 임진왜란 1590 -> 1592
  {
    const q = year.find((x) => x.id === 75);
    q.answer_en = '1592 AD';
    q.answer_ko = '서기 1592년';
  }
  // 사실 오류 #87: 폴란드 왕위 계승 전쟁 종결 빈 조약 1731 -> 1738
  {
    const q = year.find((x) => x.id === 87);
    q.answer_en = '1738 AD';
    q.answer_ko = '서기 1738년';
  }
  // #76: Port-Royal(1605) 대신 1604년 사실에 맞게 정정
  {
    const q = year.find((x) => x.id === 76);
    q.question_en = 'In which year did this occur: The French established their first settlement in Acadia.';
    q.question_ko = '프랑스가 아카디아에 첫 정착지를 세운 해는 언제인가요?';
    q.explanation_en = "French colonists under Pierre Dugua established a settlement on Île Sainte-Croix in 1604. It was an early base for France's colonial presence in North America.";
    q.explanation_ko = '프랑스 식민자들은 1604년 피에르 뒤귀아의 지휘 아래 생트크루아섬에 정착지를 세웠다. 이곳은 프랑스의 북아메리카 식민 활동 초기 거점이 되었다.';
  }
  save('early_modern', 'year', year);
}

// ---------- modern1 ----------
{
  // person: "누구인가?" -> "누구인가요?"
  const person = load('modern1', 'person');
  for (const q of person) {
    if (!isNew(q)) continue;
    q.question_ko = q.question_ko.replace(/누구인가\?\s*$/, '누구인가요?');
  }
  save('modern1', 'person', person);

  // year: 문법 깨진 2문항 EN 정정 + "일어났는가?" -> "일어났나요?"
  const year = load('modern1', 'year');
  for (const q of year) {
    if (!isNew(q)) continue;
    if (q.id === 73) q.question_en = 'In which year was the Indian National Congress founded?';
    if (q.id === 91) q.question_en = 'In which year was Manchukuo established?';
    q.question_ko = q.question_ko.replace(/일어났는가\?\s*$/, '일어났나요?');
  }
  save('modern1', 'year', year);

  // event: 질문의 스퍼리어스 "?" 제거 + "무엇인가?" -> "무엇인가요?" + 해설 필러 제거
  const event = load('modern1', 'event');
  for (const q of event) {
    if (!isNew(q)) continue;
    if (q.question_ko.startsWith('다음 설명에 해당하는')) {
      q.question_ko = q.question_ko.replace(/\?\s*$/, '.');
      q.question_ko = q.question_ko.replace('다음 설명에 해당하는 사건은 무엇인가?', '다음 설명에 해당하는 사건은 무엇인가요?');
    }
    q.explanation_ko = q.explanation_ko.replace(/^.*?근대의 중요한 사건이었다\.\s*/, '');
    q.explanation_en = q.explanation_en.replace(/^.*? was a (?:major|significant) modern-era event\.\s*/, '');
  }
  save('modern1', 'event', event);
}

// ---------- contemporary ----------
{
  // person: 해설 필러(조사 오류·경어체 혼용) 제거
  const person = load('contemporary', 'person');
  for (const q of person) {
    if (!isNew(q)) continue;
    q.explanation_ko = q.explanation_ko.replace(/^.*?현대사의 중요한 정치 인물입니다\.\s*/, '');
    q.explanation_en = q.explanation_en.replace(/^.*? was a (?:major|significant) contemporary political figure\.\s*/, '');
  }
  save('contemporary', 'person', person);

  // event: 해설 필러 제거
  const event = load('contemporary', 'event');
  for (const q of event) {
    if (!isNew(q)) continue;
    q.explanation_ko = q.explanation_ko.replace(/^.*?현대사의 중요한 사건입니다\.\s*/, '');
    q.explanation_en = q.explanation_en.replace(/^.*? was a (?:major|significant) contemporary event\.\s*/, '');
  }
  save('contemporary', 'event', event);
}

console.log('Review fixes applied.');
