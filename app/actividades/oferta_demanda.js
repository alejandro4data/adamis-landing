// oferta_demanda.js - Simulador de heladeria (oferta y demanda)
(() => {
  'use strict';

  const root = document.getElementById('od-game');
  if (!root) return;
  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };
  const currentLang = () => {
    try {
      if (window.I18N && typeof window.I18N.getLang === 'function') return window.I18N.getLang();
    } catch (_) {}
    try {
      const stored = String(localStorage.getItem('adamis_lang') || '').toLowerCase();
      if (stored.startsWith('en')) return 'en';
    } catch (_) {}
    try {
      const htmlLang = String(document.documentElement.lang || '').toLowerCase();
      if (htmlLang.startsWith('en')) return 'en';
    } catch (_) {}
    return 'es';
  };
  const byLang = (obj, fallback = '') => {
    if (!obj || typeof obj !== 'object') return fallback;
    const lang = currentLang() === 'en' ? 'en' : 'es';
    return obj[lang] || obj.es || fallback;
  };

  const CONFIG = {
    initialMoney: 50,
    stockCost: 0.5,
    priceDefault: 2.5,
    priceMin: 0.5,
    priceMax: 6,
    priceStep: 0.25,
    simDuration: 90,
    dayStartHour: 8,
    dayHours: 12,
    eventAnnounceLead: 5,
    eventMinStart: 10,
    eventMinGap: 8,
    eventMinDuration: 10,
    eventMaxDuration: 16
  };
  const CLIENT_DIM = { width: 33, height: 45 };

  const WEATHER_POOL = [
    {
      id: 'sunny',
      label: 'Soleado',
      icon: '&#9728;',
      tempRange: [28, 33],
      multiplier: 1.1,
      demand: 1.35,
      tip: 'Dia ideal: la demanda suele ser alta.'
    },
    {
      id: 'cloudy',
      label: 'Nublado',
      icon: '&#9729;',
      tempRange: [22, 25],
      multiplier: 1.0,
      demand: 1.0,
      tip: 'Demanda estable: ajusta el precio con cuidado.'
    },
    {
      id: 'rainy',
      label: 'Lluvioso',
      icon: '&#127783;',
      tempRange: [16, 19],
      multiplier: 0.8,
      demand: 0.65,
      tip: 'Dia dificil: pocos clientes y menor disposicion a pagar.'
    }
  ];

  const CLIENT_TYPES = {
    saver: { id: 'saver', label: 'Ahorrador', baseBudget: 2.0 },
    impulsive: { id: 'impulsive', label: 'Impulsivo', baseBudget: 3.5 },
    vip: { id: 'vip', label: 'VIP', baseBudget: 5.0 }
  };

  const PROFILE_INFO = {
    impulsive: {
      name: { es: 'Naranja · Impulsivo', en: 'Orange · Impulsive' },
      desc: {
        es: 'Compra por impulso hasta $3.50. Si el precio es moderado y la fila fluye, decide rapido.',
        en: 'Buys impulsively up to $3.50. If the price is moderate and queue flows, decides fast.'
      },
      swatch: 'is-impulsive'
    },
    saver: {
      name: { es: 'Azul · Ahorrador', en: 'Blue · Saver' },
      desc: {
        es: 'Busca precios bajos (tope $2.00). Subidas bruscas o poco stock lo ahuyentan.',
        en: 'Looks for low prices (cap $2.00). Sudden increases or low stock scare them away.'
      },
      swatch: 'is-saver'
    },
    vip: {
      name: { es: 'Purpura · VIP', en: 'Purple · VIP' },
      desc: {
        es: 'Valora comodidad y calor: paga hasta $5.00 y compra mas cuando hace buen tiempo.',
        en: 'Values comfort and warm weather: pays up to $5.00 and buys more on warm days.'
      },
      swatch: 'is-vip'
    }
  };

  const RARITY_META = {
    common: { label: 'Evento común', className: 'is-common' },
    rare: { label: 'Evento raro', className: 'is-rare' },
    legendary: { label: 'Evento muy muy exclusivo', className: 'is-legendary' }
  };

  const WAVE_EVENTS = [
    {
      id: 'wave-saver',
      name: 'Oleada de ahorradores',
      cause: 'Se corrió la voz de precios bajos en la zona.',
      demandMultiplier: 1.3,
      wtpMultiplier: 0.95,
      rarity: 'common',
      profileOnly: 'saver'
    },
    {
      id: 'wave-impulsive',
      name: 'Oleada de impulsivos',
      cause: 'Salida de colegio: muchos compran por impulso.',
      demandMultiplier: 1.25,
      wtpMultiplier: 1.02,
      rarity: 'rare',
      profileOnly: 'impulsive'
    },
    {
      id: 'wave-vip',
      name: 'Oleada de VIPs',
      cause: 'Un evento premium atrae clientes de alto presupuesto.',
      demandMultiplier: 1.15,
      wtpMultiplier: 1.12,
      rarity: 'legendary',
      profileOnly: 'vip'
    }
  ];

  const EVENT_POOL = [
    {
      id: 'tourists',
      name: 'Ola turística',
      cause: 'Llega un grupo de turistas con ganas de helado.',
      demandMultiplier: 1.35,
      wtpMultiplier: 1.08,
      rarity: 'common'
    },
    {
      id: 'competitor',
      name: 'Competencia cercana',
      cause: 'Aparece un puesto rival con precios agresivos.',
      demandMultiplier: 0.75,
      wtpMultiplier: 0.92,
      rarity: 'rare'
    },
    {
      id: 'festival',
      name: 'Festival del barrio',
      cause: 'Hay movimiento extra por un evento local.',
      demandMultiplier: 1.45,
      wtpMultiplier: 1.05,
      rarity: 'rare'
    },
    {
      id: 'promo',
      name: 'Promoción en redes',
      cause: 'Una publicación se hace viral por unos minutos.',
      demandMultiplier: 1.2,
      wtpMultiplier: 1.0,
      rarity: 'common'
    },
    {
      id: 'cold-breeze',
      name: 'Brisa fría',
      cause: 'Baja la temperatura y la gente compra menos.',
      demandMultiplier: 0.8,
      wtpMultiplier: 0.95,
      rarity: 'common'
    },
    {
      id: 'wave',
      name: 'Oleada de clientes',
      isWave: true
    }
  ];

  const el = {
    screens: {
      prep: document.getElementById('od-screen-prep'),
      sim: document.getElementById('od-screen-sim'),
      summary: document.getElementById('od-screen-summary')
    },
    steps: Array.from(root.querySelectorAll('.od-step')),
    weatherIcon: document.getElementById('od-weather-icon'),
    weatherLabel: document.getElementById('od-weather-label'),
    weatherTemp: document.getElementById('od-weather-temp'),
    weatherTip: document.getElementById('od-weather-tip'),
    initialMoney: document.getElementById('od-initial-money'),
    stockRange: document.getElementById('od-stock-range'),
    stockValue: document.getElementById('od-stock-value'),
    stockCost: document.getElementById('od-stock-cost'),
    cashRemaining: document.getElementById('od-cash-remaining'),
    priceDisplay: document.getElementById('od-price-display'),
    priceUp: document.getElementById('od-price-up'),
    priceDown: document.getElementById('od-price-down'),
    startBtn: document.getElementById('od-start'),
    stage: document.getElementById('od-stage'),
    stageInfo: document.getElementById('od-stage-info'),
    lane: document.getElementById('od-lane'),
    stand: document.getElementById('od-stand'),
    clock: document.getElementById('od-clock'),
    stockLive: document.getElementById('od-stock-live'),
    stockHud: document.getElementById('od-stock-hud'),
    cashLive: document.getElementById('od-cash-live'),
    livePriceDisplay: document.getElementById('od-live-price-display'),
    livePriceUp: document.getElementById('od-live-price-up'),
    livePriceDown: document.getElementById('od-live-price-down'),
    stepButtons: Array.from(root.querySelectorAll('.od-step-btn')),
    log: document.getElementById('od-log'),
    pauseBtn: document.getElementById('od-pause'),
    skipBtn: document.getElementById('od-skip'),
    progressBar: document.getElementById('od-progress-bar'),
    eventInfo: document.getElementById('od-event-info'),
    eventOverlay: document.getElementById('od-event-overlay'),
    eventCard: root.querySelector('.od-event-overlay__card'),
    eventRarity: document.getElementById('od-event-rarity'),
    eventTitle: document.getElementById('od-event-title'),
    eventCause: document.getElementById('od-event-cause'),
    eventContinue: document.getElementById('od-event-continue'),
    reveal: document.getElementById('od-reveal'),
    revealStart: document.getElementById('od-reveal-start'),
    revealExpense: document.getElementById('od-reveal-expense'),
    revealRevenue: document.getElementById('od-reveal-revenue'),
    revealPenalty: document.getElementById('od-reveal-penalty'),
    revealTotal: document.getElementById('od-reveal-total'),
    revealMaxWrap: document.getElementById('od-reveal-max-wrap'),
    revealMax: document.getElementById('od-reveal-max'),
    revealRowStart: document.querySelector('[data-step="start"]'),
    revealRowExpense: document.querySelector('[data-step="expense"]'),
    revealRowRevenue: document.querySelector('[data-step="revenue"]'),
    revealRowPenalty: document.querySelector('[data-step="penalty"]'),
    summaryFinal: document.getElementById('od-summary-final'),
    maxInfoBtn: document.getElementById('od-max-info-btn'),
    maxInfoModal: document.getElementById('od-max-info-modal'),
    maxInfoBackdrop: document.getElementById('od-max-info-backdrop'),
    maxInfoClose: document.getElementById('od-max-info-close'),
    maxInfoVip: document.getElementById('od-max-info-vip'),
    maxInfoImpulsive: document.getElementById('od-max-info-impulsive'),
    maxInfoSaver: document.getElementById('od-max-info-saver'),
    legendBtns: Array.from(document.querySelectorAll('.od-legend-btn')),
    legendModal: document.getElementById('od-legend-modal'),
    legendBackdrop: document.getElementById('od-legend-backdrop'),
    legendClose: document.getElementById('od-legend-close'),
    legendModalSwatch: document.getElementById('od-legend-modal-swatch'),
    legendModalName: document.getElementById('od-legend-title'),
    legendModalDesc: document.getElementById('od-legend-modal-desc'),
    resultTitle: document.getElementById('od-result-title'),
    resultAmount: document.getElementById('od-result-amount'),
    resultSub: document.getElementById('od-result-sub'),
    sumInitial: document.getElementById('od-sum-initial'),
    sumExpense: document.getElementById('od-sum-expense'),
    sumRevenue: document.getElementById('od-sum-revenue'),
    sumMax: document.getElementById('od-sum-max'),
    sumFinal: document.getElementById('od-sum-final'),
    wasteNote: document.getElementById('od-waste-note'),
    maxNote: document.getElementById('od-max-note'),
    funnelTotal: document.getElementById('od-funnel-total'),
    funnelBuy: document.getElementById('od-funnel-buy'),
    funnelPrice: document.getElementById('od-funnel-price'),
    funnelStock: document.getElementById('od-funnel-stock'),
    funnelTotalText: document.getElementById('od-funnel-total-text'),
    funnelBuyText: document.getElementById('od-funnel-buy-text'),
    funnelPriceText: document.getElementById('od-funnel-price-text'),
    funnelStockText: document.getElementById('od-funnel-stock-text'),
    hourlyChart: document.getElementById('od-hourly-chart'),
    restartBtn: document.getElementById('od-restart')
  };

  const state = {
    weather: null,
    price: CONFIG.priceDefault,
    priceStep: CONFIG.priceStep,
    priceMax: CONFIG.priceMax,
    stockSelected: 0,
    stock: 0,
    cash: CONFIG.initialMoney,
    bank: CONFIG.initialMoney,
    dayStartMoney: CONFIG.initialMoney,
    revenue: 0,
    running: false,
    paused: false,
    elapsed: 0,
    simStart: 0,
    simTimer: null,
    spawnTimer: null,
    spawnDueAt: null,
    spawnDelayRemaining: null,
    clientAnimations: new Set(),
    clientTimers: new Map(),
    stats: null,
    events: [],
    activeEvent: null,
    pausedByEvent: false,
    pendingEvent: null,
    maxPlan: null
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const formatMoney = (value) => `$${value.toFixed(2)}`;
  const formatSignedMoney = (value) => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${formatMoney(Math.abs(value))}`;
  };
  const pad2 = (value) => String(value).padStart(2, '0');

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffle = (arr) => {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i -= 1){
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  function pickWaveEvent(){
    const roll = Math.random();
    if (roll < 0.8) return { ...WAVE_EVENTS[0] };
    if (roll < 0.95) return { ...WAVE_EVENTS[1] };
    return { ...WAVE_EVENTS[2] };
  }

  function normalizeWeights(weights){
    const safe = {
      saver: Math.max(0.05, weights.saver),
      impulsive: Math.max(0.05, weights.impulsive),
      vip: Math.max(0.05, weights.vip)
    };
    const total = safe.saver + safe.impulsive + safe.vip;
    return {
      saver: safe.saver / total,
      impulsive: safe.impulsive / total,
      vip: safe.vip / total
    };
  }

  function pickWeather(){
    const pick = WEATHER_POOL[Math.floor(Math.random() * WEATHER_POOL.length)];
    return { ...pick, temp: randomInt(pick.tempRange[0], pick.tempRange[1]) };
  }

  function setScreen(name){
    Object.entries(el.screens).forEach(([key, node]) => {
      if (!node) return;
      node.classList.toggle('is-active', key === name);
    });
    el.steps.forEach((step) => {
      step.classList.toggle('is-active', step.dataset.step === name);
    });
  }

  function updatePriceDisplays(){
    if (el.priceDisplay) el.priceDisplay.textContent = formatMoney(state.price);
    if (el.livePriceDisplay) el.livePriceDisplay.textContent = formatMoney(state.price);
  }

  function updateStepUI(){
    if (!el.stepButtons) return;
    el.stepButtons.forEach((btn) => {
      const value = Number(btn.dataset.step);
      const isActive = Number.isFinite(value) && Math.abs(value - state.priceStep) < 0.001;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setPriceStep(step){
    const value = Number(step);
    if (!Number.isFinite(value) || value <= 0) return;
    state.priceStep = value;
    updateStepUI();
  }

  function adjustPrice(delta){
    state.price = clamp(state.price + delta, CONFIG.priceMin, state.priceMax);
    state.price = Math.round(state.price * 100) / 100;
    updatePriceDisplays();
  }

  function updateStockUI(){
    const units = state.stockSelected;
    const cost = units * CONFIG.stockCost;
    const remaining = state.bank - cost;

    if (el.stockValue) el.stockValue.textContent = String(units);
    if (el.stockCost) el.stockCost.textContent = formatMoney(cost);
    if (el.cashRemaining) el.cashRemaining.textContent = formatMoney(remaining);

    if (el.startBtn) el.startBtn.disabled = units <= 0 || remaining < 0;
  }

  function updateWeatherUI(){
    if (!state.weather) return;
    if (el.weatherIcon) el.weatherIcon.innerHTML = state.weather.icon;
    if (el.weatherLabel) el.weatherLabel.textContent = state.weather.label;
    if (el.weatherTemp) el.weatherTemp.textContent = String(state.weather.temp);
    if (el.weatherTip) el.weatherTip.textContent = state.weather.tip;

    if (el.stage) {
      el.stage.classList.remove('is-sunny', 'is-cloudy', 'is-rainy');
      el.stage.classList.add(`is-${state.weather.id}`);
    }
    if (el.stageInfo) {
      el.stageInfo.textContent = `${state.weather.label} / ${state.weather.temp}\u00B0C`;
    }
  }

  function getSpawnDelay(){
    if (!state.weather) return 1200;
    let min = 900;
    let max = 1500;
    if (state.weather.id === 'sunny'){
      min = 650;
      max = 1100;
    } else if (state.weather.id === 'rainy'){
      min = 1300;
      max = 2200;
    }

    const demandFactor = Math.max(0.5, state.weather.demand);
    const eventFactor = Math.max(0.5, state.activeEvent?.demandMultiplier || 1);
    min = min / (demandFactor * eventFactor);
    max = max / (demandFactor * eventFactor);

    if (state.weather.temp >= 28){
      min *= 0.85;
      max *= 0.85;
    }

    return min + Math.random() * (max - min);
  }

  function pickClientType(){
    if (state.activeEvent?.profileOnly){
      return CLIENT_TYPES[state.activeEvent.profileOnly] || CLIENT_TYPES.saver;
    }

    let weights = { saver: 0.5, impulsive: 0.3, vip: 0.2 };

    if (state.weather && state.weather.temp >= 28){
      weights.vip += 0.08;
      weights.saver -= 0.04;
      weights.impulsive -= 0.04;
    }

    weights = normalizeWeights(weights);

    const roll = Math.random();
    if (roll < weights.saver) return CLIENT_TYPES.saver;
    if (roll < weights.saver + weights.impulsive) return CLIENT_TYPES.impulsive;
    return CLIENT_TYPES.vip;
  }

  function computeWtp(client){
    const bonusHeat = Math.max(0, (state.weather?.temp || 20) - 20) * 0.1;
    const multiplier = state.weather?.multiplier || 1;
    const eventMultiplier = state.activeEvent?.wtpMultiplier || 1;
    return (client.baseBudget + bonusHeat) * multiplier * eventMultiplier;
  }

  function getHourIndex(elapsedSec){
    const hourSpan = CONFIG.simDuration / CONFIG.dayHours;
    return clamp(Math.floor(elapsedSec / hourSpan), 0, CONFIG.dayHours - 1);
  }

  function getElapsedSec(){
    if (!state.running) return state.elapsed;
    if (state.paused) return state.elapsed;
    return state.elapsed + (performance.now() - state.simStart) / 1000;
  }

  function updateHud(elapsedSec){
    const progress = clamp(elapsedSec / CONFIG.simDuration, 0, 1);
    const simHour = CONFIG.dayStartHour + progress * CONFIG.dayHours;
    const hour = Math.floor(simHour);
    const minute = Math.floor((simHour - hour) * 60);

    if (el.clock) el.clock.textContent = `${pad2(hour)}:${pad2(minute)}`;
    if (el.stockLive) el.stockLive.textContent = String(state.stock);
    if (el.cashLive) el.cashLive.textContent = formatMoney(state.cash);
    if (el.stockHud) el.stockHud.classList.toggle('is-alert', state.stock <= 0);
    if (el.progressBar) el.progressBar.style.width = `${progress * 100}%`;
    if (el.skipBtn){
      const canSkip = state.running && state.stock <= 0;
      el.skipBtn.hidden = !canSkip;
    }
  }

  function flashStand(type){
    if (!el.stand) return;
    el.stand.classList.remove('is-sale', 'is-miss');
    void el.stand.offsetWidth;
    el.stand.classList.add(type === 'sale' ? 'is-sale' : 'is-miss');
  }

  function showBubble(target, outcome){
    if (!target || !target.isConnected) return;
    const bubble = document.createElement('div');
    bubble.className = `od-bubble od-bubble--${outcome}`;
    bubble.textContent = outcome === 'buy' ? tr('Compra') : outcome === 'price' ? tr('Muy caro') : tr('Sin stock');
    target.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1200);
  }

  function updateLog(client, outcome, wtp){
    if (!el.log) return;
    if (outcome === 'buy'){
      el.log.textContent = `${client.label} compra a ${formatMoney(state.price)}.`;
      return;
    }
    if (outcome === 'price'){
      el.log.textContent = `${client.label} se va: muy caro (WTP ${formatMoney(wtp)}).`;
      return;
    }
    el.log.textContent = `${client.label} se va: sin stock.`;
  }

  function recordOutcome(outcome, hourIndex){
    const bucket = state.stats.hourly[hourIndex];
    if (outcome === 'buy'){
      state.stats.sold += 1;
      bucket.sold += 1;
    } else if (outcome === 'price'){
      state.stats.lostPrice += 1;
      bucket.lostPrice += 1;
    } else {
      state.stats.lostStock += 1;
      bucket.lostStock += 1;
    }
  }

  function updatePriceMaxFromWtp(wtp){
    const rounded = Math.ceil(wtp * 100) / 100;
    if (rounded > state.priceMax){
      state.priceMax = rounded;
    }
  }

  function evaluateClient(target, client, elapsedSec){
    if (!state.running || state.paused) return;
    const wtp = computeWtp(client);
    updatePriceMaxFromWtp(wtp);
    if (state.stats?.wtpByProfile?.[client.id]){
      state.stats.wtpByProfile[client.id].push(wtp);
    }
    const hourIndex = getHourIndex(elapsedSec);
    state.stats.total += 1;

    let outcome = 'price';
    if (state.stock <= 0){
      outcome = 'stock';
    } else if (state.price > wtp){
      outcome = 'price';
    } else {
      outcome = 'buy';
    }

    recordOutcome(outcome, hourIndex);

    if (outcome === 'buy'){
      state.stock -= 1;
      state.cash += state.price;
      state.revenue += state.price;
      flashStand('sale');
    } else {
      flashStand('miss');
    }

    showBubble(target, outcome);
    updateLog(client, outcome, wtp);
    updateHud(elapsedSec);
  }

  function spawnClient(){
    if (!state.running || state.paused || !el.lane) return;
    if (el.lane.childElementCount > 18) return;

    const client = pickClientType();
    const clientEl = document.createElement('div');
    clientEl.className = `od-client od-client--${client.id}`;
    if (state.activeEvent?.id === 'tourists'){
      clientEl.classList.add('od-client--tourist');
    }
    clientEl.setAttribute('aria-hidden', 'true');
    const head = document.createElement('span');
    head.className = 'od-client__head';
    const body = document.createElement('span');
    body.className = 'od-client__body';
    clientEl.appendChild(head);
    clientEl.appendChild(body);

    const stageHeight = (el.stage && el.stage.clientHeight) || el.lane.clientHeight || 300;
    const groundLine = stageHeight * 0.68;
    const jitter = randomInt(-2, 2);
    const topPos = Math.max(8, Math.round(groundLine - CLIENT_DIM.height + jitter));
    clientEl.style.top = `${topPos}px`;
    clientEl.style.left = '0px';

    el.lane.appendChild(clientEl);

    const duration = randomInt(6800, 9800);
    const travel = (el.lane.clientWidth || 400) + 100;
    const startX = -40;

    let anim = null;
    if (clientEl.animate){
      anim = clientEl.animate(
        [
          { transform: `translateX(${startX}px)` },
          { transform: `translateX(${travel}px)` }
        ],
        { duration, easing: 'linear', fill: 'forwards' }
      );
    } else {
      clientEl.style.transform = `translateX(${startX}px)`;
      clientEl.style.transition = `transform ${duration}ms linear`;
      requestAnimationFrame(() => {
        clientEl.style.transform = `translateX(${travel}px)`;
      });
    }

    const arrivalTime = performance.now() + duration * 0.5;
    const arrivalDelay = Math.max(0, arrivalTime - performance.now());
    const timer = {
      id: null,
      dueAt: arrivalTime,
      remaining: null,
      client,
      fired: false
    };
    timer.id = setTimeout(() => {
      if (timer.fired) return;
      timer.fired = true;
      const elapsedSec = getElapsedSec();
      evaluateClient(clientEl, client, elapsedSec);
      state.clientTimers.delete(clientEl); // evita re-evaluaciones al reanudar
    }, arrivalDelay);
    state.clientTimers.set(clientEl, timer);

    if (anim){
      state.clientAnimations.add(anim);
      anim.onfinish = () => {
        state.clientAnimations.delete(anim);
        state.clientTimers.delete(clientEl);
        clientEl.remove();
      };
    } else {
      setTimeout(() => {
        state.clientTimers.delete(clientEl);
        clientEl.remove();
      }, duration + 50);
    }
  }

  function scheduleSpawn(){
    if (!state.running || state.paused) return;
    const delay = state.spawnDelayRemaining ?? getSpawnDelay();
    state.spawnDelayRemaining = null;
    state.spawnDueAt = performance.now() + delay;
    state.spawnTimer = setTimeout(() => {
      if (!state.running || state.paused) return;
      spawnClient();
      scheduleSpawn();
    }, delay);
  }

  function openEventOverlay(event){
    if (!el.eventOverlay || !event) return;
    const rarity = RARITY_META[event.rarity] || RARITY_META.common;
    if (el.eventRarity) el.eventRarity.textContent = rarity.label;
    if (el.eventCard){
      el.eventCard.classList.remove('is-common', 'is-rare', 'is-legendary');
      el.eventCard.classList.add(rarity.className);
    }
    if (el.eventTitle) el.eventTitle.textContent = event.name;
    if (el.eventCause) el.eventCause.textContent = `Posible causa del evento: ${event.cause}`;
    setEventInfo(`Duración del evento: ${Math.round(event.duration)}s`);
    el.eventOverlay.classList.add('is-visible');
    el.eventOverlay.setAttribute('aria-hidden', 'false');
    state.pendingEvent = event;
    event.pendingStart = true;
    if (state.running && !state.paused){
      state.pausedByEvent = true;
      pauseSimulation();
    }
  }

  function closeEventOverlay(){
    if (!el.eventOverlay) return;
    el.eventOverlay.classList.remove('is-visible');
    el.eventOverlay.setAttribute('aria-hidden', 'true');
    if (state.pendingEvent && !state.pendingEvent.started){
      const start = getElapsedSec();
      state.pendingEvent.start = start;
      state.pendingEvent.end = start + state.pendingEvent.duration;
      state.pendingEvent.started = true;
      state.pendingEvent.pendingStart = false;
      state.activeEvent = state.pendingEvent;
      state.pendingEvent = null;
    }
    if (state.running && state.paused && state.pausedByEvent){
      state.pausedByEvent = false;
      resumeSimulation();
    }
  }

  function setEventInfo(text){
    if (!el.eventInfo) return;
    el.eventInfo.textContent = text || '';
    el.eventInfo.classList.toggle('is-visible', Boolean(text));
  }

  function animateValue(el, from, to, duration, formatter){
    if (!el) return;
    const start = performance.now();
    const diff = to - from;
    const fmt = formatter || formatMoney;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + diff * eased;
      el.textContent = fmt(value);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function resetReveal(){
    if (!el.reveal) return;
    el.reveal.classList.remove('is-visible');
    if (el.summaryFinal) el.summaryFinal.classList.remove('is-visible');
    if (el.revealMaxWrap) el.revealMaxWrap.classList.remove('is-visible');
    [el.revealRowStart, el.revealRowExpense, el.revealRowRevenue, el.revealRowPenalty].forEach((row) => {
      if (!row) return;
      row.classList.remove('is-active', 'is-done', 'is-positive', 'is-negative');
    });
    if (el.revealStart) el.revealStart.textContent = formatMoney(0);
    if (el.revealExpense) el.revealExpense.textContent = formatMoney(0);
    if (el.revealRevenue) el.revealRevenue.textContent = formatMoney(0);
    if (el.revealPenalty) el.revealPenalty.textContent = formatMoney(0);
    if (el.revealTotal) el.revealTotal.textContent = formatMoney(0);
    if (el.revealMax) el.revealMax.textContent = formatMoney(0);
  }

  async function runRevealAnimation(data){
    if (!el.reveal || !el.summaryFinal) {
      if (el.summaryFinal) el.summaryFinal.classList.add('is-visible');
      return;
    }

    resetReveal();
    el.reveal.classList.add('is-visible');

    const stepDuration = 900;
    const stepPause = 1000;
    const maxDuration = 1100;

    const steps = [
      {
        row: el.revealRowStart,
        valueEl: el.revealStart,
        value: data.startMoney,
        format: formatMoney,
        totalTarget: data.startMoney
      },
      {
        row: el.revealRowExpense,
        valueEl: el.revealExpense,
        value: -data.expense,
        format: formatSignedMoney,
        totalTarget: data.startMoney - data.expense,
        negative: true
      },
      {
        row: el.revealRowRevenue,
        valueEl: el.revealRevenue,
        value: data.revenue,
        format: formatSignedMoney,
        totalTarget: data.startMoney - data.expense + data.revenue,
        positive: true
      },
      {
        row: el.revealRowPenalty,
        valueEl: el.revealPenalty,
        value: -data.penalty,
        format: formatSignedMoney,
        totalTarget: data.finalMoney,
        negative: true
      }
    ];

    let currentTotal = 0;
    for (const step of steps){
      if (step.row) {
        step.row.classList.add('is-active');
        if (step.negative) step.row.classList.add('is-negative');
        if (step.positive) step.row.classList.add('is-positive');
      }
      if (step.valueEl) step.valueEl.textContent = step.format(step.value);
      animateValue(el.revealTotal, currentTotal, step.totalTarget, stepDuration, formatMoney);
      await new Promise((resolve) => setTimeout(resolve, stepPause));
      if (step.row) {
        step.row.classList.remove('is-active');
        step.row.classList.add('is-done');
      }
      currentTotal = step.totalTarget;
    }

    if (el.revealMaxWrap) {
      el.revealMaxWrap.classList.add('is-visible');
    }
    animateValue(el.revealMax, 0, data.maxRevenue, maxDuration, formatMoney);
    await new Promise((resolve) => setTimeout(resolve, maxDuration + 200));

    el.reveal.classList.remove('is-visible');
    el.summaryFinal.classList.add('is-visible');
  }

  function setMaxInfoPlan(plan){
    const render = (target, info) => {
      if (!target) return;
      if (!info || info.count <= 0){
        target.textContent = 'Sin ventas';
        return;
      }
      target.textContent = `Precio ${formatMoney(info.price)} · Cantidad ${info.count}`;
    };

    render(el.maxInfoVip, plan.vip);
    render(el.maxInfoImpulsive, plan.impulsive);
    render(el.maxInfoSaver, plan.saver);
  }

  function openMaxInfoModal(){
    if (!el.maxInfoModal) return;
    setMaxInfoPlan(state.maxPlan);
    el.maxInfoModal.classList.add('is-open');
    el.maxInfoModal.setAttribute('aria-hidden', 'false');
  }

  function closeMaxInfoModal(){
    if (!el.maxInfoModal) return;
    el.maxInfoModal.classList.remove('is-open');
    el.maxInfoModal.setAttribute('aria-hidden', 'true');
  }

  function buildDailyEvents(){
    const roll = Math.random();
    const count = roll < 0.4 ? 0 : roll < 0.8 ? 1 : 2;
    if (count === 0) return [];

    const available = shuffle(EVENT_POOL);
    const scheduled = [];
    const latestStart = Math.max(CONFIG.eventMinStart + 5, CONFIG.simDuration - CONFIG.eventMaxDuration - 4);

    available.slice(0, count).forEach((event) => {
      const baseEvent = event.isWave ? pickWaveEvent() : event;
      let tries = 0;
      let start = 0;
      let duration = 0;
      let end = 0;
      while (tries < 6){
        duration = randomInt(CONFIG.eventMinDuration, CONFIG.eventMaxDuration);
        start = randomInt(CONFIG.eventMinStart, latestStart);
        end = start + duration;
        const overlaps = scheduled.some((scheduledEvent) =>
          start < scheduledEvent.end + CONFIG.eventMinGap && end > scheduledEvent.start - CONFIG.eventMinGap
        );
        if (!overlaps) break;
        tries += 1;
      }
      if (tries >= 6) return;
      scheduled.push({
        ...baseEvent,
        duration,
        start,
        end,
        announceAt: start,
        announced: false,
        started: false,
        ended: false
      });
    });

    return scheduled.sort((a, b) => a.start - b.start);
  }

  function updateEventState(elapsedSec){
    if (!state.events.length) return;
    if (state.pendingEvent) return;
    state.events.forEach((event) => {
      if (!event.announced && elapsedSec >= event.announceAt){
        event.announced = true;
        openEventOverlay(event);
      }
      if (!event.started && !event.pendingStart && elapsedSec >= event.start){
        event.started = true;
        state.activeEvent = event;
      }
      if (event.started && !event.ended && elapsedSec >= event.end){
        event.ended = true;
        if (state.activeEvent === event) state.activeEvent = null;
        setEventInfo('');
      }
      if (event === state.activeEvent && event.started && !event.ended){
        const remaining = Math.max(0, Math.ceil(event.end - elapsedSec));
        setEventInfo(`Evento ${event.name}: ${remaining}s`);
      }
    });
  }

  function startSimulation(){
    if (state.stockSelected <= 0) return;
    stopSimulation();

    state.running = true;
    state.paused = false;
    state.elapsed = 0;
    state.stock = state.stockSelected;
    state.dayStartMoney = state.bank;
    state.cash = state.bank - state.stockSelected * CONFIG.stockCost;
    state.revenue = 0;
    state.stats = {
      total: 0,
      sold: 0,
      lostPrice: 0,
      lostStock: 0,
      hourly: Array.from({ length: CONFIG.dayHours }, () => ({
        sold: 0,
        lostPrice: 0,
        lostStock: 0
      })),
      wtpByProfile: { saver: [], impulsive: [], vip: [] }
    };
    state.events = buildDailyEvents();
    state.activeEvent = null;

    setScreen('sim');
    state.simStart = performance.now();
    updateHud(0);
    if (el.log) el.log.textContent = 'Empieza la jornada. Ajusta el precio.';
    if (el.pauseBtn) el.pauseBtn.textContent = 'Pausar';
    if (el.skipBtn){
      el.skipBtn.hidden = state.stock > 0;
    }
    root.classList.remove('is-paused');

    state.simTimer = setInterval(() => {
      const elapsedSec = getElapsedSec();
      updateHud(elapsedSec);
      updateEventState(elapsedSec);
      if (elapsedSec >= CONFIG.simDuration){
        endSimulation();
      }
    }, 200);

    scheduleSpawn();
  }

  function pauseSimulation(){
    if (!state.running || state.paused) return;
    const elapsed = getElapsedSec(); // capturamos el tiempo antes de marcar pausa
    state.paused = true;
    state.elapsed = elapsed;
    state.simStart = 0;
    clearInterval(state.simTimer);
    state.simTimer = null;

    if (state.spawnTimer){
      clearTimeout(state.spawnTimer);
      state.spawnTimer = null;
      if (state.spawnDueAt){
        state.spawnDelayRemaining = Math.max(0, state.spawnDueAt - performance.now());
      }
    }

    state.clientAnimations.forEach((anim) => anim.pause());
    state.clientTimers.forEach((timer) => {
      if (timer.fired) return;
      clearTimeout(timer.id);
      timer.remaining = Math.max(0, timer.dueAt - performance.now());
    });

    updateHud(state.elapsed);
    if (el.pauseBtn) el.pauseBtn.textContent = 'Reanudar';
    root.classList.add('is-paused');
  }

  function resumeSimulation(){
    if (!state.running || !state.paused) return;
    state.paused = false;
    state.simStart = performance.now();
    if (el.pauseBtn) el.pauseBtn.textContent = 'Pausar';
    root.classList.remove('is-paused');

    state.clientAnimations.forEach((anim) => anim.play());
    state.clientTimers.forEach((timer, clientEl) => {
      if (timer.remaining == null || timer.fired) return;
      timer.dueAt = performance.now() + timer.remaining;
      timer.id = setTimeout(() => {
        if (timer.fired) return;
        timer.fired = true;
        const elapsedSec = getElapsedSec();
        evaluateClient(clientEl, timer.client, elapsedSec);
        state.clientTimers.delete(clientEl);
      }, timer.remaining);
      timer.remaining = null;
    });

    state.simTimer = setInterval(() => {
      const elapsedSec = getElapsedSec();
      updateHud(elapsedSec);
      updateEventState(elapsedSec);
      if (elapsedSec >= CONFIG.simDuration){
        endSimulation();
      }
    }, 200);

    scheduleSpawn();
  }

  function togglePause(){
    if (!state.running) return;
    if (state.paused){
      resumeSimulation();
    } else {
      pauseSimulation();
    }
  }

  function skipToEnd(){
    if (!state.running || state.stock > 0) return;
    endSimulation();
  }

  function endSimulation(){
    if (!state.running) return;
    state.running = false;
    state.paused = false;
    clearInterval(state.simTimer);
    clearTimeout(state.spawnTimer);
    state.simTimer = null;
    state.spawnTimer = null;
    state.spawnDueAt = null;
    state.spawnDelayRemaining = null;
    state.clientAnimations.clear();
    state.clientTimers.clear();
    state.events = [];
    state.activeEvent = null;
    state.pausedByEvent = false;
    state.pendingEvent = null;
    state.maxPlan = null;
    state.pendingEvent = null;
    if (el.eventOverlay){
      el.eventOverlay.classList.remove('is-visible');
      el.eventOverlay.setAttribute('aria-hidden', 'true');
    }
    setEventInfo('');
    resetReveal();
    if (el.lane) el.lane.innerHTML = '';
    showSummary();
  }

  function stopSimulation(){
    clearInterval(state.simTimer);
    clearTimeout(state.spawnTimer);
    state.simTimer = null;
    state.spawnTimer = null;
    state.running = false;
    state.paused = false;
    state.elapsed = 0;
    state.spawnDueAt = null;
    state.spawnDelayRemaining = null;
    state.clientAnimations.clear();
    state.clientTimers.clear();
    state.events = [];
    state.activeEvent = null;
    state.pausedByEvent = false;
    state.pendingEvent = null;
    state.maxPlan = null;
    if (el.eventOverlay){
      el.eventOverlay.classList.remove('is-visible');
      el.eventOverlay.setAttribute('aria-hidden', 'true');
    }
    setEventInfo('');
    resetReveal();
    if (el.lane) el.lane.innerHTML = '';
  }

  function updateFunnel(){
    const total = state.stats.total;
    const sold = state.stats.sold;
    const lostPrice = state.stats.lostPrice;
    const lostStock = state.stats.lostStock;

    const pct = (value) => (total ? Math.round((value / total) * 100) : 0);

    const totalText = `${total}`;
    const soldText = `${sold} (${pct(sold)}%)`;
    const priceText = `${lostPrice} (${pct(lostPrice)}%)`;
    const stockText = `${lostStock} (${pct(lostStock)}%)`;

    if (el.funnelTotal) el.funnelTotal.style.width = total ? '100%' : '0%';
    if (el.funnelBuy) el.funnelBuy.style.width = `${pct(sold)}%`;
    if (el.funnelPrice) el.funnelPrice.style.width = `${pct(lostPrice)}%`;
    if (el.funnelStock) el.funnelStock.style.width = `${pct(lostStock)}%`;

    if (el.funnelTotalText) el.funnelTotalText.textContent = totalText;
    if (el.funnelBuyText) el.funnelBuyText.textContent = soldText;
    if (el.funnelPriceText) el.funnelPriceText.textContent = priceText;
    if (el.funnelStockText) el.funnelStockText.textContent = stockText;
  }

  function updateHourlyChart(){
    if (!el.hourlyChart) return;
    el.hourlyChart.innerHTML = '';

    const totals = state.stats.hourly.map((hour) => hour.sold + hour.lostPrice + hour.lostStock);
    const maxTotal = Math.max(1, ...totals);

    state.stats.hourly.forEach((hour, index) => {
      const bar = document.createElement('div');
      bar.className = 'od-hourly-bar';

      const stack = document.createElement('div');
      stack.className = 'od-hourly-stack';

      const saleSeg = document.createElement('div');
      saleSeg.className = 'od-stack od-stack--sale';
      saleSeg.style.height = `${(hour.sold / maxTotal) * 100}%`;
      saleSeg.title = `Ventas: ${hour.sold}`;

      const priceSeg = document.createElement('div');
      priceSeg.className = 'od-stack od-stack--price';
      priceSeg.style.height = `${(hour.lostPrice / maxTotal) * 100}%`;
      priceSeg.title = `Muy caro: ${hour.lostPrice}`;

      const stockSeg = document.createElement('div');
      stockSeg.className = 'od-stack od-stack--stock';
      stockSeg.style.height = `${(hour.lostStock / maxTotal) * 100}%`;
      stockSeg.title = `Sin stock: ${hour.lostStock}`;

      stack.appendChild(saleSeg);
      stack.appendChild(priceSeg);
      stack.appendChild(stockSeg);

      const label = document.createElement('span');
      label.className = 'od-hourly-label';
      label.textContent = `${CONFIG.dayStartHour + index}h`;

      bar.appendChild(stack);
      bar.appendChild(label);
      el.hourlyChart.appendChild(bar);
    });
  }

  function showSummary(){
    const expense = state.stockSelected * CONFIG.stockCost;
    const penalty = state.stock * 0.5;
    const finalMoney = state.dayStartMoney - expense + state.revenue - penalty;
    const profit = finalMoney - state.dayStartMoney;
    if (window.AdamisRewards && typeof window.AdamisRewards.claim === 'function') {
      window.AdamisRewards.claim({
        activityId: 'oferta-demanda-semanal',
        amount: 5,
        frequency: 'weekly',
        score: Math.round(profit * 100) / 100,
        meta: {
          final_money: Math.round(finalMoney * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          sold: state.stats?.sold || 0,
          lost_price: state.stats?.lostPrice || 0,
          lost_stock: state.stats?.lostStock || 0
        }
      });
    }
    const wtpByProfile = state.stats?.wtpByProfile || { saver: [], impulsive: [], vip: [] };
    let remaining = state.stockSelected;
    let maxRevenue = 0;
    const plan = {
      vip: { count: 0, price: 0 },
      impulsive: { count: 0, price: 0 },
      saver: { count: 0, price: 0 }
    };
    const order = ['vip', 'impulsive', 'saver'];

    order.forEach((key) => {
      if (remaining <= 0) return;
      const list = wtpByProfile[key] || [];
      const sellCount = Math.min(remaining, list.length);
      if (sellCount <= 0) return;
      const desc = list.slice().sort((a, b) => b - a);
      const price = desc[sellCount - 1];
      const revenue = price * sellCount;
      plan[key] = { count: sellCount, price };
      maxRevenue += revenue;
      remaining -= sellCount;
    });

    if (el.resultTitle){
      el.resultTitle.textContent = profit >= 0 ? 'Ganancia neta' : 'Perdida neta';
    }
    if (el.resultAmount) el.resultAmount.textContent = formatMoney(finalMoney);
    if (el.resultSub){
      el.resultSub.textContent = profit >= 0
        ? `Ganaste ${formatMoney(profit)} al final del dia.`
        : `Perdiste ${formatMoney(Math.abs(profit))} al final del dia.`;
    }

    if (el.sumInitial) el.sumInitial.textContent = formatMoney(state.dayStartMoney);
    if (el.sumExpense) el.sumExpense.textContent = formatMoney(expense);
    if (el.sumRevenue) el.sumRevenue.textContent = formatMoney(state.revenue);
    if (el.sumMax) el.sumMax.textContent = formatMoney(maxRevenue);
    if (el.sumFinal) el.sumFinal.textContent = formatMoney(finalMoney);

    state.bank = finalMoney;

    if (el.wasteNote){
      if (state.stock > 0){
        el.wasteNote.textContent = `Merma: ${state.stock} helados sin vender. Penalización ${formatMoney(penalty)}.`;
      } else {
        el.wasteNote.textContent = 'Sin merma de stock.';
      }
    }
    if (el.maxNote){
      if (maxRevenue > 0){
        el.maxNote.textContent = 'Máximo posible de ingresos si priorizabas VIPs, luego impulsivos y después ahorradores.';
      } else {
        el.maxNote.textContent = '';
      }
    }

    state.maxPlan = plan;

    updateFunnel();
    updateHourlyChart();

    setScreen('summary');
    runRevealAnimation({
      startMoney: state.dayStartMoney,
      expense,
      revenue: state.revenue,
      penalty,
      finalMoney,
      maxRevenue
    });
  }

  function resetDay(){
    stopSimulation();
    state.weather = pickWeather();
    state.price = CONFIG.priceDefault;
    state.priceMax = CONFIG.priceMax;
    state.stockSelected = 0;
    state.stock = 0;
    state.cash = state.bank;
    state.revenue = 0;
    state.stats = {
      total: 0,
      sold: 0,
      lostPrice: 0,
      lostStock: 0,
      hourly: Array.from({ length: CONFIG.dayHours }, () => ({
        sold: 0,
        lostPrice: 0,
        lostStock: 0
      })),
      wtpByProfile: { saver: [], impulsive: [], vip: [] }
    };
    state.dayStartMoney = state.bank;
    state.events = [];
    state.activeEvent = null;
    state.pausedByEvent = false;
    state.pendingEvent = null;
    state.maxPlan = null;

    if (el.stockRange) el.stockRange.max = String(Math.floor(state.bank / CONFIG.stockCost));
    if (el.stockRange) el.stockRange.value = '0';
    if (el.initialMoney) el.initialMoney.textContent = formatMoney(state.bank);
    if (el.log) el.log.textContent = 'Listo para abrir.';
    if (el.progressBar) el.progressBar.style.width = '0%';
    if (el.pauseBtn) el.pauseBtn.textContent = 'Pausar';
    if (el.skipBtn){
      el.skipBtn.hidden = true;
    }
    if (el.eventOverlay){
      el.eventOverlay.classList.remove('is-visible');
      el.eventOverlay.setAttribute('aria-hidden', 'true');
    }
    setEventInfo('');
    resetReveal();
    root.classList.remove('is-paused');

    updatePriceDisplays();
    updateStepUI();
    updateStockUI();
    updateWeatherUI();
    setScreen('prep');
  }

  function closeLegendModal(){
    if (!el.legendModal) return;
    el.legendModal.classList.remove('is-open');
    el.legendModal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onLegendKeydown);
  }

  function openLegendModal(profile = 'impulsive'){
    if (!el.legendModal) return;
    const info = PROFILE_INFO[profile] || PROFILE_INFO.impulsive;
    if (el.legendModalName) el.legendModalName.textContent = byLang(info.name, '');
    if (el.legendModalDesc) el.legendModalDesc.textContent = byLang(info.desc, '');
    if (el.legendModalSwatch){
      el.legendModalSwatch.className = 'od-legend-swatch';
      if (info.swatch) el.legendModalSwatch.classList.add(info.swatch);
    }
    el.legendModal.classList.add('is-open');
    el.legendModal.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onLegendKeydown);
  }

  function onLegendKeydown(ev){
    if (ev.key === 'Escape'){
      ev.preventDefault();
      closeLegendModal();
    }
  }

  function bindEvents(){
    if (el.stockRange){
      el.stockRange.max = String(Math.floor(state.bank / CONFIG.stockCost));
      el.stockRange.addEventListener('input', () => {
        state.stockSelected = Number(el.stockRange.value) || 0;
        updateStockUI();
      });
    }

    if (el.stepButtons) el.stepButtons.forEach((btn) => {
      btn.addEventListener('click', () => setPriceStep(btn.dataset.step));
    });
    if (el.priceUp) el.priceUp.addEventListener('click', () => adjustPrice(state.priceStep));
    if (el.priceDown) el.priceDown.addEventListener('click', () => adjustPrice(-state.priceStep));
    if (el.livePriceUp) el.livePriceUp.addEventListener('click', () => adjustPrice(state.priceStep));
    if (el.livePriceDown) el.livePriceDown.addEventListener('click', () => adjustPrice(-state.priceStep));

    if (el.startBtn) el.startBtn.addEventListener('click', startSimulation);
    if (el.restartBtn) el.restartBtn.addEventListener('click', resetDay);
    if (el.pauseBtn) el.pauseBtn.addEventListener('click', togglePause);
    if (el.skipBtn) el.skipBtn.addEventListener('click', skipToEnd);
    if (el.maxInfoBtn) el.maxInfoBtn.addEventListener('click', openMaxInfoModal);
    if (el.maxInfoClose) el.maxInfoClose.addEventListener('click', closeMaxInfoModal);
    if (el.maxInfoBackdrop) el.maxInfoBackdrop.addEventListener('click', closeMaxInfoModal);
    if (el.legendBtns) el.legendBtns.forEach((btn) => {
      btn.addEventListener('click', () => openLegendModal(btn.dataset.profile));
    });
    if (el.eventContinue) el.eventContinue.addEventListener('click', closeEventOverlay);
    if (el.legendClose) el.legendClose.addEventListener('click', closeLegendModal);
    if (el.legendBackdrop) el.legendBackdrop.addEventListener('click', closeLegendModal);
    // Fallback por si el botón se re-renderiza o el listener se pierde
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('#od-pause');
      if (!btn || btn === el.pauseBtn) return;
      ev.preventDefault();
      togglePause();
    });
  }

  bindEvents();
  resetDay();
})();



