(function () {
  'use strict';

  var QUEUE_KEY = 'adamisEventQueue';
  var META_KEY = 'adamisEventQueueMeta';
  var STUDENT_KEY = 'adamis_student_uuid';
  var ENDPOINT = '/api/events';
  var MAX_QUEUE = 300;
  var BATCH_SIZE = 10;
  var FLUSH_DELAY_MS = 3500;
  var REQUEST_TIMEOUT_MS = 3500;
  var MIN_RETRY_MS = 30000;
  var MAX_RETRY_MS = 300000;
  var flushing = false;
  var flushTimer = 0;

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function ensureStudentId() {
    var id = '';
    try { id = sessionStorage.getItem('student_uuid') || ''; } catch (_) {}
    if (id) return id;

    try { id = localStorage.getItem(STUDENT_KEY) || ''; } catch (_) {}
    if (!id) {
      id = uuid();
      try { localStorage.setItem(STUDENT_KEY, id); } catch (_) {}
    }

    try { sessionStorage.setItem('student_uuid', id); } catch (_) {}
    return id;
  }

  function getSessionData() {
    var sessionUuid = null;
    var centro = null;
    var role = null;
    var currentUser = null;

    try {
      sessionUuid = sessionStorage.getItem('session_uuid') || null;
      centro = sessionStorage.getItem('centro') || null;
      role = sessionStorage.getItem('access_role') || null;
    } catch (_) {}
    try {
      if (window.UserState && typeof window.UserState.getCurrentUser === 'function') {
        currentUser = window.UserState.getCurrentUser();
      }
    } catch (_) {}

    return {
      session_uuid: sessionUuid,
      student_uuid: ensureStudentId(),
      current_user: currentUser,
      centro: centro,
      role: role
    };
  }

  function getQueue() {
    var list = readJSON(QUEUE_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function setQueue(list) {
    var safe = Array.isArray(list) ? list.slice(-MAX_QUEUE) : [];
    writeJSON(QUEUE_KEY, safe);
    return safe;
  }

  function getMeta() {
    var meta = readJSON(META_KEY, {});
    return meta && typeof meta === 'object' ? meta : {};
  }

  function setMeta(meta) {
    writeJSON(META_KEY, meta || {});
  }

  function getNextAttemptAt() {
    var meta = getMeta();
    var value = Number(meta.nextAttemptAt || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function markFlushOk() {
    setMeta({ failCount: 0, nextAttemptAt: 0 });
  }

  function markFlushFailed() {
    var meta = getMeta();
    var failCount = Math.min(8, Number(meta.failCount || 0) + 1);
    var delay = Math.min(MAX_RETRY_MS, MIN_RETRY_MS * Math.pow(2, failCount - 1));
    setMeta({
      failCount: failCount,
      nextAttemptAt: Date.now() + delay
    });
  }

  function removeQueued(ids) {
    if (!ids || !ids.length) return;
    var idSet = new Set(ids);
    setQueue(getQueue().filter(function (event) {
      return !idSet.has(event && event.id);
    }));
  }

  function enqueue(event) {
    var list = getQueue();
    if (list.some(function (item) { return item && item.id === event.id; })) return;
    list.push(event);
    setQueue(list);
    try {
      window.dispatchEvent(new CustomEvent('adamis:event-queued', { detail: event }));
    } catch (_) {}
  }

  function normalizePayload(payload) {
    if (!payload || typeof payload !== 'object') return {};
    try {
      return JSON.parse(JSON.stringify(payload));
    } catch (_) {
      return {};
    }
  }

  function track(type, payload, options) {
    var opts = options || {};
    var session = getSessionData();
    var now = new Date().toISOString();
    var id = String(opts.idempotencyKey || opts.id || uuid());
    var event = {
      id: id,
      type: String(type || 'event'),
      payload: normalizePayload(payload),
      session_uuid: session.session_uuid,
      student_uuid: session.student_uuid,
      current_user: session.current_user,
      centro: session.centro,
      role: session.role,
      path: window.location.pathname,
      created_at: now
    };

    enqueue(event);
    scheduleFlush();
    return id;
  }

  function postWithTimeout(batch, keepalive) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller
      ? window.setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS)
      : 0;

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
      keepalive: !!keepalive,
      signal: controller ? controller.signal : undefined
    }).finally(function () {
      if (timer) window.clearTimeout(timer);
    });
  }

  async function flush(options) {
    var opts = options || {};
    if (flushing || !navigator.onLine) return false;
    if (!opts.force && Date.now() < getNextAttemptAt()) return false;
    var events = getQueue();
    if (!events.length) return true;

    flushing = true;
    var batch = events.slice(0, BATCH_SIZE);

    try {
      var response = await postWithTimeout(batch, !!opts.keepalive);

      if (!response.ok) {
        markFlushFailed();
        return false;
      }
      removeQueued(batch.map(function (event) { return event.id; }));
      markFlushOk();
      return true;
    } catch (_) {
      markFlushFailed();
      return false;
    } finally {
      flushing = false;
    }
  }

  function runWhenIdle(fn) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(fn, { timeout: 2000 });
      return;
    }
    window.setTimeout(fn, 0);
  }

  function scheduleFlush(delay) {
    if (flushTimer) return;
    flushTimer = window.setTimeout(function () {
      flushTimer = 0;
      runWhenIdle(function () { flush(); });
    }, delay == null ? FLUSH_DELAY_MS : delay);
  }

  window.AdamisEvents = {
    track: track,
    flush: flush,
    scheduleFlush: scheduleFlush,
    getQueue: getQueue,
    getSessionData: getSessionData,
    ensureStudentId: ensureStudentId
  };

  window.addEventListener('online', function () { scheduleFlush(5000); });
})();
