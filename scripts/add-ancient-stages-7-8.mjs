import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');

const NEW_PERSON = [
  // Stage 7
  {
    id: 61, stage: 7,
    question_en: 'Who was the Indo-Greek king famous for patronizing Buddhism in Gandhara?',
    question_ko: '간다라에서 불교를 후원한 것으로 유명한 인도-그리스 왕은 누구인가요?',
    answer_en: 'Menander I', answer_ko: '메난드로스 1세',
    wrong1_en: 'Kanishka I', wrong1_ko: '카니슈카 1세',
    wrong2_en: 'Antiochus III', wrong2_ko: '안티오코스 3세',
    wrong3_en: 'Ptolemy I Soter', wrong3_ko: '프톨레마이오스 1세 소테르',
    explanation_en: 'Menander I (Menander Soter, c. 165–130 BC) ruled an Indo-Greek kingdom in northwest India and appears in Buddhist texts as a patron of the faith. His coins blend Greek and Indian imagery. Kanishka I was a Kushan ruler centuries later, not an Indo-Greek king.',
    explanation_ko: '메난드로스 1세(기원전 165–130년경)는 북서 인도의 인도-그리스 왕국을 다스리며 불교 문헌에 후원 왕으로 등장합니다. 주화에는 그리스·인도 상징이 함께 새겨졌습니다. 카니슈카 1세는 훨씬 뒤의 쿠샨 왕으로, 인도-그리스 왕이 아닙니다.',
  },
  {
    id: 62, stage: 7,
    question_en: 'Who was the Athenian tragedian of Medea and The Bacchae?',
    question_ko: '『메데아』와 『바케』를 쓴 아테네의 비극 작가는 누구인가요?',
    answer_en: 'Euripides', answer_ko: '에우리피데스',
    wrong1_en: 'Sophocles', wrong1_ko: '소포클레스',
    wrong2_en: 'Aeschylus', wrong2_ko: '아ischylus',
    wrong3_en: 'Aristophanes', wrong3_ko: '아리스토파네스',
    explanation_en: 'Euripides (c. 480–406 BC) was a leading Athenian tragedian whose plays explored psychological conflict and challenged heroic ideals. Medea and The Bacchae remain staples of world drama. Aristophanes wrote Old Comedy, not tragedy.',
    explanation_ko: '에우리피데스(기원전 480–406년경)는 심리적 갈등과 영웅적 이데올로기를 비틀어 놓은 비극으로 유명한 아테네 비극 작가입니다. 《메데아》와 《바케》는 오늘도 자주 공연됩니다. 아리스토파네스는 구코메디 작가로, 비극 작가가 아닙니다.',
  },
  {
    id: 63, stage: 7,
    question_en: 'Who compiled the Elements, a foundational geometry text of antiquity?',
    question_ko: '고대 기하학의 기초가 된 『원론』을 엮은 인물은 누구인가요?',
    answer_en: 'Euclid', answer_ko: '유클리드',
    wrong1_en: 'Apollonius of Perga', wrong1_ko: '페르가의 아폴로니오스',
    wrong2_en: 'Archimedes', wrong2_ko: '아르키메데스',
    wrong3_en: 'Aryabhata', wrong3_ko: '아리아바타',
    explanation_en: 'Euclid (fl. c. 300 BC) taught in Alexandria and systematized geometry in the Elements, which dominated mathematical education for over two millennia. Apollonius studied conic sections; Archimedes pioneered mechanics and pi approximations.',
    explanation_ko: '유클리드(기원전 300년경)는 알렉산드리아에서 《원론》으로 기하학을 체계화해 2000년 넘게 수학 교육의 표준이 되었습니다. 아폴로니오스는 원뿔곡선, 아르키메데스는 역학·원주율 연구로 유명합니다.',
  },
  {
    id: 64, stage: 7,
    question_en: 'Who is traditionally called the father of Western medicine on Cos?',
    question_ko: '코스 섬에서 서양 의학의 아버지로 불리는 인물은 누구인가요?',
    answer_en: 'Hippocrates', answer_ko: '히포크라테스',
    wrong1_en: 'Galen', wrong1_ko: '갈레노스',
    wrong2_en: 'Hipparchus', wrong2_ko: '히파르코스',
    wrong3_en: 'Herodotus', wrong3_ko: '헤로도토스',
    explanation_en: 'Hippocrates (c. 460–370 BC) practiced on the island of Cos and is associated with rational, observational medicine and the Hippocratic Oath. Galen was a Roman-era physician who built on Hippocratic traditions centuries later.',
    explanation_ko: '히포크라테스(기원전 460–370년경)는 코스에서 관찰과 경험에 기반한 의학을 전개했으며, 히포크라테스 선서와 연결됩니다. 갈레노스는 훨씬 뒤 로마 시대의 의학자로, 히포크라테스 전통을 계승·발전시켰습니다.',
  },
  {
    id: 65, stage: 7,
    question_en: 'Who led the Iceni revolt against Roman rule in Britain?',
    question_ko: '브리타니아에서 로마 지배에 맞서 이케니족 반란을 이끈 인물은 누구인가요?',
    answer_en: 'Boudica', answer_ko: '부디카',
    wrong1_en: 'Zenobia', wrong1_ko: '제노비아',
    wrong2_en: 'Cleopatra VII', wrong2_ko: '클레오파트라 7세',
    wrong3_en: 'Hatshepsut', wrong3_ko: '하트셉수트',
    explanation_en: 'Boudica (d. c. 60/61 AD) united British tribes after Roman abuses and sacked Camulodunum and Londinium before defeat by Roman forces under Suetonius Paulinus. Zenobia led Palmyra in Syria, not Britain.',
    explanation_ko: '부디카(기원후 60/61년경 사)는 로마의 억압 뒤 브리튼 부족을 결집해 카물로두눔·런던을 약탈했으나 수에토니우스 폴리누스에게 패배했습니다. 제노비아는 시리아 팔미라의 지도자로, 브리타니아와는 무관합니다.',
  },
  {
    id: 66, stage: 7,
    question_en: 'Who was the Palmyrene queen who challenged Rome in the 270s AD?',
    question_ko: '서기 270년대 로마에 맞서 팔미라를 이끈 여왕은 누구인가요?',
    answer_en: 'Zenobia', answer_ko: '제노비아',
    wrong1_en: 'Boudica', wrong1_ko: '부디카',
    wrong2_en: 'Cleopatra VII', wrong2_ko: '클레오파트라 7세',
    wrong3_en: 'Hatshepsut', wrong3_ko: '하트셉수트',
    explanation_en: 'Zenobia (r. c. 267–272 AD) expanded Palmyrene control over Egypt and much of the eastern Mediterranean before Aurelian defeated her and captured Palmyra. Boudica revolted in Roman Britain a century earlier.',
    explanation_ko: '제노비아(재위 기원후 267–272년경)는 이집트와 동방 대부분을 장악했다가 아우렐리아누스에게 패배해 포로가 되었습니다. 부디카는 한 세기 전 브리타니아에서 일어난 반란의 지도자입니다.',
  },
  {
    id: 67, stage: 7,
    question_en: 'Who united Germanic tribes to ambush Varus in the Teutoburg Forest?',
    question_ko: '토이토부르크 숲에서 바루스 군단을 매복한 게르만 부족 연합을 이끈 인물은 누구인가요?',
    answer_en: 'Arminius', answer_ko: '아르미니우스',
    wrong1_en: 'Arsaces I', wrong1_ko: '아르사케스 1세',
    wrong2_en: 'Hasdrubal the Boetharch', wrong2_ko: '하스드루발 보에타르크',
    wrong3_en: 'Mithridates VI', wrong3_ko: '미트리다테스 6세',
    explanation_en: 'Arminius (c. 18 BC–21 AD), a Cherusci chieftain who had served in the Roman army, destroyed three legions under Varus in 9 AD and fixed the Rhine as Rome\'s northern frontier. Arsaces I founded Parthia; Mithridates ruled Pontus.',
    explanation_ko: '아르미니우스(기원전 18–서기 21년경)는 로마군 경력이 있던 게르만 수장으로, 서기 9년 바루스 군단 3개를 궤멸시켜 라인 국경을 고정했습니다. 아르사케스 1세는 파르티아 건국자, 미트리다테스 6세는 본토스 왕입니다.',
  },
  {
    id: 68, stage: 7,
    question_en: 'Who wrote the Annals and Histories on early imperial Rome?',
    question_ko: '초기 로마 제국을 다룬 『 연대기 』와 『 역사 』를 쓴 인물은 누구인가요?',
    answer_en: 'Tacitus', answer_ko: '타키투스',
    wrong1_en: 'Livy', wrong1_ko: '리비우스',
    wrong2_en: 'Plutarch', wrong2_ko: '플루타르코스',
    wrong3_en: 'Polybius', wrong3_ko: '폴리비오스',
    explanation_en: 'Tacitus (c. 56–120 AD) analyzed the Julio-Claudian and Flavian emperors with sharp moral and political insight in the Annals and Histories. Livy wrote an earlier history of Rome from its founding; Plutarch composed parallel biographies.',
    explanation_ko: '타키투스(기원후 56–120년경)는 《연대기》와 《역사》에서 율리오-클라우디우스·플라비우스 황제를 날카롭게 분석했습니다. 리비우스는 로마 건국부터의 연대기를, 플루타르코스는 영웅전을 썼습니다.',
  },
  {
    id: 69, stage: 7,
    question_en: 'Who founded the Han dynasty after defeating Xiang Yu?',
    question_ko: '항우를 격파한 뒤 한나라를 세운 인물은 누구인가요?',
    answer_en: 'Liu Bang', answer_ko: '유방',
    wrong1_en: 'Qin Shi Huang', wrong1_ko: '진시황',
    wrong2_en: 'Li Si', wrong2_ko: '이사',
    wrong3_en: 'Emperor Wu of Han', wrong3_ko: '한 무제',
    explanation_en: 'Liu Bang (Emperor Gaozu, r. 202–195 BC) emerged victorious from the Chu-Han Contention and founded the Han dynasty, blending Qin centralization with milder policies. Qin Shi Huang unified China but his dynasty collapsed within years of his death.',
    explanation_ko: '유방(한 고조, 재위 기원전 202–195년)은 초한 전쟁에서 승리해 한나라를 세우며 진나라의 중앙집권과 완화 정책을 조합했습니다. 진시황은 통일했으나 사후 진나라는 금세 붕괴했습니다.',
  },
  {
    id: 70, stage: 7,
    question_en: 'Who gave his name to costly victories against Rome in Italy?',
    question_ko: '이탈리아에서 로마와의 비싼 승리로 이름이 붙은 에피로스 왕은 누구인가요?',
    answer_en: 'Pyrrhus of Epirus', answer_ko: '에피로스의 피로스',
    wrong1_en: 'Hannibal Barca', wrong1_ko: '한니발 바르카',
    wrong2_en: 'Mithridates VI', wrong2_ko: '미트리다테스 6세',
    wrong3_en: 'Antiochus III', wrong3_ko: '안티오코스 3세',
    explanation_en: 'Pyrrhus of Epirus (319–272 BC) invaded Italy to aid Tarentum and won battles at Heraclea and Asculum but suffered crippling losses, inspiring the term "Pyrrhic victory." Hannibal achieved larger Italian campaigns in the Second Punic War.',
    explanation_ko: '에피로스의 피로스(기원전 319–272년)는 타렌투m을 돕기 위해 이탈리아를 침공해 헤라클레아·아스쿨룸에서 이겼으나 막대한 손실을 입어 피로스식 승리의 유래가 되었습니다. 한니발은 이후 더 큰 규모로 이탈리아를 침공했습니다.',
  },
  // Stage 8
  {
    id: 71, stage: 8,
    question_en: 'Who presided over the Gupta golden age as Vikramaditya?',
    question_ko: '비크라마디티야로 굽타 황금기를 이끈 황제는 누구인가요?',
    answer_en: 'Chandragupta II', answer_ko: '찬드라굽타 2세',
    wrong1_en: 'Chandragupta Maurya', wrong1_ko: '찬드라굽타 마우리아',
    wrong2_en: 'Ashoka', wrong2_ko: '아소카',
    wrong3_en: 'Kanishka I', wrong3_ko: '카니슈카 1세',
    explanation_en: 'Chandragupta II (r. c. 380–415 AD) expanded Gupta power and patronized art, literature, and science during a classical Indian golden age. Chandragupta Maurya founded the earlier Mauryan Empire in the 4th century BC.',
    explanation_ko: '찬드라굽타 2세(재위 기원후 380–415년경)는 굽타 제국의 전성기를 이끌며 예술·문학·과학을 후원했습니다. 찬드라굽타 마우리아는 기원전 4세기 마우리아 제국을 연 인물로, 시대가 다릅니다.',
  },
  {
    id: 72, stage: 8,
    question_en: 'Who desecrated the Jerusalem Temple earning the epithet Epiphanes?',
    question_ko: '예루살렘 성전을 모독해 ‘에피파네스’ 별칭을 얻은 셀레우코스 왕은 누구인가요?',
    answer_en: 'Antiochus IV Epiphanes', answer_ko: '안티오코스 4세 에피파네스',
    wrong1_en: 'Antiochus III', wrong1_ko: '안티오코스 3세',
    wrong2_en: 'Seleucus I Nicator', wrong2_ko: '셀레우코스 1세 니카토르',
    wrong3_en: 'Ptolemy I Soter', wrong3_ko: '프톨레마이오스 1세 소테르',
    explanation_en: 'Antiochus IV Epiphanes (r. 175–164 BC) imposed Hellenizing policies and profaned the Jerusalem Temple, provoking the Maccabean revolt commemorated at Hanukkah. Antiochus III fought Rome at Magnesia but did not trigger that revolt.',
    explanation_ko: '안티오코스 4세 에피파네스(재위 기원전 175–164년)는 헬레니즘화 정책과 성전 모독으로 마카베오 반란을 촉발했습니다. 안티오코스 3세는 마그네시아에서 로마와 싸웠으나, 이 반란의 직접적 원인은 아닙니다.',
  },
  {
    id: 73, stage: 8,
    question_en: 'Who was Hannibal\'s father and Carthaginian commander in Sicily?',
    question_ko: '한니발의 아버이자 시칠리아에서 활약한 카르타고 장군은 누구인가요?',
    answer_en: 'Hamilcar Barca', answer_ko: '하밀카르 바르카',
    wrong1_en: 'Hasdrubal the Boetharch', wrong1_ko: '하스드루발 보에타르크',
    wrong2_en: 'Masinissa', wrong2_ko: '마시니사',
    wrong3_en: 'Scipio Africanus', wrong3_ko: '스키피오 아프리카누스',
    explanation_en: 'Hamilcar Barca (c. 275–228 BC) rebuilt Carthaginian power after the First Punic War and campaigned in Iberia, passing anti-Roman ambitions to his sons Hannibal and Hasdrubal. Masinissa was a Numidian ally of Rome.',
    explanation_ko: '하밀카르 바르카(기원전 275–228년경)는 제1차 포에니 전쟁 뒤 카르타고 세력을 재건하고 이베리아에서 원정하며 한니발에게 반로마 정신을 물려줬습니다. 마시니사는 로마의 누미디아 동맹 왕입니다.',
  },
  {
    id: 74, stage: 8,
    question_en: 'Who expanded Greek rule deep into Bactria and India?',
    question_ko: '박트리아와 인도 깊숙이까지 그리스 지배를 확장한 왕은 누구인가요?',
    answer_en: 'Demetrius I of Bactria', answer_ko: '박트리아의 데메트리오스 1세',
    wrong1_en: 'Menander I', wrong1_ko: '메난드로스 1세',
    wrong2_en: 'Seleucus I Nicator', wrong2_ko: '셀레우코스 1세 니카토르',
    wrong3_en: 'Alexander the Great', wrong3_ko: '알렉산드로스 대왕',
    explanation_en: 'Demetrius I of Bactria (c. 200–180 BC) pushed Hellenistic rule into northwest India, preceding the Indo-Greek kingdoms associated with Menander. Alexander conquered the region but did not establish lasting Bactrian dynasties.',
    explanation_ko: '박트리아의 데메트리오스 1세(기원전 200–180년경)는 북서 인도로 그리스 지배를 확장해 메난드로스 시대 인도-그리스 왕국의 토대를 마련했습니다. 알렉산드로스는 정복했으나 박트리아 왕조를 남기지 않았습니다.',
  },
  {
    id: 75, stage: 8,
    question_en: 'Who earned the nickname "the Delayer" facing Hannibal in Italy?',
    question_ko: '이탈리아에서 한니발과 맞서 ‘지연자’ 별칭을 얻은 로마 장군은 누구인가요?',
    answer_en: 'Quintus Fabius Maximus', answer_ko: '콘티우스 파비우스 막시무스',
    wrong1_en: 'Marcus Licinius Crassus', wrong1_ko: '마르쿠스 리키니우스 크라수스',
    wrong2_en: 'Sulla', wrong2_ko: '술라',
    wrong3_en: 'Mithridates VI', wrong3_ko: '미트리다테스 6세',
    explanation_en: 'Quintus Fabius Maximus Verrucosus (c. 280–203 BC) avoided pitched battles against Hannibal, wearing down Carthaginian forces through attrition—the Fabian strategy. Crassus died at Carrhae; Sulla marched on Rome in civil war.',
    explanation_ko: '콘티우스 파비우스 막시무스(기원전 280–203년경)는 한니발과의 결전을 피하며 소모전으로 카르타고군을 지치게 하는 파비우스 전략을 썼습니다. 크라수스는 카르헤에서, 술라는 내전에서 활약한 인물입니다.',
  },
  {
    id: 76, stage: 8,
    question_en: 'Who was the Achaean statesman called the last of the Greeks?',
    question_ko: '‘마지막 그리스인’으로 불린 아카이아 정치가는 누구인가요?',
    answer_en: 'Philopoemen', answer_ko: '필로포이멘',
    wrong1_en: 'Pericles', wrong1_ko: '페리클레스',
    wrong2_en: 'Solon', wrong2_ko: '솔론',
    wrong3_en: 'Pausanias', wrong3_ko: '파우사니아스',
    explanation_en: 'Philopoemen (253–183 BC) reformed the Achaean League\'s army and resisted Macedonian and Roman encroachment, earning Plutarch\'s praise as the last champion of Greek freedom. Pericles led classical Athens centuries earlier.',
    explanation_ko: '필로포이멘(기원전 253–183년)은 아카이아 동맹군을 개혁하며 마케돈·로마의 압력에 맞섰고, 플루타르코스는 그를 그리스 자유의 마지막 수호자로 칭했습니다. 페리클레스는 훨씬 앞선 고전 아테네의 지도자입니다.',
  },
  {
    id: 77, stage: 8,
    question_en: 'Who was the Alexandrian mathematician-philosopher killed in 415 AD?',
    question_ko: '서기 415년에 살해된 알렉산드리아의 수학·철학자는 누구인가요?',
    answer_en: 'Hypatia', answer_ko: '히파티아',
    wrong1_en: 'Plotinus', wrong1_ko: '플로티노스',
    wrong2_en: 'Cleopatra VII', wrong2_ko: '클레오파트라 7세',
    wrong3_en: 'Aryabhata', wrong3_ko: '아리아바타',
    explanation_en: 'Hypatia (c. 360–415 AD) taught Neoplatonist philosophy and mathematics in Alexandria and was murdered by a mob amid religious and political tensions. Plotinus founded Neoplatonism in Rome centuries earlier.',
    explanation_ko: '히파티아(기원후 360–415년경)는 알렉산드리아에서 신플라톤주의 철학과 수학을 가르치다 종교·정치 갈등 속 폭도에게 살해됐습니다. 플로티노스는 로마에서 신플라톤주의를 연 훨씬 이른 인물입니다.',
  },
  {
    id: 78, stage: 8,
    question_en: 'Who led Gauls to sack Rome around 390 BC?',
    question_ko: '기원전 390년경 갈리아인을 이끌고 로마를 약탈한 지도자는 누구인가요?',
    answer_en: 'Brennus', answer_ko: '브렌누스',
    wrong1_en: 'Vercingetorix', wrong1_ko: '베르킹게토릭스',
    wrong2_en: 'Arminius', wrong2_ko: '아르미니우스',
    wrong3_en: 'Hannibal Barca', wrong3_ko: '한니발 바르카',
    explanation_en: 'Brennus (4th century BC) commanded Senones Gauls who defeated Roman forces at the Allia and sacked Rome except the Capitoline Hill, a trauma remembered for generations. Vercingetorix resisted Caesar in the 1st century BC.',
    explanation_ko: '브렌누스(기원전 4세기)는 세노네스 갈리아인을 이끌어 알리아에서 로마군을 격파하고 카피톨리눔을 제외한 로마를 약탈했습니다. 베르킹게토릭스는 기원전 1세기 카이사르와 맞선 갈리아 족장입니다.',
  },
  {
    id: 79, stage: 8,
    question_en: 'Who built the Pharos and Library of Alexandria as Ptolemaic king?',
    question_ko: '알렉산드리아 등대와 도서관을 세운 프톨레마이오스 왕은 누구인가요?',
    answer_en: 'Ptolemy II Philadelphus', answer_ko: '프톨레마이오스 2세 필라델포스',
    wrong1_en: 'Ptolemy I Soter', wrong1_ko: '프톨레마이오스 1세 소테르',
    wrong2_en: 'Cleopatra VII', wrong2_ko: '클레오파트라 7세',
    wrong3_en: 'Alexander the Great', wrong3_ko: '알렉산드로스 대왕',
    explanation_en: 'Ptolemy II Philadelphus (r. 285–246 BC) expanded Alexandria\'s Library and Museum and completed the Pharos lighthouse, making the city a Hellenistic intellectual center. Ptolemy I founded the dynasty after Alexander\'s death.',
    explanation_ko: '프톨레마이오스 2세 필라델포스(재위 기원전 285–246년)는 알렉산드리아 도서관·박물관을 확장하고 파로스 등대를 완공해 학문 중심을 키웠습니다. 프톨레마이오스 1세는 왕조를 연 창업자입니다.',
  },
  {
    id: 80, stage: 8,
    question_en: 'Who fought Rome in the Jugurthine War for Numidian kingship?',
    question_ko: '누미디아 왕위를 놓고 로마와 주기르떼 전쟁을 벌인 인물은 누구인가요?',
    answer_en: 'Jugurtha', answer_ko: '주기르타',
    wrong1_en: 'Masinissa', wrong1_ko: '마시니사',
    wrong2_en: 'Hannibal Barca', wrong2_ko: '한니발 바르카',
    wrong3_en: 'Mithridates VI', wrong3_ko: '미트리다테스 6세',
    explanation_en: 'Jugurtha (c. 160–104 BC) seized power in Numidia and bribed Roman officials until Marius and Sulla defeated him, exposing corruption in the late Republic. Masinissa had been Rome\'s loyal Numidian ally.',
    explanation_ko: '주기르타(기원전 160–104년경)는 누미디아 왕권을 차지하며 로마 관료에게 뇌물을 썼다가 마리우스·술라에게 패배했습니다. 이 전쟁은 공화정 말기 부패를 드러냈습니다. 마시니사는 로마의 충성스러운 누미디아 동맹 왕이었습니다.',
  },
];

import { NEW_YEAR, NEW_EVENT } from './add-ancient-stages-7-8-data.mjs';

function toItem(raw, type) {
  return {
    id: raw.id,
    era: 'ancient',
    type,
    question_en: raw.question_en,
    question_ko: raw.question_ko,
    answer_en: raw.answer_en,
    answer_ko: raw.answer_ko,
    wrong1_en: raw.wrong1_en,
    wrong1_ko: raw.wrong1_ko,
    wrong2_en: raw.wrong2_en,
    wrong2_ko: raw.wrong2_ko,
    wrong3_en: raw.wrong3_en,
    wrong3_ko: raw.wrong3_ko,
    stage: raw.stage,
    explanation_en: raw.explanation_en,
    explanation_ko: raw.explanation_ko,
    image: null,
  };
}

function appendType(type, newItems) {
  const file = join(DATA_DIR, `ancient_${type}.json`);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const existingIds = new Set(data.map((item) => item.id));
  const existingStages = new Set(data.map((item) => item.stage));

  for (const raw of newItems) {
    if (existingIds.has(raw.id)) {
      console.warn(`skip duplicate id ${raw.id} in ancient_${type}.json`);
      continue;
    }
    data.push(toItem(raw, type));
  }

  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  const stages = [...new Set(data.map((item) => item.stage))].sort((a, b) => a - b);
  const counts = Object.fromEntries(
    [7, 8].map((s) => [s, data.filter((item) => item.stage === s).length]),
  );
  console.log(`ancient_${type}.json: ${data.length} items, stages ${stages.join(',')}, stage7=${counts[7]}, stage8=${counts[8]}`);
}

appendType('person', NEW_PERSON);
appendType('year', NEW_YEAR);
appendType('event', NEW_EVENT);
