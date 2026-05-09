document.addEventListener('DOMContentLoaded', () => {
    const platformAccessButtons = document.querySelectorAll('[data-platform-access]');
    const counters = document.querySelectorAll('.stat-number');
    const openInfoButtons = document.querySelectorAll('[data-open-info-modal]');
    const productTabs = Array.from(document.querySelectorAll('[data-product-tab]'));
    const productPanels = Array.from(document.querySelectorAll('[data-product-detail]'));
    const productTabById = new Map(productTabs.map((tab) => [tab.dataset.productTab, tab]));
    const productPanelById = new Map(productPanels.map((panel) => [panel.dataset.productDetail, panel]));
    const productExperience = document.querySelector('[data-active-product]');
    const productDock = document.querySelector('[data-product-dock]');
    const courseTabs = document.querySelectorAll('[data-course-tab]');
    const coursePanels = document.querySelectorAll('[data-course-panel]');
    const infoModal = document.getElementById('infoModal');
    const closeInfoModalBtn = document.getElementById('closeInfoModal');
    const infoRequestForm = document.getElementById('infoRequestForm');
    const infoRequestForms = document.querySelectorAll('[data-info-form]');
    const infoFormStatus = document.getElementById('infoFormStatus');
    const audienceField = infoRequestForm?.querySelector('[name="audience"]');
    const interestField = infoRequestForm?.querySelector('[name="interest"]');
    const infoModalInterest = document.getElementById('infoModalInterest');
    const tutorialVideo = document.querySelector('[data-tutorial-video]');
    const tutorialPlayButton = document.querySelector('[data-tutorial-play]');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileProductQuery = window.matchMedia('(max-width: 720px)');
    const topbar = document.querySelector('.topbar');
    const topbarAnchorLinks = document.querySelectorAll('.topbar a[href^="#"]');
    const landingBackgrounds = document.querySelectorAll('[data-landing-bg]');
    const landingImageSlots = document.querySelectorAll('[data-landing-image]');
    const LANDING_PHOTO_EXTENSIONS = ['avif', 'webp', 'jpg', 'jpeg', 'png'];
    const LANDING_LOGO_EXTENSIONS = ['svg', 'webp', 'png', 'avif', 'jpg', 'jpeg'];

    let panelRevealAnimation = null;
    let activeProduct = productTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.productTab || productTabs[0]?.dataset.productTab || '';
    let pendingProduct = '';
    let productTransitionFrame = 0;
    let productMeasureFrame = 0;
    const productTriggerAnimations = new Map();
    const landingAssetCache = new Map();

    const getAnchorTargetPosition = (target) => {
        if (!target || target.id === 'inicio') return 0;

        const contentAnchor = target.querySelector(
            '.section-intro, .impact-intro, .pilot-shell, .learning-shell, .products-intro, .closing-shell'
        ) || target;
        const topbarHeight = topbar?.getBoundingClientRect().height || 0;
        const breathingRoom = Math.min(80, Math.max(28, window.innerHeight * 0.08));
        const absoluteTop = contentAnchor.getBoundingClientRect().top + window.pageYOffset;

        return Math.max(0, absoluteTop - topbarHeight - breathingRoom);
    };

    topbarAnchorLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;

            const target = document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            window.scrollTo({
                top: getAnchorTargetPosition(target),
                behavior: reducedMotionQuery.matches ? 'auto' : 'smooth'
            });
            window.history.pushState(null, '', hash);
        });
    });

    const probeLandingAsset = (src) => new Promise((resolve) => {
        if (!src) {
            resolve('');
            return;
        }

        const probe = new Image();
        probe.onload = () => resolve(src);
        probe.onerror = () => resolve('');
        probe.src = src;
    });

    const getLandingAssetCandidates = (basePath, extensions) => {
        if (!basePath) return [];
        if (/\.(avif|webp|jpe?g|png|svg)$/i.test(basePath)) return [basePath];

        return extensions.map((extension) => `${basePath}.${extension}`);
    };

    const resolveLandingAsset = async (basePath, extensions) => {
        const cacheKey = `${basePath || ''}|${extensions.join(',')}`;
        if (landingAssetCache.has(cacheKey)) {
            return landingAssetCache.get(cacheKey);
        }

        const resolveRequest = (async () => {
            const candidates = getLandingAssetCandidates(basePath, extensions);

            for (const candidate of candidates) {
                const loadedAsset = await probeLandingAsset(candidate);
                if (loadedAsset) return loadedAsset;
            }

            return '';
        })();

        landingAssetCache.set(cacheKey, resolveRequest);
        return resolveRequest;
    };

    const setLandingBackgrounds = () => {
        landingBackgrounds.forEach(async (element) => {
            const resolvedAsset = await resolveLandingAsset(element.dataset.landingBg, LANDING_PHOTO_EXTENSIONS);
            if (!resolvedAsset) return;

            element.style.setProperty('--pilot-photo', `url("${resolvedAsset.replace(/"/g, '\\"')}")`);
            element.classList.add('has-landing-image');
        });
    };

    const setLandingImages = () => {
        landingImageSlots.forEach(async (slot) => {
            const image = slot.querySelector('img');
            if (!image) return;

            const extensions = slot.dataset.landingImageKind === 'logo'
                ? LANDING_LOGO_EXTENSIONS
                : LANDING_PHOTO_EXTENSIONS;
            const resolvedAsset = await resolveLandingAsset(slot.dataset.landingImage, extensions);
            if (!resolvedAsset) return;

            image.src = resolvedAsset;
            image.hidden = false;
            slot.querySelectorAll('small').forEach((fallbackItem) => {
                fallbackItem.hidden = true;
            });
            slot.classList.add('has-landing-image');
        });
    };

    setLandingBackgrounds();
    setLandingImages();

    const launchPlatformAccess = () => {
        if (document.querySelector('.transition-curtain')) return;

        const heroShell = document.querySelector('.hero-shell');
        const legacyHero = document.querySelector('.split-hero');
        const curtain = document.createElement('div');
        curtain.classList.add('transition-curtain');
        document.body.appendChild(curtain);

        heroShell?.classList.add('fade-out-content');
        legacyHero?.classList.add('fade-out-content');

        setTimeout(() => {
            window.location.href = '/splash.html';
        }, 800);
    };

    platformAccessButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            launchPlatformAccess();
        });
    });

    if (tutorialVideo && tutorialPlayButton) {
        const hideTutorialPlayButton = () => {
            tutorialPlayButton.classList.add('is-hidden');
        };

        const showTutorialPlayButton = () => {
            tutorialPlayButton.classList.remove('is-hidden');
        };

        tutorialPlayButton.addEventListener('click', () => {
            const playRequest = tutorialVideo.play();
            if (playRequest && typeof playRequest.catch === 'function') {
                playRequest.catch(showTutorialPlayButton);
            }
        });

        tutorialVideo.addEventListener('play', hideTutorialPlayButton);
        tutorialVideo.addEventListener('ended', showTutorialPlayButton);
    }

    const speed = 100;

    const animateCounters = (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const originalText = counter.innerText;
            const suffix = originalText.replace(/[0-9]/g, '') || '';

            let count = 0;

            const updateCount = () => {
                const inc = target / speed * 5;
                if (count < target) {
                    count = Math.ceil(count + inc);
                    if (count > target) count = target;
                    counter.innerText = count + suffix;
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target + suffix;
                }
            };

            updateCount();
            observer.unobserve(counter);
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    counters.forEach((counter) => {
        const originalText = counter.innerText;
        const suffix = originalText.replace(/[0-9]/g, '') || '';
        counter.innerText = '0' + suffix;
        counterObserver.observe(counter);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
        revealObserver.observe(el);
    });

    const setActiveCourse = (target) => {
        courseTabs.forEach((item) => {
            const isActive = item.dataset.courseTab === target;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', String(isActive));
            item.tabIndex = isActive ? 0 : -1;
        });

        coursePanels.forEach((panel) => {
            const isActive = panel.dataset.coursePanel === target;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;
        });
    };

    courseTabs.forEach((tab, index) => {
        tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;

        tab.addEventListener('click', () => {
            setActiveCourse(tab.dataset.courseTab);
        });

        tab.addEventListener('keydown', (event) => {
            const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
            if (!keys.includes(event.key)) return;

            event.preventDefault();

            let nextIndex = index;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = courseTabs.length - 1;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (index + 1) % courseTabs.length;
            }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (index - 1 + courseTabs.length) % courseTabs.length;
            }

            const nextTab = courseTabs[nextIndex];
            setActiveCourse(nextTab.dataset.courseTab);
            nextTab.focus();
        });
    });

    const animateProductPanelReveal = (panel) => {
        if (!panel || reducedMotionQuery.matches) return;

        panelRevealAnimation?.cancel();
        panelRevealAnimation = panel.animate(
            [
                { opacity: 0.01, transform: 'translate3d(0, 14px, 0)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            {
                duration: 440,
                easing: 'cubic-bezier(.22,1,.36,1)',
                fill: 'both'
            }
        );
    };

    const getProductRects = () => new Map(productTabs.map((tab) => [tab, tab.getBoundingClientRect()]));

    const animateProductTriggerFLIP = (firstRects) => {
        if (!firstRects || reducedMotionQuery.matches || mobileProductQuery.matches) return;

        productTabs.forEach((tab) => {
            const first = firstRects.get(tab);
            const last = tab.getBoundingClientRect();

            if (!first || !last) return;

            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;
            const scaleX = first.width / last.width;
            const scaleY = first.height / last.height;

            const changedEnough =
                Math.abs(deltaX) > 1 ||
                Math.abs(deltaY) > 1 ||
                Math.abs(scaleX - 1) > 0.015 ||
                Math.abs(scaleY - 1) > 0.015;

            productTriggerAnimations.get(tab)?.cancel();

            if (!changedEnough) return;

            const animation = tab.animate(
                [
                    {
                        transformOrigin: 'top left',
                        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`
                    },
                    {
                        transformOrigin: 'top left',
                        transform: 'translate3d(0, 0, 0) scale(1, 1)'
                    }
                ],
                {
                    duration: 580,
                    easing: 'cubic-bezier(.22,1,.36,1)',
                    fill: 'both'
                }
            );

            productTriggerAnimations.set(tab, animation);
            animation.addEventListener('finish', () => {
                if (productTriggerAnimations.get(tab) === animation) {
                    productTriggerAnimations.delete(tab);
                }
            }, { once: true });
        });
    };

    const setProductTabState = (tab, isActive) => {
        if (!tab) return;

        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    };

    const setProductPanelState = (panel, isActive) => {
        if (!panel) return;

        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
    };

    const focusProductTab = (tab) => {
        if (!tab) return;

        try {
            tab.focus({ preventScroll: true });
        } catch {
            tab.focus();
        }
    };

    const revealProductDetailOnMobile = () => {
        if (!productDock || !mobileProductQuery.matches) return;

        const dockRect = productDock.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollMarginTop = Number.parseFloat(window.getComputedStyle(productDock).scrollMarginTop) || 0;
        const isReadable = dockRect.top >= scrollMarginTop - 8 && dockRect.top <= viewportHeight * 0.78;

        if (isReadable) return;

        window.scrollTo({
            top: Math.max(0, window.scrollY + dockRect.top - scrollMarginTop),
            behavior: 'auto'
        });
    };

    const setActiveProduct = (target, options = {}) => {
        const { focus = false, revealDetail = false, immediate = false } = options;
        const nextTab = productTabById.get(target);
        const nextPanel = productPanelById.get(target);

        if (!nextTab || !nextPanel) return;

        if ((pendingProduct || activeProduct) === target && !immediate) {
            if (focus) {
                focusProductTab(nextTab);
            }

            return;
        }

        if (productTransitionFrame) {
            cancelAnimationFrame(productTransitionFrame);
        }

        if (productMeasureFrame) {
            cancelAnimationFrame(productMeasureFrame);
        }

        pendingProduct = '';

        if (immediate) {
            if (productExperience) {
                productExperience.dataset.activeProduct = target;
            }

            productTabs.forEach((tab) => setProductTabState(tab, tab.dataset.productTab === target));
            productPanels.forEach((panel) => setProductPanelState(panel, panel.dataset.productDetail === target));
            activeProduct = target;
            pendingProduct = '';
            return;
        }

        pendingProduct = target;

        if (focus) {
            focusProductTab(nextTab);
        }

        productTransitionFrame = requestAnimationFrame(() => {
            productTransitionFrame = 0;

            const shouldAnimateTriggers = !reducedMotionQuery.matches && !mobileProductQuery.matches;
            const firstRects = shouldAnimateTriggers ? getProductRects() : null;
            const previousProduct = productTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.productTab || activeProduct;
            const previousTab = productTabById.get(previousProduct);
            const previousPanel = productPanelById.get(previousProduct);

            if (productExperience) {
                productExperience.dataset.activeProduct = target;
            }

            setProductTabState(previousTab, false);
            setProductTabState(nextTab, true);

            productMeasureFrame = requestAnimationFrame(() => {
                productMeasureFrame = 0;
                if (pendingProduct !== target) return;

                animateProductTriggerFLIP(firstRects);
                setProductPanelState(previousPanel, false);
                setProductPanelState(nextPanel, true);
                animateProductPanelReveal(nextPanel);
                activeProduct = target;
                pendingProduct = '';

                if (revealDetail && mobileProductQuery.matches && productDock) {
                    requestAnimationFrame(revealProductDetailOnMobile);
                }
            });
        });
    };

    productTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setActiveProduct(tab.dataset.productTab, { revealDetail: true });
        });

        tab.addEventListener('keydown', (event) => {
            const activationKeys = ['Enter', ' '];
            const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

            if (activationKeys.includes(event.key)) {
                event.preventDefault();
                setActiveProduct(tab.dataset.productTab, { focus: true, revealDetail: true });
                return;
            }

            if (!navigationKeys.includes(event.key)) return;

            event.preventDefault();

            let nextIndex = index;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = productTabs.length - 1;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (index + 1) % productTabs.length;
            }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (index - 1 + productTabs.length) % productTabs.length;
            }

            const nextTab = productTabs[nextIndex];
            setActiveProduct(nextTab.dataset.productTab, { focus: true });
        });
    });

    if (activeProduct) {
        setActiveProduct(activeProduct, { immediate: true });
    }

    window.addEventListener('resize', () => {
        if (productDock) {
            productDock.style.height = '';
        }

        productTriggerAnimations.forEach((animation) => animation.cancel());
        productTriggerAnimations.clear();
    });

    const handleReducedMotionChange = () => {
        if (productDock) {
            productDock.style.height = '';
        }

        panelRevealAnimation?.cancel();
        productTriggerAnimations.forEach((animation) => animation.cancel());
        productTriggerAnimations.clear();
    };

    if (typeof reducedMotionQuery.addEventListener === 'function') {
        reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    } else if (typeof reducedMotionQuery.addListener === 'function') {
        reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    const setModalInterest = (interest = '') => {
        if (interestField) {
            interestField.value = interest;
        }

        if (!infoModalInterest) return;

        if (interest) {
            infoModalInterest.hidden = false;
            infoModalInterest.textContent = `Producto seleccionado: ${interest}`;
            return;
        }

        infoModalInterest.hidden = true;
        infoModalInterest.textContent = '';
    };

    const openInfoModal = ({ audience = '', interest = '' } = {}) => {
        if (!infoModal) return;

        if (audienceField) {
            audienceField.value = audience || '';
        }

        setModalInterest(interest);
        if (infoFormStatus) {
            infoFormStatus.className = 'form-status';
            infoFormStatus.textContent = '';
        }
        infoModal.hidden = false;
        document.body.style.overflow = 'hidden';
    };

    const closeInfoModal = () => {
        if (!infoModal) return;
        infoModal.hidden = true;
        document.body.style.overflow = '';
    };

    openInfoButtons.forEach((button) => {
        button.addEventListener('click', () => {
            openInfoModal({
                audience: button.dataset.audience || '',
                interest: button.dataset.productInterest || ''
            });
        });
    });

    closeInfoModalBtn?.addEventListener('click', closeInfoModal);

    infoModal?.addEventListener('click', (event) => {
        if (event.target === infoModal) closeInfoModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && infoModal && !infoModal.hidden) {
            closeInfoModal();
        }
    });

    infoRequestForms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formStatus = form.querySelector('[data-form-status]');
            const formSubmit = form.querySelector('[data-form-submit]');

            if (!formStatus || !formSubmit) return;

            const payload = Object.fromEntries(new FormData(form).entries());

            formSubmit.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = 'Enviando solicitud...';

            try {
                const response = await fetch('/api/request-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || !data.ok) {
                    throw new Error(data.error || 'No se pudo enviar la solicitud.');
                }

                formStatus.className = 'form-status is-success';
                formStatus.textContent = 'Solicitud enviada. Te responderemos pronto.';
                form.reset();

                if (form === infoRequestForm) {
                    setTimeout(closeInfoModal, 1200);
                }
            } catch (error) {
                formStatus.className = 'form-status is-error';
                formStatus.textContent = error.message || 'Ha ocurrido un error al enviar la solicitud.';
            } finally {
                formSubmit.disabled = false;
            }
        });
    });
});
