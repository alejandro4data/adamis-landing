// ======= DEMO existente (puedes borrar/editar) =======
// Mantengo tus ejemplos de “explicacion-bocadillo” tal cual,
// ahora generarán tipo 'explicacion-bocadillo'.
// ======= DEMO (puedes editar/borrar) =======

window.CURRENT_CLASS = 'ahorro';

window.slides.push( SlideTituloClase({ mode:'imagen', img:'../assets/instrucciones.avif' }) );

window.slides.push( SlideTituloClase({ mode:'imagen', img:'../assets/ahorro/escenas/titulo-ahorro.avif' }) );

window.slides.push( SlideTituloClase({ titulo: 'Introducción' }) );


// Texto abajo, imagen ~80%, efecto y narrador
window.slides.push( Slide({
  text: 'Holaa! Mi nombre es Adamis.',
  img: '../assets/ahorro/escenas/escena1.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Y, ¡voy a acompañarte a explorar el mundo del ahorro!',
  img: '../assets/ahorro/escenas/escena2.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Antes de nada, hay una pregunta clave que nos tenemos que hacer...',
  img: '../assets/ahorro/escenas/escena3.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¿Y si, en vez de gastar todo el dinero que tenemos...',
  img: '../assets/ahorro/escenas/escena4.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '... guardamos una parte?',
  img: '../assets/ahorro/escenas/escena5.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¡Hoy desubriremos el súperpoder del AHORRO!',
  img: '../assets/ahorro/escenas/escena6.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideCuadroReflexion({
  id: 'a_r_1',
  pregunta: "Si quisieras comprarte una bici, ¿cómo ahorrarías para conseguirla?",
  placeholder: "Escribe aquí tu respuesta...",
  minChars: 40,          // mínimo recomendado para que no respondan con 1 línea
  maxChars: 300,         // tope razonable para 10–14 años
  allowSkip: true,       // permite saltar (puedes poner false si quieres forzarlo)
  autoFocus: true,       // enfoca el textarea al entrar en la slide
  advanceOnSubmit: true, // al evaluar, pasa a la siguiente slide

  // ===== OPCIÓN A (callback local): usa UNA de las dos =====
  onEvaluate: async ({ question, answer }) => {
    // Ejemplo sencillo: considera "bien" si mencionan ideas clave
    const ok = /libertad|elegir|objetivo|emergencia|plan|decisiones/i.test(answer);
    return {
      ok,
      feedback: ok
        ? "Bien: conectas el ahorro con tomar mejores decisiones y cumplir objetivos."
        : "Mejorable: explica cómo el ahorro te permite decidir mejor (emergencias, objetivos, menos dependencia)."
    };
  }
}) );

window.slides.push( SlideTituloClase({ titulo: 'Sección 1' }) );

window.slides.push( Slide({
  text: 'Imagina dos amigos, Alex y Sofía, que reciben 20€ de paga cada semana.',
  img: '../assets/ahorro/escenas/escena7.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Alex gasta todo su dinero durante la semana, comprando cosas sin pensar en el futuro.',
  img: '../assets/ahorro/escenas/escena8.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Sofía disfruta parte de su dinero, pero cada semana guarda 7 € en su hucha.',
  img: '../assets/ahorro/escenas/escena9.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Después de 5 semanas, sus amigos proponen ir al ¡Parque de Atracciones!',
  img: '../assets/ahorro/escenas/escena10.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Pero... La entrada no es gratis... ¡Cuesta 30 €!',
  img: '../assets/ahorro/escenas/escena11.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Alex quiere ir, pero no tiene dinero ahorrado. Solo tiene su paga de la semana y no le llega.',
  img: '../assets/ahorro/escenas/escena12.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Sofía tiene 35 € ahorrados, y si suma su paga de esa semana, ¡puede ir y todavía le sobra dinero!',
  img: '../assets/ahorro/escenas/escena13.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¿Ves la diferencia? Ahorrar te da libertad para elegir.',
  img: '../assets/ahorro/escenas/escena14.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Así puedes estar preparado cuando realmente necesitas algo o encuentras algo que te encanta.',
  img: '../assets/ahorro/escenas/escena15.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'No se trata de guardar todo sin disfrutar, sino de encontrar el equilibrio.',
  img: '../assets/ahorro/escenas/escena16.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Pero ahorrar tiene muchos más beneficios. ¡Vamos a verlos!',
  img: '../assets/ahorro/escenas/escena17.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideTituloClase({ titulo: 'Sección 2' }) );

window.slides.push( Slide({
  text: '¡Te prepara para emergencias!',
  img: '../assets/ahorro/escenas/escena18.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Si surge un problema, como que se te rompan los auriculares...',
  img: '../assets/ahorro/escenas/escena19.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '... el dinero ahorrado te ayuda a solucionarlo rápido.',
  img: '../assets/ahorro/escenas/escena20.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Cuando ahorras, piensas mejor en qué gastas tu dinero...',
  img: '../assets/ahorro/escenas/escena21.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '... y evitas comprar cosas solo porque te apetecen en ese momento.',
  img: '../assets/ahorro/escenas/escena22.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¿Te gustaría viajar?',
  img: '../assets/ahorro/escenas/escena23.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: '¿Comprar una bici nueva?',
  img: '../assets/ahorro/escenas/escena24.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: 'O quizá... ¿Montar un Negocio?',
  img: '../assets/ahorro/escenas/escena25.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Si ahorras poco a poco, ¡puedes conseguirlo!',
  img: '../assets/ahorro/escenas/escena26.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Además, ¡puedes tomar decisiones sin depender de nadie! Esto lo veremos más adelante',
  img: '../assets/ahorro/escenas/escena27.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¡Genial! Ahora vamos a hacer una actividad para ver si has entendido por qué AHORRAR es tan importante.',
  img: '../assets/ahorro/escenas/escena28.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideTituloClase({ titulo: 'Actividad Interactiva' }) );


window.slides.push( Slide({
  text: 'Hola! Soy Lucía.',
  img: '../assets/ahorro/actividades/actividad1-0.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Necesito que me ayudes a manejar mi dinero.',
  img: '../assets/ahorro/actividades/actividad1-01.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push(
  SlideTerminoIntro({
    // COLUMNA IZQUIERDA (imagen + diálogo)
    text: "Lo que quiero es que seas mi asesor de ahorro.",
    img: "../assets/ahorro/actividades/actividad1-02.avif",
    narrator: "Lucía",
    narratorColor: "#26b416ff",
    typeSpeed: 44,

    // COLUMNA DERECHA (tarjeta)
    term: "Asesor de Ahorro",
    meaning: "Un Asesor de ahorro es una persona que te ayuda a tomar decisiones sobre si debes gastar o debes ahorrar para cumplir unas metas.",
    // Opcional: para forzar otro degradado de texto
    // goldGradient: "linear-gradient(180deg, #fff6c1, #ffda73, #e5b93b)"
  })
);


window.slides.push( Slide({
  text: 'Dentro de 8 semanas me quiero comprar una bici nueva.',
  img: '../assets/ahorro/actividades/actividad1-03.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Pero todas las semanas mis amigos me invitan a planes... y gastaré dinero.',
  img: '../assets/ahorro/actividades/actividad1-04.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Si consigues que ahorre suficiente y no esté muy triste al final, ¡te recompensaré!',
  img: '../assets/ahorro/actividades/actividad1-05.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( SlideTituloActividad({ actividad: 'Asesor de Ahorro' }) );

window.slides.push( SlideExplicacionActividad({
  guiones: [
    'La actividad dura 8 semanas (8 decisiones).',
    'Cada semana, Lucía recibe 5 monedas de paga.',
    'A lo largo de la semana, sus amigos propondrán planes.',
    'Tú deberás decidir si Lucía acepta o rechaza cada plan.',
    'Al final, Lucía quiere comprarse una bici nueva (30 monedas).',
    'Lucía no deberá estar muy triste al final'
  ],
  recompensa: 'Recibirás 1 si Lucía consigue la Bici y no está muy triste'
}));

window.ACT_AHORRO_STATE = window.ACT_AHORRO_STATE || {};
window.ACT_AHORRO_STATE.showGoal   = true;  // mostrarlo por defecto en todas
window.ACT_AHORRO_STATE.goalAmount = 30;    // objetivo por defecto


window.slides.push( SlideTituloClase({ titulo: 'Semana 1' }) );

window.slides.push(
  SlideActividadAhorro11({
    text: "¡Tarde de juegos con pizzas!",
    image: "../assets/ahorro/actividades/actividad1-1.avif",
    coins: 10,
    happiness: 55,
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:-8, dHappy:+15,
      nextImage:'../assets/ahorro/actividades/actividad1-2.avif',
      color: '#2563eb',        // ← color base (azul)
      textColor: '#ffffff'     // ← opcional (si quieres texto más claro en la tarjeta)
    },
    right: {
      dCoins: 0, dHappy:-10,
      nextImage:'../assets/ahorro/actividades/actividad1-3.avif',
      color: '#10b981'         // ← color base (verde)
      // textColor: '#0b1b2b'  // opcional
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "¡La primera paga semanal!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);

window.slides.push( SlideTituloClase({ titulo: 'Semana 2' }) );

window.slides.push(
  SlideActividadAhorro11({
    text: "Lucía va por la calle y ve una tienda. ¡Quiere comprar un cómic!",
    image: "../assets/ahorro/actividades/actividad1-5.avif",
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:-5, dHappy:+7,
      nextImage:'../assets/ahorro/actividades/actividad1-6.avif',
      color: '#eb3225ff',        // ← color base (azul)
      textColor: '#ffffff'     // ← opcional (si quieres texto más claro en la tarjeta)
    },
    right: {
      dCoins: 0, dHappy:-5,
      nextImage:'../assets/ahorro/actividades/actividad1-7.avif',
      color: '#1091b9ff',       // ← color base (verde)
      textColor: '#ffffff'  // opcional
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "¡Al acabar la segunda semana Lucía recibe la paga!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);

window.slides.push( SlideTituloClase({ titulo: 'Semana 3' }) );

window.slides.push(
  SlideActividadAhorro11({
    text: "Tarde de bolera y restaurante con amigos. Ir le daría a Lucía mucha felicidad.",
    image: "../assets/ahorro/actividades/actividad1-8.avif",
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:-25, dHappy:+25,
      nextImage:'../assets/ahorro/actividades/actividad1-9.avif',
      color: '#eb9525ff',        // ← color base (azul)
      textColor: '#ffffff'     // ← opcional (si quieres texto más claro en la tarjeta)
    },
    right: {
      dCoins: 0, dHappy:-20,
      nextImage:'../assets/ahorro/actividades/actividad1-10.avif',
      color: '#ab10b9ff',       // ← color base (verde)
      textColor: '#ffffff'  // opcional
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "¡Hoora de la paga!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);

window.slides.push( SlideTituloClase({ titulo: 'Semana 4' }) );

window.slides.push( Slide({
  text: 'Esta semana unos amigos del colegio me han invitado a un torneo de baloncesto.',
  img: '../assets/ahorro/actividades/actividad1-11.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Seguro que me divierto pero no soy muy fan de este deporte.',
  img: '../assets/ahorro/actividades/actividad1-12.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Pero otros amigos de mi urbanización me han invitado a ver un partido de fútbol profesional. ¡Me encanta el fútbol!',
  img: '../assets/ahorro/actividades/actividad1-13.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));


window.slides.push(
  SlideActividadAhorro11({
    text: "¿Torneo de baloncesto o partido de fútbol?",
    image: "../assets/ahorro/actividades/actividad1-14.avif",
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:0, dHappy:+7,
      nextImage:'../assets/ahorro/actividades/actividad1-15.avif',
      color: '#eba625ff',        // ← color base (azul)
      textColor: '#ffffff',     // ← opcional (si quieres texto más claro en la tarjeta)
      icon: '../assets/icons/baloncesto.png', 
    },
    right: {
      dCoins: -10, dHappy:+25,
      nextImage:'../assets/ahorro/actividades/actividad1-16.avif',
      color: '#b91089ff',       // ← color base (verde)
      textColor: '#ffffff',  // opcional
      icon: '../assets/icons/futbol.png', 
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "Cuarta semana, ¡cuarta paga!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);

window.slides.push( SlideTituloClase({ titulo: 'Semana 5' }) );

window.slides.push( Slide({
  text: 'No me gusta mi funda de móvil, me quiero comprar una nueva.',
  img: '../assets/ahorro/actividades/actividad1-17.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));


window.slides.push(
  SlideActividadAhorro11({
    text: "¿Se debe comprar Lucía una funda nueva?",
    image: "../assets/ahorro/actividades/actividad1-18.avif",
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:-5, dHappy:+5,
      nextImage:'../assets/ahorro/actividades/actividad1-19.avif',
      color: '#35eb25ff',        // ← color base (azul)
      textColor: '#ffffff',     // ← opcional (si quieres texto más claro en la tarjeta)
    },
    right: {
      dCoins: 0, dHappy:-5,
      nextImage:'../assets/ahorro/actividades/actividad1-20.avif',
      color: '#10b9b9ff',       // ← color base (verde)
      textColor: '#ffffff',  // opcional
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "¡Lucía recibe la paga!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);

window.slides.push( SlideTituloClase({ titulo: 'Semana 6' }) );

window.slides.push( Slide({
  text: 'Esta semana mi familia me ha propuesto acampar en el campo. ¡Me encanta pasar tiempo con ellos!',
  img: '../assets/ahorro/actividades/actividad1-21.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Unos amigos me han propuesto ir a ver una peli que se estrena esta semana y llevo meses esperando.',
  img: '../assets/ahorro/actividades/actividad1-22.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Me encantan los dos planes, ¿qué hago?',
  img: '../assets/ahorro/actividades/actividad1-23.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));


window.slides.push(
  SlideActividadAhorro11({
    text: "Ir al estreno de la película o acampar con su familia.",
    image: "../assets/ahorro/actividades/actividad1-24.avif",
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:-5, dHappy:+15,
      nextImage:'../assets/ahorro/actividades/actividad1-25.avif',
      color: '#2549ebff',        // ← color base (azul)
      textColor: '#ffffff',     // ← opcional (si quieres texto más claro en la tarjeta)
      icon: '../assets/icons/cine.png', 
    },
    right: {
      dCoins: 0, dHappy:+15,
      nextImage:'../assets/ahorro/actividades/actividad1-26.avif',
      color: '#10b951ff',       // ← color base (verde)
      textColor: '#ffffff',  // opcional
      icon: '../assets/icons/acampar.png', 
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "¡La sexta paga!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);

window.slides.push( SlideTituloClase({ titulo: 'Semana 7' }) );

window.slides.push( Slide({
  text: '¡Ohh! Se me había olvidado que tengo que entregar una maqueta del sistema solar.',
  img: '../assets/ahorro/actividades/actividad1-27.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push( Slide({
  text: 'Y no tengo los materiales.',
  img: '../assets/ahorro/actividades/actividad1-28.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Lucía',
  narratorColor: '#26b416ff'
}));

window.slides.push(
  SlideActividadAhorro11({
    text: "¿Compra los materiales?",
    image: "../assets/ahorro/actividades/actividad1-29.avif",
    setpoints: { sp1: 30, sp2: 65, sp3: 100 },
    zoneIcons: {
      red:   "../assets/icons/icono-triste.png",
      orange:"../assets/icons/icono-normal.png",
      green: "../assets/icons/icono-feliz.png"
    },
    left:  {
      dCoins:-5, dHappy:+5,
      nextImage:'../assets/ahorro/actividades/actividad1-30.avif',
      color: '#eb2c25ff',        // ← color base (azul)
      textColor: '#ffffff',     // ← opcional (si quieres texto más claro en la tarjeta)
    },
    right: {
      dCoins: 0, dHappy:-30,
      nextImage:'../assets/ahorro/actividades/actividad1-31.avif',
      color: '#8310b9ff',       // ← color base (verde)
      textColor: '#ffffff',  // opcional
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  }),

  SlideActividadAhorro13({
    text: "¡¡Esta es la última paga!!",
    image: '../assets/ahorro/actividades/actividad1-4.avif',
    paga: 5,
    duration: 800,
    advanceAfter: 0 // pon >0 si quieres que avance sola
  })
);


window.slides.push( SlideTituloClase({ titulo: 'Semana 8' }) );

window.slides.push(
  SlideActividadAhorro14({
    textOk: '¡Sí! ¡Te llega para la bici nueva!',
    textKo: 'No has llegado para la bici nueva...',
    price: 30,
    image: '../assets/ahorro/actividades/actividad1-final.avif',
    left: {  // acción cuando ALCANZA (compra)
      // si no pones dCoins, se pone -price automáticamente
      dHappy: +50,
      nextImage: '../assets/ahorro/actividades/actividad1-final1.avif',
      color: '#25eb35ff',
      icon: '../assets/icons/tick.png',
      iconAlt: 'Comprar bici'
    },
    right: { // acción cuando NO ALCANZA (seguir)
      dCoins: 0,
      dHappy: -75,
      nextImage: '../assets/ahorro/actividades/actividad1-final2.avif',
      color: '#b91010ff',
      icon: '../assets/icons/cruz.png',
      iconAlt: 'Seguir ahorrando'
    }
  }),

  SlideActividadAhorro12({
    text: "Así afecta tu decisión…",
    duration: 1000,
    advanceAfter: 0
  })
);


window.slides.push( Slide({
  text: '¿Has visto qué importante es pensar antes de gastar?',
  img: '../assets/ahorro/escenas/escena29.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Aprender a equilibrar el ahorro y la diversión es clave para cumplir tus metas.',
  img: '../assets/ahorro/escenas/escena30.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: 'A veces, nos podemos podemos dejar llevar por el momento y gastar de más...',
  img: '../assets/ahorro/escenas/escena31.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '...pero si no pensamos un poco en el futuro, luego puede que nos quedemos sin dinero para lo que realmente queremos.',
  img: '../assets/ahorro/escenas/escena32.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'En la actividad, fuiste tomando decisiones semana a semana pero sin tener una estrategia clara.',
  img: '../assets/ahorro/escenas/escena33.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¿Te imaginas lo que podría pasar si, desde el principio, tuvieras una estrategia definida?',
  img: '../assets/ahorro/escenas/escena34.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: 'Puedes ahorrarlo todo, pero sin disfrutar de nada...',
  img: '../assets/ahorro/escenas/escena35.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Puedes ahorrar lo que te sobre después de haber disfrutado...',
  img: '../assets/ahorro/escenas/escena36.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: 'Puedes guardar una parte cada semana para ahorrar y el resto para disfrutar...',
  img: '../assets/ahorro/escenas/escena37.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'O puedes dividir tú dinero en montoncitos, cada uno para una cosa diferente...',
  img: '../assets/ahorro/escenas/escena38.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: '¡Ahora te toca decidir a ti! Si pudieras elegir tu propia estrategia para ahorrar... ¿cuál te gustaría más?',
  img: '../assets/ahorro/escenas/escena39.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideCuadroReflexion({
  id: 'a_r_2',
  pregunta: "¿Qué estrategia usarías? O invéntate tu estrategia ideal para tí.",
  placeholder: "Recuerda, no escribas demasiado...",
  minChars: 40,          // mínimo recomendado para que no respondan con 1 línea
  maxChars: 300,         // tope razonable para 10–14 años
  allowSkip: true,       // permite saltar (puedes poner false si quieres forzarlo)
  autoFocus: true,       // enfoca el textarea al entrar en la slide
  advanceOnSubmit: true, // al evaluar, pasa a la siguiente slide

  // ===== OPCIÓN A (callback local): usa UNA de las dos =====
  onEvaluate: async ({ question, answer }) => {
    // Ejemplo sencillo: considera "bien" si mencionan ideas clave
    const ok = /libertad|elegir|objetivo|emergencia|plan|decisiones/i.test(answer);
    return {
      ok,
      feedback: ok
        ? "Bien: conectas el ahorro con tomar mejores decisiones y cumplir objetivos."
        : "Mejorable: explica cómo el ahorro te permite decidir mejor (emergencias, objetivos, menos dependencia)."
    };
  }
}) );

window.slides.push( Slide({
  text: '¡Pues aquí ha terminado la clase de hoy!',
  img: '../assets/ahorro/escenas/escena40.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Esperamos que te haya gustado y que hayas aprendido por qué es tan importante ahorrar.',
  img: '../assets/ahorro/escenas/escena41.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis y Lucía',
  narratorColor: '#afb416ff'
}));

window.slides.push( Slide({
  text: 'Ahora contesta 3 preguntas ¡Queremos saber tu opinión de esta clase!',
  img: '../assets/ahorro/escenas/escena42.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis y Lucía',
  narratorColor: '#afb416ff'
}));


// ====== ENCUESTA DE SATISFACCIÓN ======

// 1) Escala
window.slides.push(
  SlideEncuestaEscala({
    id: 'a_1',
    pregunta: 'Después de la clase, del 1 al 10, ¿cómo de seguro te sientes para administrar tu paga?',
    min: 1, max: 10, step: 1, initial: 5,
    labels: { min: 'Poco', max: 'Mucho' },
    required: true,
    submitText: 'Continuar'
  })
);


// 2) Texto libre
window.slides.push(
  SlideEncuestaTexto({
    id: 'a_2',
    pregunta: '¿Qué es lo que MÁS te ha gustado de la clase?',
    placeholder: 'Escribe aquí tu respuesta...',
    minChars: 10,
    maxChars: 180,
    required: true,
    submitText: 'Enviar y seguir'
  })
);

window.slides.push(
  SlideEncuestaTexto({
    id: 'a_3',
    pregunta: 'Cómo mejorarías la clase?',
    placeholder: 'Escribe aquí tu respuesta...',
    minChars: 10,
    maxChars: 180,
    required: true,
    submitText: 'Enviar y seguir'
  })
);


window.slides.push( SlideBotonUnico({ 
  texto:'Volver al menú',
  action: 'menu' }) 
);

window.slides.push( SlideTituloClase({ titulo: '¡Muchas Gracias!' }) );

/*

window.slides.push( SlideTituloActividad({ actividad: '¿Cómo se fijan los tipos de interés? ' }) );

window.slides.push( SlideExplicacionActividad({
  guiones: [
    'Tú serás quién preste el dinero.',
    'Para cada persona deberás elegir el tipo de interés.',
    'Podrás elegir entre 3 opciones: Bajo, Medio o Alto.',
    'Tú actuas como el banquero, ajusta el interés según el riesgo.'
  ],
  recompensa: 'Por cada situación bien resuelta, ganarás 1 para el ranking.'
}));

window.slides.push( SlideDinamicaActividad({
  img: '../assets/actividades/actividad1-5.png',
  descripcion: 'Carla, 21 años y le gustaría comprarse un mochila para la universidad.',
  icons: [
    { src: '../assets/actividades/trabajo_parcial.png', text: 'Con trabajo parcial' },
    { src: '../assets/actividades/hucha_llena.png', text: 'Con unos pocos ahorros' },
    { src: '../assets/actividades/pulgar_arriba.png', text: 'Cumplió en su anterior préstamo' }
  ],
  onSelect: (choice) => console.log('Elegiste:', choice) // 'low' | 'mid' | 'high'
}) );


// Texto a la izquierda, SIN efecto, indicando textFraction (20%)
window.slides.push( Slide({
  text: 'Recuerda: elegir es comparar. ¡Y comparar es súperpoder!',
  img: '../assets/images/adamis_explorador.png',
  textPosition: 'left',
  textFraction: 0.2,
  typewriter: false,
  narrator: 'Profe',
  narratorColor: '#1dae69'
}));



/* ======= EJEMPLO (puedes borrar) =======

// 1) Título con letras animadas
// window.slides.push( SlideTituloClase({ titulo: 'Interés y Riesgo' }) );

// 2) Título como imagen
// window.slides.push( SlideTituloClase({ mode: 'imagen', img: '../assets/titulos/portada_riesgo.png', alt: 'Interés y Riesgo' }) );

// 3) Titulo actividad
window.slides.push( SlideTituloActividad({ actividad: 'Decide el interés' }) );

// 4) Explicación actividad (1–5 guiones)
window.slides.push( SlideExplicacionActividad({
  guiones: [
    'Observa la situación de la persona.',
    'Revisa los indicadores de riesgo (iconos).',
    'Elige el interés adecuado: Bajo, Medio o Alto.'
  ],
  recompensa: 'Por cada situación bien resuelta, ganarás 1 para el ranking.'
}) );

window.slides.push( SlideDinamicaActividad({
  img: '../assets/escenas/escena_demo.png',
  descripcion: 'Ana tiene empleo estable y ahorros moderados.',
  icons: [
    { src: '../assets/icons/empleo_estable.png', text: 'Empleo estable' },
    { src: '../assets/icons/ahorros.png',         text: 'Ahorros' },
    { src: '../assets/icons/historial_ok.png',    text: 'Buen historial' }
  ],
  onSelect: (choice) => console.log('Elegiste:', choice) // 'low' | 'mid' | 'high'
}) );

*/
