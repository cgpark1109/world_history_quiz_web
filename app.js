'use strict';

const ERAS = ['ancient', 'medieval', 'early_modern', 'modern1', 'contemporary'];
const CATEGORIES = ['person', 'year', 'event'];
const TOTAL_STAGES = 6;
const QUESTIONS_PER_SESSION = 10;

const ERA_LABELS = {
  ancient: { en: 'Ancient', ko: '고대' },
  medieval: { en: 'Medieval', ko: '중세' },
  early_modern: { en: 'Early Modern', ko: '근대' },
  modern1: { en: 'Modern', ko: '현대 1' },
  contemporary: { en: 'Contemporary', ko: '현대 2' },
};

const CATEGORY_LABELS = {
  person: { en: 'Person Quiz', ko: '인물 퀴즈' },
  year: { en: 'Year Quiz', ko: '연도 퀴즈' },
  event: { en: 'Event Quiz', ko: '사건 퀴즈' },
};

const PROGRESS_CATEGORY_LABELS = {
  person: { en: 'Person', ko: '인물' },
  year: { en: 'Year', ko: '연도' },
  event: { en: 'Event', ko: '사건' },
};

const TEXTS = {
  loading: { en: 'Loading quiz data...', ko: '퀴즈 데이터를 불러오는 중...' },
  loadingError: { en: 'Failed to load data. Please refresh.', ko: '데이터 로드에 실패했습니다. 새로고침 해주세요.' },
  appTitle: { en: 'World History Quiz', ko: '세계사 퀴즈' },
  settingsTitle: { en: 'Settings', ko: '설정' },
  resetProgress: { en: 'Reset Progress', ko: '진행도 초기화' },
  privacyPolicy: { en: 'Privacy Policy', ko: '개인정보처리방침' },
  progressTitle: { en: 'My Progress', ko: '내 진행도' },
  rateApp: { en: 'Rate this App ⭐', ko: '앱 평가하기 ⭐' },
  hint: { en: 'Hint (Watch Ad)', ko: '힌트 (광고 시청)' },
  hintShort: { en: 'Hint', ko: '힌트' },
  score: { en: 'Score', ko: '점수' },
  stage: { en: 'Stage', ko: '스테이지' },
  difficulty: { en: 'Difficulty increases by stage', ko: '스테이지가 올라갈수록 난이도가 상승합니다' },
  stageClear: { en: 'Stage Clear!', ko: '스테이지 클리어!' },
  tryAgain: { en: 'Try Again', ko: '다시 도전해보세요' },
  nextStage: { en: 'Next Stage', ko: '다음 스테이지' },
  retry: { en: 'Retry', ko: '다시하기' },
  stageSelect: { en: 'Stage Select', ko: '스테이지 선택' },
  home: { en: 'Home', ko: '홈' },
  resetSuccess: { en: 'Progress reset!', ko: '진행도가 초기화되었습니다!' },
  confirmResetTitle: { en: 'Reset Progress', ko: '진행도 초기화' },
  confirmResetBody: { en: 'Are you sure you want to reset all progress?', ko: '정말 모든 진행도를 초기화할까요?' },
  cancel: { en: 'Cancel', ko: '취소' },
  confirm: { en: 'Confirm', ko: '확인' },
  hintPrefix: { en: 'Answer starts with', ko: '정답의 첫 글자' },
  continue: { en: 'Continue', ko: '다음' },
  noQuestions: { en: 'Not enough questions for this stage.', ko: '이 스테이지의 문제가 부족합니다.' },
  loadingStage: { en: 'Loading...', ko: '불러오는 중...' },
  loadDataError: { en: 'Failed to load quiz data.', ko: '퀴즈 데이터를 불러오지 못했습니다.' },
  adLoading: { en: 'Loading...', ko: '로딩 중...' },
};

const state = {
  currentEra: 'ancient',
  currentCategory: 'person',
  currentStage: 1,
  language: 'en',
  questions: [],
  currentQuestion: 0,
  score: 0,
  answered: false,
  awaitingContinue: false,
  currentScreen: 'home-screen',
  previousScreen: 'home-screen',
};

const dom = {};
const dataCache = {};
let hintTextEl = null;
let hintBtnLabelBeforeAdLoad = null;
let explanationEl = null;
let advanceTimerId = null;

document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  ensureHintElement();
  ensureExplanationElement();
  ensureStageLabelElement();
  bindEvents();

  state.language = localStorage.getItem('language') === 'ko' ? 'ko' : 'en';
  updateTexts();
  showScreen('home-screen', false);
  goHome();
});

function cacheDom() {
  dom.screens = Array.from(document.querySelectorAll('.screen'));
  dom.homeScreen = document.getElementById('home-screen');
  dom.categoryScreen = document.getElementById('category-screen');
  dom.stageScreen = document.getElementById('stage-screen');
  dom.quizScreen = document.getElementById('quiz-screen');
  dom.resultScreen = document.getElementById('result-screen');
  dom.settingsScreen = document.getElementById('settings-screen');

  dom.homeTitle = dom.homeScreen.querySelector('.screen-title');
  dom.settingsTitle = dom.settingsScreen.querySelector('.screen-title');
  dom.categoryEraTitle = document.getElementById('category-era-title');
  dom.stageTitle = document.getElementById('stage-title');
  dom.stageGrid = document.getElementById('stage-grid');
  dom.quizMeta = document.getElementById('quiz-meta');
  dom.progressBar = document.getElementById('progress-bar');
  dom.questionCounter = document.getElementById('question-counter');
  dom.questionText = document.getElementById('question-text');
  dom.answersContainer = document.getElementById('answers');
  dom.scoreDisplay = document.getElementById('score-display');
  dom.hintBtn = document.getElementById('hint-btn');
  dom.continueBtn = document.getElementById('continue-btn');
  dom.resultScore = document.getElementById('result-score');
  dom.resultStatus = document.getElementById('result-status');
  dom.resultMessage = document.getElementById('result-message');
  dom.nextStageBtn = document.getElementById('next-stage-btn');
  dom.retryBtn = document.getElementById('retry-btn');
  dom.stageSelectBtn = document.getElementById('stage-select-btn');
  dom.homeBtn = document.getElementById('home-btn');
  dom.resetProgressBtn = document.getElementById('reset-progress-btn');
  dom.privacyLink = document.getElementById('privacy-policy-link');
  dom.versionLabel = dom.settingsScreen.querySelector('.version-label');
  dom.languageToggleHome = document.getElementById('language-toggle-home');
  dom.progressSummary = document.getElementById('progress-summary');
  dom.progressTitle = document.getElementById('text-progress-title');
  dom.rateAppBtn = document.getElementById('rate-app-btn');
  dom.rateAppText = document.getElementById('text-rate-app');
}

function bindEvents() {
  document.getElementById('home-settings-btn').addEventListener('click', () => {
    state.previousScreen = state.currentScreen;
    showScreen('settings-screen');
    renderProgressSummary();
  });

  document.getElementById('category-back-btn').addEventListener('click', goHome);
  document.getElementById('stage-back-btn').addEventListener('click', () => showScreen('category-screen'));
  document.getElementById('quiz-back-btn').addEventListener('click', goToStageScreen);
  document.getElementById('settings-back-btn').addEventListener('click', () => showScreen(state.previousScreen || 'home-screen'));

  document.querySelectorAll('.era-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectEra(btn.dataset.era));
  });

  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectCategory(btn.dataset.category));
  });

  dom.answersContainer.addEventListener('click', onAnswerContainerClick);

  dom.hintBtn.addEventListener('click', onHintClick);
  dom.continueBtn.addEventListener('click', onContinueClick);
  dom.nextStageBtn.addEventListener('click', onNextStageClick);
  dom.retryBtn.addEventListener('click', () => selectStage(state.currentStage));
  dom.stageSelectBtn.addEventListener('click', goToStageScreen);
  dom.homeBtn.addEventListener('click', goHome);
  dom.resetProgressBtn.addEventListener('click', resetProgressWithConfirm);

  dom.rateAppBtn.addEventListener('click', onRateAppClick);
  dom.rateAppBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRateAppClick();
    }
  });

  dom.privacyLink.href = 'https://cgpark1109.github.io/privacy-policy/';
  dom.privacyLink.target = '_blank';
  dom.privacyLink.rel = 'noopener noreferrer';

  if (dom.languageToggleHome) {
    dom.languageToggleHome.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
  }

  window.addEventListener('rewardGranted', onRewardGranted);
  window.addEventListener('rewardFailed', onRewardFailed);
  window.addEventListener('adLoading', onAdLoading);

  window.addEventListener('popstate', (event) => {
    const target = event.state && event.state.screenId ? event.state.screenId : 'home-screen';
    showScreen(target, false);
  });
}

/** Android 뒤로가기: Flutter WebView에서 호출 */
window.handleFlutterBack = function handleFlutterBack() {
  if (state.currentScreen === 'home-screen') {
    return false;
  }
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }
  showScreen('home-screen', false);
  return true;
};

function ensureHintElement() {
  hintTextEl = document.createElement('p');
  hintTextEl.className = 'hint-text hidden';
  hintTextEl.id = 'hint-text';
  dom.answersContainer.before(hintTextEl);
}

function ensureExplanationElement() {
  explanationEl = document.createElement('div');
  explanationEl.className = 'explanation-panel hidden';
  explanationEl.id = 'explanation-panel';
  explanationEl.setAttribute('role', 'region');
  explanationEl.setAttribute('aria-live', 'polite');
  dom.answersContainer.after(explanationEl);
}

function ensureStageLabelElement() {
  let stageLabel = document.getElementById('stage-label');
  if (!stageLabel) {
    stageLabel = document.createElement('p');
    stageLabel.id = 'stage-label';
    stageLabel.className = 'stage-label';
    dom.stageGrid.after(stageLabel);
  }
  dom.stageLabel = stageLabel;
}

async function loadData(era, category) {
  const key = `${era}_${category}`;
  if (dataCache[key]) return dataCache[key];

  const response = await fetch(`data/${era}_${category}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${era}_${category}.json (${response.status})`);
  }
  const data = await response.json();
  dataCache[key] = Array.isArray(data) ? data : [];
  return dataCache[key];
}

function showStageLoading(isVisible) {
  if (!dom.stageGrid) return;
  if (isVisible) {
    dom.stageGrid.innerHTML = '';
    const loadingEl = document.createElement('p');
    loadingEl.id = 'stage-loading';
    loadingEl.className = 'stage-loading';
    loadingEl.textContent = TEXTS.loadingStage[state.language];
    dom.stageGrid.appendChild(loadingEl);
  } else {
    renderStageScreen();
  }
}

function goToStageScreen() {
  renderStageScreen();
  showScreen('stage-screen');
}

function showScreen(screenId, pushState = true) {
  dom.screens.forEach((screen) => {
    screen.classList.remove('active');
    screen.classList.add('hidden');
  });

  const target = document.getElementById(screenId);
  if (!target) return;
  target.classList.remove('hidden');
  target.classList.add('active');

  state.currentScreen = screenId;

  if (screenId === 'stage-screen' && dom.stageGrid.querySelector('#stage-loading')) {
    renderStageScreen();
  }

  if (screenId === 'settings-screen') {
    renderProgressSummary();
  }

  if (pushState) {
    history.pushState({ screenId }, '', `#${screenId}`);
  }
}

function selectEra(era) {
  if (!ERAS.includes(era)) return;
  state.currentEra = era;
  updateCategoryTitle();
  showScreen('category-screen');
}

function selectCategory(category) {
  if (!CATEGORIES.includes(category)) return;
  state.currentCategory = category;
  goToStageScreen();
}

async function selectStage(stage) {
  showStageLoading(true);
  try {
    const data = await loadData(state.currentEra, state.currentCategory);
    state.currentStage = Number(stage);
    state.questions = generateQuestions(data, state.currentStage);
    state.currentQuestion = 0;
    state.score = 0;
    state.answered = false;
    showScreen('quiz-screen');
    renderQuestion();
  } catch (error) {
    console.error(error);
    alert(TEXTS.loadDataError[state.language]);
  } finally {
    showStageLoading(false);
  }
}

function goHome() {
  showScreen('home-screen');
}

function getUnlockedStage() {
  const key = getUnlockKey(state.currentEra, state.currentCategory);
  const value = Number(localStorage.getItem(key));
  if (Number.isNaN(value) || value < 1) return 1;
  return Math.min(TOTAL_STAGES, value);
}

function renderStageScreen() {
  const unlockedStage = getUnlockedStage();
  dom.stageGrid.innerHTML = '';

  for (let stage = 1; stage <= TOTAL_STAGES; stage += 1) {
    const btn = document.createElement('button');
    btn.className = 'stage-btn';
    btn.dataset.stage = String(stage);

    if (stage <= unlockedStage) {
      btn.classList.add('unlocked');
      if (stage === unlockedStage) {
        btn.classList.add('current');
      }
      btn.textContent =
        state.language === 'ko'
          ? `스테이지 ${stage}`
          : `${TEXTS.stage.en} ${stage}`;
      btn.addEventListener('click', () => selectStage(stage));
    } else {
      btn.classList.add('locked');
      btn.disabled = true;
      btn.textContent =
        state.language === 'ko'
          ? `스테이지 ${stage} (잠김)`
          : `${TEXTS.stage.en} ${stage} (locked)`;
    }

    dom.stageGrid.appendChild(btn);
  }

  updateStageTitle();
  dom.stageLabel.textContent = TEXTS.difficulty[state.language];
}

function generateQuestions(data, stage) {
  const stagePool = data.filter((item) => Number(item.stage) === Number(stage));
  const fallbackPool = data;

  const selectedBase = shuffle([...stagePool]).slice(0, QUESTIONS_PER_SESSION);

  if (selectedBase.length < QUESTIONS_PER_SESSION) {
    const usedIds = new Set(selectedBase.map((q) => q.id));
    for (const candidate of shuffle([...fallbackPool])) {
      if (usedIds.has(candidate.id)) continue;
      selectedBase.push(candidate);
      usedIds.add(candidate.id);
      if (selectedBase.length >= QUESTIONS_PER_SESSION) break;
    }
  }

  if (selectedBase.length < QUESTIONS_PER_SESSION) {
    const sourcePool = fallbackPool.length > 0 ? fallbackPool : stagePool;
    if (sourcePool.length === 0) {
      alert(TEXTS.noQuestions[state.language]);
    } else {
      while (selectedBase.length < QUESTIONS_PER_SESSION) {
        const randomPick = sourcePool[Math.floor(Math.random() * sourcePool.length)];
        selectedBase.push(randomPick);
      }
    }
  }

  const wrongPoolBase = data.filter((item) => Number(item.stage) !== Number(stage));

  return selectedBase.slice(0, QUESTIONS_PER_SESSION).map((question) => {
    const correctChoice = buildChoice(question.answer_en, question.answer_ko);
    const wrongPool = wrongPoolBase
      .map((item) => buildChoice(item.answer_en, item.answer_ko))
      .filter((choice) => choice.en && choice.en !== correctChoice.en);

    const uniqueWrongMap = new Map();
    wrongPool.forEach((choice) => {
      const key = `${choice.en}__${choice.ko}`;
      if (!uniqueWrongMap.has(key)) {
        uniqueWrongMap.set(key, choice);
      }
    });
    let wrongChoices = shuffle(Array.from(uniqueWrongMap.values())).slice(0, 3);

    if (wrongChoices.length < 3) {
      for (let i = 1; i <= 3; i += 1) {
        const embedded = buildChoice(question[`wrong${i}_en`], question[`wrong${i}_ko`]);
        if (!embedded.en || embedded.en === correctChoice.en) continue;
        const exists = wrongChoices.some((choice) => choice.en === embedded.en);
        if (!exists) {
          wrongChoices.push(embedded);
          if (wrongChoices.length === 3) break;
        }
      }
    }

    while (wrongChoices.length < 3) {
      wrongChoices.push({ en: '-', ko: '-' });
    }

    const choices = shuffle([correctChoice, ...wrongChoices]);
    const correctIndex = choices.findIndex((choice) => choice.en === correctChoice.en);

    return {
      raw: question,
      choices,
      correctIndex,
    };
  });
}

function updateHintButton() {
  dom.hintBtn.textContent = TEXTS.hintShort[state.language];
  dom.hintBtn.setAttribute('aria-label', TEXTS.hint[state.language]);
}

function showContinueButton(isVisible) {
  dom.continueBtn.classList.toggle('hidden', !isVisible);
  dom.continueBtn.textContent = TEXTS.continue[state.language];
}

function resetQuizControls() {
  showContinueButton(false);
  dom.hintBtn.disabled = false;
  dom.hintBtn.classList.remove('hidden');
  updateHintButton();
}

function renderQuestion() {
  if (!state.questions.length) return;

  const current = state.questions[state.currentQuestion];
  if (!current) return;

  const progress = (state.currentQuestion / QUESTIONS_PER_SESSION) * 100;
  dom.progressBar.style.width = `${progress}%`;
  dom.questionCounter.textContent = `${state.currentQuestion + 1} / ${QUESTIONS_PER_SESSION}`;
  dom.quizMeta.textContent = `${ERA_LABELS[state.currentEra][state.language]} · ${CATEGORY_LABELS[state.currentCategory][state.language]}`;
  dom.questionText.textContent = getQuestionText(current.raw);
  dom.scoreDisplay.textContent = `${TEXTS.score[state.language]}: ${state.score}`;

  clearAdvanceTimer();
  state.awaitingContinue = false;

  hintTextEl.textContent = '';
  hintTextEl.classList.add('hidden');
  hideExplanation();
  resetQuizControls();

  dom.answersContainer.classList.remove('answers-locked');
  dom.answersContainer.innerHTML = '';
  current.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-btn';
    btn.dataset.index = String(idx);
    btn.textContent = choice[state.language] || choice.en;
    dom.answersContainer.appendChild(btn);
  });
}

function onAnswerContainerClick(event) {
  if (state.answered || dom.answersContainer.classList.contains('answers-locked')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  const btn = event.target.closest('.answer-btn');
  if (!btn || btn.disabled) return;

  const choiceIndex = Number(btn.dataset.index);
  if (Number.isNaN(choiceIndex)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  selectAnswer(choiceIndex);
}

function lockAnswerButtons() {
  dom.answersContainer.classList.add('answers-locked');
  dom.answersContainer.querySelectorAll('.answer-btn').forEach((btn) => {
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.tabIndex = -1;
  });
}

function selectAnswer(choiceIndex) {
  if (state.answered) return;
  const current = state.questions[state.currentQuestion];
  if (!current) return;

  state.answered = true;
  lockAnswerButtons();

  const answerButtons = Array.from(dom.answersContainer.querySelectorAll('.answer-btn'));
  answerButtons.forEach((btn) => {
    btn.classList.remove('correct', 'incorrect');
  });

  if (choiceIndex === current.correctIndex) {
    state.score += 1;
    answerButtons[choiceIndex].classList.add('correct');
  } else {
    answerButtons[choiceIndex].classList.add('incorrect');
    if (answerButtons[current.correctIndex]) {
      answerButtons[current.correctIndex].classList.add('correct');
    }
  }

  dom.scoreDisplay.textContent = `${TEXTS.score[state.language]}: ${state.score}`;

  const explanation = getExplanationText(current.raw);
  if (explanation) {
    showExplanation(explanation);
    state.awaitingContinue = true;
    dom.hintBtn.classList.add('hidden');
    showContinueButton(true);
  } else {
    dom.hintBtn.disabled = true;
    scheduleAdvance(1200);
  }
}

function nextQuestion() {
  state.currentQuestion += 1;
  if (state.currentQuestion >= QUESTIONS_PER_SESSION) {
    showResult();
    return;
  }
  state.answered = false;
  renderQuestion();
}

function showResult(incrementResultCount = true) {
  showScreen('result-screen');

  dom.resultScore.textContent = `${state.score} / ${QUESTIONS_PER_SESSION}`;

  const cleared = state.score >= 6;
  dom.resultStatus.textContent = cleared ? TEXTS.stageClear[state.language] : TEXTS.tryAgain[state.language];
  dom.resultStatus.classList.toggle('clear', cleared);
  dom.resultStatus.classList.toggle('fail', !cleared);
  dom.resultMessage.textContent = getResultMessage(state.score, state.language);

  if (cleared) {
    const key = getUnlockKey(state.currentEra, state.currentCategory);
    const currentUnlocked = getUnlockedStage();
    const nextUnlock = Math.min(TOTAL_STAGES, Math.max(currentUnlocked, state.currentStage + 1));
    localStorage.setItem(key, String(nextUnlock));
  }

  const showNextStage = cleared && state.currentStage < TOTAL_STAGES;
  dom.nextStageBtn.classList.toggle('hidden', !showNextStage);

  if (incrementResultCount) {
    let resultCount = Number(localStorage.getItem('resultCount'));
    if (Number.isNaN(resultCount)) resultCount = 0;
    resultCount += 1;
    localStorage.setItem('resultCount', String(resultCount));

    if (resultCount % 2 === 0) {
      postFlutterMessage('showInterstitialAd');
    }
  }
}

function getResultMessage(score, lang) {
  if (score === 10) return lang === 'ko' ? '완벽해요!' : 'Perfect!';
  if (score >= 7) return lang === 'ko' ? '잘했어요!' : 'Great job!';
  if (score >= 4) return lang === 'ko' ? '계속 연습하세요!' : 'Keep practicing!';
  return lang === 'ko' ? '다시 도전해보세요!' : 'Try again!';
}

function onNextStageClick() {
  if (state.currentStage >= TOTAL_STAGES) return;
  selectStage(state.currentStage + 1);
}

function onHintClick() {
  dom.hintBtn.disabled = true;
  postFlutterMessage('showRewardedAd');
}

function onAdLoading() {
  if (state.currentScreen !== 'quiz-screen') return;
  if (state.answered) return;
  hintBtnLabelBeforeAdLoad = dom.hintBtn.textContent;
  dom.hintBtn.textContent = TEXTS.adLoading[state.language];
  dom.hintBtn.disabled = true;
}

function restoreHintBtnLabel() {
  if (hintBtnLabelBeforeAdLoad != null) {
    dom.hintBtn.textContent = hintBtnLabelBeforeAdLoad;
    hintBtnLabelBeforeAdLoad = null;
    return;
  }
  dom.hintBtn.textContent = TEXTS.hintShort[state.language];
}

function onContinueClick() {
  if (!state.awaitingContinue) return;
  state.awaitingContinue = false;
  showContinueButton(false);
  nextQuestion();
}

function onRewardGranted() {
  if (!state.questions.length || state.currentScreen !== 'quiz-screen') return;
  if (state.answered) return;

  const current = state.questions[state.currentQuestion];
  const answerButtons = Array.from(dom.answersContainer.querySelectorAll('.answer-btn'));
  const wrongButtons = answerButtons.filter(
    (btn) => Number(btn.dataset.index) !== current.correctIndex && !btn.disabled && !btn.classList.contains('hidden'),
  );

  if (wrongButtons.length) {
    const toHide = wrongButtons[Math.floor(Math.random() * wrongButtons.length)];
    toHide.classList.add('hidden');
    toHide.disabled = true;
  }

  const answerText = current.choices[current.correctIndex][state.language] || current.choices[current.correctIndex].en || '';
  const firstLetter = answerText.trim().charAt(0) || '?';
  hintTextEl.textContent =
    state.language === 'ko'
      ? `${TEXTS.hintPrefix.ko}: ${firstLetter}...`
      : `${TEXTS.hintPrefix.en}: ${firstLetter}...`;
  hintTextEl.classList.remove('hidden');
  dom.hintBtn.classList.add('hidden');
}

function onRewardFailed() {
  if (state.currentScreen !== 'quiz-screen') return;
  if (state.answered) return;
  restoreHintBtnLabel();
  dom.hintBtn.disabled = false;
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'ko') return;
  state.language = lang;
  localStorage.setItem('language', lang);
  updateTexts();

  if (state.currentScreen === 'stage-screen') {
    renderStageScreen();
  } else if (state.currentScreen === 'quiz-screen') {
    renderQuestion();
  } else if (state.currentScreen === 'result-screen') {
    showResult(false);
  }
}

function updateTexts() {
  dom.homeTitle.textContent = TEXTS.appTitle[state.language];
  dom.settingsTitle.textContent = `${TEXTS.settingsTitle.en} / ${TEXTS.settingsTitle.ko}`;
  dom.resetProgressBtn.textContent = TEXTS.resetProgress[state.language];
  if (dom.progressTitle) {
    dom.progressTitle.textContent = TEXTS.progressTitle[state.language];
  }
  if (dom.rateAppText) {
    dom.rateAppText.textContent = TEXTS.rateApp[state.language];
  }
  dom.privacyLink.textContent = TEXTS.privacyPolicy[state.language];
  dom.versionLabel.textContent = 'v1.0.0';
  dom.retryBtn.textContent = TEXTS.retry[state.language];
  dom.stageSelectBtn.textContent = TEXTS.stageSelect[state.language];
  dom.homeBtn.textContent = TEXTS.home[state.language];
  dom.nextStageBtn.textContent = TEXTS.nextStage[state.language];
  updateHintButton();
  if (state.awaitingContinue) {
    showContinueButton(true);
  }

  document.querySelectorAll('.era-btn').forEach((btn) => {
    const era = btn.dataset.era;
    btn.textContent = ERA_LABELS[era][state.language];
  });

  document.querySelectorAll('.category-btn').forEach((btn) => {
    const category = btn.dataset.category;
    btn.textContent = CATEGORY_LABELS[category][state.language];
  });

  updateCategoryTitle();
  updateStageTitle();
  updateLanguageToggleUI();

  if (state.currentScreen === 'settings-screen') {
    renderProgressSummary();
  }

  if (state.currentScreen === 'quiz-screen' && state.questions.length > 0) {
    if (state.awaitingContinue) {
      const current = state.questions[state.currentQuestion];
      if (current) {
        dom.questionText.textContent = getQuestionText(current.raw);
        dom.quizMeta.textContent = `${ERA_LABELS[state.currentEra][state.language]} · ${CATEGORY_LABELS[state.currentCategory][state.language]}`;
        const explanation = getExplanationText(current.raw);
        if (explanation) showExplanation(explanation);
        dom.hintBtn.classList.add('hidden');
        showContinueButton(true);
      }
    } else if (!state.answered) {
      renderQuestion();
    }
  }
}

function updateCategoryTitle() {
  dom.categoryEraTitle.textContent = ERA_LABELS[state.currentEra][state.language];
}

function updateStageTitle() {
  dom.stageTitle.textContent = `${ERA_LABELS[state.currentEra][state.language]} · ${CATEGORY_LABELS[state.currentCategory][state.language]}`;
}

function updateLanguageToggleUI() {
  if (!dom.languageToggleHome) return;
  dom.languageToggleHome.querySelectorAll('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === state.language;
    btn.classList.toggle('active', active);
  });
}

function resetProgressWithConfirm() {
  showConfirmModal(
    TEXTS.confirmResetTitle[state.language],
    TEXTS.confirmResetBody[state.language],
    () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('unlockedStage_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('resultCount', '0');
      showToast(TEXTS.resetSuccess[state.language], 2000);
      if (state.currentScreen === 'stage-screen') {
        renderStageScreen();
      }
      if (state.currentScreen === 'settings-screen') {
        renderProgressSummary();
      }
    },
  );
}

function showConfirmModal(title, message, onConfirm) {
  const backdrop = document.createElement('div');
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px',
    zIndex: '10000',
  });

  const modal = document.createElement('div');
  Object.assign(modal.style, {
    width: '100%',
    maxWidth: '420px',
    background: '#3D2B1F',
    color: '#F5ECD7',
    border: '2px solid #F5ECD7',
    borderRadius: '12px',
    padding: '16px',
  });

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.marginBottom = '8px';

  const messageEl = document.createElement('p');
  messageEl.textContent = message;
  messageEl.style.marginBottom = '14px';
  messageEl.style.lineHeight = '1.45';

  const actions = document.createElement('div');
  Object.assign(actions.style, {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = TEXTS.cancel[state.language];
  Object.assign(cancelBtn.style, {
    border: '1px solid #F5ECD7',
    color: '#F5ECD7',
    padding: '8px 12px',
    borderRadius: '8px',
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = TEXTS.confirm[state.language];
  Object.assign(confirmBtn.style, {
    border: '1px solid #C8A96E',
    color: '#3D2B1F',
    background: '#C8A96E',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: '700',
  });

  cancelBtn.addEventListener('click', () => backdrop.remove());
  confirmBtn.addEventListener('click', () => {
    backdrop.remove();
    onConfirm();
  });

  actions.append(cancelBtn, confirmBtn);
  modal.append(titleEl, messageEl, actions);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

function showToast(message, durationMs) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    left: '50%',
    bottom: '28px',
    transform: 'translateX(-50%)',
    background: '#F5ECD7',
    color: '#3D2B1F',
    borderRadius: '999px',
    padding: '10px 14px',
    fontWeight: '700',
    zIndex: '10001',
    maxWidth: '90vw',
    textAlign: 'center',
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), durationMs);
}

function getUnlockKey(era, category) {
  return `unlockedStage_${era}_${category}`;
}

function getUnlockedStageFor(era, category) {
  const key = getUnlockKey(era, category);
  const value = Number(localStorage.getItem(key));
  if (Number.isNaN(value) || value < 1) return 1;
  return Math.min(TOTAL_STAGES, value);
}

function getClearedStageCount(era, category) {
  const unlocked = getUnlockedStageFor(era, category);
  return Math.max(0, Math.min(TOTAL_STAGES, unlocked - 1));
}

function renderProgressSummary() {
  if (!dom.progressSummary) return;

  dom.progressSummary.innerHTML = '';

  ERAS.forEach((era) => {
    const eraBlock = document.createElement('div');
    eraBlock.className = 'progress-era-block';

    const eraName = document.createElement('div');
    eraName.className = 'progress-era-name';
    eraName.textContent = ERA_LABELS[era][state.language];
    eraBlock.appendChild(eraName);

    CATEGORIES.forEach((category) => {
      const cleared = getClearedStageCount(era, category);
      const fillPercent = (cleared / TOTAL_STAGES) * 100;

      const row = document.createElement('div');
      row.className = 'progress-bar-row';

      const label = document.createElement('span');
      label.className = 'progress-bar-label';
      label.textContent = PROGRESS_CATEGORY_LABELS[category][state.language];

      const track = document.createElement('div');
      track.className = 'progress-bar-track';
      track.setAttribute('aria-hidden', 'true');

      const fill = document.createElement('div');
      fill.className = 'progress-bar-fill';
      fill.style.width = `${fillPercent}%`;
      track.appendChild(fill);

      const count = document.createElement('span');
      count.className = 'progress-bar-count';
      count.textContent = `${cleared}/${TOTAL_STAGES}`;

      row.append(label, track, count);
      eraBlock.appendChild(row);
    });

    dom.progressSummary.appendChild(eraBlock);
  });
}

function onRateAppClick() {
  postFlutterMessage('openPlayStore');
}

function getQuestionText(question) {
  return question[`question_${state.language}`] || question.question_en || '';
}

function getExplanationText(question) {
  if (!question) return '';
  return (question[`explanation_${state.language}`] || question.explanation_en || '').trim();
}

function getAnswerText(question) {
  return question[`answer_${state.language}`] || question.answer_en || '';
}

function showExplanation(text) {
  if (!explanationEl) return;
  explanationEl.textContent = text;
  explanationEl.classList.remove('hidden');
}

function hideExplanation() {
  if (!explanationEl) return;
  explanationEl.textContent = '';
  explanationEl.classList.add('hidden');
}

function clearAdvanceTimer() {
  if (advanceTimerId !== null) {
    clearTimeout(advanceTimerId);
    advanceTimerId = null;
  }
}

function scheduleAdvance(delayMs) {
  clearAdvanceTimer();
  advanceTimerId = setTimeout(() => {
    advanceTimerId = null;
    nextQuestion();
  }, delayMs);
}

function buildChoice(en, ko) {
  const safeEn = en || '';
  const safeKo = ko || safeEn;
  return { en: safeEn, ko: safeKo };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function postFlutterMessage(message) {
  try {
    if (window.FlutterChannel && typeof window.FlutterChannel.postMessage === 'function') {
      window.FlutterChannel.postMessage(message);
    }
  } catch (error) {
    console.warn('Flutter channel unavailable:', error);
  }
}
