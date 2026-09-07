(() => {
    const lang = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'es';
    const isEnglish = lang === 'en';
    const allowRuntimeTranslation = document.documentElement.hasAttribute('data-auto-translate');

    const exact = new Map([
        ['ADAMIS | Educación financiera para colegios de Primaria', 'ADAMIS | Financial education for primary schools'],
        ['Programa de educación financiera práctica para 4º, 5º y 6º de Primaria. Clases, actividades y seguimiento para implantar en colegios de forma sencilla.', 'A practical financial education program for 4th, 5th and 6th grade. Lessons, activities and tracking to make school implementation simple.'],
        ['ADAMIS: educación financiera para colegios de Primaria', 'ADAMIS: financial education for primary schools'],
        ['Navegacion principal', 'Main navigation'],
        ['Ir al inicio de ADAMIS', 'Go to the ADAMIS homepage'],
        ['Qué es ADAMIS', 'What is ADAMIS'],
        ['El reto', 'The challenge'],
        ['En colegios', 'In schools'],
        ['Programa', 'Program'],
        ['Soluciones', 'Solutions'],
        ['Acceso plataforma', 'Platform access'],
        ['Logotipo de ADAMIS', 'ADAMIS logo'],
        ['Educación Financiera para colegios', 'Financial education for schools'],
        ['Un recorrido claro y progresivo para 4º, 5º y 6º de Primaria.', 'A clear, progressive path for 4th, 5th and 6th grade.'],
        ['Solicitar propuesta', 'Request a proposal'],
        ['Ver cómo funciona', 'See how it works'],
        ['Video tutorial', 'Video tutorial'],
        ['Un recorrido por las clases, actividades, dashboard y seguimiento del alumno dentro de la plataforma.', 'A walkthrough of the lessons, activities, dashboard and student tracking inside the platform.'],
        ['Video tutorial de la plataforma ADAMIS', 'ADAMIS platform video tutorial'],
        ['Reproducir video tutorial', 'Play video tutorial'],
        ['Conflictos reales', 'Real conflicts'],
        ['Tres datos para entender', 'Three facts to understand'],
        ['el problema', 'the problem'],
        ['Lo financiero ya está influyendo en decisiones reales antes de que exista una comprensión clara. ADAMIS entra aquí: antes de que el criterio llegue tarde.', 'Money is already shaping real decisions before students fully understand it. ADAMIS steps in here: before judgement arrives too late.'],
        ['Adultos en España', 'Adults in Spain'],
        ['No sabe calcular cómo crece el ahorro con intereses.', 'Do not know how to calculate how savings grow with interest.'],
        ['Una dificultad básica para entender rentabilidad, tiempo y construcción de ahorro.', 'A basic difficulty when understanding returns, time and savings growth.'],
        ['Banco de España · ECF 2021', 'Bank of Spain · ECF 2021'],
        ['Estudiantes de 15 años en España', '15-year-old students in Spain'],
        ['Compró algo porque sus amigos lo tenían.', 'Bought something because their friends had it.'],
        ['La presión social ya está condicionando decisiones de consumo.', 'Social pressure is already shaping spending decisions.'],
        ['OCDE · PISA 2022 · España', 'OECD · PISA 2022 · Spain'],
        ['No entiende bien qué implica pedir un préstamo.', 'Do not fully understand what taking out a loan involves.'],
        ['Un concepto financiero básico sigue sin comprenderse con claridad.', 'A basic financial concept is still not clearly understood.'],
        ['Aulas piloto', 'Pilot classrooms'],
        ['Más de 350 alumnos ya han aprendido con ADAMIS', 'More than 350 students have already learned with ADAMIS'],
        ['Medimos indicadores en cada sesión y mejoramos continuamente el producto con feedback real de profesorado y alumnado.', 'We measure indicators in every session and continuously improve the product with real feedback from teachers and students.'],
        ['Alumnos trabajando con ADAMIS en una sesion piloto de aula', 'Students working with ADAMIS in a classroom pilot session'],
        ['Despliegue', 'Rollout'],
        ['Cada vez más centros se suman', 'More and more schools are joining'],
        ['Acompañamos la integración de principio a fin: pilotos, formación docente y seguimiento para que el programa funcione desde el primer día.', 'We support the integration from start to finish: pilots, teacher training and tracking so the program works from day one.'],
        ['Equipo ADAMIS durante una presentacion en un centro educativo', 'The ADAMIS team during a presentation at a school'],
        ['Curso 2026-2027', '2026-2027 school year'],
        ['El próximo curso, escalamos contigo', 'Next school year, we scale with you'],
        ['La versión completa del producto se lanza el próximo curso. Este es el momento de asegurar la implantación de ADAMIS y posicionar tu centro un paso por delante.', 'The complete product launches next school year. This is the moment to secure ADAMIS implementation and position your school one step ahead.'],
        ['Sesion piloto de ADAMIS en el Colegio Pedro Antonio', 'ADAMIS pilot session at Colegio Pedro Antonio'],
        ['Programa completo', 'Complete program'],
        ['El recorrido se entiende mejor cuando cada bloque ocupa su lugar.', 'The journey is easier to understand when every block has its place.'],
        ['Desde el dinero y el consumo hasta la inversión, la seguridad y la toma de decisiones, ADAMIS avanza por una progresión clara y acumulativa.', 'From money and spending to investing, security and decision-making, ADAMIS follows a clear cumulative progression.'],
        ['Personaje Adamis', 'Adamis character'],
        ['El personaje ADAMIS', 'The ADAMIS character'],
        ['Acompaña el recorrido del alumno', 'Guides the student journey'],
        ['Inicio', 'Start'],
        ['Dinero, valor y consumo cotidiano', 'Money, value and everyday spending'],
        ['Se introduce la educación financiera, la historia y función del dinero, y la base del consumo: necesidades, deseos, precio y mercado.', 'Students are introduced to financial education, the history and function of money, and the basics of consumption: needs, wants, price and market.'],
        ['Orden', 'Structure'],
        ['Ingresos, gastos y ahorro', 'Income, expenses and savings'],
        ['Se trabaja cómo entra y sale el dinero y cómo construir objetivos de ahorro con criterio y continuidad.', 'Students work on how money comes in and goes out, and how to build savings goals with judgement and consistency.'],
        ['Profundidad', 'Depth'],
        ['Deuda, interés, inversión y riesgo', 'Debt, interest, investment and risk'],
        ['Se explica qué implica pedir prestado, cómo funciona el interés y cómo empezar a entender rentabilidad, riesgo y distintas formas de invertir.', 'Students learn what borrowing means, how interest works and how to begin understanding returns, risk and different ways to invest.'],
        ['Cierre', 'Wrap-up'],
        ['Decisiones, seguridad y consolidación', 'Decisions, security and consolidation'],
        ['Se integran emociones, sesgos, estafas, protección de datos y un cierre final para unir todo el aprendizaje.', 'Emotions, biases, scams, data protection and a final wrap-up bring the learning together.'],
        ['Implantación flexible', 'Flexible implementation'],
        ['Tres productos. Un escenario mucho más decidido.', 'Three products. A much clearer setup.'],
        ['Elige entre programa completo, packs temáticos o configuración flexible según el curso, el calendario y el alcance real del centro.', 'Choose between the complete program, thematic packs or flexible configuration depending on the grade, schedule and real scope of the school.'],
        ['Soluciones ADAMIS', 'ADAMIS solutions'],
        ['Cursos completos', 'Complete courses'],
        ['Programa integral', 'Full program'],
        ['Programas completos', 'Complete programs'],
        ['De 4º a 6º de Primaria', 'From 4th to 6th grade'],
        ['Recorrido completo por curso.', 'Full journey by grade.'],
        ['Packs temáticos', 'Thematic packs'],
        ['Secuencia temática', 'Thematic sequence'],
        ['Packs Temáticos', 'Thematic Packs'],
        ['Bloques listos para activar criterio', 'Ready-to-use blocks for building judgement'],
        ['Progresión cerrada por objetivos.', 'Goal-based closed progression.'],
        ['Flexible', 'Flexible'],
        ['Sistema modular', 'Modular system'],
        ['Configuración Flexible', 'Flexible Configuration'],
        ['Clases y dinámicas según tu centro', 'Lessons and dynamics adapted to your school'],
        ['Montaje propio con ritmo real.', 'Custom setup at a realistic pace.'],
        ['Cursos disponibles', 'Available grades'],
        ['6º Primaria', '6th grade'],
        ['5º Primaria', '5th grade'],
        ['4º Primaria', '4th grade'],
        ['La opción más completa para cerrar Primaria', 'The most complete option to finish primary school'],
        ['Más de 20 clases progresivas listas para usar', 'More than 20 progressive ready-to-use lessons'],
        ['Actividades prácticas y evaluación integrada', 'Practical activities and built-in assessment'],
        ['Dashboard para seguir el progreso de cada alumno', 'Dashboard to track each student’s progress'],
        ['Ranking con premios para reforzar la participación', 'Ranking with rewards to reinforce participation'],
        ['Formación gratuita para profesores e implantación sencilla', 'Free teacher training and simple implementation'],
        ['Complementos disponibles: dinámicas y diplomas de finalización', 'Available add-ons: dynamics and completion certificates'],
        ['Un recorrido amplio para avanzar con criterio', 'A broad path to move forward with judgement'],
        ['16 clases progresivas listas para usar', '16 progressive ready-to-use lessons'],
        ['La entrada más sencilla a la educación financiera', 'The simplest entry point into financial education'],
        ['14 clases progresivas listas para usar', '14 progressive ready-to-use lessons'],
        ['Elegir este formato', 'Choose this format'],
        ['Bloques 1 y 2', 'Blocks 1 and 2'],
        ['Introducción a la educación financiera', 'Introduction to financial education'],
        ['Origen y función del dinero', 'Origin and function of money'],
        ['Bloques 3 y 4', 'Blocks 3 and 4'],
        ['Necesidades y decisiones de compra', 'Needs and purchase decisions'],
        ['Precio, valor y criterio financiero', 'Price, value and financial judgement'],
        ['Bloques 5 y 6', 'Blocks 5 and 6'],
        ['Ingresos, gastos y ahorro', 'Income, expenses and savings'],
        ['Presupuesto, deuda e interés', 'Budget, debt and interest'],
        ['Bloques 7 y 8', 'Blocks 7 and 8'],
        ['Inversión, riesgo y activos', 'Investment, risk and assets'],
        ['Primeras ideas de emprendimiento', 'First entrepreneurship ideas'],
        ['Bloque 9', 'Block 9'],
        ['Decisiones financieras y protección', 'Financial decisions and protection'],
        ['Simulación final del recorrido', 'Final journey simulation'],
        ['Los packs avanzados parten de contenidos ya trabajados en fases anteriores, por lo que se aplican sobre el itinerario de 6º de Primaria.', 'Advanced packs build on content already covered in previous stages, so they apply to the 6th grade pathway.'],
        ['Diseña un bloque propio combinando clases y dinámicas.', 'Design your own block by combining lessons and dynamics.'],
        ['Clases', 'Lessons'],
        ['Clases individuales', 'Individual lessons'],
        ['Sesiones concretas del itinerario.', 'Specific sessions from the pathway.'],
        ['Pack de clases', 'Lesson pack'],
        ['Bloque propio con varias sesiones.', 'Custom block with several sessions.'],
        ['Dinámicas', 'Dynamics'],
        ['Solo 6º Primaria', '6th grade only'],
        ['Dinámicas individuales', 'Individual dynamics'],
        ['Experiencias sueltas por temática.', 'Standalone experiences by topic.'],
        ['Pack de dinámicas', 'Dynamics pack'],
        ['Conjunto práctico adaptado al centro.', 'Practical set adapted to the school.'],
        ['Cada clase o dinámica dura aproximadamente entre 45 minutos y 1 hora.', 'Each lesson or dynamic lasts approximately 45 minutes to 1 hour.'],
        ['Centros piloto', 'Pilot schools'],
        ['Colegios que ya han aprendido con ADAMIS', 'Schools that have already learned with ADAMIS'],
        ['Logos de colegios participantes', 'Logos of participating schools'],
        ['Ir a la web del Colegio Arcangel', 'Visit Colegio Arcangel website'],
        ['Ir a la web del Colegio Torrevilano', 'Visit Colegio Torrevilano website'],
        ['Ir a la web del Colegio Abaco', 'Visit Colegio Abaco website'],
        ['Ir a la web del CEIP Pedro Antonio de Alarcon', 'Visit CEIP Pedro Antonio de Alarcon website'],
        ['Logo Colegio Arcangel', 'Colegio Arcangel logo'],
        ['Logo Colegio Torrevilano', 'Colegio Torrevilano logo'],
        ['Logo Colegio Abaco', 'Colegio Abaco logo'],
        ['Logo CEIP Pedro Antonio de Alarcon', 'CEIP Pedro Antonio de Alarcon logo'],
        ['Preguntas frecuentes', 'Frequently asked questions'],
        ['Respuestas directas sobre ADAMIS.', 'Direct answers about ADAMIS.'],
        ['ADAMIS es un programa de educación financiera para colegios de Primaria, diseñado para implantarse de forma práctica en 4º, 5º y 6º.', 'ADAMIS is a financial education program for primary schools, designed for practical implementation in 4th, 5th and 6th grade.'],
        ['FAQs de ADAMIS', 'ADAMIS FAQs'],
        ['Definición', 'Definition'],
        ['¿Qué es ADAMIS?', 'What is ADAMIS?'],
        ['ADAMIS es un programa de', 'ADAMIS is a'],
        ['educación financiera para Primaria', 'financial education program for primary school'],
        ['y', 'and'],
        ['colegios', 'schools'],
        ['que combina clases, actividades prácticas, plataforma y seguimiento del alumno.', 'that combines lessons, practical activities, platform access and student tracking.'],
        ['Cursos', 'Grades'],
        ['¿Para qué cursos está pensado?', 'Which grades is it designed for?'],
        ['ADAMIS está pensado para', 'ADAMIS is designed for'],
        ['4º de Primaria', '4th grade'],
        ['5º de Primaria', '5th grade'],
        ['6º de Primaria', '6th grade'],
        [', con recorridos progresivos que adaptan la educación financiera al nivel de cada curso.', ', with progressive pathways that adapt financial education to each grade level.'],
        ['Implantación', 'Implementation'],
        ['¿Cómo se implanta en un colegio?', 'How is it implemented in a school?'],
        ['El colegio puede elegir programa completo,', 'The school can choose the complete program,'],
        ['packs temáticos', 'thematic packs'],
        ['o', 'or'],
        ['configuración flexible', 'flexible configuration'],
        ['. ADAMIS acompaña la implantación con formación docente y seguimiento.', '. ADAMIS supports implementation with teacher training and tracking.'],
        ['Packs', 'Packs'],
        ['¿Qué incluyen los packs temáticos?', 'What do the thematic packs include?'],
        ['Los packs temáticos agrupan bloques de aprendizaje como Money Start, Smart Buy, Cash Control, Invest Lab y Money Shield para trabajar objetivos concretos.', 'Thematic packs group learning blocks such as Money Start, Smart Buy, Cash Control, Invest Lab and Money Shield to work on specific goals.'],
        ['Solicitud de propuesta', 'Proposal request'],
        ['Recibe una propuesta adaptada a tu centro', 'Receive a proposal adapted to your school'],
        ['Indícanos curso, número aproximado de alumnos y formato preferido. Te responderemos con una opción concreta y sin compromiso.', 'Tell us the grade, approximate number of students and preferred format. We will reply with a concrete option with no commitment.'],
        ['Por curso', 'By grade'],
        ['Modular', 'Modular'],
        ['Nombre', 'Name'],
        ['Centro', 'School'],
        ['Producto', 'Product'],
        ['Selecciona una opción', 'Select an option'],
        ['Mensaje opcional', 'Optional message'],
        ['Curso, número aproximado de alumnos o cualquier detalle relevante.', 'Grade, approximate number of students or any relevant detail.'],
        ['Sin compromiso. Te responderemos con una propuesta concreta.', 'No commitment. We will reply with a concrete proposal.'],
        ['Recibir propuesta', 'Receive proposal'],
        ['Cerrar formulario', 'Close form'],
        ['Solicitud de información', 'Information request'],
        ['Cuéntanos qué necesitas', 'Tell us what you need'],
        ['Te responderemos en los correos del equipo de Prospere.', 'The Prospere team will reply by email.'],
        ['Perfil', 'Profile'],
        ['Familia', 'Family'],
        ['Colegio', 'School'],
        ['Otro', 'Other'],
        ['Centro / organización', 'School / organization'],
        ['Selecciona un producto', 'Select a product'],
        ['Cuéntanos qué información necesitas.', 'Tell us what information you need.'],
        ['Enviando solicitud...', 'Sending request...'],
        ['No se pudo enviar la solicitud.', 'The request could not be sent.'],
        ['Solicitud enviada. Te responderemos pronto.', 'Request sent. We will reply soon.'],
        ['Ha ocurrido un error al enviar la solicitud.', 'An error occurred while sending the request.'],
        ['Producto seleccionado: {interest}', 'Selected product: {interest}']
    ]);

    const normalizeText = (value = '') => String(value).replace(/\s+/g, ' ').trim();
    const normalized = new Map(Array.from(exact.entries()).map(([key, value]) => [normalizeText(key), value]));

    const t = (value, vars = {}) => {
        if (!isEnglish) return String(value || '');
        const source = String(value || '');
        const mapped = exact.get(source) || normalized.get(normalizeText(source)) || source;
        return mapped.replace(/\{(\w+)\}/g, (_match, key) => {
            return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : `{${key}}`;
        });
    };

    const translateTextNodes = (root) => {
        if (!root || !isEnglish) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
                return node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        const changes = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const current = node.nodeValue;
            const trimmed = current.trim();
            const next = t(trimmed);
            if (next !== trimmed) changes.push([node, current.replace(trimmed, next)]);
        }

        changes.forEach(([node, value]) => {
            node.nodeValue = value;
        });
    };

    const translateAttributes = (root) => {
        if (!root || !isEnglish) return;
        const attrs = ['alt', 'aria-label', 'placeholder', 'title', 'data-mobile-label'];
        root.querySelectorAll('*').forEach((element) => {
            attrs.forEach((attr) => {
                if (!element.hasAttribute(attr)) return;
                const current = element.getAttribute(attr);
                const next = t(current);
                if (next !== current) element.setAttribute(attr, next);
            });
        });
    };

    const updateMetadata = () => {
        document.documentElement.lang = lang;
        if (!isEnglish) return;

        document.title = t(document.title);
        const description = t('Programa de educación financiera práctica para 4º, 5º y 6º de Primaria. Clases, actividades y seguimiento para implantar en colegios de forma sencilla.');
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
        document.querySelector('meta[property="og:locale"]')?.setAttribute('content', 'en_US');
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', t('ADAMIS | Educación financiera para colegios de Primaria'));
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
        document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', t('ADAMIS | Educación financiera para colegios de Primaria'));
        document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    };

    const apply = () => {
        document.documentElement.lang = lang;
        if (!allowRuntimeTranslation) return;
        updateMetadata();
        translateTextNodes(document.body);
        translateAttributes(document.body);
    };

    if (document.body) {
        apply();
    } else {
        document.addEventListener('DOMContentLoaded', apply, { once: true });
    }

    window.AdamisLandingI18n = { lang, isEnglish, t };
})();

document.addEventListener('DOMContentLoaded', () => {
    const landingI18n = window.AdamisLandingI18n || {
        t: (value) => String(value || '')
    };
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
    const mobileMenuQuery = window.matchMedia('(max-width: 1180px)');
    const header = document.querySelector('.commercial-header');
    const siteHeader = document.querySelector('[data-site-header]');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mainMenu = document.querySelector('[data-main-menu]');
    const menuToggleLabel = menuToggle?.querySelector('.visually-hidden');
    const sectionNavLinks = Array.from(mainMenu?.querySelectorAll('[data-nav-section]') || []);
    const leadInterestTriggers = document.querySelectorAll('[data-lead-interest]');
    const leadInterestFields = document.querySelectorAll('[data-lead-interest-field]');
    const leadCourseFields = document.querySelectorAll('[data-lead-course-field]');
    const anchorLinks = document.querySelectorAll('.site-nav a[href^="#"], .commercial-footer a[href^="#"], .mobile-cta-bar a[href^="#"], .hero-text-link[href^="#"], .inline-cta[href^="#"], .btn-primary[href^="#"], .btn-outline[href^="#"]');
    const whatsappLinks = document.querySelectorAll('[data-whatsapp-link]');
    const ctaElements = document.querySelectorAll('[data-cta]');
    const mobileCtaBar = document.querySelector('.mobile-cta-bar');
    const contactSection = document.querySelector('[data-contact-section]') || document.getElementById('contacto');
    const openingSection = document.querySelector('.lead-hero, .detail-hero, .brief-hero, .methodology-hero, .workshop-watch-heading');
    const footer = document.querySelector('.commercial-footer');

    let panelRevealAnimation = null;
    let activeProduct = productTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.productTab || productTabs[0]?.dataset.productTab || '';
    let pendingProduct = '';
    let productTransitionFrame = 0;
    let productMeasureFrame = 0;
    const productTriggerAnimations = new Map();
    let menuScrollPosition = 0;
    let menuBodyInlineStyles = null;

    const getAnchorTargetPosition = (target) => {
        if (!target || target.id === 'inicio') return 0;

        const leadFormAnchor = target.id === 'contacto' && !document.body.classList.contains('landing-page')
            ? target.querySelector('.lead-form')
            : null;
        const contentAnchor = leadFormAnchor || target.querySelector(
            '.section-heading, .hero-copy, .trust-copy, .problem-copy, .how-grid, .schools-copy, .contact-copy, .section-intro, .impact-intro, .pilot-shell, .learning-shell, .products-intro, .closing-shell'
        ) || target;
        const headerHeight = header?.getBoundingClientRect().height || 0;
        const breathingRoom = target.matches?.('[data-method-story]')
            ? 0
            : window.innerWidth <= 920
                ? 16
                : Math.min(80, Math.max(28, window.innerHeight * 0.08));
        const absoluteTop = contentAnchor.getBoundingClientRect().top + window.pageYOffset;

        return Math.max(0, absoluteTop - headerHeight - breathingRoom);
    };

    const getMenuFocusableItems = () => {
        if (!menuToggle || !mainMenu) return [];
        return [
            menuToggle,
            ...Array.from(mainMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        ].filter((item) => !item.hasAttribute('hidden'));
    };

    const syncMenuAccessibility = () => {
        if (!mainMenu || !siteHeader) return;
        if (!mobileMenuQuery.matches) {
            mainMenu.removeAttribute('aria-hidden');
            return;
        }
        mainMenu.setAttribute('aria-hidden', String(!siteHeader.classList.contains('is-menu-open')));
    };

    const setMenuState = (isOpen, { moveFocus = true } = {}) => {
        if (!siteHeader || !menuToggle || !mainMenu) return;
        const shouldOpen = Boolean(isOpen && mobileMenuQuery.matches);
        const wasOpen = siteHeader.classList.contains('is-menu-open');

        if (shouldOpen && !wasOpen) {
            menuScrollPosition = window.scrollY;
            menuBodyInlineStyles = {
                position: document.body.style.position,
                top: document.body.style.top,
                width: document.body.style.width,
                paddingRight: document.body.style.paddingRight
            };
            const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
            document.body.style.position = 'fixed';
            document.body.style.top = `-${menuScrollPosition}px`;
            document.body.style.width = '100%';
            if (scrollbarGap) document.body.style.paddingRight = `${scrollbarGap}px`;
        }

        siteHeader.classList.toggle('is-menu-open', shouldOpen);
        document.documentElement.classList.toggle('mobile-menu-open', shouldOpen);
        document.body.classList.toggle('mobile-menu-open', shouldOpen);
        menuToggle.setAttribute('aria-expanded', String(shouldOpen));
        mainMenu.setAttribute('aria-hidden', String(!shouldOpen));
        if (menuToggleLabel) {
            const openLabel = menuToggle.dataset.menuOpenLabel || 'Abrir men\u00fa';
            const closeLabel = menuToggle.dataset.menuCloseLabel || 'Cerrar men\u00fa';
            menuToggleLabel.textContent = shouldOpen ? closeLabel : openLabel;
        }
        if (shouldOpen && moveFocus) {
            window.requestAnimationFrame(() => {
                const firstMenuLink = mainMenu.querySelector('a[href]');
                firstMenuLink?.focus({ preventScroll: true });
            });
        }

        if (!shouldOpen && wasOpen && menuBodyInlineStyles) {
            const restoreScrollPosition = menuScrollPosition;
            document.body.style.position = menuBodyInlineStyles.position;
            document.body.style.top = menuBodyInlineStyles.top;
            document.body.style.width = menuBodyInlineStyles.width;
            document.body.style.paddingRight = menuBodyInlineStyles.paddingRight;
            menuBodyInlineStyles = null;
            window.requestAnimationFrame(() => {
                const previousScrollBehavior = document.documentElement.style.scrollBehavior;
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, restoreScrollPosition);
                document.documentElement.style.scrollBehavior = previousScrollBehavior;
            });
        }
    };

    const closeMobileMenu = ({ restoreFocus = false } = {}) => {
        if (!siteHeader || !menuToggle || !mainMenu) return;
        setMenuState(false);
        if (restoreFocus) menuToggle.focus({ preventScroll: true });
    };

    menuToggle?.addEventListener('click', () => {
        if (!siteHeader || !mainMenu) return;
        setMenuState(!siteHeader.classList.contains('is-menu-open'), { moveFocus: false });
    });

    document.addEventListener('click', (event) => {
        if (!siteHeader || !siteHeader.classList.contains('is-menu-open')) return;
        if (siteHeader.contains(event.target)) return;
        closeMobileMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && siteHeader?.classList.contains('is-menu-open')) {
            closeMobileMenu({ restoreFocus: true });
            return;
        }

        if (event.key === 'Tab' && siteHeader?.classList.contains('is-menu-open') && mobileMenuQuery.matches) {
            const focusableItems = getMenuFocusableItems();
            if (!focusableItems.length) return;
            const firstItem = focusableItems[0];
            const lastItem = focusableItems[focusableItems.length - 1];

            if (event.shiftKey && document.activeElement === firstItem) {
                event.preventDefault();
                lastItem.focus();
            } else if (!event.shiftKey && document.activeElement === lastItem) {
                event.preventDefault();
                firstItem.focus();
            }
        }
    });

    mainMenu?.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            closeMobileMenu();
            return;
        }
        if (event.target === mainMenu) closeMobileMenu({ restoreFocus: true });
    });

    syncMenuAccessibility();
    mobileMenuQuery.addEventListener?.('change', () => {
        if (!mobileMenuQuery.matches) setMenuState(false, { moveFocus: false });
        syncMenuAccessibility();
    });

    if (siteHeader) {
        let headerFrame = 0;
        const syncHeaderState = () => {
            headerFrame = 0;
            siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
        };
        syncHeaderState();
        window.addEventListener('scroll', () => {
            if (headerFrame) return;
            headerFrame = window.requestAnimationFrame(syncHeaderState);
        }, { passive: true });
    }

    if (document.body.classList.contains('landing-page') && sectionNavLinks.length && 'IntersectionObserver' in window) {
        const observedSections = sectionNavLinks
            .map((link) => document.getElementById(link.dataset.navSection))
            .filter(Boolean);
        const visibleSections = new Set();

        const setActiveNavSection = (sectionId = '') => {
            sectionNavLinks.forEach((link) => {
                if (link.dataset.navSection === sectionId) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const activeSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.01) {
                    visibleSections.add(entry.target.id);
                } else {
                    visibleSections.delete(entry.target.id);
                }
            });

            const activeLine = window.innerHeight * 0.29;
            const activeSection = observedSections
                .filter((section) => visibleSections.has(section.id))
                .sort((first, second) => (
                    Math.abs(first.getBoundingClientRect().top - activeLine)
                    - Math.abs(second.getBoundingClientRect().top - activeLine)
                ))[0];
            setActiveNavSection(activeSection?.id || '');
        }, {
            rootMargin: '-24% 0px -64% 0px',
            threshold: 0.01
        });

        observedSections.forEach((section) => activeSectionObserver.observe(section));
    }

    anchorLinks.forEach((link) => {
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
            closeMobileMenu();

            if (event.detail === 0) {
                window.setTimeout(() => {
                    const focusTarget = target.id === 'contacto' && !document.body.classList.contains('landing-page')
                        ? target.querySelector('.lead-form') || target
                        : target;
                    focusTarget.setAttribute('tabindex', '-1');
                    focusTarget.focus({ preventScroll: true });
                }, reducedMotionQuery.matches ? 0 : 450);
            }
        });
    });

    const alignInitialHash = () => {
        const hash = window.location.hash;
        if (!hash || hash === '#') return;
        let target = null;
        try {
            target = document.getElementById(decodeURIComponent(hash.slice(1)));
        } catch {
            target = document.getElementById(hash.slice(1));
        }
        if (!target) return;
        const previousScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, getAnchorTargetPosition(target));
        window.requestAnimationFrame(() => {
            document.documentElement.style.scrollBehavior = previousScrollBehavior;
        });
    };

    if (window.location.hash) {
        window.requestAnimationFrame(() => window.requestAnimationFrame(alignInitialHash));
        window.addEventListener('load', () => {
            alignInitialHash();
            window.setTimeout(alignInitialHash, 320);
            window.setTimeout(alignInitialHash, 900);
        }, { once: true });
        document.fonts?.ready.then(() => {
            window.requestAnimationFrame(alignInitialHash);
        });
    }

    const selectLeadInterest = (interest = '') => {
        if (!interest) return;
        leadInterestFields.forEach((field) => {
            if (!field.options) {
                field.value = interest;
                return;
            }
            const matchingOption = Array.from(field.options || []).find((option) => option.value === interest || option.textContent.trim() === interest);
            if (matchingOption) field.value = matchingOption.value;
        });
    };

    const selectLeadCourse = (course = '') => {
        if (!course) return;
        leadCourseFields.forEach((field) => {
            if (!field.options) {
                field.value = course;
                return;
            }
            const matchingOption = Array.from(field.options || []).find((option) => option.value === course || option.textContent.trim() === course);
            if (matchingOption) field.value = matchingOption.value;
        });
    };

    leadInterestTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => selectLeadInterest(trigger.dataset.leadInterest || ''));
    });

    const syncInfoFormSource = (form) => {
        const sourceField = form?.querySelector('[name="source"]');
        if (!sourceField) return '';

        try {
            const params = new URLSearchParams(window.location.search);
            const sourceParts = [`${window.location.pathname}${window.location.hash || ''}`];
            const sourceContext = form.dataset.sourceContext || '';
            if (sourceContext) sourceParts.push(sourceContext);
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((key) => {
                const value = params.get(key);
                if (value) sourceParts.push(`${key}=${value}`);
            });
            sourceField.value = sourceParts.join(' | ').slice(0, 500);
        } catch {
            // Keep the authored source value if URL parsing is unavailable.
        }

        return sourceField.value;
    };

    window.AdamisInfoForms = Object.assign(window.AdamisInfoForms || {}, {
        syncSource: syncInfoFormSource
    });

    try {
        const params = new URLSearchParams(window.location.search);
        selectLeadInterest(params.get('interest') || '');
        selectLeadCourse(params.get('courses') || '');
    } catch {
        // Keep the authored field values if URL parsing is unavailable.
    }

    infoRequestForms.forEach(syncInfoFormSource);

    const trackCta = (element, eventName = '') => {
        const cta = element?.dataset?.cta || eventName;
        if (!cta) return;

        const payload = {
            event: eventName || `click_${cta.replace(/-/g, '_')}`,
            cta,
            section: element.dataset.section || ''
        };

        if (typeof window.gtag === 'function') {
            window.gtag('event', payload.event, {
                cta: payload.cta,
                section: payload.section
            });
            return;
        }

        if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
        window.dataLayer.push(payload);
    };

    ctaElements.forEach((element) => {
        element.addEventListener('click', () => {
            trackCta(element);
        });
    });

    const getWhatsappHref = (rawNumber = '') => {
        const number = String(rawNumber || '').replace(/[^\d]/g, '');
        if (!number || rawNumber.includes('[') || rawNumber.includes('WHATSAPP_NUMBER')) return '';

        const message = encodeURIComponent('Hola, soy de un centro escolar y me gustaria conocer los talleres de ADAMIS.');
        return `https://wa.me/${number}?text=${message}`;
    };

    whatsappLinks.forEach((link) => {
        const whatsappHref = getWhatsappHref(link.dataset.whatsappNumber || '');
        if (!whatsappHref) {
            link.classList.add('is-disabled');
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('tabindex', '-1');
            link.addEventListener('click', (event) => {
                event.preventDefault();
            });
            return;
        }

        link.href = whatsappHref;
        link.classList.remove('is-disabled');
        link.removeAttribute('aria-disabled');
        link.removeAttribute('tabindex');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
    });

    if (mobileCtaBar && 'IntersectionObserver' in window) {
        const isLanding = document.body.classList.contains('landing-page');

        if (isLanding) {
            const mobileCtaMedia = window.matchMedia('(max-width: 768px)');
            const heroCta = openingSection?.querySelector('[data-cta="llevar-adamis"]') || openingSection;
            const mobileCtaState = {
                heroVisible: true,
                contactVisible: false,
                footerVisible: false
            };

            const elementIsNearViewport = (element, bottomMargin = 0) => {
                if (!element) return false;
                const rect = element.getBoundingClientRect();
                return rect.bottom > 0 && rect.top < window.innerHeight * (1 + bottomMargin);
            };

            const syncMobileCta = () => {
                mobileCtaState.heroVisible = elementIsNearViewport(heroCta);
                mobileCtaState.contactVisible = elementIsNearViewport(contactSection, 0.24);
                mobileCtaState.footerVisible = elementIsNearViewport(footer, 0.12);
                const menuOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
                const contactHasFocus = Boolean(contactSection?.contains(document.activeElement));
                const shouldShow = mobileCtaMedia.matches
                    && !mobileCtaState.heroVisible
                    && !mobileCtaState.contactVisible
                    && !mobileCtaState.footerVisible
                    && !menuOpen
                    && !contactHasFocus;

                mobileCtaBar.classList.toggle('is-hidden', !shouldShow);
                document.body.classList.toggle('is-mobile-cta-visible', shouldShow);
                mobileCtaBar.dataset.heroVisible = String(mobileCtaState.heroVisible);
                mobileCtaBar.dataset.menuOpen = String(menuOpen);
                mobileCtaBar.dataset.contactVisible = String(mobileCtaState.contactVisible || contactHasFocus);
                mobileCtaBar.dataset.footerVisible = String(mobileCtaState.footerVisible);
                mobileCtaBar.dataset.stickyVisible = String(shouldShow);
            };

            const refreshMobileCtaGeometry = () => {
                syncMobileCta();
            };

            mobileCtaState.heroVisible = elementIsNearViewport(heroCta);
            mobileCtaState.contactVisible = elementIsNearViewport(contactSection, 0.24);
            mobileCtaState.footerVisible = elementIsNearViewport(footer, 0.12);
            syncMobileCta();

            if (heroCta) {
                const heroObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.target === heroCta) mobileCtaState.heroVisible = entry.isIntersecting;
                    });
                    syncMobileCta();
                }, { threshold: 0.01 });
                heroObserver.observe(heroCta);
            }

            const closingObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.target === contactSection) mobileCtaState.contactVisible = entry.isIntersecting;
                    if (entry.target === footer) mobileCtaState.footerVisible = entry.isIntersecting;
                });
                syncMobileCta();
            }, {
                rootMargin: '0px 0px 24% 0px',
                threshold: 0.01
            });

            [contactSection, footer].filter(Boolean).forEach((section) => closingObserver.observe(section));

            if (menuToggle) {
                const menuStateObserver = new MutationObserver(syncMobileCta);
                menuStateObserver.observe(menuToggle, { attributes: true, attributeFilter: ['aria-expanded'] });
            }

            contactSection?.addEventListener('focusin', syncMobileCta);
            contactSection?.addEventListener('focusout', () => window.requestAnimationFrame(syncMobileCta));
            mobileCtaMedia.addEventListener?.('change', syncMobileCta);
            let mobileCtaFrame = 0;
            window.addEventListener('scroll', () => {
                if (mobileCtaFrame) return;
                mobileCtaFrame = window.requestAnimationFrame(() => {
                    mobileCtaFrame = 0;
                    refreshMobileCtaGeometry();
                });
            }, { passive: true });
            window.addEventListener('resize', refreshMobileCtaGeometry, { passive: true });
            window.addEventListener('orientationchange', refreshMobileCtaGeometry, { passive: true });
        } else {
            const mobileCtaHiddenSections = new Set();
            const mobileCtaObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        mobileCtaHiddenSections.add(entry.target);
                    } else {
                        mobileCtaHiddenSections.delete(entry.target);
                    }
                });

                mobileCtaBar.classList.toggle('is-hidden', mobileCtaHiddenSections.size > 0);
            }, {
                rootMargin: '0px 0px -12% 0px',
                threshold: 0.04
            });

            [openingSection, contactSection, footer].filter(Boolean).forEach((section) => {
                mobileCtaObserver.observe(section);
            });
        }
    }

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
            if (counter.dataset.counting === 'true') return;

            const target = +counter.getAttribute('data-target');
            const originalText = counter.innerText;
            const leadingMatch = originalText.match(/^\D+/);
            const trailingMatch = originalText.match(/\D+$/);
            const prefix = counter.dataset.prefix ?? (leadingMatch ? leadingMatch[0] : '');
            const suffix = counter.dataset.suffix ?? (trailingMatch ? trailingMatch[0] : '');
            const shouldRepeat = counter.dataset.counterRepeat === 'true';

            let count = 0;
            counter.dataset.counting = 'true';
            counter.innerText = `${prefix}${count}${suffix}`;

            const updateCount = () => {
                const inc = target / speed * 5;
                if (count < target) {
                    count = Math.ceil(count + inc);
                    if (count > target) count = target;
                    counter.innerText = `${prefix}${count}${suffix}`;
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = `${prefix}${target}${suffix}`;
                    counter.dataset.counting = 'false';
                }
            };

            updateCount();
            if (!shouldRepeat) {
                observer.unobserve(counter);
            }
        });
    };

    if ('IntersectionObserver' in window && !reducedMotionQuery.matches) {
        const counterObserver = new IntersectionObserver(animateCounters, {
            threshold: 0.5
        });

        counters.forEach((counter) => {
            const originalText = counter.innerText;
            const leadingMatch = originalText.match(/^\D+/);
            const trailingMatch = originalText.match(/\D+$/);
            const prefix = counter.dataset.prefix ?? (leadingMatch ? leadingMatch[0] : '');
            const suffix = counter.dataset.suffix ?? (trailingMatch ? trailingMatch[0] : '');
            counter.innerText = `${prefix}0${suffix}`;
            counterObserver.observe(counter);
        });
    }

    const revealItems = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window && !reducedMotionQuery.matches) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach((el) => {
            if (el.closest('.lead-section')) {
                el.classList.add('visible');
                return;
            }
            el.classList.add('reveal-pending');
            revealObserver.observe(el);
        });
    } else {
        revealItems.forEach((el) => el.classList.add('visible'));
    }

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
            infoModalInterest.textContent = landingI18n.t('Producto seleccionado: {interest}', {
                interest: landingI18n.t(interest)
            });
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

    const methodFlow = document.querySelector('[data-method-flow]');
    const methodStage = methodFlow?.querySelector('[data-method-stage]');
    const methodPanels = methodFlow ? Array.from(methodFlow.querySelectorAll('[data-method-panel]')) : [];
    const methodUiSteps = methodFlow ? Array.from(methodFlow.querySelectorAll('[data-method-ui-step]')) : [];
    const methodPills = methodUiSteps.map((step) => step.querySelector('.method-meta-v5 > strong'));
    const methodTrack = methodFlow?.querySelector('[data-method-track]');

    if (methodFlow && methodStage && methodPanels.length === 3 && methodUiSteps.length === 3 && methodPills.every(Boolean) && methodTrack) {
        if (reducedMotionQuery.matches) {
            methodUiSteps.forEach((step) => step.removeAttribute('aria-hidden'));
        } else {
            const methodClamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
            let methodMetrics = {
                start: 0,
                travel: 1,
                viewportHeight: window.innerHeight
            };
            let methodFrame = 0;
            let methodLastProgress = -1;
            let methodLastNear = false;
            let methodLastEntered = false;
            let methodLastActive = 0;
            let methodViewportWidth = window.innerWidth;
            let methodViewportHeight = window.innerHeight;

            const measureMethodPills = () => {
                methodPills.forEach((pill) => {
                    const previousWidth = pill.style.width;
                    pill.style.width = 'max-content';
                    const targetWidth = Math.max(28, Math.ceil(pill.getBoundingClientRect().width));
                    pill.style.width = previousWidth;
                    pill.style.setProperty('--pill-target-width', `${targetWidth}px`);
                });
            };

            const renderMethodFlow = () => {
                methodFrame = 0;

                const scrollPosition = window.scrollY || window.pageYOffset;
                const progress = methodClamp((scrollPosition - methodMetrics.start) / methodMetrics.travel);
                const isNear = scrollPosition >= methodMetrics.start - methodMetrics.viewportHeight
                    && scrollPosition <= methodMetrics.start + methodMetrics.travel + methodMetrics.viewportHeight;

                if (isNear !== methodLastNear) {
                    methodFlow.classList.toggle('is-in-range', isNear);
                    methodLastNear = isNear;
                }

                const hasEntered = scrollPosition >= methodMetrics.start - 1;
                if (hasEntered !== methodLastEntered) {
                    methodFlow.classList.toggle('has-entered', hasEntered);
                    methodLastEntered = hasEntered;
                }

                if (Math.abs(progress - methodLastProgress) < 0.0001) return;
                methodLastProgress = progress;

                // Images stay anchored. Only the clipping edge advances, so each new
                // scene progressively covers the previous one without vertical drift.
                const dynamicsReveal = methodClamp((progress - 0.04) / 0.44);
                const aiReveal = methodClamp((progress - 0.52) / 0.44);
                const dynamicsInset = (1 - dynamicsReveal) * 100;
                const aiInset = (1 - aiReveal) * 100;

                methodPanels[1].style.clipPath = `inset(${dynamicsInset.toFixed(3)}% 0 0 0)`;
                methodPanels[2].style.clipPath = `inset(${aiInset.toFixed(3)}% 0 0 0)`;
                methodTrack.style.transform = `scaleX(${progress.toFixed(5)})`;

                const activeStep = progress < 0.43 ? 0 : progress < 0.9 ? 1 : 2;

                if (methodFlow.dataset.activeStep !== String(activeStep)) {
                    methodFlow.dataset.activeStep = String(activeStep);
                }

                methodUiSteps.forEach((step, index) => {
                    if (activeStep !== methodLastActive) {
                        const isActive = index === activeStep;
                        step.classList.toggle('is-active', isActive);
                        if (isActive) {
                            step.removeAttribute('aria-hidden');
                        } else {
                            step.setAttribute('aria-hidden', 'true');
                        }
                    }
                });

                methodLastActive = activeStep;
            };

            const requestMethodRender = () => {
                if (methodFrame) return;
                methodFrame = window.requestAnimationFrame(renderMethodFlow);
            };

            const measureMethodFlow = () => {
                measureMethodPills();
                const flowRect = methodFlow.getBoundingClientRect();
                const flowTop = (window.scrollY || window.pageYOffset) + flowRect.top;
                const headerHeight = siteHeader?.getBoundingClientRect().height || (window.innerWidth <= 920 ? 68 : 76);
                const stageHeight = methodStage.getBoundingClientRect().height;

                methodMetrics = {
                    start: flowTop - headerHeight,
                    travel: Math.max(1, methodFlow.offsetHeight - stageHeight),
                    viewportHeight: window.innerHeight
                };
                methodLastProgress = -1;
                renderMethodFlow();
            };

            const handleMethodResize = () => {
                const nextWidth = window.innerWidth;
                const nextHeight = window.innerHeight;
                const widthChanged = Math.abs(nextWidth - methodViewportWidth) > 2;
                const stableDesktopHeightChanged = nextWidth > 920 && Math.abs(nextHeight - methodViewportHeight) > 2;

                if (!widthChanged && !stableDesktopHeightChanged) return;

                methodViewportWidth = nextWidth;
                methodViewportHeight = nextHeight;
                measureMethodFlow();
            };

            measureMethodFlow();
            window.addEventListener('scroll', requestMethodRender, { passive: true });
            window.addEventListener('resize', handleMethodResize, { passive: true });
            window.addEventListener('pageshow', measureMethodFlow, { passive: true });
        }
    }

    infoRequestForms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formStatus = form.querySelector('[data-form-status]');
            const formSubmit = form.querySelector('[data-form-submit]');
            const formMessage = (key, fallback) => form.getAttribute(`data-form-${key}`) || landingI18n.t(fallback);

            if (!formStatus || !formSubmit) return;

            if (!form.checkValidity()) {
                formStatus.className = 'form-status is-error';
                formStatus.textContent = formMessage('validation', 'Revisa los campos obligatorios y acepta el tratamiento de datos.');
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            payload.dataConsent = formData.get('dataConsent') === 'yes';
            payload.marketingConsent = formData.get('marketingConsent') === 'yes';

            formSubmit.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = formMessage('sending', 'Enviando solicitud...');

            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            const timeoutId = controller ? window.setTimeout(() => controller.abort(), 15000) : 0;

            try {
                const response = await fetch(form.action || '/api/request-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller?.signal
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || !data.ok) {
                    const responseError = landingI18n.isEnglish ? '' : data.error;
                    throw new Error(responseError || formMessage('error', 'No se pudo enviar la solicitud.'));
                }

                formStatus.className = 'form-status is-success';
                formStatus.textContent = formMessage('success', 'Gracias. Hemos recibido tu solicitud y te responderemos en breve.');
                trackCta(formSubmit, 'submit_form_propuesta');
                form.reset();

                if (form === infoRequestForm) {
                    setTimeout(closeInfoModal, 1200);
                }
            } catch (error) {
                formStatus.className = 'form-status is-error';
                const errorMessage = error?.name === 'AbortError'
                    ? formMessage('timeout', 'La solicitud est\u00e1 tardando demasiado. Int\u00e9ntalo de nuevo o escr\u00edbenos por WhatsApp.')
                    : landingI18n.isEnglish
                        ? formMessage('error', 'Ha ocurrido un error al enviar la solicitud.')
                        : landingI18n.t(error.message || 'Ha ocurrido un error al enviar la solicitud.');
                formStatus.textContent = `${errorMessage} `;
                const fallbackLink = document.createElement('a');
                fallbackLink.href = 'https://wa.me/34644576186?text=Hola%2C%20he%20intentado%20enviar%20una%20solicitud%20desde%20la%20web%20de%20ADAMIS.';
                fallbackLink.target = '_blank';
                fallbackLink.rel = 'noopener';
                fallbackLink.textContent = formMessage('fallback', 'Abrir WhatsApp');
                formStatus.appendChild(fallbackLink);
            } finally {
                if (timeoutId) window.clearTimeout(timeoutId);
                formSubmit.disabled = false;
            }
        });
    });
});
