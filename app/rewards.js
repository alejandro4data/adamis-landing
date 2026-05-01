(function () {
  'use strict';

  var CLAIMS_KEY = 'adamisRewardClaims';

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

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function formatDate(date) {
    return [
      date.getFullYear(),
      pad2(date.getMonth() + 1),
      pad2(date.getDate())
    ].join('-');
  }

  function getWeekKey(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getUTCFullYear() + '-W' + pad2(week);
  }

  function periodKey(frequency, now) {
    var date = now || new Date();
    var freq = String(frequency || 'once').toLowerCase();
    if (freq === 'daily') return formatDate(date);
    if (freq === 'weekly') return getWeekKey(date);
    if (freq === 'monthly') return date.getFullYear() + '-' + pad2(date.getMonth() + 1);
    return 'once';
  }

  function getActorId() {
    if (window.UserState && typeof window.UserState.getCurrentUser === 'function') {
      var user = window.UserState.getCurrentUser();
      if (user && user !== 'invitado') return user;
    }
    if (window.AdamisEvents && typeof window.AdamisEvents.ensureStudentId === 'function') {
      return window.AdamisEvents.ensureStudentId();
    }
    return 'invitado';
  }

  function getCoins() {
    var user = getActorId();
    if (window.UserState && typeof window.UserState.getCoins === 'function') {
      return window.UserState.getCoins(user);
    }
    return 0;
  }

  function setCoins(value) {
    var user = getActorId();
    if (window.UserState && typeof window.UserState.setCoins === 'function') {
      return window.UserState.setCoins(user, value);
    }
    return value;
  }

  function getClaims() {
    var all = readJSON(CLAIMS_KEY, {});
    return all && typeof all === 'object' ? all : {};
  }

  function saveClaims(claims) {
    writeJSON(CLAIMS_KEY, claims || {});
  }

  function claim(options) {
    var opts = options || {};
    var activityId = String(opts.activityId || opts.id || '').trim();
    var amount = Number(opts.amount || opts.coins || 0);
    var frequency = String(opts.frequency || 'once').toLowerCase();
    var period = String(opts.periodKey || periodKey(frequency));
    var actorId = getActorId();

    if (!activityId || !Number.isFinite(amount) || amount <= 0) {
      return { claimed: false, coins: getCoins(), reason: 'invalid_reward' };
    }

    var claims = getClaims();
    var claimId = actorId + ':' + activityId + ':' + period;
    var alreadyClaimed = !!claims[claimId];

    if (window.AdamisEvents && typeof window.AdamisEvents.track === 'function') {
      window.AdamisEvents.track('activity_completed', {
        activity_id: activityId,
        frequency: frequency,
        period_key: period,
        reward_amount: amount,
        reward_claimed: !alreadyClaimed,
        score: opts.score == null ? null : opts.score,
        meta: opts.meta || null
      });
    }

    if (alreadyClaimed) {
      return { claimed: false, coins: getCoins(), reason: 'already_claimed', claimId: claimId };
    }

    var nextCoins = setCoins(getCoins() + amount);
    claims[claimId] = {
      activity_id: activityId,
      amount: amount,
      frequency: frequency,
      period_key: period,
      claimed_at: new Date().toISOString()
    };
    saveClaims(claims);

    if (window.CoinsUI && typeof window.CoinsUI.updateAll === 'function') {
      window.CoinsUI.updateAll();
    }

    try {
      window.dispatchEvent(new CustomEvent('adamis:reward-claimed', {
        detail: { activityId: activityId, amount: amount, coins: nextCoins, claimId: claimId }
      }));
    } catch (_) {}

    if (window.AdamisEvents && typeof window.AdamisEvents.track === 'function') {
      window.AdamisEvents.track('coins_awarded', {
        activity_id: activityId,
        amount: amount,
        period_key: period,
        balance_after: nextCoins,
        claim_id: claimId
      }, { idempotencyKey: 'coins:' + claimId });
    }

    return { claimed: true, coins: nextCoins, claimId: claimId };
  }

  window.AdamisRewards = {
    claim: claim,
    periodKey: periodKey,
    getClaims: getClaims
  };
})();
