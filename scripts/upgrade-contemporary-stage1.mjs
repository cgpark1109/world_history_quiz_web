import fs from 'fs';

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const facts = {
  "Martin Luther King Jr.": {
    en: "Martin Luther King Jr. (1929–1968) was a leading figure of the U.S. civil rights movement. He delivered the \"I Have a Dream\" speech at the March on Washington on 28 August 1963, calling for an end to racial discrimination. The speech became a defining moment in the fight for civil rights.",
    ko: "마틴 루서 킹 주니어(1929–1968)는 미국 민권운동을 이끈 대표적 지도자입니다. 그는 1963년 8월 28일 ‘워싱턴 행진’에서 \"나에게는 꿈이 있습니다\" 연설을 하며 인종차별 철폐와 평등을 호소했습니다. 이 연설은 민권운동의 상징적 전환점으로 남았습니다.",
  },
  "Nelson Mandela": {
    en: "Nelson Mandela (1918–2013) was a key leader in the struggle against apartheid in South Africa. After 27 years in prison, he helped negotiate a democratic transition and became South Africa’s first Black president in 1994. His presidency symbolized the end of apartheid-era rule.",
    ko: "넬슨 만델라(1918–2013)는 남아프리카공화국의 아파르트헤이트(인종차별 정책) 철폐 투쟁을 이끈 지도자입니다. 27년의 수감 생활 이후 민주화 전환을 이끌었고, 1994년 남아공의 첫 흑인 대통령이 되었습니다. 그의 집권은 아파르트헤이트 체제 종식을 상징합니다.",
  },
  "Mao Zedong": {
    en: "Mao Zedong (1893–1976) led the Chinese Communist Party to victory in the Chinese Civil War. He proclaimed the founding of the People’s Republic of China in 1949 and dominated Chinese politics in its early decades. His era included major campaigns such as the Great Leap Forward and the Cultural Revolution.",
    ko: "마오쩌둥(1893–1976)은 중국 공산당을 이끌어 내전에서 승리했고, 1949년 중화인민공화국 수립을 선포했습니다. 이후 수십 년간 중국 정치의 중심 인물로 군림했습니다. 대약진운동·문화대혁명 등 대규모 정책이 그의 시대를 특징짓습니다.",
  },
  "Nikita Khrushchev": {
    en: "Nikita Khrushchev (1894–1971) was the leader of the Soviet Union during the Cuban Missile Crisis (1962). The crisis peaked when the USSR deployed missiles in Cuba and the U.S. imposed a naval blockade, bringing the world close to nuclear war. Khrushchev ultimately agreed to withdraw the missiles in exchange for U.S. concessions.",
    ko: "니키타 흐루쇼프(1894–1971)는 1962년 쿠바 미사일 위기 당시 소련의 최고 지도자였습니다. 소련의 쿠바 미사일 배치와 미국의 해상 봉쇄로 핵전쟁 직전까지 치달았고, 흐루쇼프는 결국 미사일 철수를 수용하며 위기가 완화되었습니다. 이 사건은 냉전기의 최대 위기 중 하나로 꼽힙니다.",
  },
  "John F. Kennedy": {
    en: "John F. Kennedy (1917–1963) was U.S. president during the Cuban Missile Crisis in October 1962. He managed the confrontation with the Soviet Union through a quarantine (naval blockade) and back-channel negotiations. Kennedy was assassinated in Dallas on 22 November 1963.",
    ko: "존 F. 케네디(1917–1963)는 1962년 10월 쿠바 미사일 위기 당시 미국 대통령이었습니다. 그는 해상 봉쇄(‘검역’)와 협상을 병행해 위기 관리를 시도했습니다. 이후 1963년 11월 22일 달라스에서 암살당했습니다.",
  },
  "Mikhail Gorbachev": {
    en: "Mikhail Gorbachev (1931–2022) introduced major reforms in the Soviet Union in the 1980s. His policies of perestroika (restructuring) and glasnost (openness) aimed to modernize the system but also loosened political control. These reforms contributed to the rapid changes that culminated in the USSR’s dissolution in 1991.",
    ko: "미하일 고르바초프(1931–2022)는 1980년대 소련에서 페레스트로이카(개혁·재건)와 글라스노스트(개방)를 추진했습니다. 체제 현대화를 목표로 했지만 정치·사회 통제를 완화해 급격한 변화가 촉진되었습니다. 이러한 흐름은 1991년 소련 해체로 이어지는 배경 중 하나가 되었습니다.",
  },
  "Margaret Thatcher": {
    en: "Margaret Thatcher (1925–2013) served as UK prime minister from 1979 to 1990. She was nicknamed the \"Iron Lady\" for her hardline politics and assertive leadership, including economic reforms and a tough stance in the Cold War. The label captured her reputation for firmness.",
    ko: "마거릿 대처(1925–2013)는 1979~1990년 영국 총리를 지냈습니다. 강경한 정치 스타일과 단호한 리더십 때문에 ‘철의 여인(Iron Lady)’이라는 별칭으로 불렸습니다. 경제 개혁과 냉전기 대외정책에서의 강한 태도가 그의 이미지를 굳혔습니다.",
  },
  "Deng Xiaoping": {
    en: "Deng Xiaoping (1904–1997) became China’s paramount leader after Mao’s era and launched sweeping economic reforms from 1978 onward. His \"reform and opening up\" policies introduced market mechanisms and encouraged foreign investment, accelerating China’s growth. He reshaped China’s development path in the late 20th century.",
    ko: "덩샤오핑(1904–1997)은 마오쩌둥 이후 중국의 실권자로 부상해 1978년 이후 ‘개혁·개방’ 정책을 추진했습니다. 시장 원리를 일부 도입하고 대외 개방을 확대해 고도성장의 기반을 마련했습니다. 이는 20세기 후반 중국의 발전 경로를 크게 바꾼 전환점으로 평가됩니다.",
  },
  "Ronald Reagan": {
    en: "Ronald Reagan (1911–2004) was U.S. president from 1981 to 1989 and is associated with a tougher Cold War posture. He increased defense spending and used strong rhetoric, yet also engaged in landmark arms-control talks with Gorbachev. Their summits helped ease tensions in the late Cold War.",
    ko: "로널드 레이건(1911–2004)은 1981~1989년 미국 대통령으로, 냉전 후반 강경 노선으로 자주 언급됩니다. 국방비 확대와 강한 수사를 펼쳤지만, 동시에 고르바초프와의 정상회담 및 군비통제 협상을 통해 긴장 완화에도 기여했습니다. 이는 냉전 종식 국면의 중요한 배경입니다.",
  },
  "Fidel Castro": {
    en: "Fidel Castro (1926–2016) led the Cuban Revolution that overthrew Batista in 1959. He ruled Cuba for decades and aligned the country with the Soviet bloc, making Cuba a flashpoint of Cold War politics. His long leadership shaped Cuba’s domestic and foreign policy.",
    ko: "피델 카스트로(1926–2016)는 1959년 쿠바 혁명을 이끌어 바티스타 정권을 무너뜨렸습니다. 이후 수십 년간 쿠바를 통치하며 소련 진영과 밀착했고, 쿠바는 냉전의 주요 갈등 지점이 되었습니다. 그의 장기 집권은 쿠바의 내정·외교를 규정했습니다.",
  },

  // years keyed by YYYY
  "1945": {
    en: "In 1945, the United Nations was founded after World War II to promote collective security and prevent another global conflict. The UN Charter was signed in San Francisco in June 1945, and the organization formally came into being on 24 October 1945. It became the central institution of the postwar international order.",
    ko: "1945년에는 제2차 세계대전 이후 집단안보와 전쟁 재발 방지를 목표로 유엔(UN)이 창설되었습니다. 1945년 6월 샌프란시스코에서 유엔 헌장이 서명되었고, 10월 24일 정식 발족했습니다. 이는 전후 국제질서의 핵심 기구가 되었습니다.",
  },
  "1950": {
    en: "The Korean War began in 1950 when North Korean forces crossed the 38th parallel on 25 June 1950. The conflict drew in a UN-led coalition and China, escalating into a major Cold War war. Fighting ended with an armistice in 1953, leaving the peninsula divided.",
    ko: "한국전쟁은 1950년 6월 25일 북한군이 38선을 넘어 남침하면서 시작되었습니다. 유엔군과 중국군이 개입하며 냉전기의 대리전 성격을 띠는 대규모 전쟁으로 확대되었습니다. 1953년 정전협정으로 전투가 멈췄지만 한반도 분단은 지속되었습니다.",
  },
  "1969": {
    en: "In 1969, Apollo 11 achieved humanity’s first landing on the Moon. Neil Armstrong and Buzz Aldrin walked on the lunar surface on 20 July 1969, while Michael Collins orbited above. The mission was a landmark moment of the Space Race.",
    ko: "1969년에는 아폴로 11호가 인류 최초의 달 착륙을 달성했습니다. 닐 암스트롱과 버즈 올드린은 1969년 7월 20일 달 표면에 내렸고, 마이클 콜린스는 궤도에서 임무를 지원했습니다. 이는 우주 경쟁의 상징적 성과로 꼽힙니다.",
  },
  "1989": {
    en: "In 1989, the Berlin Wall fell as East Germany opened border crossings on 9 November 1989. The event accelerated the collapse of communist regimes in Eastern Europe and paved the way for German reunification in 1990. It became a powerful symbol of the Cold War’s end.",
    ko: "1989년에는 11월 9일 동독이 국경 통행을 허용하면서 베를린 장벽 붕괴가 현실화되었습니다. 이는 동유럽 공산권 붕괴를 가속했고, 1990년 독일 통일로 이어지는 길을 열었습니다. 베를린 장벽의 붕괴는 냉전 종식의 상징으로 자리 잡았습니다.",
  },
  "1991": {
    en: "In 1991, the Soviet Union collapsed, ending the Cold War’s bipolar structure. A failed coup attempt in August 1991 weakened the central government, and the USSR formally dissolved in December 1991 as its republics became independent states. This reshaped global geopolitics.",
    ko: "1991년에는 소련이 해체되어 냉전의 양극 체제가 종식되었습니다. 1991년 8월 쿠데타 시도가 실패하며 중앙 권력이 약화되었고, 12월 소련은 공식적으로 해체되어 공화국들이 독립국이 되었습니다. 이는 국제정치 지형을 크게 바꿨습니다.",
  },
  "1947": {
    en: "In 1947, the Marshall Plan was announced as a U.S. program to rebuild war-torn Europe and stabilize economies after World War II. Proposed by Secretary of State George C. Marshall in June 1947, it provided large-scale aid and became a cornerstone of Western recovery. It also shaped early Cold War alignments.",
    ko: "1947년에는 전후 유럽 재건을 위한 미국의 마셜 플랜이 제안·발표되었습니다. 1947년 6월 조지 C. 마셜 국무장관의 제안으로 시작되어 대규모 원조를 제공하며 서유럽 복구의 핵심 정책이 되었습니다. 동시에 초기 냉전 구도 형성에도 영향을 미쳤습니다.",
  },
  "1949": {
    en: "In 1949, NATO was established as a collective defense alliance in April 1949, and the People’s Republic of China was founded in October 1949. Both events were pivotal early Cold War developments: NATO formalized Western security cooperation, while the PRC’s founding reshaped Asian geopolitics.",
    ko: "1949년에는 4월 나토(NATO)가 창설되어 집단방위 동맹이 공식화되었고, 10월에는 중화인민공화국(PRC)이 수립되었습니다. 두 사건 모두 초기 냉전 전개에서 핵심적 전환점이었는데, 나토는 서방의 안보 협력을 제도화했고 중국의 정권 수립은 아시아 국제정치에 큰 변화를 가져왔습니다.",
  },
  "1962": {
    en: "In 1962, the Cuban Missile Crisis brought the United States and Soviet Union to the brink of nuclear war. The crisis peaked in October 1962 after the discovery of Soviet missiles in Cuba, leading to a U.S. naval quarantine and intense negotiations. It ended with the removal of missiles and helped spur later arms-control efforts.",
    ko: "1962년의 쿠바 미사일 위기는 미국과 소련을 핵전쟁 직전까지 몰고 간 냉전 최대 위기입니다. 1962년 10월 소련 미사일의 쿠바 배치가 확인되며 미국이 해상 봉쇄를 실시했고, 치열한 협상 끝에 미사일 철수로 위기가 종료되었습니다. 이후 군비통제 논의가 진전되는 계기 중 하나가 되었습니다.",
  },
  "1957": {
    en: "In 1957, the Soviet Union launched Sputnik 1, the first artificial satellite, on 4 October 1957. The launch shocked the world and triggered the Space Race, accelerating U.S. investment in science and space programs. It marked a new era of space technology and competition.",
    ko: "1957년에는 소련이 1957년 10월 4일 스푸트니크 1호를 발사해 인류 최초의 인공위성 시대를 열었습니다. 이 성공은 우주 경쟁을 촉발했고, 미국의 과학·우주 개발 투자를 크게 가속했습니다. 냉전기 기술 경쟁의 상징적 사건으로 꼽힙니다.",
  },

  // events
  "Cold War": {
    en: "The Cold War was the prolonged geopolitical rivalry between the United States and the Soviet Union after 1945. It featured ideological competition, arms races, proxy wars, and crises such as Berlin and Cuba, rather than direct large-scale war between the superpowers. The rivalry shaped global alliances until the USSR’s collapse in 1991.",
    ko: "냉전은 1945년 이후 미국과 소련 사이에서 전개된 장기적 세계 질서 경쟁입니다. 직접적인 대규모 전면전보다는 이념 대립, 군비 경쟁, 대리전, 베를린·쿠바 같은 위기 관리가 중심이었습니다. 1991년 소련 해체까지 국제정치의 기본 구도를 규정했습니다.",
  },
  "Korean War": {
    en: "The Korean War (1950–1953) began with North Korea’s invasion of South Korea and quickly became an international conflict. UN forces led largely by the United States intervened, and China entered the war on the North’s side. The 1953 armistice ended fighting without a peace treaty, leaving Korea divided.",
    ko: "한국전쟁(1950~1953)은 북한의 남침으로 시작되어 국제전으로 확대되었습니다. 미국 중심의 유엔군이 개입했고, 중국군도 참전하며 전선이 격화되었습니다. 1953년 정전협정으로 전투가 중단됐지만 평화협정은 체결되지 않아 분단이 고착되었습니다.",
  },
  "Vietnam War": {
    en: "The Vietnam War was a prolonged conflict involving North Vietnam and the Viet Cong against South Vietnam and its U.S. ally. Major U.S. escalation occurred in the 1960s, and the war became a central Cold War struggle in Southeast Asia. It ended with the fall of Saigon in 1975 and Vietnam’s reunification under communist rule.",
    ko: "베트남 전쟁은 북베트남·베트콩과 남베트남 및 미국이 얽힌 장기 전쟁입니다. 1960년대 미국의 대규모 개입으로 전쟁이 격화되었고, 동남아에서의 대표적 냉전 갈등으로 자리 잡았습니다. 1975년 사이공 함락으로 종결되어 베트남은 공산 정권 아래 통일되었습니다.",
  },
  "Cuban Missile Crisis": {
    en: "The Cuban Missile Crisis (1962) was a confrontation triggered by Soviet nuclear missiles placed in Cuba. The U.S. responded with a naval quarantine and demanded withdrawal, while both sides negotiated under extreme pressure. The crisis ended with Soviet removal of missiles from Cuba and became a defining moment of Cold War brinkmanship.",
    ko: "쿠바 미사일 위기(1962)는 소련의 쿠바 핵미사일 배치로 촉발된 미·소 대결입니다. 미국은 해상 봉쇄를 실시하며 철수를 요구했고, 양측은 극도의 긴장 속에서 협상을 진행했습니다. 소련의 미사일 철수로 일단락되며 냉전기의 ‘벼랑 끝 전술’의 대표 사례가 되었습니다.",
  },
  "Apollo 11 Moon Landing": {
    en: "The Apollo 11 Moon landing in 1969 marked the first time humans set foot on the Moon. Neil Armstrong and Buzz Aldrin landed in the lunar module Eagle, while Michael Collins remained in lunar orbit. The mission was a signature achievement of the U.S. in the Space Race.",
    ko: "1969년 아폴로 11호 달 착륙은 인류가 처음으로 달 표면에 발을 디딘 사건입니다. 닐 암스트롱과 버즈 올드린이 착륙선 ‘이글’로 달에 내렸고, 마이클 콜린스는 궤도에서 지원했습니다. 우주 경쟁에서 미국의 상징적 성취로 평가됩니다.",
  },
  "Fall of the Berlin Wall": {
    en: "The fall of the Berlin Wall in 1989 symbolized the unraveling of communist rule in Eastern Europe. As border restrictions eased, East Germans crossed into West Berlin, and the wall quickly lost its function as a barrier. The event accelerated German reunification and became an emblem of the Cold War’s end.",
    ko: "1989년 베를린 장벽 붕괴는 동유럽 공산권 붕괴를 상징하는 사건입니다. 국경 통행이 완화되자 동독 시민들이 서베를린으로 이동했고, 장벽은 빠르게 ‘장벽’으로서의 기능을 잃었습니다. 이는 독일 통일을 촉진하며 냉전 종식의 상징이 되었습니다.",
  },
  "Decolonization": {
    en: "Decolonization refers to the wave of independence movements that dismantled European colonial empires after World War II. Many Asian and African territories achieved sovereignty through negotiation, political struggle, or armed conflict. The process reshaped the international system and expanded UN membership dramatically.",
    ko: "탈식민화는 제2차 세계대전 이후 유럽 제국주의 식민지들이 독립을 획득해 식민 제국이 해체된 과정을 말합니다. 아시아·아프리카 여러 지역이 협상, 정치 투쟁, 무장 독립 등 다양한 방식으로 주권을 얻었습니다. 이는 국제질서를 재편하고 유엔 회원국을 급증시키는 변화를 가져왔습니다.",
  },
  "United Nations System": {
    en: "The United Nations system is the network of UN organs and specialized agencies created to maintain peace and promote cooperation. Founded in 1945, it includes bodies such as the General Assembly and Security Council, along with agencies addressing health, refugees, development, and more. It became a core framework for postwar global governance.",
    ko: "유엔 체제(UN System)는 평화 유지와 국제 협력을 위해 구축된 유엔 기구·전문기구의 네트워크를 뜻합니다. 1945년 창설 이후 총회·안전보장이사회 같은 본기관과, 보건·난민·개발 등을 다루는 여러 전문기구가 형성되었습니다. 전후 세계 거버넌스의 핵심 틀로 자리 잡았습니다.",
  },
  "Civil Rights Movement": {
    en: "The U.S. civil rights movement of the 1950s–1960s challenged segregation and racial discrimination. It used mass protests, legal action, and civil disobedience, and achieved landmark legislation such as the Civil Rights Act of 1964 and Voting Rights Act of 1965. Leaders like Martin Luther King Jr. helped shape its nonviolent strategy.",
    ko: "미국 민권운동(1950~1960년대)은 인종 분리와 차별에 맞선 사회운동입니다. 시위·소송·비폭력 시민불복종을 통해 변화를 추진했고, 1964년 민권법·1965년 투표권법 같은 핵심 입법 성과로 이어졌습니다. 마틴 루서 킹 등 지도자들이 비폭력 전략을 이끌었습니다.",
  },
  "Detente": {
    en: "Détente was a period of reduced tensions between the Soviet bloc and the West, especially in the 1970s. It involved diplomacy, arms-control agreements, and summitry aimed at managing the Cold War rivalry more safely. While tensions later rose again, détente marked a significant shift toward negotiated stabilization.",
    ko: "데탕트(긴장 완화)는 특히 1970년대에 두드러진 소련권과 서방 간 긴장 완화 국면을 말합니다. 외교 교섭, 정상회담, 군비통제 합의 등을 통해 냉전 경쟁을 보다 안전하게 관리하려 했습니다. 이후 긴장이 다시 높아지기도 했지만, ‘협상을 통한 안정화’로의 중요한 전환으로 평가됩니다.",
  },
};

function yearKey(answerEn) {
  const m = String(answerEn || '').match(/(\d{4})/);
  return m ? m[1] : '';
}

function build(item) {
  let fact = null;
  if (item.type === 'year') {
    fact = facts[yearKey(item.answer_en)];
  } else {
    fact = facts[item.answer_en];
  }
  if (!fact) return null;

  const en = `${fact.en}`.trim();
  const ko = `${fact.ko}`.trim();
  return { en, ko };
}

let updated = 0;
for (const item of data) {
  if (Number(item.stage) !== 1) continue;
  const next = build(item);
  if (!next) continue;
  if (item.explanation_en !== next.en || item.explanation_ko !== next.ko) {
    item.explanation_en = next.en;
    item.explanation_ko = next.ko;
    updated += 1;
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`updated stage1: ${updated}`);
