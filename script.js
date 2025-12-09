document.addEventListener('DOMContentLoaded', () => {
    
    const heroRight = document.getElementById('heroRight');
    
    // --- LÓGICA DE TRANSICIÓN A SPLASH ---
    heroRight.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. Crear dinámicamente el telón de transición
        const curtain = document.createElement('div');
        curtain.classList.add('transition-curtain');
        document.body.appendChild(curtain);

        // 2. Desvanecer el contenido actual
        document.querySelector('.split-hero').classList.add('fade-out-content');

        // 3. Esperar y redirigir
        setTimeout(() => {
            window.location.href = 'splash.html';
        }, 800);
    });

    // ... (Resto de tu código de contadores y scroll reveal sin cambios) ...
    // --- Animación de Contadores (Count Up) ---
    const counters = document.querySelectorAll('.stat-number');
    const speed = 100; 

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const originalText = counter.innerText;
                const suffix = originalText.replace(/[0-9]/g, '') || ""; 
                
                let count = 0;
                
                const updateCount = () => {
                    const inc = target / speed * 5; 
                    if (count < target) {
                        count = Math.ceil(count + inc);
                        if(count > target) count = target; 
                        counter.innerText = count + suffix;
                        setTimeout(updateCount, 25);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        const originalText = counter.innerText;
        const suffix = originalText.replace(/[0-9]/g, '') || "";
        counter.innerText = "0" + suffix;
        counterObserver.observe(counter);
    });

    // --- Scroll Reveal General ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });
});