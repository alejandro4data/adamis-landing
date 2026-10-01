(() => {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    const english = document.documentElement.lang.startsWith('en');
    const home = english ? '/financial-education/' : '/';
    const otherLanguage = english ? 'es' : 'en';
    const alternate = document.querySelector(`link[rel="alternate"][hreflang="${otherLanguage}"]`);
    const languagePath = alternate ? new URL(alternate.href).pathname : english ? '/' : '/financial-education/';
    const links = english ? [
        ['/financial-education/why-it-matters/', 'Why it matters'],
        ['/financial-education/product/', 'Product'],
        ['/financial-education/workshops/', 'Workshops'],
        ['/financial-education/courses/', 'Programme'],
        ['/financial-education/impact/', 'Impact']
    ] : [
        ['/educacion-financiera/', 'Problema'], ['/producto/', 'Producto'],
        ['/talleres/', 'Talleres'], ['/programa/', 'Programa'], ['/impacto/', 'Impacto']
    ];
    const openLabel = english ? 'Open menu' : 'Abrir menú';
    const closeLabel = english ? 'Close menu' : 'Cerrar menú';
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
    // One template supplies the home, campaign, translated and legal pages.
    header.innerHTML = `
        <nav class="adamis-header-bar" aria-label="${english ? 'Main navigation' : 'Navegación principal'}">
            <a class="adamis-header-brand" href="${home}" aria-label="${english ? 'Go to the ADAMIS homepage' : 'Ir al inicio de ADAMIS'}">
                <img class="adamis-header-logo" src="/assets/logo.png" alt="" width="1485" height="1342" decoding="async">
                <span class="adamis-header-copy">
                    <span class="adamis-header-name" data-header-contrast>ADAMIS</span>
                    <span class="adamis-header-subtitle" data-header-contrast>${english ? 'Financial education' : 'Educación financiera'}</span>
                </span>
            </a>
            <button class="adamis-header-toggle" type="button" aria-expanded="false" aria-controls="primaryMenu" data-menu-toggle data-header-contrast data-menu-open-label="${openLabel}" data-menu-close-label="${closeLabel}">
                <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
                <span class="visually-hidden">${openLabel}</span>
            </button>
            <div class="adamis-header-menu" id="primaryMenu" data-main-menu>
                ${links.map(([href, label]) => `<a href="${href}" data-header-contrast${path === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
                <span class="adamis-header-actions">
                    <a href="${languagePath}" class="adamis-header-language" hreflang="${otherLanguage}" lang="${otherLanguage}" data-language-choice="${otherLanguage}" data-header-contrast aria-label="${english ? 'Ver esta página en español' : 'View this page in English'}">${otherLanguage.toUpperCase()}</a>
                    <a href="https://adamis-demo.vercel.app/" class="adamis-header-access" data-header-contrast>${english ? 'Platform access' : 'Acceso plataforma'}</a>
                    <a href="${home}#${english ? 'contact' : 'contacto'}" class="adamis-header-cta" data-cta="${english ? 'bring-adamis' : 'llevar-adamis'}" data-section="header">${english ? 'Bring ADAMIS to my school' : 'Llevar ADAMIS a mi centro'}</a>
                </span>
            </div>
        </nav>`;

    const mobile = matchMedia('(max-width: 1180px)');
    const menu = header.querySelector('[data-main-menu]');
    const toggle = header.querySelector('[data-menu-toggle]');
    const label = toggle.querySelector('.visually-hidden');
    const contrastItems = [...header.querySelectorAll('[data-header-contrast]')];
    const inertElements = new Map();
    let lockedStyles = null;
    let scrollPosition = 0;
    let frame = 0;

    const syncMenuAccessibility = () => {
        const hidden = mobile.matches && !header.classList.contains('is-menu-open');
        menu.inert = hidden;
        if (mobile.matches) menu.setAttribute('aria-hidden', String(hidden));
        else menu.removeAttribute('aria-hidden');
    };

    const close = ({ restoreFocus = false } = {}) => {
        if (!header.classList.contains('is-menu-open')) return;
        header.classList.remove('is-menu-open');
        document.documentElement.classList.remove('adamis-menu-open');
        document.body.classList.remove('adamis-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        label.textContent = openLabel;
        if (lockedStyles) {
            Object.assign(document.body.style, lockedStyles);
            lockedStyles = null;
            // Restore synchronously so a subsequent anchor or dialog can set its own position.
            window.scrollTo({ top: scrollPosition, behavior: 'instant' });
        }
        inertElements.forEach((wasInert, element) => { element.inert = wasInert; });
        inertElements.clear();
        syncMenuAccessibility();
        if (restoreFocus) toggle.focus({ preventScroll: true });
        refresh();
    };

    const open = () => {
        if (!mobile.matches || header.classList.contains('is-menu-open')) return;
        scrollPosition = scrollY;
        lockedStyles = { position: document.body.style.position, top: document.body.style.top,
            width: document.body.style.width, paddingRight: document.body.style.paddingRight };
        const scrollbar = innerWidth - document.documentElement.clientWidth;
        Object.assign(document.body.style, { position: 'fixed', top: `-${scrollPosition}px`, width: '100%' });
        if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`;
        [...document.body.children].filter(element => element !== header && !['SCRIPT', 'STYLE'].includes(element.tagName)).forEach(element => {
            inertElements.set(element, element.inert);
            element.inert = true;
        });
        header.classList.add('is-menu-open');
        document.documentElement.classList.add('adamis-menu-open');
        document.body.classList.add('adamis-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        label.textContent = closeLabel;
        syncMenuAccessibility();
        // Clear per-item colours while the menu supplies its own light backdrop.
        contrastItems.forEach(item => item.style.removeProperty('--item-color'));
        menu.querySelector('a').focus({ preventScroll: true });
    };

    const parseColor = value => {
        const channels = value.match(/[\d.]+/g)?.map(Number);
        return channels?.length >= 3 ? [...channels.slice(0, 3), channels[3] ?? 1] : [0, 0, 0, 0];
    };
    const blend = (front, back) => front.slice(0, 3).map((value, i) => value * front[3] + back[i] * (1 - front[3]));
    const isDarkAt = (x, y) => {
        const beneath = document.elementsFromPoint(x, y).find(element => !header.contains(element));
        const layers = [];
        for (let element = beneath; element; element = element.parentElement) {
            if (element.dataset.headerTheme) return element.dataset.headerTheme === 'dark';
            const styles = getComputedStyle(element);
            const color = parseColor(styles.backgroundColor);
            // The opaque paint underneath translucent decoration determines contrast.
            if (color[3]) layers.push(color);
            if (color[3] >= 1) break;
        }
        const color = layers.reverse().reduce((back, front) => blend(front, back), [251, 247, 239]);
        const linear = color.map(channel => { const value = channel / 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4; });
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722 < 0.34;
    };

    const refresh = () => {
        frame = 0;
        if (header.classList.contains('is-menu-open')) return;
        header.classList.toggle('is-scrolled', scrollY > 12);
        // Sample each line/link separately, including when a section boundary crosses the island.
        const colors = contrastItems.map(item => {
            const bounds = item.getBoundingClientRect();
            if (!bounds.width || !bounds.height || (mobile.matches && menu.contains(item))) return null;
            return isDarkAt(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
        });
        colors.forEach((dark, i) => {
            if (dark !== null) contrastItems[i].style.setProperty('--item-color', dark ? '#fbf7ef' : '#122b2a');
        });
        header.classList.toggle('is-on-dark', colors[0] === true);
    };
    const scheduleRefresh = () => { if (!frame) frame = requestAnimationFrame(refresh); };
    toggle.addEventListener('click', () => header.classList.contains('is-menu-open') ? close({ restoreFocus: true }) : open());
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) close();
        else if (event.target === menu) close({ restoreFocus: true });
    });
    document.addEventListener('keydown', event => {
        if (!header.classList.contains('is-menu-open')) return;
        if (event.key === 'Escape') { event.preventDefault(); close({ restoreFocus: true }); }
        if (event.key !== 'Tab') return;
        const items = [header.querySelector('.adamis-header-brand'), toggle, ...menu.querySelectorAll('a[href]')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    mobile.addEventListener('change', () => { if (!mobile.matches) close({ restoreFocus: true }); syncMenuAccessibility(); scheduleRefresh(); });
    window.addEventListener('scroll', scheduleRefresh, { passive: true });
    window.addEventListener('resize', scheduleRefresh, { passive: true });
    window.addEventListener('pageshow', scheduleRefresh);
    window.addEventListener('pagehide', () => close());
    // Colour sampling follows the resize transition even if scrolling stops midway through it.
    if ('ResizeObserver' in window) new ResizeObserver(scheduleRefresh).observe(header);
    document.fonts?.ready.then(scheduleRefresh);
    window.AdamisHeader = { close, refresh: scheduleRefresh };
    syncMenuAccessibility();
    refresh();
})();
