import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '../data');

const FIXES = [
  ['아ischylus', '에스킬로스'],
  ['타렌투m', '타렌토'],
  ['본토스', '폰토스'],
  ['아버이자', '아버지이자'],
  ['콘티우스 파비우스', '퀸투스 파비우스'],
  ['콘티우스', '퀸투스'],
  ['사자년', '사제년'],
  ['상징한습니다', '상징합니다'],
  ['구코메디', '고대 코메디'],
  ['度量衡', '도량형'],
  ['『 연대기 』', '《연대기》'],
  ['Principate 체제를 세워 Pax Romana로', '원린제(Principate) 체제를 세워 로마의 평화(Pax Romana)로'],
  ['펠로ponnesos', '펠로폰네소스'],
  ['로마 제 empire 분할', '로마 제국 분할'],
  ['《 원정기 》', '《원정기》'],
  ['해전였습니다', '해전이었습니다'],
  ['재난였습니다', '재난이었습니다'],
  ['시작였습니다', '시작이었습니다'],
  ['정권였습니다', '정권이었습니다'],
  ['핵심였습니다', '핵심이었습니다'],
  ['쿠루스 younger', '쿠루스 더 영'],
  ['법(dharma)', '법(다르마)'],
  ['senior·junior', '상·하급'],
  ['(Keops)', ''],
  ['\uCE74ades', '\uCE74\uB370\uC2DC'],
  ['‘유ureka(발견했다)’', '‘발견했다(유ureka)’'],
];

for (const file of ['ancient_person.json', 'ancient_year.json', 'ancient_event.json']) {
  const path = join(DATA_DIR, file);
  let text = readFileSync(path, 'utf8');
  let count = 0;
  for (const [from, to] of FIXES) {
    const parts = text.split(from);
    if (parts.length > 1) {
      count += parts.length - 1;
      text = parts.join(to);
    }
  }
  writeFileSync(path, text, 'utf8');
  console.log(`${file}: ${count} fixes`);
}
