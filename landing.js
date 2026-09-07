(() => {
    const root = document.documentElement;
    root.classList.add('landing-js');

    const initLanding = () => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const initProblemStack = () => {
            const problemSection = document.querySelector('#problema');
            if (!problemSection) return;

            const problemCards = Array.from(problemSection.querySelectorAll('.landing-problem-card'));
            if (problemCards.length < 2 || !('IntersectionObserver' in window)) return;

            const compactViewport = window.matchMedia('(max-width: 720px) and (max-height: 760px)');
            const mobileViewport = window.matchMedia('(max-width: 640px)');
            const header = document.querySelector('[data-site-header]');
            const mobileCta = document.querySelector('.mobile-cta-bar');
            let isNearSection = false;
            let isListening = false;
            let animationFrame = 0;
            let stateKey = '';
            let lastProgress = -1;

            const syncMobileGeometry = () => {
                if (!mobileViewport.matches || reducedMotion.matches) {
                    problemSection.classList.remove('is-mobile-stack', 'is-mobile-stack-fallback');
                    return;
                }

                const styles = window.getComputedStyle(problemSection);
                const step = Number.parseFloat(styles.getPropertyValue('--problem-stack-step'));
                const clearance = Number.parseFloat(styles.getPropertyValue('--problem-mobile-clearance'));
                const headerHeight = header?.getBoundingClientRect().height || 0;
                const ctaHeight = mobileCta?.getBoundingClientRect().height || 0;
                const heights = problemCards.map((card) => card.getBoundingClientRect().height);
                const deckHeight = Math.max(...heights.map((height, index) => height + index * step));
                const lastCardBottom = heights[heights.length - 1] + (heights.length - 1) * step;
                const fits = deckHeight + headerHeight + ctaHeight + clearance * 2 <= window.innerHeight;

                problemSection.style.setProperty('--problem-mobile-header', `${headerHeight}px`);
                problemSection.style.setProperty('--problem-mobile-cta', `${ctaHeight}px`);
                problemSection.style.setProperty('--problem-mobile-deck', `${deckHeight}px`);
                problemSection.style.setProperty('--problem-mobile-tail', `${64 + deckHeight - lastCardBottom}px`);
                problemSection.classList.toggle('is-mobile-stack', fits);
                problemSection.classList.toggle('is-mobile-stack-fallback', !fits);
            };

            const resetStates = () => {
                stateKey = '';
                lastProgress = -1;
                problemSection.style.removeProperty('--problem-cover-progress');
                problemCards.forEach((card) => {
                    card.classList.remove('is-active', 'is-covering', 'is-covered', 'is-future');
                });
            };

            const updateStack = () => {
                animationFrame = 0;
                if (!isListening) return;

                const stickyTop = Number.parseFloat(window.getComputedStyle(problemCards[0]).top) || 110;
                const coverDistance = Math.min(210, Math.max(120, window.innerHeight * 0.22));
                const cardTops = problemCards.map((card) => card.getBoundingClientRect().top);
                let activeIndex = 0;
                let coveringIndex = -1;
                let coverProgress = 0;

                for (let index = 1; index < problemCards.length; index += 1) {
                    if (cardTops[index] > stickyTop + coverDistance) break;
                    activeIndex = index;
                    if (cardTops[index] > stickyTop + 1) {
                        coveringIndex = index - 1;
                        coverProgress = (stickyTop + coverDistance - cardTops[index]) / coverDistance;
                    }
                }

                coverProgress = Math.min(1, Math.max(0, coverProgress));
                const nextStateKey = `${activeIndex}:${coveringIndex}`;

                if (nextStateKey !== stateKey) {
                    stateKey = nextStateKey;
                    problemCards.forEach((card, index) => {
                        card.classList.toggle('is-active', index === activeIndex);
                        card.classList.toggle('is-covering', index === coveringIndex);
                        card.classList.toggle('is-covered', index < activeIndex && index !== coveringIndex);
                        card.classList.toggle('is-future', index > activeIndex);
                    });
                }

                if (Math.abs(coverProgress - lastProgress) >= 0.004) {
                    lastProgress = coverProgress;
                    problemSection.style.setProperty('--problem-cover-progress', coverProgress.toFixed(3));
                }
            };

            const requestStackUpdate = () => {
                if (!isListening || animationFrame) return;
                animationFrame = window.requestAnimationFrame(updateStack);
            };

            const startListening = () => {
                if (isListening) return;
                isListening = true;
                problemSection.classList.add('is-stack-live');
                window.addEventListener('scroll', requestStackUpdate, { passive: true });
                window.addEventListener('resize', requestStackUpdate, { passive: true });
                requestStackUpdate();
            };

            const stopListening = () => {
                if (!isListening) return;
                isListening = false;
                problemSection.classList.remove('is-stack-live');
                window.removeEventListener('scroll', requestStackUpdate);
                window.removeEventListener('resize', requestStackUpdate);
                if (animationFrame) window.cancelAnimationFrame(animationFrame);
                animationFrame = 0;
            };

            const syncMode = () => {
                if (mobileViewport.matches) {
                    stopListening();
                    resetStates();
                    problemSection.classList.remove('is-stack-enhanced');
                    syncMobileGeometry();
                    return;
                }

                syncMobileGeometry();
                const useFallback = reducedMotion.matches || compactViewport.matches;
                problemSection.classList.toggle('is-stack-enhanced', !useFallback);

                if (useFallback) {
                    stopListening();
                    resetStates();
                    return;
                }

                if (!stateKey) {
                    problemCards.forEach((card, index) => {
                        card.classList.toggle('is-active', index === 0);
                        card.classList.toggle('is-future', index > 0);
                    });
                }

                if (isNearSection) startListening();
            };

            const proximityObserver = new IntersectionObserver((entries) => {
                const sectionEntry = entries[0];
                isNearSection = Boolean(sectionEntry?.isIntersecting);

                if (isNearSection && !mobileViewport.matches && !reducedMotion.matches && !compactViewport.matches) {
                    startListening();
                } else {
                    stopListening();
                }
            }, {
                rootMargin: '60% 0px 60% 0px',
                threshold: 0
            });

            proximityObserver.observe(problemSection);
            reducedMotion.addEventListener?.('change', syncMode);
            compactViewport.addEventListener?.('change', syncMode);
            mobileViewport.addEventListener?.('change', syncMode);
            // Content, fonts, header and safe-area changes can alter the usable
            // space. Native sticky handles scrolling without a mobile listener.
            if ('ResizeObserver' in window) {
                const geometryObserver = new ResizeObserver(syncMobileGeometry);
                [...problemCards, header, mobileCta].filter(Boolean).forEach((element) => {
                    geometryObserver.observe(element);
                });
            }
            window.addEventListener('resize', syncMobileGeometry, { passive: true });
            syncMode();
        };

        initProblemStack();
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
