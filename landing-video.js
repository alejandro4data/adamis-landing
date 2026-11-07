(() => {
    const film = document.querySelector('[data-landing-film]');
    const stage = film?.querySelector('[data-film-stage]');
    const video = film?.querySelector('[data-film-video]');
    const soundButton = film?.querySelector('[data-film-sound]');
    if (!film || !stage || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileScene = window.matchMedia('(max-width: 640px) and (orientation: portrait)');
    const trial = new URLSearchParams(window.location.search).get('prueba-video');
    const fixedCardTrial = trial === 'fijo';
    const card = stage.querySelector('.landing-problem-card--film');
    const media = stage.querySelector('.landing-film-frame');
    const transformTrial = trial === 'transform' && Boolean(card && media);
    const header = document.querySelector('[data-site-header]');
    const mobileCta = document.querySelector('.mobile-cta-bar');
    const animatedElements = [film, header, mobileCta].filter(Boolean);
    let nearScene = false;
    let visibleRatio = 0;
    let frame = 0;
    let listening = false;
    let lastProgress = '0.0000';
    let autoplayAttempted = false;
    let prepared = false;
    let geometry;

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

    const setProgress = (progress) => {
        const value = progress.toFixed(4);
        if (value === lastProgress) return;
        lastProgress = value;
        animatedElements.forEach((element) => {
            if (value === '0.0000') element.style.removeProperty('--film-progress');
            else element.style.setProperty('--film-progress', value);
        });
    };

    const measureTransformScene = () => {
        const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top);
        const start = film.getBoundingClientRect().top + window.scrollY - stickyTop;
        const travel = film.offsetHeight - stage.offsetHeight;
        const shell = window.getComputedStyle(card, '::before');
        const shellWidth = Number.parseFloat(shell.width);
        const shellHeight = Number.parseFloat(shell.height);
        const mediaScale = Math.min((shellWidth - 2) / media.offsetWidth, (shellHeight - 2) / media.offsetHeight);
        const shellX = card.offsetWidth / shellWidth;
        const shellY = card.offsetHeight / shellHeight;
        film.style.setProperty('--film-shell-x', shellX);
        film.style.setProperty('--film-shell-y', shellY);
        film.style.setProperty('--film-media-scale', mediaScale);
        film.style.setProperty('--film-shell-ready', '1');
        return { start, travel };
    };

    const updateProgress = () => {
        frame = 0;
        if (!listening) return;
        let travel;
        let distance;
        if (transformTrial) {
            geometry ??= measureTransformScene();
            travel = geometry.travel;
            distance = window.scrollY - geometry.start;
        } else {
            // The stage keeps its original height, so its sticky travel is independent of the resize.
            travel = film.offsetHeight - stage.offsetHeight;
            distance = stage.getBoundingClientRect().top - film.getBoundingClientRect().top;
        }
        // Use the first and last 40% to resize, with a short hold at maximum height.
        const progress = Math.min(1, Math.max(0, Math.min(distance, travel - distance) / (travel * 0.4)));
        setProgress(progress * progress * (3 - 2 * progress));
    };

    const requestUpdate = () => {
        if (listening && !frame) frame = window.requestAnimationFrame(updateProgress);
    };

    const invalidateGeometry = () => {
        geometry = undefined;
        requestUpdate();
    };

    const syncListening = () => {
        // Keep the same sticky track in the trial while skipping its scroll animation.
        const shouldListen = !fixedCardTrial && nearScene && film.classList.contains('is-scroll-scene');
        if (shouldListen === listening) return;
        listening = shouldListen;
        if (listening) {
            window.addEventListener('scroll', requestUpdate, { passive: true });
            invalidateGeometry();
        } else {
            window.removeEventListener('scroll', requestUpdate);
            setProgress(0);
        }
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
        const scrollScene = mobileScene.matches && !reducedMotion.matches;
        film.classList.toggle('is-scroll-scene', scrollScene);
        film.classList.toggle('is-transform-scene', scrollScene && transformTrial);
        if (reducedMotion.matches) video.pause();
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
    playbackObserver.observe(video);
    reducedMotion.addEventListener?.('change', syncMotion);
    mobileScene.addEventListener?.('change', syncMotion);
    window.addEventListener('resize', invalidateGeometry, { passive: true });
    if (transformTrial) window.visualViewport?.addEventListener('resize', invalidateGeometry, { passive: true });
    if (transformTrial && 'ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(invalidateGeometry);
        [stage, film, header, document.querySelector('#inicio')].filter(Boolean).forEach((element) => resizeObserver.observe(element));
    }
})();
