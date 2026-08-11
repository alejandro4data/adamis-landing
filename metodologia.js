(() => {
    const body = document.body;
    const flow = document.querySelector('[data-method-flow]');
    const stage = flow?.querySelector('[data-method-stage]');
    const panels = flow ? Array.from(flow.querySelectorAll('[data-method-panel]')) : [];
    const steps = flow ? Array.from(flow.querySelectorAll('[data-method-step]')) : [];
    const jumpButtons = flow ? Array.from(flow.querySelectorAll('[data-method-jump]')) : [];
    const track = flow?.querySelector('[data-method-track]');
    const header = document.querySelector('[data-site-header]');

    if (!body?.classList.contains('methodology-page') || !flow || !stage || !track || panels.length !== 3 || steps.length !== 3 || jumpButtons.length !== 3) {
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const checkpoints = [0.04, 0.5, 0.96];
    let enhanced = false;
    let frame = 0;
    let activeStep = -1;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let metrics = { start: 0, travel: 1 };

    const setActiveStep = (nextStep) => {
        if (nextStep === activeStep && enhanced) return;

        steps.forEach((step, index) => {
            const isActive = index === nextStep;
            step.classList.toggle('is-active', isActive);
            if (enhanced && !isActive) {
                step.setAttribute('aria-hidden', 'true');
            } else {
                step.removeAttribute('aria-hidden');
            }
        });

        jumpButtons.forEach((button, index) => {
            if (index === nextStep) {
                button.setAttribute('aria-current', 'step');
            } else {
                button.removeAttribute('aria-current');
            }
        });

        flow.dataset.activeStep = String(nextStep);
        activeStep = nextStep;
    };

    const render = () => {
        frame = 0;
        if (!enhanced) return;

        const scrollPosition = window.scrollY || window.pageYOffset;
        const progress = clamp((scrollPosition - metrics.start) / metrics.travel);
        const classroomReveal = clamp((progress - 0.05) / 0.4);
        const aiReveal = clamp((progress - 0.55) / 0.4);

        panels[1].style.clipPath = `inset(${((1 - classroomReveal) * 100).toFixed(3)}% 0 0 0)`;
        panels[2].style.clipPath = `inset(${((1 - aiReveal) * 100).toFixed(3)}% 0 0 0)`;
        track.style.transform = `scaleX(${progress.toFixed(5)})`;

        setActiveStep(progress < 0.39 ? 0 : progress < 0.82 ? 1 : 2);
    };

    const requestRender = () => {
        if (!enhanced || frame) return;
        frame = window.requestAnimationFrame(render);
    };

    const measure = () => {
        if (!enhanced) return;

        const flowRect = flow.getBoundingClientRect();
        const flowTop = (window.scrollY || window.pageYOffset) + flowRect.top;
        const headerHeight = header?.getBoundingClientRect().height || (window.innerWidth <= 920 ? 68 : 82);
        const stageHeight = stage.getBoundingClientRect().height;

        metrics = {
            start: flowTop - headerHeight,
            travel: Math.max(1, flow.offsetHeight - stageHeight)
        };

        render();
    };

    const setMode = () => {
        enhanced = !reducedMotion.matches;
        body.classList.toggle('methodology-enhanced', enhanced);

        if (enhanced) {
            activeStep = -1;
            setActiveStep(0);
            window.requestAnimationFrame(measure);
        } else {
            if (frame) {
                window.cancelAnimationFrame(frame);
                frame = 0;
            }
            panels.forEach((panel) => panel.style.removeProperty('clip-path'));
            track.style.removeProperty('transform');
            steps.forEach((step) => step.removeAttribute('aria-hidden'));
            activeStep = -1;
            setActiveStep(0);
        }
    };

    jumpButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (!enhanced) return;
            const index = Number(button.dataset.methodJump);
            const target = metrics.start + (metrics.travel * checkpoints[index]);
            window.scrollTo({ top: target, behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', () => {
        const nextWidth = window.innerWidth;
        const nextHeight = window.innerHeight;
        const widthChanged = Math.abs(nextWidth - viewportWidth) > 2;
        const desktopHeightChanged = nextWidth > 920 && Math.abs(nextHeight - viewportHeight) > 2;

        if (!widthChanged && !desktopHeightChanged) return;
        viewportWidth = nextWidth;
        viewportHeight = nextHeight;
        measure();
    }, { passive: true });
    window.addEventListener('pageshow', measure, { passive: true });
    reducedMotion.addEventListener?.('change', setMode);

    setMode();
})();
