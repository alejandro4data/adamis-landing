(() => {
    const film = document.querySelector('[data-landing-film]');
    const stage = film?.querySelector('[data-film-stage]');
    const video = film?.querySelector('[data-film-video]');
    const soundButton = film?.querySelector('[data-film-sound]');
    if (!film || !stage || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('[data-site-header]');
    const mobileCta = document.querySelector('.mobile-cta-bar');
    let headerHeight = 0;
    let nearScene = false;
    let visibleRatio = 0;
    let frame = 0;
    let listening = false;
    let autoplayAttempted = false;
    let prepared = false;

    const prepareVideo = () => {
        if (prepared) return;
        prepared = true;
        video.preload = 'metadata';
        video.load();
    };

    const playVideo = () => {
        // Native controls remain available when a browser blocks autoplay.
        const request = video.play();
        request?.catch(() => {});
    };

    const tryAutoplay = () => {
        if (autoplayAttempted || visibleRatio < 0.65 || document.hidden ||
            reducedMotion.matches || navigator.connection?.saveData) return;
        autoplayAttempted = true;
        // A visitor who has already used the controls owns playback from now on.
        if (!video.paused || !video.muted) return;
        prepareVideo();
        playVideo();
    };

    const updateProgress = () => {
        frame = 0;
        if (reducedMotion.matches) {
            film.style.setProperty('--film-progress', '1');
            return;
        }
        const entryPoint = window.innerHeight * 0.82;
        const travel = Math.max(1, entryPoint - headerHeight);
        const progress = Math.min(1, Math.max(0, (entryPoint - film.getBoundingClientRect().top) / travel));
        const eased = progress * progress * (3 - 2 * progress);
        film.style.setProperty('--film-progress', eased.toFixed(4));
    };

    const requestUpdate = () => {
        if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    const syncListening = () => {
        const shouldListen = nearScene && !reducedMotion.matches;
        if (shouldListen !== listening) {
            listening = shouldListen;
            if (listening) window.addEventListener('scroll', requestUpdate, { passive: true });
            else window.removeEventListener('scroll', requestUpdate);
        }
        requestUpdate();
    };

    const syncGeometry = () => {
        headerHeight = header?.getBoundingClientRect().height || 0;
        // Leave the fixed mobile CTA clear of the native playback controls.
        const bottomSpace = mobileCta?.getBoundingClientRect().height || 0;
        film.style.setProperty('--film-header', `${headerHeight}px`);
        film.style.setProperty('--film-bottom', `${bottomSpace}px`);
        requestUpdate();
    };

    const syncSound = () => {
        if (soundButton) soundButton.hidden = !video.muted && video.volume > 0;
    };

    soundButton?.addEventListener('click', () => {
        autoplayAttempted = true;
        prepareVideo();
        video.currentTime = 0;
        video.muted = false;
        if (!video.volume) video.volume = 1;
        playVideo();
        // Keep keyboard focus on a visible, usable control after hiding the button.
        video.focus({ preventScroll: true });
        syncSound();
    });
    video.addEventListener('volumechange', syncSound);
    video.addEventListener('play', () => { autoplayAttempted = true; });
    video.addEventListener('pause', () => { autoplayAttempted = true; });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) video.pause();
        else tryAutoplay();
    });
    window.addEventListener('pagehide', () => video.pause());
    syncSound();

    // Without observers, retain a normal video with native controls and no pinning.
    if (!('IntersectionObserver' in window)) return;

    const syncMotion = () => {
        film.classList.toggle('is-scroll-scene', !reducedMotion.matches);
        if (reducedMotion.matches) video.pause();
        syncGeometry();
        syncListening();
        tryAutoplay();
    };

    const proximityObserver = new IntersectionObserver((entries) => {
        nearScene = entries[0].isIntersecting;
        if (nearScene && !navigator.connection?.saveData) prepareVideo();
        syncListening();
    }, { rootMargin: '400px 0px', threshold: 0 });

    const playbackObserver = new IntersectionObserver((entries) => {
        visibleRatio = entries[0].intersectionRatio;
        if (visibleRatio < 0.25) video.pause();
        else tryAutoplay();
    }, { threshold: [0, 0.25, 0.65] });

    syncMotion();
    proximityObserver.observe(film);
    playbackObserver.observe(stage);
    reducedMotion.addEventListener?.('change', syncMotion);
    window.addEventListener('resize', syncGeometry, { passive: true });
    if ('ResizeObserver' in window) {
        const geometryObserver = new ResizeObserver(syncGeometry);
        [header, mobileCta].filter(Boolean).forEach((element) => geometryObserver.observe(element));
    }
})();
