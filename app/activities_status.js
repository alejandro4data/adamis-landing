(function () {
  'use strict';

  var PAGE = document.documentElement.getAttribute('data-page') || '';
  if (PAGE !== 'actividades') return;

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

  function statusText(frequency) {
    var tr = window.I18N && typeof window.I18N.tr === 'function'
      ? window.I18N.tr
      : function (value) { return String(value || ''); };
    var freq = String(frequency || '').toLowerCase();
    if (freq === 'daily') return tr('Completada hoy');
    if (freq === 'weekly') return tr('Completada esta semana');
    if (freq === 'monthly') return tr('Completada este mes');
    return tr('Recompensa reclamada');
  }

  function render() {
    if (!window.AdamisRewards || typeof window.AdamisRewards.getClaims !== 'function') return;
    var claims = window.AdamisRewards.getClaims();
    var actorId = getActorId();

    document.querySelectorAll('[data-activity-id]').forEach(function (card) {
      var activityId = card.dataset.activityId;
      var frequency = card.dataset.frequency || 'once';
      var period = window.AdamisRewards.periodKey(frequency);
      var claimId = actorId + ':' + activityId + ':' + period;
      var claimed = !!claims[claimId];

      card.classList.toggle('is-reward-claimed', claimed);
      var status = card.querySelector('.activity-status');
      if (!claimed) {
        if (status) status.remove();
        return;
      }
      if (!status) {
        status = document.createElement('span');
        status.className = 'activity-status';
        card.appendChild(status);
      }
      status.textContent = statusText(frequency);
    });
  }

  window.addEventListener('adamis:reward-claimed', render);
  document.addEventListener('i18n:change', render);
  window.addEventListener('DOMContentLoaded', render);
  render();
})();
