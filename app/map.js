/* =====================================================
   map.js - Mapa tipo campana (SVG data-driven)
   - 18 nodos numerados, camino generado desde puntos
   - Cada nodo enlaza a clase.html?nivel=X
   ===================================================== */

const CLASS_NODE_BY_ID = { ahorro: 10, deuda: 11, emprendimiento: 13 };

(() => {
  'use strict';

  const svg = document.getElementById('campaign-map');
  if (!svg) return;

  const XLINK = 'http://www.w3.org/1999/xlink';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const INSTRUCCIONES_URL = '/app/assets/instrucciones.avif';
  const IS_LOCAL_STATIC = window.location.protocol === 'file:';
  const LOCKED_MAX_LEVEL = 5;
  const DEFAULT_CURRENT_LEVEL = 10;
  let instructionsPreloaded = false;

  const POINTS = [
    [80, 520], [260, 460], [440, 500], [620, 520], [800, 480], [950, 400],
    [730, 330], [550, 310], [400, 400], [240, 300], [100, 250], [90, 130],
    [170, 60], [360, 100], [430, 230], [570, 140], [800, 190], [960, 50]
  ];

  const nodeRefs = [];
  const routeLayer = svg.querySelector('#route-layer');
  const dotsLayer = svg.querySelector('#route-dots');
  const nodesLayer = svg.querySelector('#nodes-layer');
  const avatarLayer = svg.querySelector('#avatar-layer');

  function preloadInstrucciones() {
    if (instructionsPreloaded) return;
    instructionsPreloaded = true;

    const img = new Image();
    img.decoding = 'async';
    img.src = INSTRUCCIONES_URL;

    if (img.decode) img.decode().catch(() => {});
  }

  function pointsToSmoothBezier(points, tension = 0.5) {
    if (!points || points.length < 2) return '';
    const p = points.map(([x, y]) => ({ x, y }));
    const at = (i) => p[Math.max(0, Math.min(p.length - 1, i))];

    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = at(i - 1);
      const p1 = at(i);
      const p2 = at(i + 1);
      const p3 = at(i + 2);

      const c1x = p1.x + (p2.x - p0.x) * (tension / 6);
      const c1y = p1.y + (p2.y - p0.y) * (tension / 6);
      const c2x = p2.x - (p3.x - p1.x) * (tension / 6);
      const c2y = p2.y - (p3.y - p1.y) * (tension / 6);

      d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  function createRoute() {
    const route = document.createElementNS(SVG_NS, 'path');
    route.setAttribute('class', 'route');
    route.setAttribute('d', pointsToSmoothBezier(POINTS, 0.55));
    routeLayer.appendChild(route);

    if (!dotsLayer) return;

    const total = route.getTotalLength();
    const DOT_STEP = 26;
    const DOT_R = 5.5;

    for (let s = 0; s <= total; s += DOT_STEP) {
      const { x, y } = route.getPointAtLength(s);
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'route-dot');
      dot.setAttribute('cx', x.toFixed(2));
      dot.setAttribute('cy', y.toFixed(2));
      dot.setAttribute('r', DOT_R);
      dotsLayer.appendChild(dot);
    }
  }

  function createNodes() {
    POINTS.forEach(([x, y], idx) => {
      const i = idx + 1;
      const g = document.createElementNS(SVG_NS, 'a');
      g.setAttribute('class', 'node state--locked');
      g.setAttribute('tabindex', '-1');
      g.setAttribute('aria-disabled', 'true');
      g.setAttribute('aria-label', `Nivel ${i}`);
      g.setAttribute('transform', `translate(${x} ${y})`);
      g.setAttribute('data-node-available', 'false');

      const halo = document.createElementNS(SVG_NS, 'circle');
      halo.setAttribute('class', 'halo');
      halo.setAttribute('r', '28');

      const glow = document.createElementNS(SVG_NS, 'circle');
      glow.setAttribute('class', 'node-glow');
      glow.setAttribute('r', '26');
      glow.setAttribute('fill', 'url(#haloGrad)');

      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('class', 'dot node-dot');
      c.setAttribute('r', '20');

      const label = document.createElementNS(SVG_NS, 'text');
      label.setAttribute('class', 'label');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'central');
      label.setAttribute('y', '1');
      label.textContent = i;

      g.appendChild(halo);
      g.appendChild(glow);
      g.appendChild(c);
      g.appendChild(label);
      nodesLayer.appendChild(g);
      nodeRefs[i] = g;

      g.addEventListener('mouseenter', preloadInstrucciones, { passive: true });
      g.addEventListener('touchstart', preloadInstrucciones, { passive: true });
      g.addEventListener('click', (ev) => {
        const isAvailable = g.getAttribute('data-node-available') === 'true';
        if (!isAvailable) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }

        preloadInstrucciones();

        const href = g.getAttribute('href') || g.getAttributeNS(XLINK, 'href');
        if (!href) return;

        ev.preventDefault();
        setTimeout(() => { window.location.href = href; }, 120);
      });
    });
  }

  function renderAvatar(level) {
    if (!avatarLayer || !POINTS[level - 1]) return;

    while (avatarLayer.firstChild) avatarLayer.removeChild(avatarLayer.firstChild);

    const [ax, ay] = POINTS[level - 1];
    const W = 128;
    const H = 128;
    const HALO = 5;
    const GAP = -20;
    const OFFSET_X = 24;

    const img = document.createElementNS(SVG_NS, 'image');
    img.setAttribute('class', 'avatar');
    img.setAttribute('width', W);
    img.setAttribute('height', H);
    img.setAttribute('x', ax - W / 2 + OFFSET_X);
    img.setAttribute('y', ay - (HALO + GAP + H));
    img.setAttribute('href', '../assets/images/adamis_explorador.png');
    img.setAttributeNS(XLINK, 'xlink:href', '../assets/images/adamis_explorador.png');
    avatarLayer.appendChild(img);
  }

  function isLevelCompleted(level) {
    try {
      return localStorage.getItem(`class_completed_${level}`) === 'true';
    } catch (_) {
      return false;
    }
  }

  function getSortedConfiguredLevels(byNumero) {
    return Array.from(byNumero.keys())
      .filter((level) => Number.isFinite(level))
      .sort((a, b) => a - b);
  }

  function computeCurrentLevel(byNumero) {
    const levels = getSortedConfiguredLevels(byNumero);
    if (!levels.length) return DEFAULT_CURRENT_LEVEL;

    for (const level of levels) {
      const info = byNumero.get(level);
      if (!info || !info.activa) continue;
      if (!isLevelCompleted(level)) return level;
    }

    for (let idx = levels.length - 1; idx >= 0; idx--) {
      const level = levels[idx];
      const info = byNumero.get(level);
      if (info && info.activa) return level;
    }

    return levels[0];
  }

  function getNodeState(level, currentLevel) {
    if (level <= LOCKED_MAX_LEVEL) return 'state--locked';
    if (level < currentLevel) return 'state--done';
    if (level === currentLevel) return 'state--current';
    return 'state--locked';
  }

  function buildConfigFromWindow() {
    if (!window.CONFIG_CLASES || !Array.isArray(window.CONFIG_CLASES.clases)) {
      return new Map();
    }

    return new Map(
      window.CONFIG_CLASES.clases
        .filter((item) => Number.isFinite(Number(item?.numero)) && item?.id)
        .map((item) => [
          Number(item.numero),
          { id: String(item.id).toLowerCase(), activa: !!item.activa }
        ])
    );
  }

  async function loadConfig() {
    if (IS_LOCAL_STATIC) {
      const localConfig = buildConfigFromWindow();
      if (localConfig.size) return localConfig;
    }

    try {
      const res = await fetch('../clases/sets.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo leer sets.json');

      const cfg = await res.json();
      const boolById = new Map();
      const classIds = new Set();

      if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
        Object.entries(cfg).forEach(([key, value]) => {
          const normalizedKey = String(key || '').trim().toLowerCase();
          if (!normalizedKey) return;

          if (normalizedKey.startsWith('bool_')) {
            boolById.set(normalizedKey.slice(5), !!value);
            return;
          }

          classIds.add(normalizedKey);
        });
      }

      return new Map(
        Object.entries(CLASS_NODE_BY_ID)
          .filter(([id]) => classIds.has(id))
          .map(([id, numero]) => [Number(numero), { id, activa: boolById.get(id) !== false }])
      );
    } catch (e) {
      console.warn('[map-config]', e);
      return buildConfigFromWindow();
    }
  }

  function applyConfigToNodes(byNumero) {
    const configuredLevels = getSortedConfiguredLevels(byNumero);
    const localPreviewLevel = configuredLevels.find((level) => level > LOCKED_MAX_LEVEL) || DEFAULT_CURRENT_LEVEL;
    const currentLevel = IS_LOCAL_STATIC ? localPreviewLevel : computeCurrentLevel(byNumero);
    renderAvatar(currentLevel);

    for (let i = 1; i <= POINTS.length; i++) {
      const g = nodeRefs[i];
      if (!g) continue;

      const info = byNumero.get(i) || null;
      const stateClass = IS_LOCAL_STATIC
        ? (info && info.id && i > LOCKED_MAX_LEVEL ? (i === currentLevel ? 'state--current' : 'state--done') : 'state--locked')
        : getNodeState(i, currentLevel);
      const isActiveSet = !!(info && info.activa);
      const isAvailable = IS_LOCAL_STATIC
        ? Boolean(info && info.id && i > LOCKED_MAX_LEVEL)
        : Boolean(info && info.id && isActiveSet && stateClass !== 'state--locked' && i > LOCKED_MAX_LEVEL);

      g.setAttribute('class', `node ${stateClass}`);
      g.setAttribute('data-clase-id', info?.id || '');
      g.setAttribute('data-clase-active', isAvailable || (isActiveSet && stateClass !== 'state--locked') ? 'true' : 'false');
      g.setAttribute('data-node-available', isAvailable ? 'true' : 'false');
      g.setAttribute('aria-label', info?.id ? `Nivel ${i} - ${info.id}` : `Nivel ${i}`);
      g.setAttribute('tabindex', isAvailable ? '0' : '-1');

      if (isAvailable) {
        g.removeAttribute('aria-disabled');
        g.setAttribute('href', `./clase.html?clase=${encodeURIComponent(info.id)}`);
        g.setAttributeNS(XLINK, 'xlink:href', `./clase.html?clase=${encodeURIComponent(info.id)}`);
      } else {
        g.setAttribute('aria-disabled', 'true');
        g.removeAttribute('href');
        g.removeAttribute('xlink:href');
        g.removeAttributeNS(XLINK, 'href');
      }
    }
  }

  createRoute();
  createNodes();
  loadConfig().then(applyConfigToNodes);
})();
