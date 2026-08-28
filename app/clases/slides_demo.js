window.CURRENT_CLASS = 'demo';

const DEMO_SCENES_DIR = '../assets/demo/ahorrar-meta/escenas';
const DEMO_SPEAKERS = Object.freeze({
  adamis: Object.freeze({ name: 'Adamis' }),
  chispa: Object.freeze({ name: 'Chispa' }),
  brote: Object.freeze({ name: 'Brote' })
});

function demoScenePath(scene) {
  return `${DEMO_SCENES_DIR}/escena-${String(scene).padStart(2, '0')}.avif`;
}

function pushDemoScenes(scenes) {
  scenes.forEach(({ scene, speaker, text, alt }) => {
    const character = DEMO_SPEAKERS[speaker];
    window.slides.push(
      Slide({
        text,
        img: demoScenePath(scene),
        alt,
        textPosition: 'bottom',
        imageFraction: '72%',
        typeSpeed: 44,
        narrator: character.name,
        speakerKey: speaker
      })
    );
  });
}

window.slides.push(
  SlideTituloClase({ titulo: 'Ahorrar con una meta' })
);

// ==================== Introducción · escenas 1–6 ====================
pushDemoScenes([
  {
    scene: 1,
    speaker: 'adamis',
    text: '“¡Hoooola, [Nombre]! Soy Adamis. Hoy tenemos una misión especial.”',
    alt: 'Adamis presenta una misión especial.'
  },
  {
    scene: 2,
    speaker: 'adamis',
    text: '“Queremos conseguir este robot.”',
    alt: 'Adamis muestra el robot de la meta.'
  },
  {
    scene: 3,
    speaker: 'chispa',
    text: '“¡Me encanta! Yo quiero empezar ya.”',
    alt: 'Chispa reacciona con entusiasmo.'
  },
  {
    scene: 4,
    speaker: 'brote',
    text: '“Tenemos un problema. Cuesta veinte monedas.”',
    alt: 'Brote explica el precio del robot.'
  },
  {
    scene: 5,
    speaker: 'chispa',
    text: '“Y ahora mismo no tenemos…”',
    alt: 'Chispa comprueba que no tienen monedas.'
  },
  {
    scene: 6,
    speaker: 'adamis',
    text: '“Entonces tendremos que descubrir cómo conseguirlo.”',
    alt: 'Adamis propone descubrir cómo lograr la meta.'
  }
]);

// ==================== Qué significa ahorrar · escenas 8–14 ====================
pushDemoScenes([
  {
    scene: 8,
    speaker: 'adamis',
    text: '“Veamos una forma de acercarnos a nuestra meta.”',
    alt: 'Adamis introduce una forma de alcanzar la meta.'
  },
  {
    scene: 9,
    speaker: 'adamis',
    text: '“Imagina que recibes diez monedas.”',
    alt: 'Adamis presenta diez monedas.'
  },
  {
    scene: 10,
    speaker: 'adamis',
    text: '“Puedes utilizar una parte ahora y guardar otra para después.”',
    alt: 'Adamis divide las monedas entre usar y guardar.'
  }
]);

window.slides.push(
  SlideTerminoIntro({
    text: '“Cuando reservamos una parte para utilizarla más adelante, estamos ahorrando.”',
    img: demoScenePath(11),
    alt: 'Adamis explica qué significa ahorrar.',
    narrator: DEMO_SPEAKERS.adamis.name,
    speakerKey: 'adamis',
    typeSpeed: 44,
    term: 'AHORRAR',
    meaning: 'Reservar una parte del dinero para utilizarla más adelante.'
  })
);

pushDemoScenes([
  {
    scene: 12,
    speaker: 'chispa',
    text: '“¡Ah! Entonces ahorrar no es perder esas monedas.”',
    alt: 'Chispa comprende que ahorrar no es perder monedas.'
  },
  {
    scene: 13,
    speaker: 'brote',
    text: '“Siguen ahí para cuando decidamos utilizarlas.”',
    alt: 'Brote explica que las monedas siguen disponibles.'
  },
  {
    scene: 14,
    speaker: 'adamis',
    text: '“Exacto. Ahorrar nos da más opciones para el futuro.”',
    alt: 'Adamis explica las opciones que ofrece ahorrar.'
  }
]);

// ==================== Una meta clara · escenas 15–16 ====================
pushDemoScenes([
  {
    scene: 15,
    speaker: 'adamis',
    text: '“Nuestra meta es conseguir el robot. Necesitamos veinte monedas en cinco semanas.”',
    alt: 'Adamis presenta la meta del robot.'
  },
  {
    scene: 16,
    speaker: 'adamis',
    text: '“Una meta clara nos dice qué queremos, cuánto necesitamos y cuándo queremos conseguirlo.”',
    alt: 'Adamis explica las partes de una meta clara.'
  }
]);

// ==================== Guardar primero · escenas 17–22 ====================
pushDemoScenes([
  {
    scene: 17,
    speaker: 'adamis',
    text: '“Hoy vas a aprender un truco sencillo.”',
    alt: 'Adamis presenta un truco de ahorro.'
  },
  {
    scene: 18,
    speaker: 'adamis',
    text: '“Podemos decidir cuánto ahorrar antes de empezar a gastar.”',
    alt: 'Adamis explica cómo guardar antes de gastar.'
  },
  {
    scene: 19,
    speaker: 'chispa',
    text: '“¡Claro! Porque si lo primero que hago es gastar…”',
    alt: 'Chispa piensa en gastar primero.'
  },
  {
    scene: 20,
    speaker: 'chispa',
    text: '“A lo mejor al final no queda nada.”',
    alt: 'Chispa descubre que podría no quedar dinero.'
  },
  {
    scene: 21,
    speaker: 'brote',
    text: '“En cambio, si guardamos una parte cada vez, podemos crear un hábito…”',
    alt: 'Brote explica cómo crear el hábito de ahorrar.'
  },
  {
    scene: 22,
    speaker: 'adamis',
    text: '“Y los hábitos pequeños pueden acercarnos poco a poco a una meta grande.”',
    alt: 'Adamis relaciona los hábitos con una meta grande.'
  }
]);

// ==================== Introducción a Misión Meta · escenas 23–34 ====================
pushDemoScenes([
  {
    scene: 23,
    speaker: 'adamis',
    text: '“Álex quiere conseguir el robot y tú le vas a ayudar. Tiene cinco semanas y recibirá diez monedas cada semana.”',
    alt: 'Adamis presenta la misión de Álex.'
  },
  {
    scene: 24,
    speaker: 'chispa',
    text: '“Pero durante esas semanas aparecerán situaciones sorpresa.”',
    alt: 'Chispa avisa de las situaciones sorpresa.'
  },
  {
    scene: 25,
    speaker: 'brote',
    text: '“No sabremos qué ocurre cada semana hasta después de decidir cuánto guardar.”',
    alt: 'Brote explica cuándo se revelan las sorpresas.'
  },
  {
    scene: 26,
    speaker: 'adamis',
    text: '“Al principio de cada semana decidirás si quieres guardar una parte.”',
    alt: 'Adamis explica la decisión semanal de ahorro.'
  },
  {
    scene: 27,
    speaker: 'chispa',
    text: '“Después descubrirás qué ocurre y tendrás que tomar una decisión.”',
    alt: 'Chispa explica la decisión tras cada sorpresa.'
  },
  {
    scene: 28,
    speaker: 'brote',
    text: '“Si eliges una opción de pago, usaremos primero el monedero.”',
    alt: 'Brote explica que se usa primero el monedero.'
  },
  {
    scene: 29,
    speaker: 'chispa',
    text: '“¿Y si no tenemos suficiente?”',
    alt: 'Chispa pregunta qué ocurre si falta dinero.'
  },
  {
    scene: 30,
    speaker: 'adamis',
    text: '“Podrás abrir la hucha y sacar solo lo que falte.”',
    alt: 'Adamis explica cómo usar la hucha.'
  },
  {
    scene: 31,
    speaker: 'brote',
    text: '“La hucha sigue siendo tuya, pero sacar dinero te aleja de la meta.”',
    alt: 'Brote explica el efecto de sacar dinero de la hucha.'
  },
  {
    scene: 32,
    speaker: 'adamis',
    text: '“Además de ahorrar, tendrás que cuidar el bienestar de Álex.”',
    alt: 'Adamis introduce el bienestar de Álex.'
  }
]);

window.slides.push(
  SlideExplicacionActividad({
    guiones: [
      'HUCHA FINAL → 20 monedas o más.',
      'BIENESTAR FINAL → 70 puntos o más.',
      'BIENESTAR INICIAL → 60 puntos.'
    ]
  })
);

pushDemoScenes([
  {
    scene: 33,
    speaker: 'chispa',
    text: '“¡Al acabar las 5 semanas tendremos que tener el bienestar por encima de 70!”',
    alt: 'Chispa recuerda la meta final de bienestar.'
  },
  {
    scene: 34,
    speaker: 'adamis',
    text: '“¿Preparado? ¡Vamos con la misión!”',
    alt: 'Adamis invita a comenzar la misión.'
  }
]);

window.slides.push(
  SlideTituloClase({ titulo: 'Contenido de la demo en preparación' })
);
