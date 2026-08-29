(() => {
  'use strict';

  const STORAGE_KEY = 'demo_mision_meta_v1';
  const STATE_VERSION = 1;
  const STYLE_ID = 'mision-meta-styles';
  const VALID_PHASES = new Set([
    'saving', 'ready-for-surprise', 'reveal', 'decision',
    'confirm-piggy', 'feedback', 'week-complete'
  ]);
  const toInteger = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.trunc(number) : fallback;
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const money = (value, fallback = 0) => Math.max(0, toInteger(value, fallback));
  const stringOrNull = (value) => typeof value === 'string' && value ? value : null;

  function normalizeScene(value) {
    if (!value || typeof value !== 'object') return null;
    return {
      scene: toInteger(value.scene),
      speaker: String(value.speaker || ''),
      speakerName: String(value.speakerName || ''),
      image: String(value.image || ''),
      alt: String(value.alt || ''),
      text: String(value.text || '')
    };
  }

  function normalizeOption(value) {
    if (!value || typeof value !== 'object' || !value.id) return null;
    return {
      id: String(value.id),
      label: String(value.label || value.id),
      cost: money(value.cost),
      wellbeingDelta: toInteger(value.wellbeingDelta)
    };
  }

  function normalizeWeek(value, totalWeeks) {
    if (!value || typeof value !== 'object') return null;
    const week = clamp(toInteger(value.week), 0, totalWeeks);
    if (!week) return null;
    const rawDecision = value.decision && typeof value.decision === 'object' ? value.decision : {};
    const options = Array.isArray(rawDecision.options)
      ? rawDecision.options.map(normalizeOption).filter(Boolean)
      : [];
    const guidedChoice = String(rawDecision.guidedChoice || '');
    return {
      week,
      id: String(value.id || `week-${week}`),
      title: String(value.title || `Semana ${week}`),
      reveal: Array.isArray(value.reveal) ? value.reveal.map(normalizeScene).filter(Boolean) : [],
      decision: {
        prompt: String(rawDecision.prompt || ''),
        image: String(rawDecision.image || ''),
        alt: String(rawDecision.alt || ''),
        options,
        guidedChoice: options.some((option) => option.id === guidedChoice) ? guidedChoice : ''
      },
      feedback: Array.isArray(value.feedback) ? value.feedback.map(normalizeScene).filter(Boolean) : []
    };
  }

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
      alt: String(slide.alt || 'Álex recibe su paga semanal.'),
      weeks: Array.isArray(slide.weeks)
        ? slide.weeks.map((week) => normalizeWeek(week, totalWeeks)).filter(Boolean)
        : []
    };
  }

  const getWeekConfig = (config, week) => config.weeks.find((item) => item.week === week) || null;

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
      revealStep: 0,
      feedbackStep: 0,
      visualChoice: null,
      appliedChoice: null,
      pendingPayment: null,
      paymentError: null,
      creditedWeeks: [],
      history: []
    };
  }

  function normalizeHistory(value, totalWeeks) {
    if (!Array.isArray(value)) return [];
    const byWeek = new Map();
    value.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const week = clamp(toInteger(entry.week), 0, totalWeeks);
      if (!week || byWeek.has(week)) return;
      const normalized = {
        week,
        allowance: money(entry.allowance),
        saved: money(entry.saved),
        walletAfterSaving: money(entry.walletAfterSaving),
        piggyBankAfterSaving: money(entry.piggyBankAfterSaving),
        wellbeingAfterSaving: clamp(toInteger(entry.wellbeingAfterSaving), 0, 100)
      };
      const visualChoice = stringOrNull(entry.visualChoice);
      const appliedChoice = stringOrNull(entry.appliedChoice);
      if (visualChoice) normalized.visualChoice = visualChoice;
      if (appliedChoice) normalized.appliedChoice = appliedChoice;
      ['costApplied', 'walletAfterDecision', 'piggyBankAfterDecision', 'walletSpent', 'piggyBankSpent']
        .forEach((field) => {
          if (Object.prototype.hasOwnProperty.call(entry, field)) normalized[field] = money(entry[field]);
        });
      if (Object.prototype.hasOwnProperty.call(entry, 'wellbeingDeltaApplied')) {
        normalized.wellbeingDeltaApplied = toInteger(entry.wellbeingDeltaApplied);
      }
      if (Object.prototype.hasOwnProperty.call(entry, 'wellbeingAfterDecision')) {
        normalized.wellbeingAfterDecision = clamp(toInteger(entry.wellbeingAfterDecision), 0, 100);
      }
      normalized.decisionResolved = entry.decisionResolved === true;
      byWeek.set(week, normalized);
    });
    return Array.from(byWeek.values()).sort((a, b) => a.week - b.week);
  }

  function normalizePendingPayment(value) {
    if (!value || typeof value !== 'object') return null;
    const pending = {
      cost: money(value.cost),
      fromWallet: money(value.fromWallet),
      fromPiggyBank: money(value.fromPiggyBank)
    };
    return pending.cost > 0 && pending.fromPiggyBank > 0
      && pending.fromWallet + pending.fromPiggyBank === pending.cost ? pending : null;
  }

  function normalizeState(value, config) {
    if (!value || typeof value !== 'object' || value.version !== STATE_VERSION) {
      return createInitialState(config);
    }
    const totalWeeks = Math.max(1, toInteger(value.totalWeeks, config.totalWeeks));
    const weeklyIncome = money(value.weeklyIncome, config.weeklyIncome);
    const week = clamp(toInteger(value.week, 1), 1, totalWeeks);
    const history = normalizeHistory(value.history, totalWeeks);
    const current = history.find((entry) => entry.week === week) || null;
    const weekConfig = getWeekConfig(config, week);
    const resolved = current?.decisionResolved === true;
    let phase = VALID_PHASES.has(value.phase) ? value.phase : 'saving';
    let pendingPayment = normalizePendingPayment(value.pendingPayment);
    if (!current) {
      phase = 'saving';
      pendingPayment = null;
    } else if (!weekConfig) {
      phase = 'ready-for-surprise';
      pendingPayment = null;
    } else if (resolved) {
      phase = phase === 'week-complete' ? 'week-complete' : 'feedback';
      pendingPayment = null;
    } else {
      if (phase === 'saving' || phase === 'feedback' || phase === 'week-complete') phase = 'ready-for-surprise';
      if (phase === 'confirm-piggy' && !pendingPayment) phase = 'decision';
    }
    const creditedWeeks = Array.isArray(value.creditedWeeks)
      ? Array.from(new Set(value.creditedWeeks.map((item) => toInteger(item))
        .filter((item) => item >= 1 && item <= totalWeeks))).sort((a, b) => a - b)
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
      revealStep: clamp(toInteger(value.revealStep), 0, Math.max(0, (weekConfig?.reveal.length || 1) - 1)),
      feedbackStep: clamp(toInteger(value.feedbackStep), 0, Math.max(0, (weekConfig?.feedback.length || 1) - 1)),
      visualChoice: stringOrNull(value.visualChoice) || current?.visualChoice || null,
      appliedChoice: stringOrNull(value.appliedChoice) || current?.appliedChoice || null,
      pendingPayment,
      paymentError: value.paymentError === 'insufficient-funds' && !resolved ? 'insufficient-funds' : null,
      creditedWeeks,
      history
    };
  }

  function persistState(state) {
    window.MISION_META_STATE = state;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    return state;
  }

  function loadState(config) {
    let state = createInitialState(config);
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) state = normalizeState(JSON.parse(stored), config);
    } catch (_) { state = createInitialState(config); }
    return persistState(state);
  }

  const getHistoryEntry = (state) => state.history.find((entry) => entry.week === state.week) || null;
  function updateHistoryEntry(state, fields) {
    let updated = false;
    state.history = state.history.map((entry) => {
      if (entry.week !== state.week) return entry;
      updated = true;
      return { ...entry, ...fields };
    });
    return updated;
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
    if (state.phase !== 'saving' || getHistoryEntry(state)) return false;
    const saved = clamp(toInteger(state.savingDraft), 0, state.weeklyIncome);
    if (saved > state.wallet) return false;
    const entry = {
      week: state.week,
      allowance: state.weeklyIncome,
      saved,
      walletAfterSaving: state.wallet - saved,
      piggyBankAfterSaving: state.piggyBank + saved,
      wellbeingAfterSaving: state.wellbeing,
      decisionResolved: false
    };
    Object.assign(state, {
      wallet: entry.walletAfterSaving,
      piggyBank: entry.piggyBankAfterSaving,
      phase: 'ready-for-surprise',
      revealStep: 0,
      feedbackStep: 0,
      visualChoice: null,
      appliedChoice: null,
      pendingPayment: null,
      paymentError: null,
      history: [...state.history, entry]
    });
    persistState(state);
    return true;
  }

  function startReveal(state, weekConfig) {
    if (state.phase !== 'ready-for-surprise' || !getHistoryEntry(state) || !weekConfig) return false;
    state.phase = weekConfig.reveal.length ? 'reveal' : 'decision';
    state.revealStep = 0;
    persistState(state);
    return true;
  }

  function advanceReveal(state, weekConfig) {
    if (state.phase !== 'reveal' || !weekConfig) return false;
    if (state.revealStep + 1 < weekConfig.reveal.length) state.revealStep += 1;
    else state.phase = 'decision';
    persistState(state);
    return true;
  }

  function applyDecision(state, option, payment) {
    const entry = getHistoryEntry(state);
    if (!entry || entry.decisionResolved === true || !option || state.appliedChoice !== option.id) return false;
    const wellbeingAfterDecision = clamp(state.wellbeing + toInteger(option.wellbeingDelta), 0, 100);
    const fields = {
      visualChoice: state.visualChoice,
      appliedChoice: state.appliedChoice,
      costApplied: money(option.cost),
      wellbeingDeltaApplied: toInteger(option.wellbeingDelta),
      walletSpent: money(payment.walletSpent),
      piggyBankSpent: money(payment.piggyBankSpent),
      walletAfterDecision: money(payment.walletAfter),
      piggyBankAfterDecision: money(payment.piggyBankAfter),
      wellbeingAfterDecision,
      decisionResolved: true
    };
    if (!updateHistoryEntry(state, fields)) return false;
    Object.assign(state, {
      wallet: fields.walletAfterDecision,
      piggyBank: fields.piggyBankAfterDecision,
      wellbeing: wellbeingAfterDecision,
      phase: 'feedback',
      feedbackStep: 0,
      pendingPayment: null,
      paymentError: null
    });
    persistState(state);
    return true;
  }

  function resolvePayment(state, option) {
    const entry = getHistoryEntry(state);
    if (!entry || entry.decisionResolved === true || !option) return 'ignored';
    const cost = money(option.cost);
    if (cost === 0) {
      return applyDecision(state, option, {
        walletAfter: state.wallet, piggyBankAfter: state.piggyBank, walletSpent: 0, piggyBankSpent: 0
      }) ? 'applied' : 'ignored';
    }
    if (state.wallet >= cost) {
      return applyDecision(state, option, {
        walletAfter: state.wallet - cost, piggyBankAfter: state.piggyBank,
        walletSpent: cost, piggyBankSpent: 0
      }) ? 'applied' : 'ignored';
    }
    if (state.wallet + state.piggyBank >= cost) {
      state.pendingPayment = { cost, fromWallet: state.wallet, fromPiggyBank: cost - state.wallet };
      state.paymentError = null;
      state.phase = 'confirm-piggy';
      persistState(state);
      return 'pending';
    }
    state.pendingPayment = null;
    state.paymentError = 'insufficient-funds';
    state.phase = 'decision';
    persistState(state);
    return 'insufficient';
  }

  function resolveChoice(state, weekConfig, visualChoice) {
    const entry = getHistoryEntry(state);
    if (state.phase !== 'decision' || !entry || entry.decisionResolved === true) return 'ignored';
    const visualOption = weekConfig?.decision.options.find((option) => option.id === visualChoice);
    const appliedOption = weekConfig?.decision.options.find((option) => option.id === weekConfig.decision.guidedChoice);
    if (!visualOption || !appliedOption) return 'ignored';
    state.visualChoice = visualOption.id;
    state.appliedChoice = appliedOption.id;
    state.paymentError = null;
    updateHistoryEntry(state, {
      visualChoice: visualOption.id,
      appliedChoice: appliedOption.id,
      decisionResolved: false
    });
    persistState(state);
    return resolvePayment(state, appliedOption);
  }

  function confirmPiggyPayment(state, weekConfig) {
    const entry = getHistoryEntry(state);
    const pending = state.pendingPayment;
    if (state.phase !== 'confirm-piggy' || !pending || entry?.decisionResolved === true) return false;
    const option = weekConfig?.decision.options.find((item) => item.id === state.appliedChoice);
    if (!option || money(option.cost) !== pending.cost
      || pending.fromWallet > state.wallet || pending.fromPiggyBank > state.piggyBank
      || pending.fromWallet + pending.fromPiggyBank !== pending.cost) return false;
    return applyDecision(state, option, {
      walletAfter: state.wallet - pending.fromWallet,
      piggyBankAfter: state.piggyBank - pending.fromPiggyBank,
      walletSpent: pending.fromWallet,
      piggyBankSpent: pending.fromPiggyBank
    });
  }

  function returnToDecision(state) {
    if (state.phase !== 'confirm-piggy' && state.paymentError !== 'insufficient-funds') return false;
    state.phase = 'decision';
    state.pendingPayment = null;
    state.paymentError = null;
    persistState(state);
    return true;
  }

  function advanceFeedback(state, weekConfig) {
    const entry = getHistoryEntry(state);
    if (state.phase !== 'feedback' || entry?.decisionResolved !== true || !weekConfig) return false;
    if (state.feedbackStep + 1 < weekConfig.feedback.length) state.feedbackStep += 1;
    else state.phase = 'week-complete';
    persistState(state);
    return true;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .mission-meta{--ink:#17324d;--muted:#60748b;--teal:#199b91;--teal-dark:#08766f;--border:#dce9e7;box-sizing:border-box;overflow-x:hidden!important;overflow-y:auto!important;cursor:default!important;color:var(--ink);background:radial-gradient(circle at 13% 16%,rgba(145,224,202,.25),transparent 32%),radial-gradient(circle at 88% 88%,rgba(244,185,66,.15),transparent 31%),#f8fcfb!important}.mission-meta,.mission-meta *{box-sizing:border-box}
      .mission-meta__shell{width:min(1480px,100%);min-height:100%;margin:auto;padding:clamp(16px,2.3vw,38px) clamp(14px,3.3vw,52px) clamp(22px,3vw,44px);display:grid;grid-template-rows:auto minmax(0,1fr);gap:clamp(12px,1.7vh,22px)}
      .mission-meta__header{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:12px 24px}.mission-meta__eyebrow{margin:0 0 4px;color:var(--teal-dark);font-size:clamp(11px,1.1vw,14px);font-weight:800;letter-spacing:.12em;text-transform:uppercase}.mission-meta__title{margin:0;font-size:clamp(28px,3.2vw,50px);line-height:1;letter-spacing:-.035em}.mission-meta__week-line{margin-top:8px;display:flex;align-items:center;gap:12px}.mission-meta__week-label{flex:none;color:var(--muted);font-size:clamp(13px,1.25vw,16px);font-weight:750}.mission-meta__progress{width:min(270px,52vw);display:grid;grid-template-columns:repeat(var(--weeks),minmax(18px,1fr));gap:7px}.mission-meta__progress-step{height:8px;border-radius:999px;background:#dbe8e6}.mission-meta__progress-step.is-active{background:var(--teal)}
      .mission-meta__goals{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}.mission-meta__goal{padding:8px 12px;border:1px solid var(--border);border-radius:999px;background:#ffffffc7;color:var(--muted);font-size:clamp(11px,1vw,13px);font-weight:750;white-space:nowrap}.mission-meta__goal strong{color:var(--ink)}.mission-meta__stage{min-width:0;min-height:0;position:relative}.mission-meta__content{min-width:0;min-height:0;height:100%;display:grid;grid-template-columns:minmax(230px,.9fr) minmax(0,1.1fr);gap:clamp(16px,2.5vw,34px)}
      .mission-meta__visual{position:relative;min-width:0;min-height:0;margin:0;overflow:hidden;display:grid;place-items:center;padding:clamp(10px,1.7vw,24px);border:1px solid #cee5e0e6;border-radius:clamp(20px,2.8vw,32px);background:linear-gradient(155deg,#fffffff0,#e6f7f2db);box-shadow:0 18px 55px #1e544b1a}.mission-meta__image{display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:100%;max-height:100%;object-fit:contain;object-position:center;filter:drop-shadow(0 16px 22px #16413e1f)}
      .mission-meta__panel{min-width:0;min-height:0;display:grid;align-content:center;gap:clamp(9px,1.2vh,14px)}.mission-meta__balances{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.mission-meta__balance{position:relative;min-width:0;padding:clamp(10px,1.35vw,17px);border:1px solid var(--border)!important;border-radius:18px;background:#fffffff0;box-shadow:0 8px 24px #1c494412}.mission-meta__balance--piggy{border-color:#efd99e!important;background:linear-gradient(145deg,#fffdf5,#fff8df)}.mission-meta__balance--wallet{border-color:#bfe1dc!important;background:linear-gradient(145deg,#fbfffe,#edf9f6)}.mission-meta__balance-heading{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mission-meta__balance-label{display:block;color:var(--muted);font-size:clamp(10px,.9vw,12px);font-weight:850;letter-spacing:.08em}.mission-meta__state-icon{width:clamp(21px,1.8vw,27px);height:clamp(21px,1.8vw,27px);flex:none}.mission-meta__balance--piggy .mission-meta__state-icon{color:#a97708}.mission-meta__balance--wallet .mission-meta__state-icon{color:var(--teal-dark)}.mission-meta__balance-value{min-width:0;display:flex;align-items:center;gap:6px;font-size:clamp(20px,2.35vw,33px);font-weight:850;line-height:1}.mission-meta__coin{width:clamp(18px,1.8vw,25px);height:clamp(18px,1.8vw,25px);object-fit:contain}.mission-meta__wellbeing-value{font-size:clamp(17px,1.95vw,27px);white-space:nowrap}.mission-meta__wellbeing-track{height:6px;margin-top:8px;overflow:hidden;border-radius:999px;background:#e3eceb}.mission-meta__wellbeing-fill{width:var(--wellbeing);height:100%;border-radius:inherit;background:linear-gradient(90deg,#f4c24f,#68bf6c)}
      .mission-meta__balance.is-changing{animation:mission-meta-balance-pulse .72s ease-out}.mission-meta__delta{position:absolute;z-index:2;top:-11px;right:10px;padding:4px 8px;border:1px solid currentColor!important;border-radius:999px;background:#fff;box-shadow:0 7px 18px #17324d24;font-size:clamp(10px,.95vw,13px);font-weight:900;line-height:1;white-space:nowrap;pointer-events:none;animation:mission-meta-delta 1.35s ease-out forwards}.mission-meta__delta--positive{color:#197747}.mission-meta__delta--negative{color:#a84b3f}@keyframes mission-meta-balance-pulse{0%{transform:scale(1);box-shadow:0 8px 24px #1c494412}32%{transform:scale(1.025);box-shadow:0 0 0 4px #f2cc3838,0 13px 30px #1c49441f}100%{transform:scale(1);box-shadow:0 8px 24px #1c494412}}@keyframes mission-meta-delta{0%{opacity:0;transform:translateY(7px) scale(.96)}16%,68%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-7px) scale(.98)}}
      .mission-meta__allowance{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 15px;border:1px solid #f1d48b;border-radius:17px;background:#fff4d8}.mission-meta__allowance span{color:#765a1f;font-size:clamp(11px,1vw,13px);font-weight:850;letter-spacing:.08em}.mission-meta__allowance strong{display:flex;align-items:center;gap:7px;color:#684b0d;font-size:clamp(17px,1.8vw,23px);font-weight:900;white-space:nowrap}
      .mission-meta__box,.mission-meta__dialogue,.mission-meta__complete{padding:clamp(14px,1.8vw,22px);border:1px solid var(--border);border-radius:22px;background:#fffffff5;box-shadow:0 13px 36px #1c494414}.mission-meta__question{display:block;margin-bottom:5px;font-size:clamp(16px,1.55vw,21px);font-weight:820}.mission-meta__selection{margin-bottom:8px;color:var(--teal-dark);font-size:clamp(23px,2.7vw,35px);font-weight:900}.mission-meta__range{display:block;width:100%;height:28px;margin:0;padding:0;border:0;background:transparent;accent-color:var(--teal);cursor:pointer;touch-action:pan-y}.mission-meta__range:disabled{cursor:default;opacity:.62}.mission-meta__range-limits{display:flex;justify-content:space-between;margin-top:-2px;color:var(--muted);font-size:12px;font-weight:700}.mission-meta__preview{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.mission-meta__preview div{padding:9px 11px;border-radius:14px;background:#f1f8f6;color:var(--muted);font-size:clamp(11px,1vw,13px)}.mission-meta__preview strong{display:block;margin-top:2px;color:var(--ink);font-size:clamp(16px,1.45vw,20px)}.mission-meta__actions{display:grid;gap:8px}
      .mission-meta__button{min-height:46px;padding:11px 17px;border:0;border-radius:14px;background:linear-gradient(135deg,var(--teal),var(--teal-dark));color:#fff;font:inherit;font-size:clamp(13px,1.15vw,16px);font-weight:850;box-shadow:0 8px 18px #08766f33;cursor:pointer}.mission-meta__button:hover:not(:disabled){filter:brightness(1.04)}.mission-meta__button:disabled{background:#dfece9;color:#3d716b;box-shadow:none;cursor:default}.mission-meta__button--secondary{border:1px solid var(--border);background:#fff;color:var(--teal-dark);box-shadow:none}.mission-meta__button:focus-visible,.mission-meta__choice:focus-visible,.mission-meta__range:focus-visible{outline:3px solid #199b9157;outline-offset:3px}
      .mission-meta__narrative,.mission-meta__decision{grid-template-columns:minmax(280px,1.05fr) minmax(330px,.95fr)}.mission-meta__dialogue{align-self:stretch;display:grid;align-content:center;gap:14px;border:1px solid var(--speaker-border,var(--border))!important;background:var(--speaker-surface,#fff)}.mission-meta__speaker{width:max-content;max-width:100%;padding:6px 11px;border:2px solid var(--speaker-border,var(--teal-dark))!important;border-radius:999px;background:var(--speaker-pill,#e5f7f3);color:var(--speaker-ink,var(--ink));font-size:13px;font-weight:900}.mission-meta__dialogue-text{margin:0;color:var(--speaker-ink,var(--ink));font-size:clamp(20px,2.15vw,31px);font-weight:750;line-height:1.28}.mission-meta__week-title{margin:0;color:var(--teal-dark);font-size:clamp(12px,1vw,14px);font-weight:850;letter-spacing:.08em;text-transform:uppercase}.mission-meta__choice-title{margin:0;font-size:clamp(22px,2.2vw,32px)}.mission-meta__choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mission-meta__choice{min-width:0;min-height:132px;padding:15px;display:grid;align-content:space-between;gap:12px;border:2px solid #b9d9d4;border-radius:18px;background:linear-gradient(155deg,#fff,#f1faf8);color:var(--ink);font:inherit;text-align:left;cursor:pointer}.mission-meta__choice:hover{border-color:var(--teal);transform:translateY(-1px)}.mission-meta__choice-label{font-size:clamp(18px,1.7vw,23px);font-weight:900}.mission-meta__effects{display:grid;gap:4px;color:var(--muted);font-size:13px;font-weight:750}.mission-meta__effects strong{color:var(--ink)}
      .mission-meta__overlay{position:absolute;z-index:5;inset:0;display:grid;place-items:center;padding:16px;border-radius:24px;background:#132d398a;backdrop-filter:blur(5px)}.mission-meta__modal{width:min(620px,100%);max-height:100%;overflow-y:auto;padding:clamp(18px,2.5vw,30px);border-radius:23px;background:#fff;box-shadow:0 24px 70px #08242f47}.mission-meta__modal h2{margin:0 0 12px;font-size:clamp(22px,2.2vw,30px)}.mission-meta__payment{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.mission-meta__payment div{padding:11px;border-radius:14px;background:#f1f8f6}.mission-meta__payment span{display:block;color:var(--muted);font-size:10px;font-weight:850;letter-spacing:.06em}.mission-meta__payment strong{display:block;margin-top:3px;font-size:clamp(16px,1.7vw,21px)}.mission-meta__modal-actions{display:grid;gap:8px}.mission-meta__complete-wrap{height:100%;display:grid;place-items:center}.mission-meta__complete{width:min(720px,100%);text-align:center}.mission-meta__complete h2{margin:0 0 8px;font-size:clamp(28px,3.4vw,46px)}.mission-meta__complete p{margin:14px 0 0;color:var(--muted)}.mission-meta__complete .mission-meta__balances{margin-top:20px;text-align:left}
      @media(max-width:840px){.mission-meta__shell{display:block;padding:16px 13px 26px}.mission-meta__header{grid-template-columns:1fr;align-items:start}.mission-meta__goals{justify-content:flex-start;margin-top:9px}.mission-meta__stage{margin-top:15px}.mission-meta__content{grid-template-columns:1fr;height:auto}.mission-meta__visual{height:clamp(210px,30vh,300px)}.mission-meta__panel{margin-top:13px}.mission-meta__complete-wrap{min-height:480px}}
      @media(max-width:520px){.mission-meta__title{font-size:29px}.mission-meta__week-line{align-items:flex-start;flex-direction:column;gap:6px}.mission-meta__progress{width:100%}.mission-meta__goal{padding:6px 9px}.mission-meta__balances{grid-template-columns:1fr 1fr}.mission-meta__balance--wellbeing{grid-column:1/-1}.mission-meta__preview,.mission-meta__choices,.mission-meta__payment{grid-template-columns:1fr}.mission-meta__visual{height:clamp(190px,31vh,235px)}.mission-meta__choice{min-height:108px}.mission-meta__overlay{position:fixed;border-radius:0}}
      @media(max-height:780px) and (min-width:841px){.mission-meta__shell{padding-block:12px 18px;gap:9px}.mission-meta__panel{gap:7px}.mission-meta__balance{padding:8px 11px}.mission-meta__box,.mission-meta__dialogue{padding:12px 15px}.mission-meta__choice{min-height:112px;padding:12px}}
      @media(prefers-reduced-motion:reduce){.mission-meta__balance.is-changing,.mission-meta__delta{animation-duration:.01ms;animation-iteration-count:1}}
    `;
    document.head.appendChild(style);
  }

  function coinIcon() {
    const coin = document.createElement('img');
    coin.className = 'mission-meta__coin';
    coin.src = '../assets/icons/coin_ranking.webp';
    coin.alt = '';
    coin.setAttribute('aria-hidden', 'true');
    return coin;
  }

  function stateIcon(key) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('mission-meta__state-icon');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.4');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    if (key === 'piggy') {
      svg.innerHTML = '<path d="M7 14.5c1.7-4.1 5.2-6.5 10-6.5 5.7 0 9.5 3.3 9.5 8.2 0 2.9-1.4 5.2-3.8 6.6V27h-4v-2.7h-7.4V27h-4v-3.7A9.2 9.2 0 0 1 4 16.2v-1.7h3Z"/><path d="M19.5 8.3c.4-2.1 1.8-3.2 4.1-3.3.1 2-.4 3.5-1.8 4.5M13.5 11.5h6M25.7 13.5H29v4h-2.6"/><circle cx="21.5" cy="13" r=".8" fill="currentColor" stroke="none"/>';
    } else {
      svg.innerHTML = '<rect x="4" y="7" width="24" height="19" rx="4"/><path d="M4.5 11h19.8a3.7 3.7 0 0 1 3.7 3.7V18h-7.2a3 3 0 0 1 0-6H28"/><circle cx="21" cy="15" r="1" fill="currentColor" stroke="none"/>';
    }
    return svg;
  }

  const balanceSnapshot = (state) => ({
    piggy: state.piggyBank,
    wallet: state.wallet,
    wellbeing: state.wellbeing
  });

  function balanceChanges(before, state) {
    if (!before) return null;
    const after = balanceSnapshot(state);
    const changes = {};
    Object.keys(after).forEach((key) => {
      const delta = after[key] - before[key];
      if (delta) changes[key] = delta;
    });
    return Object.keys(changes).length ? changes : null;
  }

  function balancesView(state, changes = null) {
    const balances = document.createElement('div');
    balances.className = 'mission-meta__balances';
    balances.setAttribute('aria-label', 'Saldos actuales');
    [['piggy', 'HUCHA', state.piggyBank], ['wallet', 'MONEDERO', state.wallet], ['wellbeing', 'BIENESTAR', state.wellbeing]]
      .forEach(([key, label, value]) => {
        const card = document.createElement('div');
        card.className = `mission-meta__balance mission-meta__balance--${key}`;
        if (changes?.[key]) card.classList.add('is-changing');
        const heading = document.createElement('div');
        heading.className = 'mission-meta__balance-heading';
        if (key === 'piggy' || key === 'wallet') heading.appendChild(stateIcon(key));
        const labelNode = document.createElement('span');
        labelNode.className = 'mission-meta__balance-label';
        labelNode.textContent = label;
        heading.appendChild(labelNode);
        const valueNode = document.createElement('div');
        valueNode.className = 'mission-meta__balance-value';
        if (key === 'wellbeing') {
          valueNode.classList.add('mission-meta__wellbeing-value');
          valueNode.textContent = `${value} / 100`;
          const track = document.createElement('div');
          track.className = 'mission-meta__wellbeing-track';
          const fill = document.createElement('div');
          fill.className = 'mission-meta__wellbeing-fill';
          fill.style.setProperty('--wellbeing', `${value}%`);
          track.appendChild(fill);
          card.append(heading, valueNode, track);
        } else {
          valueNode.append(String(value), coinIcon());
          card.append(heading, valueNode);
        }
        if (changes?.[key]) {
          const delta = changes[key];
          const deltaNode = document.createElement('span');
          deltaNode.className = `mission-meta__delta mission-meta__delta--${delta > 0 ? 'positive' : 'negative'}`;
          deltaNode.setAttribute('role', 'status');
          deltaNode.setAttribute('aria-live', 'polite');
          deltaNode.textContent = `${delta > 0 ? '+' : ''}${delta}${key === 'wellbeing' ? '' : ' monedas'}`;
          card.appendChild(deltaNode);
        }
        balances.appendChild(card);
      });
    return balances;
  }

  function imageView(src, alt) {
    const figure = document.createElement('figure');
    figure.className = 'mission-meta__visual';
    const image = document.createElement('img');
    image.className = 'mission-meta__image';
    image.src = src;
    image.alt = alt;
    figure.appendChild(image);
    return figure;
  }

  function buttonView(label, secondary = false) {
    const button = document.createElement('button');
    button.className = `mission-meta__button${secondary ? ' mission-meta__button--secondary' : ''}`;
    button.type = 'button';
    button.textContent = label;
    return button;
  }

  const FALLBACK_THEMES = Object.freeze({
    adamis: { border: '#b68200', surface: '#fffce8', pill: '#ffef9a', ink: '#4c3b00' },
    chispa: { border: '#b93c08', surface: '#fff8f2', pill: '#ffd9bf', ink: '#6d2507' },
    brote: { border: '#287a31', surface: '#f7fcf4', pill: '#d7f1ce', ink: '#174b22' }
  });

  function dialogueView(scene, label, onContinue) {
    const dialogue = document.createElement('section');
    dialogue.className = 'mission-meta__dialogue';
    const theme = window.RendererUtils?.getSpeakerTheme?.({ speakerKey: scene.speaker })
      || FALLBACK_THEMES[scene.speaker];
    if (theme) {
      ['border', 'surface', 'pill', 'ink'].forEach((key) => {
        dialogue.style.setProperty(`--speaker-${key}`, theme[key]);
      });
    }
    const speaker = document.createElement('div');
    speaker.className = 'mission-meta__speaker';
    speaker.textContent = scene.speakerName
      || (scene.speaker ? scene.speaker.charAt(0).toUpperCase() + scene.speaker.slice(1) : '');
    const text = document.createElement('p');
    text.className = 'mission-meta__dialogue-text';
    text.textContent = scene.text;
    const button = buttonView(label);
    button.addEventListener('click', onContinue);
    dialogue.append(speaker, text, button);
    return dialogue;
  }

  SlideRendererRegistry.register('mision-meta', function (slide, root) {
    ensureStyles();
    const config = normalizeConfig(slide);
    const state = loadState(config);
    creditWeeklyAllowance(state);
    let pendingBalanceChanges = null;
    let renderBalanceChanges = null;
    const queueBalanceChanges = (before) => {
      pendingBalanceChanges = balanceChanges(before, state);
    };
    root.classList.add('mission-meta');

    const shell = document.createElement('div');
    shell.className = 'mission-meta__shell';
    const header = document.createElement('header');
    header.className = 'mission-meta__header';
    const headings = document.createElement('div');
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
    progress.style.setProperty('--weeks', state.totalWeeks);
    progress.setAttribute('role', 'img');
    progress.setAttribute('aria-label', `Progreso: semana ${state.week} de ${state.totalWeeks}`);
    for (let index = 1; index <= state.totalWeeks; index += 1) {
      const step = document.createElement('span');
      step.className = `mission-meta__progress-step${index === state.week ? ' is-active' : ''}`;
      progress.appendChild(step);
    }
    weekLine.append(weekLabel, progress);
    headings.append(eyebrow, title, weekLine);
    const goals = document.createElement('div');
    goals.className = 'mission-meta__goals';
    goals.setAttribute('aria-label', 'Objetivos de la misión');
    goals.innerHTML = `<span class="mission-meta__goal">Hucha <strong>≥ ${state.savingsGoal}</strong></span><span class="mission-meta__goal">Bienestar <strong>≥ ${state.wellbeingGoal}</strong></span>`;
    header.append(headings, goals);
    const stage = document.createElement('main');
    stage.className = 'mission-meta__stage';
    shell.append(header, stage);
    root.appendChild(shell);

    function savingView() {
      const ready = state.phase === 'ready-for-surprise';
      const content = document.createElement('div');
      content.className = 'mission-meta__content';
      const panel = document.createElement('section');
      panel.className = 'mission-meta__panel';
      panel.appendChild(balancesView(state, renderBalanceChanges));
      const allowance = document.createElement('div');
      allowance.className = 'mission-meta__allowance';
      allowance.innerHTML = '<span>PAGA SEMANAL</span>';
      const allowanceValue = document.createElement('strong');
      allowanceValue.append(`+${state.weeklyIncome} monedas`, coinIcon());
      allowance.appendChild(allowanceValue);
      const box = document.createElement('div');
      box.className = 'mission-meta__box';
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
      Object.assign(range, { type: 'range', min: '0', max: String(state.weeklyIncome), step: '1' });
      range.disabled = ready;
      const limits = document.createElement('div');
      limits.className = 'mission-meta__range-limits';
      limits.setAttribute('aria-hidden', 'true');
      limits.innerHTML = `<span>0</span><span>${state.weeklyIncome}</span>`;
      const preview = document.createElement('div');
      preview.className = 'mission-meta__preview';
      const previewPiggy = document.createElement('div');
      const previewWallet = document.createElement('div');
      preview.append(previewPiggy, previewWallet);
      const actions = document.createElement('div');
      actions.className = 'mission-meta__actions';
      const confirm = buttonView('');
      confirm.disabled = ready;
      actions.appendChild(confirm);
      const weekConfig = getWeekConfig(config, state.week);
      if (ready && weekConfig) {
        const discover = buttonView('Descubrir qué ocurre');
        discover.addEventListener('click', () => { if (startReveal(state, weekConfig)) render(); });
        actions.appendChild(discover);
      }
      box.append(question, selection, range, limits, preview, actions);
      panel.append(allowance, box);
      content.append(imageView(config.image, config.alt), panel);
      function syncDraft() {
        const draft = state.savingDraft;
        selection.textContent = `${draft} ${draft === 1 ? 'moneda' : 'monedas'}`;
        range.value = String(draft);
        range.setAttribute('aria-valuenow', String(draft));
        range.setAttribute('aria-valuetext', `${draft} ${draft === 1 ? 'moneda' : 'monedas'}`);
        previewPiggy.innerHTML = `A la hucha<strong>${draft} ${draft === 1 ? 'moneda' : 'monedas'}</strong>`;
        const wallet = ready ? state.wallet : state.wallet - draft;
        previewWallet.innerHTML = `En el monedero quedan<strong>${wallet} ${wallet === 1 ? 'moneda' : 'monedas'}</strong>`;
        confirm.textContent = ready ? 'Ahorro confirmado ✓' : `Guardar ${draft} ${draft === 1 ? 'moneda' : 'monedas'}`;
      }
      range.addEventListener('input', (event) => { updateSavingDraft(state, event.currentTarget.value); syncDraft(); });
      confirm.addEventListener('click', () => {
        const before = balanceSnapshot(state);
        if (confirmSaving(state)) {
          queueBalanceChanges(before);
          render();
        }
      });
      syncDraft();
      return content;
    }

    function narrativeView(items, step, feedback) {
      const scene = items[step];
      if (!scene) return decisionView();
      const content = document.createElement('div');
      content.className = 'mission-meta__content mission-meta__narrative';
      const panel = document.createElement('div');
      panel.className = 'mission-meta__panel';
      panel.appendChild(balancesView(state, renderBalanceChanges));
      const last = step === items.length - 1;
      const label = feedback ? (last ? 'Terminar semana' : 'Continuar') : (last ? 'Tomar una decisión' : 'Continuar');
      panel.appendChild(dialogueView(scene, label, () => {
        const changed = feedback
          ? advanceFeedback(state, getWeekConfig(config, state.week))
          : advanceReveal(state, getWeekConfig(config, state.week));
        if (changed) render();
      }));
      content.append(imageView(scene.image, scene.alt), panel);
      return content;
    }

    function decisionView() {
      const weekConfig = getWeekConfig(config, state.week);
      const content = document.createElement('div');
      content.className = 'mission-meta__content mission-meta__decision';
      const panel = document.createElement('div');
      panel.className = 'mission-meta__panel';
      panel.appendChild(balancesView(state, renderBalanceChanges));
      const box = document.createElement('section');
      box.className = 'mission-meta__box mission-meta__panel';
      const weekTitle = document.createElement('p');
      weekTitle.className = 'mission-meta__week-title';
      weekTitle.textContent = weekConfig?.title || '';
      const prompt = document.createElement('h2');
      prompt.className = 'mission-meta__choice-title';
      prompt.textContent = weekConfig?.decision.prompt || '';
      const choices = document.createElement('div');
      choices.className = 'mission-meta__choices';
      (weekConfig?.decision.options || []).forEach((option) => {
        const choice = document.createElement('button');
        choice.className = 'mission-meta__choice';
        choice.type = 'button';
        choice.setAttribute('aria-label', `${option.label}: coste ${option.cost} monedas, bienestar ${option.wellbeingDelta >= 0 ? '+' : ''}${option.wellbeingDelta}`);
        const label = document.createElement('span');
        label.className = 'mission-meta__choice-label';
        label.textContent = option.label;
        const effects = document.createElement('span');
        effects.className = 'mission-meta__effects';
        effects.innerHTML = `<span>Coste: <strong>${option.cost ? `−${option.cost}` : '0'} monedas</strong></span><span>Bienestar: <strong>${option.wellbeingDelta >= 0 ? '+' : ''}${option.wellbeingDelta}</strong></span>`;
        choice.append(label, effects);
        choice.addEventListener('click', () => {
          const before = balanceSnapshot(state);
          const result = resolveChoice(state, weekConfig, option.id);
          if (result !== 'ignored') {
            if (result === 'applied') queueBalanceChanges(before);
            render();
          }
        });
        choices.appendChild(choice);
      });
      box.append(weekTitle, prompt, choices);
      panel.appendChild(box);
      content.append(imageView(weekConfig?.decision.image || '', weekConfig?.decision.alt || ''), panel);
      if (state.phase === 'confirm-piggy' && state.pendingPayment) content.appendChild(piggyModal(weekConfig));
      else if (state.paymentError === 'insufficient-funds') content.appendChild(errorModal());
      return content;
    }

    function modalBase(title) {
      const overlay = document.createElement('div');
      overlay.className = 'mission-meta__overlay';
      const modal = document.createElement('section');
      modal.className = 'mission-meta__modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      const heading = document.createElement('h2');
      heading.textContent = title;
      modal.appendChild(heading);
      overlay.appendChild(modal);
      return { overlay, modal };
    }

    function piggyModal(weekConfig) {
      const pending = state.pendingPayment;
      const { overlay, modal } = modalBase(`Te faltan ${pending.fromPiggyBank} monedas en el monedero.`);
      const payment = document.createElement('div');
      payment.className = 'mission-meta__payment';
      [['MONEDERO', `${state.wallet} monedas disponibles`], ['HUCHA', `${state.piggyBank} monedas disponibles`], ['NECESITAMOS DE LA HUCHA', `${pending.fromPiggyBank} monedas`]]
        .forEach(([label, value]) => {
          const item = document.createElement('div');
          item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
          payment.appendChild(item);
        });
      const actions = document.createElement('div');
      actions.className = 'mission-meta__modal-actions';
      const confirm = buttonView(`Sacar ${pending.fromPiggyBank} monedas de la hucha`);
      const back = buttonView('Volver', true);
      confirm.addEventListener('click', () => {
        const before = balanceSnapshot(state);
        if (confirmPiggyPayment(state, weekConfig)) {
          queueBalanceChanges(before);
          render();
        }
      });
      back.addEventListener('click', () => { if (returnToDecision(state)) render(); });
      actions.append(confirm, back);
      modal.append(payment, actions);
      window.setTimeout(() => confirm.focus(), 0);
      return overlay;
    }

    function errorModal() {
      const { overlay, modal } = modalBase('No tienes suficientes monedas para realizar este pago.');
      const back = buttonView('Volver');
      back.addEventListener('click', () => { if (returnToDecision(state)) render(); });
      modal.appendChild(back);
      window.setTimeout(() => back.focus(), 0);
      return overlay;
    }

    function completeView() {
      const wrap = document.createElement('div');
      wrap.className = 'mission-meta__complete-wrap';
      const card = document.createElement('section');
      card.className = 'mission-meta__complete';
      const heading = document.createElement('h2');
      heading.textContent = `Semana ${state.week} completada`;
      const note = document.createElement('p');
      note.textContent = 'La siguiente semana se integrará en el próximo bloque.';
      card.append(heading, balancesView(state, renderBalanceChanges), note);
      wrap.appendChild(card);
      return wrap;
    }

    function render() {
      root.dataset.phase = state.phase;
      renderBalanceChanges = pendingBalanceChanges;
      pendingBalanceChanges = null;
      const weekConfig = getWeekConfig(config, state.week);
      let view;
      if (state.phase === 'saving' || state.phase === 'ready-for-surprise') view = savingView();
      else if (state.phase === 'reveal') view = narrativeView(weekConfig?.reveal || [], state.revealStep, false);
      else if (state.phase === 'feedback') view = narrativeView(weekConfig?.feedback || [], state.feedbackStep, true);
      else if (state.phase === 'week-complete') view = completeView();
      else view = decisionView();
      stage.replaceChildren(view);
    }

    render();
    return { noLock: true, suppressRootClick: true, bindControls(onAdvance) { void onAdvance; } };
  });
})();
