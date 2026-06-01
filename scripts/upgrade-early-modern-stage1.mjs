import fs from 'fs';

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const facts = {
  // person
  "Christopher Columbus": {
    en: "Christopher Columbus (1451–1506) sailed under the Spanish crown and reached the Caribbean in 1492. His voyage linked Europe and the Americas in a lasting way and accelerated transatlantic expansion. Although he did not land on the mainland of North America in 1492, the expedition became a landmark of early modern global exploration.",
    ko: "크리스토퍼 콜럼버스(1451–1506)는 스페인 왕실의 후원을 받아 1492년 카리브 해에 도달했습니다. 그의 항해는 유럽과 아메리카를 지속적으로 연결하며 대서양 세계의 확장을 가속했습니다. 1492년에 북아메리카 본토에 상륙한 것은 아니지만, 이 원정은 근대 초 세계 탐험의 상징적 사건이 되었습니다.",
  },
  "Leonardo da Vinci": {
    en: "Leonardo da Vinci (1452–1519) was a central Renaissance polymath active in painting, engineering, anatomy, and natural philosophy. He painted the Mona Lisa in the early 16th century, and the work became one of the most famous paintings in world history. His career embodies the Renaissance ideal of combining art and scientific inquiry.",
    ko: "레오나르도 다 빈치(1452–1519)는 회화·공학·해부학·자연철학을 아우른 르네상스의 대표적 다재다능한 인물입니다. 그는 16세기 초 모나리자를 그렸고, 이 작품은 세계 미술사의 상징이 되었습니다. 그의 활동은 예술과 과학 탐구의 결합이라는 르네상스 이상을 잘 보여줍니다.",
  },
  "Martin Luther": {
    en: "Martin Luther (1483–1546) triggered the Protestant Reformation by publishing the Ninety-Five Theses in 1517. His criticism of indulgences and papal authority spread rapidly through print culture and sparked major religious and political change in Europe. The movement fractured Western Christendom and reshaped early modern state and church relations.",
    ko: "마르틴 루터(1483–1546)는 1517년 95개조 반박문을 발표하며 종교개혁의 도화선이 되었습니다. 면벌부와 교황권 비판은 인쇄문화 확산과 결합해 유럽 전역으로 빠르게 퍼졌고, 종교·정치 질서에 큰 변화를 일으켰습니다. 그 결과 서유럽 기독교 세계는 분열되었고, 근대 초 국가-교회 관계가 재편되었습니다.",
  },
  "William Shakespeare": {
    en: "William Shakespeare (1564–1616) was a leading playwright and poet of Elizabethan and Jacobean England. Works such as Hamlet and Macbeth transformed English drama through psychological depth, language, and stagecraft. His plays became foundational texts in global literary history.",
    ko: "윌리엄 셰익스피어(1564–1616)는 엘리자베스·제임스 시대 영국을 대표하는 극작가이자 시인입니다. 햄릿과 맥베스 같은 작품은 인물 심리, 언어 표현, 무대 구성 면에서 영어권 연극의 수준을 크게 끌어올렸습니다. 그의 희곡은 오늘날 세계 문학사의 핵심 고전으로 자리합니다.",
  },
  "Isaac Newton": {
    en: "Isaac Newton (1642–1727) formulated the laws of motion and universal gravitation, especially in Principia (1687). His work unified terrestrial and celestial mechanics under common mathematical laws. This achievement became a cornerstone of the Scientific Revolution.",
    ko: "아이작 뉴턴(1642–1727)은 특히 『프린키피아』(1687)에서 운동 법칙과 만유인력 법칙을 체계화했습니다. 그는 지상과 천체의 운동을 공통된 수학 법칙으로 설명해 자연 이해의 틀을 통합했습니다. 이 성취는 과학혁명의 핵심 토대가 되었습니다.",
  },
  "Galileo Galilei": {
    en: "Galileo Galilei (1564–1642) improved telescope-based observations and provided strong support for heliocentrism. His observations of Jupiter’s moons and phases of Venus challenged geocentric assumptions. Galileo’s conflict with Church authorities became a defining episode in the history of science.",
    ko: "갈릴레오 갈릴레이(1564–1642)는 망원경 관측을 발전시켜 지동설을 강하게 뒷받침했습니다. 목성의 위성과 금성의 위상 관측은 천동설의 전통적 가정에 큰 타격을 주었습니다. 그가 교회 권위와 충돌한 사건은 과학사에서 상징적 장면으로 남아 있습니다.",
  },
  "Elizabeth I": {
    en: "Elizabeth I (r. 1558–1603) ruled England during a period of political consolidation, maritime expansion, and cultural flowering. In 1588, England defeated the Spanish Armada, strengthening England’s security and prestige. Her reign is often associated with the high point of Elizabethan England.",
    ko: "엘리자베스 1세(재위 1558–1603)는 정치 안정, 해양 진출, 문화 융성의 시기에 영국을 통치했습니다. 1588년 스페인 무적함대 격파는 영국의 안보와 위신을 크게 높인 사건이었습니다. 그녀의 통치는 엘리자베스 시대 영국의 전성기로 자주 평가됩니다.",
  },
  "Louis XIV": {
    en: "Louis XIV (1638–1715), known as the Sun King, ruled France for over seven decades and became a symbol of absolutist monarchy. He strengthened royal centralization and projected power through court culture, architecture, and warfare. Versailles represented the political theater of his rule.",
    ko: "루이 14세(1638–1715)는 ‘태양왕’으로 불리며 70년 넘게 프랑스를 통치한 절대왕정의 상징적 군주입니다. 그는 왕권 집중을 강화하고 궁정 문화·건축·전쟁을 통해 프랑스의 위세를 과시했습니다. 베르사유 궁전은 그의 통치 방식과 정치 연출을 보여주는 대표적 공간입니다.",
  },
  "Peter the Great": {
    en: "Peter the Great (1672–1725) pursued major military, administrative, and cultural reforms to modernize Russia. He founded Saint Petersburg in 1703 as a western-facing imperial capital and expanded Russia’s role in European politics. His reign marked a decisive shift in Russian state development.",
    ko: "표트르 대제(1672–1725)는 군사·행정·문화 전반의 개혁을 추진해 러시아의 근대화를 시도했습니다. 1703년 상트페테르부르크를 건설해 서유럽 지향의 수도로 육성했고, 러시아의 유럽 정치 개입을 확대했습니다. 그의 통치는 러시아 국가 발전의 중대한 전환점으로 평가됩니다.",
  },
  "Suleiman the Magnificent": {
    en: "Suleiman the Magnificent (r. 1520–1566) presided over the Ottoman Empire at its sixteenth-century height. His reign combined military expansion, legal codification, and imperial administration across a vast multiethnic realm. In Ottoman and European history alike, his era is treated as a peak of Ottoman power.",
    ko: "쉴레이만 대제(재위 1520–1566)는 오스만 제국이 16세기에 전성기를 맞이하던 시기를 이끈 술탄입니다. 그의 통치는 군사 팽창, 법제 정비, 광대한 다민족 제국 행정 운영이 결합된 시기로 특징지어집니다. 오스만사와 유럽사 모두에서 그의 시대는 제국 권력의 정점으로 평가됩니다.",
  },

  // years
  "1492": {
    en: "In 1492, Columbus’s voyage under Spanish sponsorship reached the Caribbean, marking a major turning point in transatlantic contact. The expedition accelerated imperial competition, exchange, and conquest across the Atlantic world. For early modern history, 1492 is treated as a foundational date of global maritime expansion.",
    ko: "1492년 콜럼버스 원정이 스페인 후원 아래 카리브 해에 도달하면서 대서양 세계 교류의 중대한 전환점이 열렸습니다. 이 항해는 제국 경쟁, 교역, 정복의 속도를 크게 높였습니다. 근대 초 세계사에서 1492년은 해양 팽창 시대의 출발점으로 자주 다뤄집니다.",
  },
  "1517": {
    en: "In 1517, Martin Luther’s Ninety-Five Theses challenged indulgence practices and ignited the Protestant Reformation. Print networks rapidly spread reform ideas across Europe. This year is widely recognized as the symbolic beginning of the Reformation era.",
    ko: "1517년 마르틴 루터의 95개조 반박문은 면벌부 관행을 비판하며 종교개혁의 불씨를 당겼습니다. 인쇄물 네트워크를 통해 개혁 사상이 유럽 전역으로 빠르게 확산되었습니다. 그래서 1517년은 종교개혁 시대의 상징적 출발점으로 널리 인식됩니다.",
  },
  "1543": {
    en: "In 1543, Copernicus’s On the Revolutions was published, presenting a heliocentric model that repositioned Earth in relation to the Sun. The work did not immediately overturn older astronomy, but it provided a crucial framework for later scientific advances. Historians often mark 1543 as a milestone of the Scientific Revolution.",
    ko: "1543년 코페르니쿠스의 『천구의 회전에 관하여』가 출간되어 태양 중심 우주 모델이 본격 제시되었습니다. 이 저작이 즉시 기존 천문학을 대체한 것은 아니지만, 이후 과학 발전의 핵심 이론 틀을 제공했습니다. 그래서 1543년은 과학혁명의 중요한 이정표로 평가됩니다.",
  },
  "1588": {
    en: "In 1588, England defeated the Spanish Armada, frustrating Spain’s invasion attempt. The campaign highlighted naval maneuver, logistics, and weather as decisive factors in maritime warfare. The outcome strengthened England’s strategic confidence and prestige.",
    ko: "1588년 영국은 스페인 무적함대를 격파하며 스페인의 침공 시도를 좌절시켰습니다. 이 전역은 해전에서 기동, 보급, 기상 조건의 중요성을 보여준 사례로 자주 언급됩니다. 결과적으로 영국의 전략적 자신감과 국제적 위상이 강화되었습니다.",
  },
  "1607": {
    en: "In 1607, Jamestown was founded as England’s first permanent colony in North America. Despite severe early hardship, the settlement survived and became a base for further English colonial expansion. The date is central to the history of English America.",
    ko: "1607년 제임스타운은 영국이 북아메리카에 세운 첫 영구 식민지로 출범했습니다. 초기에는 식량난과 질병으로 극심한 어려움을 겪었지만, 정착이 유지되며 이후 영국 식민지 확장의 거점이 되었습니다. 따라서 1607년은 영국계 아메리카 식민사에서 핵심 연도로 다뤄집니다.",
  },
  "1642": {
    en: "In 1642, the English Civil War began between forces loyal to King Charles I and supporters of Parliament. The conflict revolved around sovereignty, taxation, religion, and constitutional authority. It transformed English politics and later constitutional development.",
    ko: "1642년 영국 내전은 찰스 1세 측 왕당파와 의회파 사이의 무력 충돌로 시작되었습니다. 전쟁의 핵심 쟁점은 주권, 조세, 종교, 헌정 권한이었습니다. 이 내전은 영국 정치 질서를 크게 바꾸고 이후 입헌 발전의 방향에 깊은 영향을 주었습니다.",
  },
  "1688": {
    en: "In 1688, the Glorious Revolution replaced James II and established a new constitutional settlement under William and Mary. The revolution strengthened parliamentary supremacy and constrained royal authority. It is a key date in the history of constitutional monarchy in Britain.",
    ko: "1688년 명예혁명은 제임스 2세를 축출하고 윌리엄·메리 체제를 통해 새로운 헌정 질서를 수립했습니다. 이 과정에서 의회의 우위가 강화되고 왕권은 제도적으로 제한되었습니다. 따라서 1688년은 영국 입헌군주제 발전사에서 핵심 연도로 평가됩니다.",
  },
  "1776": {
    en: "In 1776, the American Declaration of Independence formally announced separation from Britain. The document articulated principles of natural rights and popular sovereignty that influenced later constitutional and revolutionary movements. It became a foundational text of the American Revolution.",
    ko: "1776년 미국 독립선언은 영국으로부터의 정치적 분리를 공식 선언했습니다. 선언문은 천부인권과 국민주권 원리를 제시해 이후 헌정·혁명 운동에도 큰 영향을 주었습니다. 그래서 1776년은 미국 독립혁명의 핵심 연도로 자리합니다.",
  },
  "1789": {
    en: "In 1789, the French Revolution began amid fiscal crisis, social tension, and political conflict. Events such as the Estates-General and the storming of the Bastille signaled the breakdown of the old regime. The revolution reshaped France and transformed European political thought.",
    ko: "1789년 프랑스혁명은 재정 위기, 사회적 긴장, 정치적 갈등 속에서 시작되었습니다. 삼부회 소집과 바스티유 감옥 습격 같은 사건은 구체제 붕괴를 상징했습니다. 혁명은 프랑스 사회를 재편했을 뿐 아니라 유럽의 정치사상에도 큰 변화를 가져왔습니다.",
  },
  "1501": {
    en: "In 1501, Shah Ismail established the Safavid dynasty, laying the foundation for a major early modern Persian state. Safavid rule institutionalized Twelver Shi‘ism as a state religion and reshaped regional geopolitics against Ottoman and Uzbek rivals. The date marks a turning point in Iranian history.",
    ko: "1501년 샤 이스마일이 사파비 왕조를 수립하며 근대 초 페르시아 국가 형성의 토대를 마련했습니다. 사파비 정권은 열두이맘파 시아파를 국가 종교로 제도화해 오스만·우즈벡 세력과의 지역 질서를 재편했습니다. 따라서 1501년은 이란사에서 중요한 전환점으로 평가됩니다.",
  },

  // events
  "Age of Exploration": {
    en: "The Age of Exploration was the long phase of maritime expansion in which European powers opened new sea routes across the Atlantic, Indian, and Pacific worlds. Advances in navigation, shipbuilding, and cartography enabled sustained long-distance voyages. The process transformed trade networks, imperial competition, and cross-cultural contact on a global scale.",
    ko: "대항해시대는 유럽 세력이 대서양·인도양·태평양으로 항로를 확장한 장기적 해양 팽창 국면을 뜻합니다. 항해술, 조선 기술, 지도 제작의 발전이 장거리 항해를 가능하게 했습니다. 그 결과 세계 무역망, 제국 경쟁, 문명 간 접촉 구조가 근본적으로 바뀌었습니다.",
  },
  "Renaissance": {
    en: "The Renaissance was an intellectual and artistic revival that began in Italian city-states and spread across Europe. It encouraged renewed study of classical texts, humanist learning, and experimentation in art and science. Its influence reshaped education, political thought, and visual culture in early modern Europe.",
    ko: "르네상스는 이탈리아 도시국가에서 시작되어 유럽 전역으로 확산된 지적·예술적 부흥 운동입니다. 고전 텍스트 재해석, 인문주의 교육, 예술·과학 실험정신이 핵심 동력이었습니다. 이 흐름은 근대 초 유럽의 교육, 정치사상, 시각문화를 크게 바꾸었습니다.",
  },
  "Protestant Reformation": {
    en: "The Protestant Reformation was a religious movement that challenged papal authority and Catholic institutional practices. Beginning with Luther and spreading through reformers such as Zwingli and Calvin, it fragmented Western Christendom. The movement triggered new confessional states, conflicts, and church reforms.",
    ko: "종교개혁은 교황권과 가톨릭 교회의 제도·교리를 비판하며 전개된 종교 운동입니다. 루터를 출발점으로 츠빙글리·칼뱅 등 개혁가를 거치며 서유럽 기독교 세계는 분열되었습니다. 이 과정은 새로운 신앙 국가의 형성, 종교전쟁, 교회 개혁을 촉발했습니다.",
  },
  "Defeat of the Spanish Armada": {
    en: "The defeat of the Spanish Armada in 1588 was a major naval setback for Habsburg Spain. England’s resistance, fleet tactics, and campaign conditions prevented a successful invasion. The event became a symbol of shifting maritime power in late sixteenth-century Europe.",
    ko: "1588년 스페인 무적함대의 패배는 합스부르크 스페인에 큰 해군적 타격을 준 사건입니다. 영국의 방어와 함대 운용, 원정 조건의 불리함이 겹치며 침공은 실패했습니다. 이 사건은 16세기 후반 유럽 해양 세력 균형 변화의 상징으로 자주 언급됩니다.",
  },
  "Glorious Revolution": {
    en: "The Glorious Revolution (1688) replaced James II without prolonged nationwide civil war and redefined the English constitution. Subsequent settlement, especially the Bill of Rights (1689), strengthened parliamentary authority over monarchy. It is treated as a milestone in the evolution of modern constitutional government.",
    ko: "명예혁명(1688)은 장기 내전 없이 제임스 2세를 교체하고 영국 헌정 질서를 재정의한 사건입니다. 이어진 권리장전(1689) 등 제도 정비를 통해 의회의 권한이 왕권보다 우위에 서게 되었습니다. 이는 근대 입헌 정치 발전의 핵심 이정표로 평가됩니다.",
  },
  "Thirty Years War": {
    en: "The Thirty Years’ War (1618–1648) began in the Holy Roman Empire as a confessional conflict but expanded into a broader European power struggle. Massive destruction in Central Europe and shifting alliances marked the war’s course. Its settlement at Westphalia reshaped diplomatic norms and state sovereignty.",
    ko: "30년 전쟁(1618~1648)은 신성로마제국 내부의 종교 갈등으로 시작되었지만 곧 유럽 열강의 권력투쟁으로 확대되었습니다. 전쟁 과정에서 중부 유럽은 대규모 파괴를 겪었고, 동맹 구도도 수차례 재편되었습니다. 베스트팔렌 조약은 외교 질서와 주권 국가 체제 논의에 중대한 영향을 남겼습니다.",
  },
  "English Civil War": {
    en: "The English Civil War was a series of conflicts between monarchy and Parliament in the mid-seventeenth century. Issues of taxation, religion, and sovereignty drove the fighting. The war culminated in the execution of Charles I and opened a new phase in English constitutional development.",
    ko: "영국 내전은 17세기 중반 왕권과 의회 권력 사이에서 벌어진 연속적 무력 충돌입니다. 조세, 종교, 주권의 소재가 핵심 쟁점이었습니다. 전쟁은 찰스 1세의 처형으로 이어졌고, 영국 헌정 질서가 새 단계로 이동하는 계기를 만들었습니다.",
  },
  "American Revolution": {
    en: "The American Revolution was the colonial uprising that transformed Britain’s thirteen North American colonies into an independent political project. Military conflict and revolutionary ideology developed together from the 1770s. The result was the creation of a new republic and a major shift in Atlantic politics.",
    ko: "미국혁명은 영국의 13개 북아메리카 식민지가 독립 국가 건설로 나아간 식민지 반란이었습니다. 1770년대 이후 군사 충돌과 혁명 이념이 결합하며 운동이 확대되었습니다. 결과적으로 새로운 공화국이 탄생했고, 대서양 세계의 정치 질서가 크게 재편되었습니다.",
  },
  "Atlantic Slave Trade": {
    en: "The Atlantic Slave Trade was the forced transportation of millions of Africans to the Americas between the early modern and modern eras. It operated through violent capture, commodification, and plantation labor systems tied to Atlantic economies. The system had profound demographic, social, and cultural consequences across multiple continents.",
    ko: "대서양 노예무역은 근대 초~근대에 걸쳐 수백만 아프리카인을 아메리카로 강제 이송한 폭력적 노동 체제였습니다. 사람을 상품화해 플랜테이션 경제에 투입하는 구조가 대서양 경제권과 결합해 작동했습니다. 이 체제는 여러 대륙의 인구, 사회 구조, 문화에 장기적 상처와 변화를 남겼습니다.",
  },
  "Declaration of Independence": {
    en: "The Declaration of Independence (1776) announced that the thirteen colonies were politically separate from Britain. Beyond immediate wartime goals, it articulated claims about natural rights and legitimate government by consent. The document became a foundational text for American statehood and later democratic movements.",
    ko: "독립선언서(1776)는 13개 식민지가 영국과 정치적으로 분리됨을 공식 천명한 문서입니다. 전쟁기의 독립 정당화에 그치지 않고, 천부인권과 동의에 기반한 정부 정당성 원리를 제시했습니다. 이 문서는 미국 국가 형성의 기초 텍스트이자 이후 민주주의 운동에도 영향을 준 고전으로 남았습니다.",
  },
};

function yearKey(answerEn) {
  const m = String(answerEn || '').match(/(\d{4})/);
  return m ? m[1] : '';
}

function build(item) {
  if (item.type === 'year') {
    return facts[yearKey(item.answer_en)] || null;
  }
  return facts[item.answer_en] || null;
}

let updated = 0;
for (const item of data) {
  if (Number(item.stage) !== 1) continue;
  const fact = build(item);
  if (!fact) continue;
  if (item.explanation_en !== fact.en || item.explanation_ko !== fact.ko) {
    item.explanation_en = fact.en;
    item.explanation_ko = fact.ko;
    updated += 1;
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`early_modern stage1 updated: ${updated}`);
