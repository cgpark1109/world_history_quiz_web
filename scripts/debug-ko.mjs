import fs from 'fs';

const BASE = 'C:/Users/parkchangook/Documents/devapp/world_history_quiz/world_history_quiz_web/data';
const event = fs.readFileSync(`${BASE}/medieval_event.json`, 'utf8');
const year = fs.readFileSync(`${BASE}/medieval_year.json`, 'utf8');
const person = fs.readFileSync(`${BASE}/medieval_person.json`, 'utf8');

const keys = [
  ['acheloos', '\uc544\ud5ec\ub85cos'],
  ['henriques', '\ud5ec\ub9acques'],
  ['sultan', '\uc219ltan'],
  ['cairo', '(\uce74\ud788\ub77c)'],
];

for (const [label, key] of keys) {
  console.log(label, 'event', event.includes(key), 'year', year.includes(key));
}

const i = person.indexOf('\ud790\ub370');
console.log('hildegard ctx', JSON.stringify(person.slice(i - 12, i + 14)));

const hf = '\ube59' + "en's " + '\ud790\ub370\uac00\ub974\ud2b8';
console.log('hildegard match', person.includes(hf));

// show achelous slice
const j = event.indexOf('\uc544\ud5ec');
console.log('achelo ctx', JSON.stringify(event.slice(j, j + 12)), [...event.slice(j, j + 8)].map((c) => c.charCodeAt(0).toString(16)));
