(() => {
    const measurementId = 'G-7R6D1PV4LV';
    const disableAnalytics = `ga-disable-${measurementId}`;
    const preferenceKey = 'adamis-analytics-consent-v1';
    const lifetimeSeconds = 365 * 24 * 60 * 60;
    const denied = {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    };
    const granted = { ...denied, analytics_storage: 'granted' };

    let tag;
    let tagLoaded = false;
    let configured = false;
    let preference;
    let temporaryPreference;
    let expiryTimer;
    let opener;

    function readPreference() {
        let saved = temporaryPreference;
        try {
            saved ??= JSON.parse(localStorage.getItem(preferenceKey));
        } catch {
            // Without local storage, an explicit choice applies to this page only.
        }
        return typeof saved?.analytics === 'boolean' && Number.isFinite(saved.expiresAt) && saved.expiresAt > Date.now()
            ? saved
            : null;
    }

    function configureAnalytics() {
        if (!tagLoaded || configured || window[disableAnalytics]) return;

        configured = true;
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            cookie_domain: 'none',
            cookie_expires: lifetimeSeconds,
            cookie_flags: 'SameSite=Lax;Secure',
            cookie_update: false
        });
    }

    function applyAnalytics(enabled) {
        window[disableAnalytics] = !enabled;

        if (!enabled) {
            if (tag) window.gtag('consent', 'update', denied);
            const secure = location.protocol === 'https:' ? '; Secure' : '';
            for (const name of ['_ga', `_ga_${measurementId.slice(2)}`]) {
                document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
            }
            return;
        }

        if (tag) {
            window.gtag('consent', 'update', granted);
            configureAnalytics();
            return;
        }

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', denied);
        window.gtag('consent', 'update', granted);

        tag = document.createElement('script');
        tag.async = true;
        tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        tag.addEventListener('load', () => {
            tagLoaded = true;
            // A withdrawal while gtag.js is downloading must prevent configuration.
            configureAnalytics();
        }, { once: true });
        document.head.append(tag);
    }

    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const copy = english ? {
        title: 'Analytics cookies',
        description: 'With your permission, we use Google Analytics cookies to understand how visitors find and use this website. You can change your choice at any time.',
        policy: 'Cookie policy (Spanish)',
        reject: 'Reject analytics',
        accept: 'Accept analytics'
    } : {
        title: 'Cookies analíticas',
        description: 'Con tu permiso, usamos cookies de Google Analytics para saber cómo llegan los visitantes a la web y cómo la utilizan. Puedes cambiar tu elección en cualquier momento.',
        policy: 'Política de cookies',
        reject: 'Rechazar analíticas',
        accept: 'Aceptar analíticas'
    };

    const banner = document.createElement('section');
    banner.className = 'cookie-consent';
    banner.setAttribute('aria-labelledby', 'cookie-consent-title');
    banner.hidden = true;
    banner.innerHTML = `
        <h2 id="cookie-consent-title" tabindex="-1">${copy.title}</h2>
        <p>${copy.description} <a href="/politica-cookies/" hreflang="es">${copy.policy}</a></p>
        <div class="cookie-consent-actions">
            <button type="button" data-analytics-choice="deny">${copy.reject}</button>
            <button type="button" data-analytics-choice="grant">${copy.accept}</button>
        </div>`;
    document.body.prepend(banner);

    function syncPreference() {
        const previous = preference;
        preference = readPreference();
        if (previous?.analytics !== preference?.analytics || previous === undefined) {
            applyAnalytics(preference?.analytics === true);
        }

        clearTimeout(expiryTimer);
        if (preference) {
            // A browser timeout cannot represent the full lifetime in one call.
            expiryTimer = setTimeout(syncPreference, Math.min(preference.expiresAt - Date.now(), 2147483647));
        }
        if (!opener) banner.hidden = preference !== null;
    }

    function closePreferences() {
        banner.hidden = true;
        opener?.focus({ preventScroll: true });
        opener = undefined;
    }

    banner.querySelectorAll('[data-analytics-choice]').forEach((button) => {
        button.addEventListener('click', () => {
            const choice = {
                analytics: button.dataset.analyticsChoice === 'grant',
                expiresAt: Date.now() + lifetimeSeconds * 1000
            };
            try {
                localStorage.setItem(preferenceKey, JSON.stringify(choice));
                temporaryPreference = undefined;
            } catch {
                temporaryPreference = choice;
            }
            syncPreference();
            closePreferences();
        });
    });

    document.querySelectorAll('[data-cookie-preferences]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            opener = link;
            banner.hidden = false;
            banner.querySelector('h2').focus({ preventScroll: true });
        });
    });
    banner.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && opener && preference) closePreferences();
    });

    window.addEventListener('storage', (event) => {
        if (event.key === preferenceKey || event.key === null) syncPreference();
    });
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) syncPreference();
    });
    syncPreference();
})();
