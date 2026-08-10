(() => {
    const root = document.documentElement;
    root.classList.add('landing-js');

    const initLanding = () => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const revealItems = Array.from(document.querySelectorAll('[data-landing-reveal]'));

        if (reducedMotion.matches || !('IntersectionObserver' in window)) {
            revealItems.forEach((item) => item.classList.add('is-visible'));
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            }, {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.08
            });

            revealItems.forEach((item) => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.94) {
                    item.classList.add('is-visible');
                    return;
                }
                revealObserver.observe(item);
            });
        }

        const heroVisual = document.querySelector('[data-landing-tilt]');
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        const menuToggle = document.querySelector('[data-menu-toggle]');

        menuToggle?.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            menuToggle.click();
        });

        const platformStory = document.querySelector('[data-platform-story]');

        if (platformStory) {
            const storyScroll = platformStory.querySelector('[data-platform-story-scroll]');
            const storySticky = platformStory.querySelector('.landing-story-sticky');
            const storyMap = platformStory.querySelector('[data-platform-map-layer]');
            const storySteps = platformStory.querySelector('[data-platform-steps]');
            const storyStepItems = Array.from(storySteps?.querySelectorAll('li') || []);
            const storyVideoLayer = platformStory.querySelector('[data-platform-video-layer]');
            const storyTutorialCopy = platformStory.querySelector('[data-platform-tutorial-copy]');
            const storyVideo = platformStory.querySelector('[data-tutorial-video]');
            const storyPlayButton = platformStory.querySelector('[data-tutorial-play]');
            let storyFrameRequested = false;
            let currentStoryStep = -1;
            let currentStoryPhase = '';

            const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
            const smoothstep = (start, end, value) => {
                const progress = clamp((value - start) / (end - start));
                return progress * progress * (3 - (2 * progress));
            };

            const setStoryProgress = (progress) => {
                const safeProgress = clamp(progress);
                const morph = smoothstep(0.48, 0.82, safeProgress);
                const mapOpacity = 1 - smoothstep(0.48, 0.68, safeProgress);
                const stepsOpacity = 1 - smoothstep(0.43, 0.61, safeProgress);
                const transitionOpacity = smoothstep(0.45, 0.59, safeProgress) * (1 - smoothstep(0.69, 0.84, safeProgress));
                const videoOpacity = smoothstep(0.64, 0.82, safeProgress);
                const tutorialOpacity = smoothstep(0.71, 0.88, safeProgress);
                const nextPhase = safeProgress < 0.52 ? 'map' : safeProgress < 0.79 ? 'transform' : 'tutorial';
                const stepProgress = clamp(safeProgress / 0.44, 0, 0.999);
                const nextStep = Math.min(storyStepItems.length - 1, Math.floor(stepProgress * storyStepItems.length));

                platformStory.style.setProperty('--landing-story-progress', safeProgress.toFixed(4));
                platformStory.style.setProperty('--landing-story-morph', morph.toFixed(4));
                platformStory.style.setProperty('--landing-map-opacity', mapOpacity.toFixed(4));
                platformStory.style.setProperty('--landing-steps-opacity', stepsOpacity.toFixed(4));
                platformStory.style.setProperty('--landing-transition-opacity', transitionOpacity.toFixed(4));
                platformStory.style.setProperty('--landing-video-opacity', videoOpacity.toFixed(4));
                platformStory.style.setProperty('--landing-tutorial-opacity', tutorialOpacity.toFixed(4));

                if (nextStep !== currentStoryStep) {
                    storyStepItems.forEach((item, index) => item.classList.toggle('is-current', index === nextStep));
                    currentStoryStep = nextStep;
                }

                if (nextPhase !== currentStoryPhase) {
                    platformStory.dataset.storyPhase = nextPhase;
                    const tutorialIsInteractive = nextPhase === 'tutorial';

                    storyMap?.setAttribute('aria-hidden', tutorialIsInteractive ? 'true' : 'false');
                    storySteps?.setAttribute('aria-hidden', tutorialIsInteractive ? 'true' : 'false');
                    storyVideoLayer?.setAttribute('aria-hidden', tutorialIsInteractive ? 'false' : 'true');
                    storyTutorialCopy?.setAttribute('aria-hidden', tutorialIsInteractive ? 'false' : 'true');

                    if (storyVideo) storyVideo.tabIndex = tutorialIsInteractive ? 0 : -1;
                    if (storyPlayButton) storyPlayButton.tabIndex = tutorialIsInteractive ? 0 : -1;
                    if (!tutorialIsInteractive && storyVideo && !storyVideo.paused) storyVideo.pause();

                    currentStoryPhase = nextPhase;
                }
            };

            const updateStory = () => {
                storyFrameRequested = false;
                if (!storyScroll || !storySticky) return;

                const storyBounds = storyScroll.getBoundingClientRect();
                const stickyTop = Number.parseFloat(window.getComputedStyle(storySticky).top) || 0;
                const travel = Math.max(1, storyScroll.offsetHeight - storySticky.offsetHeight);
                setStoryProgress((stickyTop - storyBounds.top) / travel);
            };

            const requestStoryUpdate = () => {
                if (storyFrameRequested) return;
                storyFrameRequested = true;
                window.requestAnimationFrame(updateStory);
            };

            if (reducedMotion.matches) {
                setStoryProgress(1);
            } else {
                updateStory();
                window.addEventListener('scroll', requestStoryUpdate, { passive: true });
                window.addEventListener('resize', requestStoryUpdate, { passive: true });
            }
        }

        if (!heroVisual || reducedMotion.matches) return;

        let heroPlayTimer;

        const playHeroMoment = () => {
            window.clearTimeout(heroPlayTimer);
            heroVisual.classList.remove('is-playful');
            window.requestAnimationFrame(() => heroVisual.classList.add('is-playful'));
            heroPlayTimer = window.setTimeout(() => heroVisual.classList.remove('is-playful'), 820);
        };

        heroVisual.addEventListener('pointerdown', playHeroMoment, { passive: true });

        if (!finePointer.matches) return;

        const resetHeroDepth = () => {
            heroVisual.style.setProperty('--landing-photo-x', '0px');
            heroVisual.style.setProperty('--landing-photo-y', '0px');
            heroVisual.style.setProperty('--landing-character-x', '0px');
            heroVisual.style.setProperty('--landing-character-y', '0px');
            heroVisual.style.setProperty('--landing-question-x', '0px');
            heroVisual.style.setProperty('--landing-question-y', '0px');
        };

        heroVisual.addEventListener('pointermove', (event) => {
            const bounds = heroVisual.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            heroVisual.style.setProperty('--landing-photo-x', `${(x * 10).toFixed(2)}px`);
            heroVisual.style.setProperty('--landing-photo-y', `${(y * 8).toFixed(2)}px`);
            heroVisual.style.setProperty('--landing-character-x', `${(x * -18).toFixed(2)}px`);
            heroVisual.style.setProperty('--landing-character-y', `${(y * -12).toFixed(2)}px`);
            heroVisual.style.setProperty('--landing-question-x', `${(x * -7).toFixed(2)}px`);
            heroVisual.style.setProperty('--landing-question-y', `${(y * -5).toFixed(2)}px`);
        }, { passive: true });

        heroVisual.addEventListener('pointerleave', resetHeroDepth, { passive: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanding, { once: true });
    } else {
        initLanding();
    }
})();
