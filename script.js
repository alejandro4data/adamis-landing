document.addEventListener('DOMContentLoaded', () => {
    const platformAccessButtons = document.querySelectorAll('[data-platform-access]');
    const counters = document.querySelectorAll('.stat-number');
    const openInfoButtons = document.querySelectorAll('[data-open-info-modal]');
    const productTabs = Array.from(document.querySelectorAll('[data-product-tab]'));
    const productPanels = Array.from(document.querySelectorAll('[data-product-detail]'));
    const productExperience = document.querySelector('[data-active-product]');
    const productDock = document.querySelector('[data-product-dock]');
    const courseTabs = document.querySelectorAll('[data-course-tab]');
    const coursePanels = document.querySelectorAll('[data-course-panel]');
    const infoModal = document.getElementById('infoModal');
    const closeInfoModalBtn = document.getElementById('closeInfoModal');
    const infoRequestForm = document.getElementById('infoRequestForm');
    const infoFormStatus = document.getElementById('infoFormStatus');
    const infoFormSubmit = document.getElementById('infoFormSubmit');
    const audienceField = infoRequestForm?.querySelector('[name="audience"]');
    const interestField = infoRequestForm?.querySelector('[name="interest"]');
    const infoModalInterest = document.getElementById('infoModalInterest');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileProductQuery = window.matchMedia('(max-width: 720px)');

    let panelRevealAnimation = null;

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
            window.location.href = 'splash.html';
        }, 800);
    };

    platformAccessButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            launchPlatformAccess();
        });
    });

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

    const animateProductTriggerFLIP = (firstRects) => {
        if (!firstRects || reducedMotionQuery.matches) return;

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

            if (!changedEnough) return;

            tab.animate(
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
        });
    };

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

    const setActiveProduct = (target, options = {}) => {
        const { focus = false, revealDetail = false } = options;
        const previousActive = productTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.productTab;
        if (previousActive === target && !options.immediate) return;
        const shouldAnimate = !options.immediate && !reducedMotionQuery.matches && previousActive !== target;
        const firstRects = shouldAnimate
            ? new Map(productTabs.map((tab) => [tab, tab.getBoundingClientRect()]))
            : null;

        if (productExperience) {
            productExperience.dataset.activeProduct = target;
        }

        productTabs.forEach((tab) => {
            const isActive = tab.dataset.productTab === target;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;

            if (focus && isActive) {
                tab.focus();
            }
        });

        let nextPanel = null;
        productPanels.forEach((panel) => {
            const isActive = panel.dataset.productDetail === target;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;

            if (isActive) {
                nextPanel = panel;
            }
        });

        if (productDock) {
            productDock.style.height = '';
        }

        if (shouldAnimate) {
            requestAnimationFrame(() => {
                animateProductTriggerFLIP(firstRects);
                animateProductPanelReveal(nextPanel);
            });
        }

        if (revealDetail && mobileProductQuery.matches && productDock) {
            requestAnimationFrame(() => {
                productDock.scrollIntoView({
                    behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
        }
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

    if (productTabs.length > 0) {
        const initialProduct = productTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.productTab || productTabs[0].dataset.productTab;
        setActiveProduct(initialProduct, { immediate: true });
    }

    window.addEventListener('resize', () => {
        if (productDock) {
            productDock.style.height = '';
        }
    });

    const handleReducedMotionChange = () => {
        if (productDock) {
            productDock.style.height = '';
        }
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

    infoRequestForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!infoFormStatus || !infoFormSubmit) return;

        const payload = Object.fromEntries(new FormData(infoRequestForm).entries());

        infoFormSubmit.disabled = true;
        infoFormStatus.className = 'form-status';
        infoFormStatus.textContent = 'Enviando solicitud...';

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

            infoFormStatus.className = 'form-status is-success';
            infoFormStatus.textContent = 'Solicitud enviada. Te responderemos pronto.';
            infoRequestForm.reset();
            setTimeout(closeInfoModal, 1200);
        } catch (error) {
            infoFormStatus.className = 'form-status is-error';
            infoFormStatus.textContent = error.message || 'Ha ocurrido un error al enviar la solicitud.';
        } finally {
            infoFormSubmit.disabled = false;
        }
    });
});
