/* =====================================================
   map.js — Mapa tipo campaña (SVG data-driven)
   - 18 nodos numerados, camino generado desde puntos
   - Cada nodo enlaza a clase.html?nivel=X
   - Ajusta posiciones en 'POINTS' si quieres otra ruta
   ===================================================== */

const CURRENT_LEVEL = 7; // <--- cámbialo dinámicamente según tu lógica

(() => {
  'use strict';

  const svg = document.getElementById('campaign-map');
  if (!svg) return;

    // ===== Precarga de assets críticos (instrucciones) =====
  const INSTRUCCIONES_URL = "../assets/images/instrucciones.avif";

  let __preloaded = false;

  function preloadInstrucciones() {
    if (__preloaded) return;
    __preloaded = true;

    const img = new Image();
    img.decoding = "async";
    img.src = INSTRUCCIONES_URL;

    // (opcional) fuerza decode si el navegador lo soporta
    if (img.decode) {
      img.decode().catch(() => {});
    }
  }


  // ---- PUNTOS (viewBox 1000 x 600) ----
  // Ajusta libremente estas coordenadas (x,y). 18 nodos.
  const POINTS = [
    [  80, 520],[260, 460],[440, 500],[620, 520],[800, 480],[950, 400],
    [ 730, 330],[550, 310],[400, 400],[240, 300],[100, 250],[90, 130],
    [ 170, 60],[360, 100],[430, 230],[570, 140],[800, 190],[960, 50]
  ];

  // Convierte una polilínea de puntos en un path suave (Catmull-Rom -> Bezier)
  // tension: 0.0 (muy rígido) ... 1.0 (muy curvo). Recomendado 0.45–0.6
  function pointsToSmoothBezier(points, tension = 0.5) {
    if (!points || points.length < 2) return '';
    const p = points.map(([x, y]) => ({ x, y }));

    // helper para punto en índice (con clamp a extremos)
    const at = (i) => p[Math.max(0, Math.min(p.length - 1, i))];

    let d = `M ${p[0].x},${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = at(i - 1);
      const p1 = at(i);
      const p2 = at(i + 1);
      const p3 = at(i + 2);

      // Catmull-Rom to Bezier control points
      const c1x = p1.x + (p2.x - p0.x) * (tension / 6);
      const c1y = p1.y + (p2.y - p0.y) * (tension / 6);
      const c2x = p2.x - (p3.x - p1.x) * (tension / 6);
      const c2y = p2.y - (p3.y - p1.y) * (tension / 6);

      d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  // ------ Dibujo de ruta curva y puntos decorativos ------
  const route = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  route.setAttribute('class', 'route');

  /* Curvatura del camino:
     - 0.45–0.60 = suave y natural
     - sube si quieres curvas más marcadas
  */
  const TENSION = 0.55;
  route.setAttribute('d', pointsToSmoothBezier(POINTS, TENSION));

  svg.querySelector('#route-layer').appendChild(route);

  // === Generar puntos dorados a lo largo del camino ===
  const dotsLayer = svg.querySelector('#route-dots');
  if (route && dotsLayer) {
    const total = route.getTotalLength();

    // Ajustes de densidad/tamaño del punto
    const DOT_STEP = 26;   // distancia entre puntos (px sobre el path)
    const DOT_R    = 5.5;  // radio del punto

    for (let s = 0; s <= total; s += DOT_STEP) {
      const { x, y } = route.getPointAtLength(s);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'route-dot');
      dot.setAttribute('cx', x.toFixed(2));
      dot.setAttribute('cy', y.toFixed(2));
      dot.setAttribute('r', DOT_R);
      dotsLayer.appendChild(dot);
    }
  }

  // ---- NODOS ----
  const nodesLayer = svg.querySelector('#nodes-layer');

  // Precreamos los nodos 1..N (como ya hacías) y luego les aplicamos la config JSON
  const nodeRefs = []; // guardamos referencia a cada <a.node> por nivel

  POINTS.forEach(([x, y], idx) => {
    const i = idx + 1; // nivel 1..18

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'a');
    g.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `./clase.html?nivel=${i}`);
    let stateClass = 'state--locked';
    if (i < CURRENT_LEVEL) stateClass = 'state--done';
    if (i === CURRENT_LEVEL) stateClass = 'state--current';
    g.setAttribute('class', `node ${stateClass}`);
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', `Nivel ${i}`);
    g.setAttribute('transform', `translate(${x} ${y})`);

    // halo de tu estilo
    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    halo.setAttribute('class', 'halo');
    halo.setAttribute('r', '28');

    // (NUEVO) halo "glow" dorado que podemos mostrar/ocultar por CSS
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('class', 'node-glow');     // <- usado por tu CSS de dorado
    glow.setAttribute('r', '26');
    glow.setAttribute('fill', 'url(#haloGrad)'); // gradiente ya definido en el SVG

    // círculo principal (cristal) — añadimos .node-dot para dorado
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('class', 'dot node-dot'); // <- añadida .node-dot para tus estilos
    c.setAttribute('r', '20');

    // etiqueta con el número del nivel (1..18)
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'label');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'central');
    label.setAttribute('y', '1'); // micro-ajuste
    label.textContent = i;

    // orden: halo base, glow (debajo del dot), dot, label
    g.appendChild(halo);
    g.appendChild(glow);
    g.appendChild(c);
    g.appendChild(label);
    nodesLayer.appendChild(g);

    nodeRefs[i] = g; // guarda referencia por número

        // Precarga cuando el usuario muestra intención de entrar
    g.addEventListener("mouseenter", preloadInstrucciones, { passive: true });
    g.addEventListener("focus", preloadInstrucciones, { passive: true });      // teclado
    g.addEventListener("touchstart", preloadInstrucciones, { passive: true }); // móvil
    g.addEventListener("pointerdown", preloadInstrucciones, { passive: true }); // general

        g.addEventListener("click", (ev) => {
      // inicia precarga sí o sí
      preloadInstrucciones();

      // deja que el navegador navegue, pero con un pequeño margen
      // (esto reduce muchísimo el "flash" al entrar a clase)
      const href = g.getAttribute("href") || g.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href) return;

      ev.preventDefault();
      setTimeout(() => { window.location.href = href; }, 120);
    });


  });

  // === Avatar sobre el nivel actual ===
  const avatarLayer = svg.querySelector('#avatar-layer');
  if (avatarLayer && CURRENT_LEVEL >= 1 && CURRENT_LEVEL <= POINTS.length) {
    const svgns = 'http://www.w3.org/2000/svg';
    const XLINK = 'http://www.w3.org/1999/xlink';
    const [ax, ay] = POINTS[CURRENT_LEVEL - 1];

    // Tamaño del avatar y offsets para colocarlo justo encima del nodo
    const W = 128;        // ancho del avatar
    const H = 128;        // alto del avatar
    const HALO = 5;       // radio del halo (coincide con .halo r=28)
    const GAP = -20;      // pequeña separación respecto al halo
    const OFFSET_X = 24;

    const img = document.createElementNS(svgns, 'image');
    img.setAttribute('class', 'avatar');
    img.setAttribute('width', W);
    img.setAttribute('height', H);

    // colocación: centrado en X, justo por encima del halo
    img.setAttribute('x', ax - W / 2 + OFFSET_X);
    img.setAttribute('y', ay - (HALO + GAP + H));

    // compat: href y xlink:href
    img.setAttribute('href', '../assets/images/adamis_explorador.png');
    img.setAttributeNS(XLINK, 'xlink:href', '../assets/images/adamis_explorador.png');

    avatarLayer.appendChild(img);
  }

  // ======= Cargar configuración y aplicarla a los nodos =======
  // Estructura esperada de data/config_clases.json:
  // {
  //   "clases": [
  //     { "id": "ahorro", "numero": 1, "activa": true },
  //     { "id": "deuda",  "numero": 2, "activa": false }
  //   ]
  // }
  // === Sustituye en map.js ===

  // 1) Lee de window.CONFIG_CLASES si existe (offline). Si no, intenta fetch (por si usas servidor).
  async function loadConfig() {
    // Opción A (sin servidor): viene del <script src="./data/config_clases.js">
    if (window.CONFIG_CLASES && Array.isArray(window.CONFIG_CLASES.clases)) {
      const arr = window.CONFIG_CLASES.clases;
      return new Map(arr
        .filter(x => Number.isFinite(x.numero))
        .map(x => [Number(x.numero), { id: String(x.id || '').toLowerCase(), activa: !!x.activa }]));
    }

    // Opción B (con servidor): intenta fetch al .json
    try {
      const res = await fetch('./data/config_clases.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo leer config_clases.json');
      const cfg = await res.json();
      const arr = Array.isArray(cfg?.clases) ? cfg.clases : [];
      return new Map(arr
        .filter(x => Number.isFinite(x.numero))
        .map(x => [Number(x.numero), { id: String(x.id || '').toLowerCase(), activa: !!x.activa }]));
    } catch (e) {
      console.warn('[map-config]', e);
      return new Map();
    }
  }

  // 2) Aplica la configuración a los nodos (atributos + link)
  function applyConfigToNodes(byNumero) {
    for (let i = 1; i <= POINTS.length; i++) {
      const g = nodeRefs[i];
      if (!g) continue;

      const info = byNumero.get(i);
      if (!info) continue;

      // Atributos para el CSS del dorado
      if (info.id) g.setAttribute('data-clase-id', info.id);
      g.setAttribute('data-clase-active', info.activa ? 'true' : 'false');

      // Si hay id de clase, el href salta a clase.html?clase=<id>
      if (info.id) {
        g.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `./clase.html?clase=${encodeURIComponent(info.id)}`);
        // (opcional) aria-label más descriptivo
        g.setAttribute('aria-label', `Nivel ${i} — ${info.id}`);
      }
    }
  }

  // Llama igual que antes:
  loadConfig().then(applyConfigToNodes);


})();
