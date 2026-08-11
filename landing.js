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

        const requestDialogPanel = document.querySelector('[data-request-dialog-panel]');
        const requestDialog = requestDialogPanel?.closest('dialog');
        const requestForm = requestDialog?.querySelector('[data-request-form]');
        const requestTitle = requestDialog?.querySelector('#requestDialogTitle');
        const requestIntro = requestDialog?.querySelector('#requestDialogIntro');
        const requestInterest = requestForm?.querySelector('[name="interest"]');
        const requestAudience = requestForm?.querySelector('[name="audience"]');
        const requestSubmit = requestForm?.querySelector('[data-form-submit]');
        const requestSubmitLabel = requestSubmit?.querySelector('[data-request-submit-label]');
        const requestStatus = requestForm?.querySelector('[data-form-status]');
        const requestClose = requestDialog?.querySelector('[data-request-dialog-close]');
        const requestTriggers = Array.from(document.querySelectorAll('[data-request-modal][data-request-type]'));
        const requestOptions = {
            taller: {
                title: requestDialog?.dataset.requestWorkshopTitle || 'Solicitar taller',
                intro: requestDialog?.dataset.requestWorkshopIntro || 'Cuéntanos vuestro contexto y os ayudaremos a preparar un taller que encaje con el centro.',
                interest: 'Taller inicial',
                source: 'modal-taller'
            },
            programa: {
                title: requestDialog?.dataset.requestProgrammeTitle || 'Solicitar programa',
                intro: requestDialog?.dataset.requestProgrammeIntro || 'Cuéntanos vuestro contexto y os ayudaremos a valorar cómo puede encajar un recorrido ADAMIS en el centro.',
                interest: 'Programa completo',
                source: 'modal-programa'
            }
        };
        let requestOpener = null;

        const unlockRequestDialog = () => {
            document.body.classList.remove('request-dialog-open');
            root.style.removeProperty('--request-scrollbar-gap');
        };

        const closeRequestDialog = () => {
            if (requestDialog?.open) requestDialog.close();
        };

        const openRequestDialog = (trigger) => {
            const requestOption = requestOptions[trigger?.dataset.requestType];
            if (!requestDialog || !requestForm || !requestOption || typeof requestDialog.showModal !== 'function') return;

            requestOpener = trigger;
            requestForm.reset();
            if (requestDialogPanel) requestDialogPanel.scrollTop = 0;
            requestForm.dataset.sourceContext = requestOption.source;
            if (requestAudience) requestAudience.value = 'Centro escolar';
            if (requestInterest) requestInterest.value = requestOption.interest;
            if (requestTitle) requestTitle.textContent = requestOption.title;
            if (requestIntro) requestIntro.textContent = requestOption.intro;
            if (requestSubmitLabel) requestSubmitLabel.textContent = requestOption.title;
            if (requestSubmit) requestSubmit.disabled = false;
            if (requestStatus) {
                requestStatus.className = 'form-status';
                requestStatus.textContent = '';
            }
            window.AdamisInfoForms?.syncSource?.(requestForm);

            const siteHeader = document.querySelector('[data-site-header]');
            if (siteHeader?.classList.contains('is-menu-open')) menuToggle?.click();
            menuToggle?.setAttribute('aria-expanded', 'false');
            const menuToggleLabel = menuToggle?.querySelector('.visually-hidden');
            if (menuToggleLabel) menuToggleLabel.textContent = menuToggle?.dataset.menuOpenLabel || 'Abrir menú';

            const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
            root.style.setProperty('--request-scrollbar-gap', `${scrollbarGap}px`);
            document.body.classList.add('request-dialog-open');
            requestDialog.showModal();
            window.requestAnimationFrame(() => requestTitle?.focus({ preventScroll: true }));
        };

        requestTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => openRequestDialog(trigger));
        });

        requestClose?.addEventListener('click', closeRequestDialog);
        requestDialog?.addEventListener('click', (event) => {
            if (event.target === requestDialog) closeRequestDialog();
        });
        requestDialog?.addEventListener('close', () => {
            unlockRequestDialog();
            if (requestOpener?.isConnected) requestOpener.focus({ preventScroll: true });
            requestOpener = null;
        });

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
