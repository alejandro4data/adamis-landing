(() => {
    const root = document.documentElement;
    root.classList.add('product-js');

    const initProduct = () => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const revealItems = Array.from(document.querySelectorAll('[data-product-reveal]'));

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
                if (item.getBoundingClientRect().top < window.innerHeight * 0.94) {
                    item.classList.add('is-visible');
                    return;
                }
                revealObserver.observe(item);
            });
        }

        const dynamicsLink = document.querySelector('[data-product-dynamics-link]');
        const syncLocationState = () => {
            if (!dynamicsLink) return;
            if (window.location.hash === '#dinamicas') {
                dynamicsLink.setAttribute('aria-current', 'location');
            } else {
                dynamicsLink.removeAttribute('aria-current');
            }
        };

        syncLocationState();
        window.addEventListener('hashchange', syncLocationState);

        const story = document.querySelector('[data-product-story]');

        if (story) {
            const storyScroll = story.querySelector('[data-product-story-scroll]');
            const storySticky = story.querySelector('.product-story-sticky');
            const storyMap = story.querySelector('[data-product-map-layer]');
            const storySteps = story.querySelector('[data-product-steps]');
            const storyStepItems = Array.from(storySteps?.querySelectorAll('li') || []);
            const storyTransition = story.querySelector('.product-story-transition');
            const storyVideoLayer = story.querySelector('[data-product-video-layer]');
            const storyDemoCopy = story.querySelector('[data-product-demo-copy]');
            const storyVideo = story.querySelector('[data-product-video]');
            const storyPlayButton = story.querySelector('[data-product-demo-play]');
            let frameRequested = false;
            let currentStep = -1;
            let currentPhase = '';

            const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
            const smoothstep = (start, end, value) => {
                const progress = clamp((value - start) / (end - start));
                return progress * progress * (3 - (2 * progress));
            };

            const setInteractivePhase = (phase) => {
                if (phase === currentPhase) return;
                const tutorialIsInteractive = phase === 'tutorial' || phase === 'linear';

                story.dataset.storyPhase = phase;
                storyMap?.setAttribute('aria-hidden', phase === 'tutorial' ? 'true' : 'false');
                storySteps?.setAttribute('aria-hidden', phase === 'tutorial' ? 'true' : 'false');
                storyTransition?.setAttribute('aria-hidden', phase === 'transform' || phase === 'linear' ? 'false' : 'true');
                storyVideoLayer?.setAttribute('aria-hidden', tutorialIsInteractive ? 'false' : 'true');
                storyDemoCopy?.setAttribute('aria-hidden', tutorialIsInteractive ? 'false' : 'true');

                if (storyVideo) storyVideo.tabIndex = tutorialIsInteractive ? 0 : -1;
                if (storyPlayButton) storyPlayButton.tabIndex = tutorialIsInteractive ? 0 : -1;
                if (!tutorialIsInteractive && storyVideo && !storyVideo.paused) storyVideo.pause();

                currentPhase = phase;
            };

            const setLinearState = () => {
                story.style.setProperty('--product-story-progress', '0');
                story.style.setProperty('--product-story-morph', '0');
                story.style.setProperty('--product-map-opacity', '1');
                story.style.setProperty('--product-steps-opacity', '1');
                story.style.setProperty('--product-transition-opacity', '1');
                story.style.setProperty('--product-video-opacity', '1');
                story.style.setProperty('--product-demo-opacity', '1');
                storyStepItems.forEach((item) => item.classList.remove('is-current'));
                currentStep = -1;
                setInteractivePhase('linear');
            };

            const setStoryProgress = (progress) => {
                const safeProgress = clamp(progress);
                const morph = smoothstep(0.47, 0.82, safeProgress);
                const mapOpacity = 1 - smoothstep(0.48, 0.69, safeProgress);
                const stepsOpacity = 1 - smoothstep(0.43, 0.62, safeProgress);
                const transitionOpacity = smoothstep(0.45, 0.59, safeProgress) * (1 - smoothstep(0.69, 0.84, safeProgress));
                const videoOpacity = smoothstep(0.64, 0.82, safeProgress);
                const demoOpacity = smoothstep(0.71, 0.88, safeProgress);
                const nextPhase = safeProgress < 0.52 ? 'map' : safeProgress < 0.79 ? 'transform' : 'tutorial';
                const stepProgress = clamp(safeProgress / 0.44, 0, 0.999);
                const nextStep = Math.min(storyStepItems.length - 1, Math.floor(stepProgress * storyStepItems.length));

                story.style.setProperty('--product-story-progress', safeProgress.toFixed(4));
                story.style.setProperty('--product-story-morph', morph.toFixed(4));
                story.style.setProperty('--product-map-opacity', mapOpacity.toFixed(4));
                story.style.setProperty('--product-steps-opacity', stepsOpacity.toFixed(4));
                story.style.setProperty('--product-transition-opacity', transitionOpacity.toFixed(4));
                story.style.setProperty('--product-video-opacity', videoOpacity.toFixed(4));
                story.style.setProperty('--product-demo-opacity', demoOpacity.toFixed(4));

                if (nextStep !== currentStep) {
                    storyStepItems.forEach((item, index) => item.classList.toggle('is-current', index === nextStep));
                    currentStep = nextStep;
                }

                setInteractivePhase(nextPhase);
            };

            const updateStory = () => {
                frameRequested = false;

                if (reducedMotion.matches) {
                    setLinearState();
                    return;
                }

                if (!storyScroll || !storySticky) return;
                const storyBounds = storyScroll.getBoundingClientRect();
                const stickyTop = Number.parseFloat(window.getComputedStyle(storySticky).top) || 0;
                const travel = Math.max(1, storyScroll.offsetHeight - storySticky.offsetHeight);
                setStoryProgress((stickyTop - storyBounds.top) / travel);
            };

            const requestStoryUpdate = () => {
                if (frameRequested) return;
                frameRequested = true;
                window.requestAnimationFrame(updateStory);
            };

            updateStory();
            window.addEventListener('scroll', requestStoryUpdate, { passive: true });
            window.addEventListener('resize', requestStoryUpdate, { passive: true });
            reducedMotion.addEventListener?.('change', requestStoryUpdate);
        }

        const demoVideo = document.querySelector('[data-product-video]');
        const demoPlayButton = document.querySelector('[data-product-demo-play]');

        if (demoVideo && demoPlayButton) {
            const source = demoVideo.querySelector('source[data-src]');

            const ensureVideoSource = () => {
                if (!source?.dataset.src) return;
                source.src = source.dataset.src;
                source.removeAttribute('data-src');
                demoVideo.load();
            };

            const showPlayButton = () => demoPlayButton.classList.remove('is-hidden');
            const hidePlayButton = () => demoPlayButton.classList.add('is-hidden');

            demoPlayButton.addEventListener('click', () => {
                ensureVideoSource();
                const playRequest = demoVideo.play();
                if (playRequest && typeof playRequest.catch === 'function') {
                    playRequest.catch(showPlayButton);
                }
            });

            demoVideo.addEventListener('play', hidePlayButton);
            demoVideo.addEventListener('pause', showPlayButton);
            demoVideo.addEventListener('ended', showPlayButton);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProduct, { once: true });
    } else {
        initProduct();
    }
})();
