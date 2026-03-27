document.addEventListener('DOMContentLoaded', () => {
    const heroRight = document.getElementById('heroRight');
    const counters = document.querySelectorAll('.stat-number');
    const openInfoButtons = document.querySelectorAll('[data-open-info-modal]');
    const infoModal = document.getElementById('infoModal');
    const closeInfoModalBtn = document.getElementById('closeInfoModal');
    const infoRequestForm = document.getElementById('infoRequestForm');
    const infoFormStatus = document.getElementById('infoFormStatus');
    const infoFormSubmit = document.getElementById('infoFormSubmit');
    const audienceField = infoRequestForm?.querySelector('[name="audience"]');

    if (heroRight) {
        heroRight.addEventListener('click', (e) => {
            e.preventDefault();

            const curtain = document.createElement('div');
            curtain.classList.add('transition-curtain');
            document.body.appendChild(curtain);

            document.querySelector('.split-hero')?.classList.add('fade-out-content');

            setTimeout(() => {
                window.location.href = 'splash.html';
            }, 800);
        });
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

    const openInfoModal = (audience = '') => {
        if (!infoModal) return;
        if (audienceField && audience) {
            audienceField.value = audience;
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
            openInfoModal(button.dataset.audience || '');
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
