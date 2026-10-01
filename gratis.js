(() => {
    const page = document.querySelector('.gratis-page');
    const header = page?.querySelector('.gratis-header');
    const opening = page?.querySelector('.gratis-opening');
    const title = page?.querySelector('h1');
    const stamp = title?.querySelector('em');
    const words = title?.querySelectorAll('.gratis-title-word');
    const releaseFirstPaint = () => {
        window.clearTimeout(window.gratisIntroFallback);
        document.documentElement.classList.remove('gratis-intro-pending');
    };
    if (!header || !opening || !stamp || !words?.length) {
        releaseFirstPaint();
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Keep anchor destinations and the browser's restored reading position.
    const navigation = performance.getEntriesByType('navigation')[0];
    if (reducedMotion.matches || window.location.hash || window.scrollY > 2
        || navigation?.type === 'back_forward') {
        releaseFirstPaint();
        return;
    }

    const wordText = Array.from(words, (word) => word.textContent);
    const characters = [];
    words.forEach((word, index) => {
        // Spaces keep the same typing rhythm, while all text reserves its final layout.
        if (index) characters.push(null);
        const fragment = document.createDocumentFragment();
        for (const character of wordText[index]) {
            const letter = document.createElement('span');
            letter.className = 'gratis-title-character';
            letter.textContent = character;
            fragment.append(letter);
            characters.push(letter);
        }
        word.replaceChildren(fragment);
    });

    let frame = 0;
    let timer = 0;
    let finished = false;
    let started = false;
    let viewportWidth = window.innerWidth;
    const passive = { passive: true };
    const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab', 'Enter']);

    const finish = (cancelled = false) => {
        finished = true;
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        if (cancelled) page.classList.add('is-intro-skipped');
        page.classList.remove('is-intro-running', 'is-interface-revealed');
        stamp.classList.remove('is-stamping', 'is-revealed');
        words.forEach((word, index) => { word.textContent = wordText[index]; });
        releaseFirstPaint();
        window.removeEventListener('wheel', finish);
        window.removeEventListener('touchstart', finish);
        window.removeEventListener('pointerdown', finish);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pagehide', finish);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        reducedMotion.removeEventListener('change', finish);
        window.AdamisHeader?.refresh();
    };

    const onKeyDown = (event) => {
        if (scrollKeys.has(event.key)) finish(true);
    };
    const onVisibilityChange = () => {
        if (document.hidden) finish(true);
    };
    const onResize = () => {
        // Mobile browser bars resize the height during scrolling; let those settle.
        if (started && window.innerWidth !== viewportWidth) finish(true);
    };

    // Native gestures always take over, including during the initial delay.
    window.addEventListener('wheel', finish, passive);
    window.addEventListener('touchstart', finish, passive);
    window.addEventListener('pointerdown', finish, passive);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    window.addEventListener('pagehide', finish);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', finish);
    page.classList.add('is-intro-running');
    releaseFirstPaint();

    const animateScroll = (target, duration, onComplete) => {
        const startY = window.scrollY;
        const startTime = performance.now();
        const step = (now) => {
            if (finished) return;
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = (1 - Math.cos(Math.PI * progress)) / 2;
            // Override the shared CSS smooth scrolling for precise, cancellable frames.
            window.scrollTo({ top: startY + (target - startY) * eased, behavior: 'instant' });
            if (progress < 1) frame = window.requestAnimationFrame(step);
            else onComplete();
        };
        frame = window.requestAnimationFrame(step);
    };

    const restingPosition = () => {
        const openingBottom = opening.getBoundingClientRect().bottom + window.scrollY;
        const peek = parseFloat(getComputedStyle(page).getPropertyValue('--gratis-peek')) || 84;
        const titleTop = title.getBoundingClientRect().top + window.scrollY;
        const headerBottom = header.querySelector('.adamis-header-brand').getBoundingClientRect().bottom;
        // Short screens get a smaller glimpse so the island never covers the headline.
        return Math.max(0, Math.min(openingBottom - window.innerHeight + peek, titleTop - headerBottom - 18));
    };

    const startScroll = () => {
        if (finished) return;
        if (window.scrollY > 2 || window.location.hash || document.hidden) {
            finish(true);
            return;
        }
        const previewY = restingPosition() + Math.min(window.innerHeight * 0.04, 32);
        viewportWidth = window.innerWidth;
        started = true;
        animateScroll(previewY, 700, () => {
            animateScroll(restingPosition(), 600, () => finish());
        });
    };

    const revealInterface = () => {
        if (finished) return;
        page.classList.add('is-interface-revealed');
        // Let the complete fade finish before introducing any scrolling.
        timer = window.setTimeout(startScroll, 650);
    };

    const revealStamp = () => {
        if (finished) return;
        stamp.classList.add('is-stamping');
        timer = window.setTimeout(() => {
            stamp.classList.add('is-revealed');
            stamp.classList.remove('is-stamping');
            // Half a second with only the finished headline on screen.
            timer = window.setTimeout(revealInterface, 500);
        }, 600);
    };

    let characterIndex = 0;
    const printNextCharacter = () => {
        if (finished) return;
        characters[characterIndex++]?.classList.add('is-revealed');
        if (characterIndex < characters.length) {
            timer = window.setTimeout(printNextCharacter, 50);
        } else {
            // Pause for 200ms once "fácil," is completely printed, then stamp DESCONFÍA.
            timer = window.setTimeout(revealStamp, 200);
        }
    };

    // Wait briefly for the display font so the measurements use the final layout.
    const fontsReady = document.fonts?.ready || Promise.resolve();
    const fontTimeout = new Promise((resolve) => { timer = window.setTimeout(resolve, 1200); });
    Promise.race([fontsReady, fontTimeout]).then(() => {
        window.clearTimeout(timer);
        if (!finished) timer = window.setTimeout(printNextCharacter, 300);
    }).catch(finish);
})();
