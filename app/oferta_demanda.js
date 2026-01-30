// oferta_demanda.js - Simulador de heladeria (oferta y demanda)
(() => {
  'use strict';

  const root = document.getElementById('od-game');
  if (!root) return;

  const CONFIG = {
    initialMoney: 50,
    stockCost: 0.5,
    priceDefault: 2.5,
    priceMin: 0.5,
    priceMax: 6,
    priceStep: 0.25,
    simDuration: 60,
    dayStartHour: 8,
    dayHours: 12
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
      name: 'Naranja · Impulsivo',
      desc: 'Compra por impulso hasta $3.50. Si el precio es moderado y la fila fluye, decide rápido.',
      swatch: 'is-impulsive'
    },
    saver: {
      name: 'Azul · Ahorrador',
      desc: 'Caza precios bajos (tope $2.00). Subas bruscas o poco stock lo espantan al instante.',
      swatch: 'is-saver'
    },
    vip: {
      name: 'Púrpura · VIP',
      desc: 'Valora comodidad y calor: paga hasta $5.00 y compra más cuando hace buen tiempo.',
      swatch: 'is-vip'
    }
  };

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
    log: document.getElementById('od-log'),
    pauseBtn: document.getElementById('od-pause'),
    progressBar: document.getElementById('od-progress-bar'),
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
    sumFinal: document.getElementById('od-sum-final'),
    wasteNote: document.getElementById('od-waste-note'),
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
    stockSelected: 0,
    stock: 0,
    cash: CONFIG.initialMoney,
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
    stats: null
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const formatMoney = (value) => `$${value.toFixed(2)}`;
  const pad2 = (value) => String(value).padStart(2, '0');

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

  function adjustPrice(delta){
    state.price = clamp(state.price + delta, CONFIG.priceMin, CONFIG.priceMax);
    state.price = Math.round(state.price * 100) / 100;
    updatePriceDisplays();
  }

  function updateStockUI(){
    const units = state.stockSelected;
    const cost = units * CONFIG.stockCost;
    const remaining = CONFIG.initialMoney - cost;

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
    min = min / demandFactor;
    max = max / demandFactor;

    if (state.weather.temp >= 28){
      min *= 0.85;
      max *= 0.85;
    }

    return min + Math.random() * (max - min);
  }

  function pickClientType(){
    let saver = 0.45;
    let impulsive = 0.35;
    let vip = 0.2;

    if (state.weather && state.weather.temp >= 28){
      vip += 0.1;
      saver -= 0.05;
      impulsive -= 0.05;
    }

    const roll = Math.random();
    if (roll < saver) return CLIENT_TYPES.saver;
    if (roll < saver + impulsive) return CLIENT_TYPES.impulsive;
    return CLIENT_TYPES.vip;
  }

  function computeWtp(client){
    const bonusHeat = Math.max(0, (state.weather?.temp || 20) - 20) * 0.1;
    const multiplier = state.weather?.multiplier || 1;
    return (client.baseBudget + bonusHeat) * multiplier;
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
    bubble.textContent = outcome === 'buy' ? 'Compra' : outcome === 'price' ? 'Muy caro' : 'Sin stock';
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

  function evaluateClient(target, client, elapsedSec){
    if (!state.running || state.paused) return;
    const wtp = computeWtp(client);
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

  function startSimulation(){
    if (state.stockSelected <= 0) return;
    stopSimulation();

    state.running = true;
    state.paused = false;
    state.elapsed = 0;
    state.stock = state.stockSelected;
    state.cash = CONFIG.initialMoney - state.stockSelected * CONFIG.stockCost;
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
      }))
    };

    setScreen('sim');
    state.simStart = performance.now();
    updateHud(0);
    if (el.log) el.log.textContent = 'Empieza la jornada. Ajusta el precio.';
    if (el.pauseBtn) el.pauseBtn.textContent = 'Pausar';
    root.classList.remove('is-paused');

    state.simTimer = setInterval(() => {
      const elapsedSec = getElapsedSec();
      updateHud(elapsedSec);
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
    const finalMoney = CONFIG.initialMoney - expense + state.revenue;
    const profit = finalMoney - CONFIG.initialMoney;

    if (el.resultTitle){
      el.resultTitle.textContent = profit >= 0 ? 'Ganancia neta' : 'Perdida neta';
    }
    if (el.resultAmount) el.resultAmount.textContent = formatMoney(finalMoney);
    if (el.resultSub){
      el.resultSub.textContent = profit >= 0
        ? `Ganaste ${formatMoney(profit)} al final del dia.`
        : `Perdiste ${formatMoney(Math.abs(profit))} al final del dia.`;
    }

    if (el.sumInitial) el.sumInitial.textContent = formatMoney(CONFIG.initialMoney);
    if (el.sumExpense) el.sumExpense.textContent = formatMoney(expense);
    if (el.sumRevenue) el.sumRevenue.textContent = formatMoney(state.revenue);
    if (el.sumFinal) el.sumFinal.textContent = formatMoney(finalMoney);

    if (el.wasteNote){
      if (state.stock > 0){
        el.wasteNote.textContent = `Merma: ${state.stock} helados sin vender.`;
      } else {
        el.wasteNote.textContent = 'Sin merma de stock.';
      }
    }

    updateFunnel();
    updateHourlyChart();

    setScreen('summary');
  }

  function resetDay(){
    stopSimulation();
    state.weather = pickWeather();
    state.price = CONFIG.priceDefault;
    state.stockSelected = 0;
    state.stock = 0;
    state.cash = CONFIG.initialMoney;
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
      }))
    };

    if (el.stockRange) el.stockRange.value = '0';
    if (el.initialMoney) el.initialMoney.textContent = formatMoney(CONFIG.initialMoney);
    if (el.log) el.log.textContent = 'Listo para abrir.';
    if (el.progressBar) el.progressBar.style.width = '0%';
    if (el.pauseBtn) el.pauseBtn.textContent = 'Pausar';
    root.classList.remove('is-paused');

    updatePriceDisplays();
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
    if (el.legendModalName) el.legendModalName.textContent = info.name;
    if (el.legendModalDesc) el.legendModalDesc.textContent = info.desc;
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
      el.stockRange.max = String(Math.floor(CONFIG.initialMoney / CONFIG.stockCost));
      el.stockRange.addEventListener('input', () => {
        state.stockSelected = Number(el.stockRange.value) || 0;
        updateStockUI();
      });
    }

    if (el.priceUp) el.priceUp.addEventListener('click', () => adjustPrice(CONFIG.priceStep));
    if (el.priceDown) el.priceDown.addEventListener('click', () => adjustPrice(-CONFIG.priceStep));
    if (el.livePriceUp) el.livePriceUp.addEventListener('click', () => adjustPrice(CONFIG.priceStep));
    if (el.livePriceDown) el.livePriceDown.addEventListener('click', () => adjustPrice(-CONFIG.priceStep));

    if (el.startBtn) el.startBtn.addEventListener('click', startSimulation);
    if (el.restartBtn) el.restartBtn.addEventListener('click', resetDay);
    if (el.pauseBtn) el.pauseBtn.addEventListener('click', togglePause);
    if (el.legendBtns) el.legendBtns.forEach((btn) => {
      btn.addEventListener('click', () => openLegendModal(btn.dataset.profile));
    });
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


