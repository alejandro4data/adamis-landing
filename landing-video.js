(() => {
    const film = document.querySelector('[data-landing-film]');
    const video = film?.querySelector('[data-film-video]');
    const soundButton = film?.querySelector('[data-film-sound]');
    if (!film || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visibleRatio = 0;
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

    // Native controls remain available in browsers without visibility observers.
    if (!('IntersectionObserver' in window)) return;

    const proximityObserver = new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting || navigator.connection?.saveData) return;
        prepareVideo();
        observer.unobserve(entry.target);
    }, { rootMargin: '400px 0px', threshold: 0 });

    const playbackObserver = new IntersectionObserver((entries) => {
        visibleRatio = entries[0].intersectionRatio;
        if (visibleRatio < 0.25) video.pause();
        else tryAutoplay();
    }, { threshold: [0, 0.25, 0.65] });

    proximityObserver.observe(film);
    playbackObserver.observe(video);
    reducedMotion.addEventListener?.('change', () => {
        if (reducedMotion.matches) video.pause();
        else tryAutoplay();
    });
})();
