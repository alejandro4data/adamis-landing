(() => {
  'use strict';

  const STORAGE_KEY = 'demo_mision_meta_v1';
  const STATE_VERSION = 1;
  const STYLE_ID = 'mision-meta-styles';
  const VALID_PHASES = new Set(['saving', 'ready-for-surprise']);

  const toInteger = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.trunc(number) : fallback;
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const money = (value, fallback = 0) => Math.max(0, toInteger(value, fallback));

  function normalizeConfig(slide) {
    const totalWeeks = Math.max(1, toInteger(slide.totalWeeks, 5));
    const weeklyIncome = money(slide.weeklyIncome, 10);
    return {
      title: String(slide.title || 'Misión Meta'),
      totalWeeks,
      weeklyIncome,
      initialWellbeing: clamp(toInteger(slide.initialWellbeing, 60), 0, 100),
      savingsGoal: money(slide.savingsGoal, 20),
      wellbeingGoal: clamp(toInteger(slide.wellbeingGoal, 70), 0, 100),
      defaultSaving: clamp(toInteger(slide.defaultSaving, 4), 0, weeklyIncome),
      image: String(slide.image || ''),
      alt: String(slide.alt || 'Álex recibe su paga semanal.')
    };
  }

  function createInitialState(config) {
    return {
      version: STATE_VERSION,
      week: 1,
      totalWeeks: config.totalWeeks,
      wallet: 0,
      piggyBank: 0,
      wellbeing: config.initialWellbeing,
      weeklyIncome: config.weeklyIncome,
      savingsGoal: config.savingsGoal,
      wellbeingGoal: config.wellbeingGoal,
      phase: 'saving',
      savingDraft: config.defaultSaving,
      creditedWeeks: [],
      history: []
    };
  }

  function normalizeHistory(value, totalWeeks) {
    if (!Array.isArray(value)) return [];
    const byWeek = new Map();

    value.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const week = clamp(toInteger(entry.week, 0), 0, totalWeeks);
      if (week < 1 || byWeek.has(week)) return;
      byWeek.set(week, {
        week,
        allowance: money(entry.allowance),
        saved: money(entry.saved),
        walletAfterSaving: money(entry.walletAfterSaving),
        piggyBankAfterSaving: money(entry.piggyBankAfterSaving),
        wellbeingAfterSaving: clamp(toInteger(entry.wellbeingAfterSaving, 0), 0, 100)
      });
    });

    return Array.from(byWeek.values()).sort((a, b) => a.week - b.week);
  }

  function normalizeState(value, config) {
    if (!value || typeof value !== 'object' || value.version !== STATE_VERSION) {
      return createInitialState(config);
    }

    const totalWeeks = Math.max(1, toInteger(value.totalWeeks, config.totalWeeks));
    const weeklyIncome = money(value.weeklyIncome, config.weeklyIncome);
    const week = clamp(toInteger(value.week, 1), 1, totalWeeks);
    const history = normalizeHistory(value.history, totalWeeks);
    const hasSavedThisWeek = history.some((entry) => entry.week === week);
    const requestedPhase = VALID_PHASES.has(value.phase) ? value.phase : 'saving';
    const phase = hasSavedThisWeek ? 'ready-for-surprise' :
      (requestedPhase === 'ready-for-surprise' ? 'saving' : requestedPhase);
    const creditedWeeks = Array.isArray(value.creditedWeeks)
      ? Array.from(new Set(value.creditedWeeks
          .map((item) => toInteger(item, 0))
          .filter((item) => item >= 1 && item <= totalWeeks)))
          .sort((a, b) => a - b)
      : [];

    return {
      version: STATE_VERSION,
      week,
      totalWeeks,
      wallet: money(value.wallet),
      piggyBank: money(value.piggyBank),
      wellbeing: clamp(toInteger(value.wellbeing, config.initialWellbeing), 0, 100),
      weeklyIncome,
      savingsGoal: money(value.savingsGoal, config.savingsGoal),
      wellbeingGoal: clamp(toInteger(value.wellbeingGoal, config.wellbeingGoal), 0, 100),
      phase,
      savingDraft: clamp(toInteger(value.savingDraft, config.defaultSaving), 0, weeklyIncome),
      creditedWeeks,
      history
    };
  }

  function persistState(state) {
    window.MISION_META_STATE = state;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
    return state;
  }

  function loadState(config) {
    let state = createInitialState(config);
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) state = normalizeState(JSON.parse(stored), config);
    } catch (_) {
      state = createInitialState(config);
    }
    return persistState(state);
  }

  function creditWeeklyAllowance(state) {
    if (state.creditedWeeks.includes(state.week)) return false;
    state.wallet += state.weeklyIncome;
    state.creditedWeeks = [...state.creditedWeeks, state.week].sort((a, b) => a - b);
    persistState(state);
    return true;
  }

  function updateSavingDraft(state, value) {
    if (state.phase !== 'saving') return state.savingDraft;
    state.savingDraft = clamp(toInteger(value, state.savingDraft), 0, state.weeklyIncome);
    persistState(state);
    return state.savingDraft;
  }

  function confirmSaving(state) {
    if (state.phase !== 'saving') return false;
    if (state.history.some((entry) => entry.week === state.week)) return false;

    const saved = clamp(toInteger(state.savingDraft, 0), 0, state.weeklyIncome);
    if (saved > state.wallet) return false;

    const walletAfterSaving = state.wallet - saved;
    const piggyBankAfterSaving = state.piggyBank + saved;
    const entry = {
      week: state.week,
      allowance: state.weeklyIncome,
      saved,
      walletAfterSaving,
      piggyBankAfterSaving,
      wellbeingAfterSaving: state.wellbeing
    };

    Object.assign(state, {
      wallet: walletAfterSaving,
      piggyBank: piggyBankAfterSaving,
      phase: 'ready-for-surprise',
      history: [...state.history, entry]
    });
    persistState(state);
    return true;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .mission-meta {
        --mission-ink: #17324d;
        --mission-muted: #60748b;
        --mission-teal: #199b91;
        --mission-teal-dark: #08766f;
        --mission-mint: #e5f7f3;
        --mission-gold: #f4b942;
        --mission-gold-soft: #fff4d8;
        --mission-border: #dce9e7;
        box-sizing: border-box;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        cursor: default !important;
        color: var(--mission-ink);
        background:
          radial-gradient(circle at 13% 16%, rgba(145, 224, 202, .25), transparent 32%),
          radial-gradient(circle at 88% 88%, rgba(244, 185, 66, .15), transparent 31%),
          #f8fcfb !important;
      }
      .mission-meta, .mission-meta * { box-sizing: border-box; }
      .mission-meta__shell {
        width: min(1480px, 100%);
        min-height: 100%;
        margin: 0 auto;
        padding: clamp(18px, 2.5vw, 42px) clamp(16px, 3.5vw, 56px);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        gap: clamp(14px, 2vh, 24px);
      }
      .mission-meta__header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: end;
        gap: 12px 24px;
      }
      .mission-meta__eyebrow {
        margin: 0 0 4px;
        color: var(--mission-teal-dark);
        font-size: clamp(12px, 1.2vw, 15px);
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .mission-meta__title {
        margin: 0;
        font-size: clamp(30px, 3.5vw, 54px);
        line-height: .98;
        letter-spacing: -.035em;
      }
      .mission-meta__week-line {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .mission-meta__week-label {
        flex: 0 0 auto;
        color: var(--mission-muted);
        font-size: clamp(14px, 1.35vw, 17px);
        font-weight: 750;
      }
      .mission-meta__progress {
        width: min(270px, 52vw);
        display: grid;
        grid-template-columns: repeat(var(--mission-weeks), minmax(18px, 1fr));
        gap: 7px;
      }
      .mission-meta__progress-step {
        height: 8px;
        border-radius: 999px;
        background: #dbe8e6;
      }
      .mission-meta__progress-step.is-active { background: var(--mission-teal); }
      .mission-meta__goals {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        flex-wrap: wrap;
      }
      .mission-meta__goal {
        padding: 8px 12px;
        border: 1px solid var(--mission-border);
        border-radius: 999px;
        background: rgba(255,255,255,.78);
        color: var(--mission-muted);
        font-size: clamp(12px, 1.1vw, 14px);
        font-weight: 750;
        white-space: nowrap;
      }
      .mission-meta__goal strong { color: var(--mission-ink); }
      .mission-meta__content {
        min-width: 0;
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(230px, .86fr) minmax(0, 1.14fr);
        gap: clamp(16px, 2.5vw, 34px);
      }
      .mission-meta__visual-card,
      .mission-meta__panel {
        min-width: 0;
        min-height: 0;
      }
      .mission-meta__visual-card {
        position: relative;
        margin: 0;
        overflow: hidden;
        display: grid;
        place-items: center;
        padding: clamp(12px, 2vw, 28px);
        border: 1px solid rgba(206, 229, 224, .9);
        border-radius: clamp(22px, 3vw, 34px);
        background: linear-gradient(155deg, rgba(255,255,255,.94), rgba(230,247,242,.86));
        box-shadow: 0 18px 55px rgba(30, 84, 75, .1);
      }
      .mission-meta__visual-card::after {
        content: '';
        position: absolute;
        width: 62%;
        aspect-ratio: 1;
        left: 19%;
        bottom: 4%;
        border-radius: 50%;
        background: rgba(93, 203, 171, .12);
        filter: blur(2px);
      }
      .mission-meta__image {
        position: relative;
        z-index: 1;
        display: block;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        max-width: 100%;
        max-height: 100%;
        align-self: stretch;
        justify-self: stretch;
        object-fit: contain;
        object-position: center;
        filter: drop-shadow(0 18px 24px rgba(22, 65, 62, .13));
      }
      .mission-meta__panel {
        display: grid;
        align-content: center;
        gap: clamp(10px, 1.4vh, 16px);
      }
      .mission-meta__balances {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      .mission-meta__balance {
        min-width: 0;
        padding: clamp(12px, 1.6vw, 19px);
        border: 1px solid var(--mission-border);
        border-radius: 20px;
        background: rgba(255,255,255,.9);
        box-shadow: 0 9px 28px rgba(28, 73, 68, .07);
      }
      .mission-meta__balance-label {
        display: block;
        margin-bottom: 5px;
        color: var(--mission-muted);
        font-size: clamp(11px, 1vw, 13px);
        font-weight: 850;
        letter-spacing: .08em;
      }
      .mission-meta__balance-value {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: clamp(22px, 2.6vw, 36px);
        font-weight: 850;
        line-height: 1;
      }
      .mission-meta__coin {
        width: clamp(19px, 2vw, 27px);
        height: clamp(19px, 2vw, 27px);
        flex: 0 0 auto;
        object-fit: contain;
      }
      .mission-meta__wellbeing-value {
        font-size: clamp(19px, 2.15vw, 30px);
        white-space: nowrap;
      }
      .mission-meta__wellbeing-track {
        height: 7px;
        margin-top: 10px;
        overflow: hidden;
        border-radius: 999px;
        background: #e3eceb;
      }
      .mission-meta__wellbeing-fill {
        width: var(--mission-wellbeing);
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #f4c24f, #68bf6c);
      }
      .mission-meta__allowance {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 11px 16px;
        border: 1px solid #f1d48b;
        border-radius: 18px;
        background: var(--mission-gold-soft);
      }
      .mission-meta__allowance-label {
        color: #765a1f;
        font-size: clamp(12px, 1.1vw, 14px);
        font-weight: 850;
        letter-spacing: .08em;
      }
      .mission-meta__allowance-value {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #684b0d;
        font-size: clamp(18px, 2vw, 25px);
        font-weight: 900;
        white-space: nowrap;
        animation: mission-meta-allowance-in .55s ease-out both;
      }
      @keyframes mission-meta-allowance-in {
        from { transform: translateY(-7px); }
        to { transform: translateY(0); }
      }
      .mission-meta__decision {
        padding: clamp(15px, 2vw, 23px);
        border: 1px solid var(--mission-border);
        border-radius: 24px;
        background: rgba(255,255,255,.94);
        box-shadow: 0 14px 38px rgba(28, 73, 68, .08);
      }
      .mission-meta__question {
        display: block;
        margin-bottom: 5px;
        font-size: clamp(17px, 1.7vw, 23px);
        font-weight: 820;
        line-height: 1.2;
      }
      .mission-meta__selection {
        margin-bottom: 10px;
        color: var(--mission-teal-dark);
        font-size: clamp(24px, 3vw, 38px);
        font-weight: 900;
      }
      .mission-meta__range {
        display: block;
        width: 100%;
        height: 28px;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        accent-color: var(--mission-teal);
        cursor: pointer;
        touch-action: pan-y;
      }
      .mission-meta__range:disabled { cursor: default; opacity: .62; }
      .mission-meta__range::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--mission-teal) var(--range-progress), #dce8e6 var(--range-progress));
      }
      .mission-meta__range::-webkit-slider-thumb {
        width: 24px;
        height: 24px;
        margin-top: -8px;
        border: 4px solid #fff;
        border-radius: 50%;
        background: var(--mission-teal);
        box-shadow: 0 2px 8px rgba(8, 118, 111, .35);
        -webkit-appearance: none;
      }
      .mission-meta__range::-moz-range-track {
        height: 8px;
        border-radius: 999px;
        background: #dce8e6;
      }
      .mission-meta__range::-moz-range-progress {
        height: 8px;
        border-radius: 999px;
        background: var(--mission-teal);
      }
      .mission-meta__range::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border: 4px solid #fff;
        border-radius: 50%;
        background: var(--mission-teal);
        box-shadow: 0 2px 8px rgba(8, 118, 111, .35);
      }
      .mission-meta__range:focus-visible {
        outline: 3px solid rgba(25, 155, 145, .28);
        outline-offset: 4px;
        border-radius: 999px;
      }
      .mission-meta__range-limits {
        display: flex;
        justify-content: space-between;
        margin-top: -2px;
        color: var(--mission-muted);
        font-size: 12px;
        font-weight: 700;
      }
      .mission-meta__preview {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        margin: 12px 0;
      }
      .mission-meta__preview-item {
        min-width: 0;
        padding: 10px 12px;
        border-radius: 15px;
        background: #f1f8f6;
        color: var(--mission-muted);
        font-size: clamp(12px, 1.15vw, 14px);
        line-height: 1.25;
      }
      .mission-meta__preview-item strong {
        display: block;
        margin-top: 2px;
        color: var(--mission-ink);
        font-size: clamp(17px, 1.6vw, 21px);
      }
      .mission-meta__confirm {
        width: 100%;
        min-height: 48px;
        padding: 12px 18px;
        border: 0;
        border-radius: 15px;
        background: linear-gradient(135deg, var(--mission-teal), var(--mission-teal-dark));
        color: #fff;
        font: inherit;
        font-size: clamp(14px, 1.25vw, 17px);
        font-weight: 850;
        box-shadow: 0 9px 20px rgba(8, 118, 111, .2);
        cursor: pointer;
      }
      .mission-meta__confirm:hover:not(:disabled) { filter: brightness(1.04); }
      .mission-meta__confirm:focus-visible {
        outline: 3px solid rgba(25, 155, 145, .3);
        outline-offset: 3px;
      }
      .mission-meta__confirm:disabled {
        background: #dfece9;
        color: #3d716b;
        box-shadow: none;
        cursor: default;
      }
      @media (max-width: 840px) {
        .mission-meta__shell { padding-inline: 18px; }
        .mission-meta__content { grid-template-columns: minmax(210px, .72fr) minmax(0, 1.28fr); gap: 15px; }
        .mission-meta__visual-card { padding: 10px; }
        .mission-meta__balance { border-radius: 16px; }
      }
      @media (max-width: 840px) {
        .mission-meta__shell { display: block; padding: 18px 14px 28px; }
        .mission-meta__header { grid-template-columns: 1fr; align-items: start; }
        .mission-meta__goals { justify-content: flex-start; margin-top: 10px; }
        .mission-meta__content { display: grid; grid-template-columns: 1fr; margin-top: 16px; }
        .mission-meta__visual-card { height: clamp(210px, 27vh, 275px); min-height: 0; max-height: none; }
        .mission-meta__panel { margin-top: 14px; }
      }
      @media (max-width: 520px) {
        .mission-meta__balances { grid-template-columns: 1fr 1fr; }
        .mission-meta__balance--wellbeing { grid-column: 1 / -1; }
        .mission-meta__preview { grid-template-columns: 1fr; }
        .mission-meta__visual-card { height: clamp(190px, 30vh, 225px); min-height: 0; max-height: none; }
      }
      @media (max-height: 780px) and (min-width: 701px) {
        .mission-meta__shell { padding-block: 14px; gap: 10px; }
        .mission-meta__week-line { margin-top: 6px; }
        .mission-meta__panel { gap: 8px; }
        .mission-meta__balance { padding: 10px 12px; }
        .mission-meta__wellbeing-track { margin-top: 7px; }
        .mission-meta__allowance { padding-block: 8px; }
        .mission-meta__decision { padding: 12px 16px; }
        .mission-meta__selection { margin-bottom: 5px; }
        .mission-meta__preview { margin: 7px 0; }
        .mission-meta__preview-item { padding-block: 7px; }
        .mission-meta__confirm { min-height: 42px; padding-block: 9px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .mission-meta__allowance-value { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function createCoinIcon() {
    const coin = document.createElement('img');
    coin.className = 'mission-meta__coin';
    coin.src = '../assets/icons/coin_ranking.webp';
    coin.alt = '';
    coin.setAttribute('aria-hidden', 'true');
    return coin;
  }

  function addBalanceCard(container, modifier, label) {
    const card = document.createElement('div');
    card.className = `mission-meta__balance mission-meta__balance--${modifier}`;
    const labelNode = document.createElement('span');
    labelNode.className = 'mission-meta__balance-label';
    labelNode.textContent = label;
    const value = document.createElement('div');
    value.className = 'mission-meta__balance-value';
    value.dataset.value = modifier;
    card.append(labelNode, value);
    container.appendChild(card);
    return { card, value };
  }

  SlideRendererRegistry.register('mision-meta', function (slide, root) {
    ensureStyles();
    const config = normalizeConfig(slide);
    const state = loadState(config);
    creditWeeklyAllowance(state);

    root.classList.add('mission-meta');
    root.dataset.phase = state.phase;

    const shell = document.createElement('div');
    shell.className = 'mission-meta__shell';

    const header = document.createElement('header');
    header.className = 'mission-meta__header';
    const headingGroup = document.createElement('div');
    const eyebrow = document.createElement('p');
    eyebrow.className = 'mission-meta__eyebrow';
    eyebrow.textContent = 'Tu reto de ahorro';
    const title = document.createElement('h1');
    title.className = 'mission-meta__title';
    title.textContent = config.title;

    const weekLine = document.createElement('div');
    weekLine.className = 'mission-meta__week-line';
    const weekLabel = document.createElement('span');
    weekLabel.className = 'mission-meta__week-label';
    weekLabel.textContent = `Semana ${state.week} de ${state.totalWeeks}`;
    const progress = document.createElement('div');
    progress.className = 'mission-meta__progress';
    progress.style.setProperty('--mission-weeks', state.totalWeeks);
    progress.setAttribute('role', 'img');
    progress.setAttribute('aria-label', `Progreso: semana ${state.week} de ${state.totalWeeks}`);
    for (let index = 1; index <= state.totalWeeks; index += 1) {
      const step = document.createElement('span');
      step.className = `mission-meta__progress-step${index === state.week ? ' is-active' : ''}`;
      progress.appendChild(step);
    }
    weekLine.append(weekLabel, progress);
    headingGroup.append(eyebrow, title, weekLine);

    const goals = document.createElement('div');
    goals.className = 'mission-meta__goals';
    goals.setAttribute('aria-label', 'Objetivos de la misión');
    const savingsGoal = document.createElement('span');
    savingsGoal.className = 'mission-meta__goal';
    savingsGoal.innerHTML = `Hucha <strong>≥ ${state.savingsGoal}</strong>`;
    const wellbeingGoal = document.createElement('span');
    wellbeingGoal.className = 'mission-meta__goal';
    wellbeingGoal.innerHTML = `Bienestar <strong>≥ ${state.wellbeingGoal}</strong>`;
    goals.append(savingsGoal, wellbeingGoal);
    header.append(headingGroup, goals);

    const content = document.createElement('div');
    content.className = 'mission-meta__content';
    const visual = document.createElement('figure');
    visual.className = 'mission-meta__visual-card';
    const image = document.createElement('img');
    image.className = 'mission-meta__image';
    image.src = config.image;
    image.alt = config.alt;
    visual.appendChild(image);

    const panel = document.createElement('section');
    panel.className = 'mission-meta__panel';
    panel.setAttribute('aria-label', 'Estado y decisión de ahorro');

    const balances = document.createElement('div');
    balances.className = 'mission-meta__balances';
    const piggy = addBalanceCard(balances, 'piggy', 'HUCHA');
    const wallet = addBalanceCard(balances, 'wallet', 'MONEDERO');
    const wellbeing = addBalanceCard(balances, 'wellbeing', 'BIENESTAR');
    const wellbeingTrack = document.createElement('div');
    wellbeingTrack.className = 'mission-meta__wellbeing-track';
    const wellbeingFill = document.createElement('div');
    wellbeingFill.className = 'mission-meta__wellbeing-fill';
    wellbeingTrack.appendChild(wellbeingFill);
    wellbeing.card.appendChild(wellbeingTrack);

    const allowance = document.createElement('div');
    allowance.className = 'mission-meta__allowance';
    const allowanceLabel = document.createElement('span');
    allowanceLabel.className = 'mission-meta__allowance-label';
    allowanceLabel.textContent = 'PAGA SEMANAL';
    const allowanceValue = document.createElement('strong');
    allowanceValue.className = 'mission-meta__allowance-value';
    allowanceValue.append(`+${state.weeklyIncome} monedas`, createCoinIcon());
    allowance.append(allowanceLabel, allowanceValue);

    const decision = document.createElement('div');
    decision.className = 'mission-meta__decision';
    const question = document.createElement('label');
    question.className = 'mission-meta__question';
    question.htmlFor = 'mission-meta-saving-range';
    question.textContent = '¿Cuánto quieres guardar en la hucha?';
    const selection = document.createElement('div');
    selection.className = 'mission-meta__selection';
    selection.setAttribute('aria-live', 'polite');
    const range = document.createElement('input');
    range.id = 'mission-meta-saving-range';
    range.className = 'mission-meta__range';
    range.type = 'range';
    range.min = '0';
    range.max = String(state.weeklyIncome);
    range.step = '1';
    range.value = String(state.savingDraft);
    range.setAttribute('aria-valuemin', '0');
    range.setAttribute('aria-valuemax', String(state.weeklyIncome));
    const limits = document.createElement('div');
    limits.className = 'mission-meta__range-limits';
    limits.setAttribute('aria-hidden', 'true');
    limits.innerHTML = `<span>0</span><span>${state.weeklyIncome}</span>`;

    const preview = document.createElement('div');
    preview.className = 'mission-meta__preview';
    const previewPiggy = document.createElement('div');
    previewPiggy.className = 'mission-meta__preview-item';
    const previewWallet = document.createElement('div');
    previewWallet.className = 'mission-meta__preview-item';
    preview.append(previewPiggy, previewWallet);

    const confirm = document.createElement('button');
    confirm.className = 'mission-meta__confirm';
    confirm.type = 'button';

    decision.append(question, selection, range, limits, preview, confirm);
    panel.append(balances, allowance, decision);
    content.append(visual, panel);
    shell.append(header, content);
    root.appendChild(shell);

    function renderValues() {
      const isConfirmed = state.phase === 'ready-for-surprise';
      const draft = state.savingDraft;
      const walletPreview = isConfirmed ? state.wallet : state.wallet - draft;

      piggy.value.replaceChildren(document.createTextNode(String(state.piggyBank)), createCoinIcon());
      wallet.value.replaceChildren(document.createTextNode(String(state.wallet)), createCoinIcon());
      wellbeing.value.classList.add('mission-meta__wellbeing-value');
      wellbeing.value.textContent = `${state.wellbeing} / 100`;
      wellbeingFill.style.setProperty('--mission-wellbeing', `${state.wellbeing}%`);
      selection.textContent = `${draft} ${draft === 1 ? 'moneda' : 'monedas'}`;
      range.value = String(draft);
      range.disabled = isConfirmed;
      range.setAttribute('aria-valuenow', String(draft));
      range.setAttribute('aria-valuetext', `${draft} ${draft === 1 ? 'moneda' : 'monedas'}`);
      range.style.setProperty('--range-progress', `${state.weeklyIncome ? (draft / state.weeklyIncome) * 100 : 0}%`);
      previewPiggy.innerHTML = `A la hucha<strong>${draft} ${draft === 1 ? 'moneda' : 'monedas'}</strong>`;
      previewWallet.innerHTML = `En el monedero quedan<strong>${walletPreview} ${walletPreview === 1 ? 'moneda' : 'monedas'}</strong>`;
      confirm.disabled = isConfirmed;
      confirm.textContent = isConfirmed ? 'Ahorro confirmado ✓' : `Guardar ${draft} ${draft === 1 ? 'moneda' : 'monedas'}`;
      root.dataset.phase = state.phase;
    }

    range.addEventListener('input', (event) => {
      updateSavingDraft(state, event.currentTarget.value);
      renderValues();
    });

    confirm.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (confirmSaving(state)) renderValues();
    });

    renderValues();

    return {
      noLock: true,
      suppressRootClick: true,
      bindControls(onAdvance) {
        void onAdvance;
      }
    };
  });
})();
