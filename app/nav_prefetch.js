(function () {
  'use strict';

  function clearLegacyServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(function (registrations) {
          registrations.forEach(function (registration) {
            registration.unregister();
          });
        })
        .catch(function () {});
    }

    if (window.caches && typeof window.caches.keys === 'function') {
      window.caches.keys()
        .then(function (keys) {
          keys
            .filter(function (key) { return key.indexOf('adamis-shell-') === 0; })
            .forEach(function (key) { window.caches.delete(key); });
        })
        .catch(function () {});
    }
  }

  clearLegacyServiceWorker();
})();
