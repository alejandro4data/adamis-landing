(() => {
    const root = document.documentElement;
    root.classList.add('impact-js');

    const initImpactReveals = () => {
        const items = Array.from(document.querySelectorAll('.impact-reveal'));
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (reducedMotion.matches || !('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -7% 0px',
            threshold: 0.08
        });

        items.forEach((item) => {
            if (item.getBoundingClientRect().top < window.innerHeight * 0.96) {
                item.classList.add('is-visible');
                return;
            }
            observer.observe(item);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImpactReveals, { once: true });
    } else {
        initImpactReveals();
    }
})();
