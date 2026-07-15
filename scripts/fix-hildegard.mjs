import fs from 'fs';

const p =
  'C:/Users/parkchangook/Documents/devapp/world_history_quiz/world_history_quiz_web/data/medieval_person.json';
let t = fs.readFileSync(p, 'utf8');
const from = '\ube59' + "en's " + '\ud790\ub370\uac00\ub974\ud2b8';
const to = '\ud790\ub370\uac00\ub974\ud2b8(\ube59\uc778)';
console.log('matches', t.split(from).length - 1);
t = t.split(from).join(to);
fs.writeFileSync(p, t);
