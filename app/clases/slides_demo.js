window.CURRENT_CLASS = 'demo';

const DEMO_SCENES_DIR = '../assets/demo/ahorrar-meta/escenas';
const DEMO_ACTIVITY_DIR = '../assets/demo/ahorrar-meta/actividad';
const DEMO_SPEAKERS = Object.freeze({
  adamis: Object.freeze({ name: 'Adamis' }),
  chispa: Object.freeze({ name: 'Chispa' }),
  brote: Object.freeze({ name: 'Brote' })
});

function demoScenePath(scene) {
  return `${DEMO_SCENES_DIR}/escena-${String(scene).padStart(2, '0')}.avif`;
}

function demoActivityPath(name) {
  return `${DEMO_ACTIVITY_DIR}/${name}.avif`;
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

// ==================== Control inicial · escena 7 ====================
pushDemoScenes([
  {
    scene: 7,
    speaker: 'adamis',
    text: '“Pero antes quiero saber qué harías tú.”',
    alt: 'Adamis invita a compartir una idea.'
  }
]);

window.slides.push(
  SlideCuadroReflexion({
    id: 'CONTROL_INICIAL',
    pregunta: '¿Qué harías para conseguir algo que te importa si todavía no tienes suficiente dinero?',
    placeholder: 'Escribe aquí tu respuesta…',
    mode: 'capture',
    required: true,
    submitText: 'Guardar respuesta',
    autoFocus: true,
    advanceOnSubmit: true
  })
);

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

window.slides.push(
  SlideMiniactividadUnirConceptos({
    title: 'Une cada pregunta con su respuesta',
    introTitle: 'Mini actividad',
    introText: 'Une cada pregunta con su respuesta correcta.',
    introButtonText: 'Empezar',

    leftTitle: 'Preguntas',
    rightTitle: 'Respuestas',
    leftEyebrow: 'Pregunta',
    rightEyebrow: 'Respuesta',

    instructions: 'Une cada pregunta con su respuesta correcta.',
    hideEmptyMedia: true,

    showTutorial: false,
    shuffleRight: true,

    pairs: [
      {
        id: 'meta-que',
        left: { text: '¿Qué queremos?' },
        right: {
          text: 'Robot',
          image: demoScenePath(2),
          alt: 'Adamis junto al robot de la meta.'
        }
      },
      {
        id: 'meta-cuanto',
        left: { text: '¿Cuánto cuesta?' },
        right: { text: '20 monedas' }
      },
      {
        id: 'meta-cuando',
        left: { text: '¿Cuándo lo queremos?' },
        right: { text: '5 semanas' }
      }
    ]
  })
);

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
  SlideMisionMeta({
    title: 'Misión Meta',
    totalWeeks: 5,
    weeklyIncome: 10,
    initialWellbeing: 60,
    savingsGoal: 20,
    wellbeingGoal: 70,
    defaultSaving: 4,
    image: demoActivityPath('alex-paga'),
    alt: 'Álex recibe su paga semanal de diez monedas.',
    weeks: [
      {
        week: 1,
        id: 'recreativos',
        title: 'Un plan con amigos',

        reveal: [
          {
            scene: 35,
            speaker: 'chispa',
            image: demoScenePath(35),
            alt: 'Chispa anuncia el primer plan de la semana.',
            text: '“¡Ya tenemos el primer plan!”'
          },
          {
            scene: 36,
            speaker: 'brote',
            image: demoScenePath(36),
            alt: 'Brote explica el coste y el bienestar del plan.',
            text: '“Cuesta ocho monedas y puede darnos más bienestar.”'
          }
        ],

        decision: {
          prompt: '¿Qué quieres hacer?',
          image: demoActivityPath('recreativos'),
          alt: 'Plan de una tarde en los recreativos.',

          options: [
            {
              id: 'accept',
              label: 'ACEPTAR',
              cost: 8,
              wellbeingDelta: 10
            },
            {
              id: 'reject',
              label: 'RECHAZAR',
              cost: 0,
              wellbeingDelta: -7
            }
          ],

          guidedChoice: 'reject'
        },

        feedback: [
          {
            scene: 37,
            speaker: 'adamis',
            image: demoScenePath(37),
            alt: 'Adamis explica la consecuencia de renunciar al plan.',
            text: '“Has renunciado a un plan que le apetecía a Álex, pero conservas tus monedas.”'
          },
          {
            scene: 38,
            speaker: 'chispa',
            image: demoScenePath(38),
            alt: 'Chispa recuerda la meta de ahorro.',
            text: '“Esta vez hemos decidido pensar en nuestra meta.”'
          }
        ]
      },
      {
        week: 2,
        id: 'botella',
        title: 'Una compra impulsiva',

        reveal: [
          {
            scene: 39,
            speaker: 'chispa',
            image: demoScenePath(39),
            alt: 'Chispa descubre una botella luminosa.',
            text: '“¡Mira esta botella luminosa!”'
          },
          {
            scene: 40,
            speaker: 'brote',
            image: demoScenePath(40),
            alt: 'Brote compara la botella actual con la nueva.',
            text: '“Pero la otra botella sigue funcionando…”'
          }
        ],

        decision: {
          prompt: '¿Qué quieres hacer?',
          image: demoActivityPath('botella'),
          alt: 'Decisión sobre comprar una botella luminosa.',

          options: [
            {
              id: 'accept',
              label: 'ACEPTAR',
              cost: 7,
              wellbeingDelta: 2
            },
            {
              id: 'reject',
              label: 'RECHAZAR',
              cost: 0,
              wellbeingDelta: -1
            }
          ],

          guidedChoice: 'reject'
        },

        feedback: [
          {
            scene: 41,
            speaker: 'adamis',
            image: demoScenePath(41),
            alt: 'Adamis explica la decisión de no comprar la botella.',
            text: '“Esta vez has renunciado a algo que te gustaba, pero que no necesitabas.”'
          },
          {
            scene: 42,
            speaker: 'chispa',
            image: demoScenePath(42),
            alt: 'Chispa guarda monedas para una meta más importante.',
            text: '“Prefiero guardar esas monedas para algo que me importe más.”'
          },
          {
            scene: 43,
            speaker: 'adamis',
            image: demoScenePath(43),
            alt: 'Adamis explica la importancia de priorizar.',
            text: '“¡Exacto! Estamos aprendiendo a priorizar.”'
          }
        ]
      },
      {
        week: 3,
        id: 'cohetes',
        title: 'Otro plan especial',

        reveal: [
          {
            scene: 44,
            speaker: 'chispa',
            image: demoScenePath(44),
            alt: 'Chispa presenta un taller de cohetes de papel.',
            text: '“Han organizado un taller de cohetes de papel. ¡A Álex le encanta!”'
          }
        ],

        decision: {
          prompt: '¿Qué quieres hacer?',
          image: demoActivityPath('cohete'),
          alt: 'Decisión sobre asistir al taller de cohetes.',

          options: [
            {
              id: 'accept',
              label: 'ACEPTAR',
              cost: 5,
              wellbeingDelta: 15
            },
            {
              id: 'reject',
              label: 'RECHAZAR',
              cost: 0,
              wellbeingDelta: -9
            }
          ],

          guidedChoice: 'accept'
        },

        feedback: [
          {
            scene: 45,
            speaker: 'adamis',
            image: demoScenePath(45),
            alt: 'Adamis acompaña a Álex en el taller de cohetes.',
            text: '“Esta vez has decidido gastar cinco monedas en un plan que te hacía mucha ilusión.”'
          }
        ]
      },
      {
        week: 4,
        id: 'baloncesto',
        title: 'Dos formas de disfrutar',

        reveal: [
          {
            scene: 46,
            speaker: 'chispa',
            image: demoScenePath(46),
            alt: 'Chispa presenta dos planes de baloncesto.',
            text: '“¡Esta semana tenemos dos planes de baloncesto!”'
          },
          {
            scene: 47,
            speaker: 'chispa',
            image: demoScenePath(47),
            alt: 'Álex y Chispa esperan para entrar al estadio de baloncesto.',
            text: '“Ir al estadio a ver al equipo favorito de Álex…”'
          },
          {
            scene: 48,
            speaker: 'chispa',
            image: demoScenePath(48),
            alt: 'Álex y sus amigos juegan al baloncesto en una cancha.',
            text: '“O jugar con sus amigos en la cancha de baloncesto”'
          }
        ],

        decision: {
          prompt: '¿Qué quieres hacer?',
          image: demoActivityPath('baloncesto'),
          alt: 'Comparación entre ir al estadio y jugar con amigos.',

          options: [
            {
              id: 'stadium',
              label: 'IR AL PARTIDO EN EL ESTADIO',
              cost: 15,
              wellbeingDelta: 15
            },
            {
              id: 'court',
              label: 'JUGAR EN LA CANCHA CON AMIGOS',
              cost: 0,
              wellbeingDelta: 10
            }
          ],

          guidedChoice: 'court'
        },

        feedback: [
          {
            scene: 49,
            speaker: 'chispa',
            image: demoScenePath(49),
            alt: 'Chispa celebra una canasta con Álex y sus amigos.',
            text: '“¡Nos lo hemos pasado genial y no hemos gastado ninguna moneda!”'
          },
          {
            scene: 50,
            speaker: 'brote',
            image: demoScenePath(50),
            alt: 'Brote descansa junto a la hucha después de jugar al baloncesto.',
            text: '“Y esas monedas siguen disponibles para nuestra meta o para algo importante que aparezca después.”'
          }
        ]
      },
      {
        week: 5,
        id: 'materiales',
        title: 'El imprevisto',

        reveal: [
          {
            scene: 51,
            speaker: 'chispa',
            image: demoScenePath(51),
            alt: 'Chispa observa que la meta del robot está cerca.',
            text: '“¡Ya casi llegamos al final!”'
          },
          {
            scene: 52,
            speaker: 'adamis',
            image: demoScenePath(52),
            alt: 'Adamis presenta un imprevisto de material escolar.',
            text: '“Pero esta semana no aparece un plan. Aparece un imprevisto.”'
          },
          {
            scene: 53,
            speaker: 'brote',
            image: demoScenePath(53),
            alt: 'Brote muestra el material escolar obligatorio.',
            text: '“Es un gasto muuuy importante.”'
          }
        ],

        decision: {
          prompt: '¿Qué quieres hacer?',
          image: demoActivityPath('materiales'),
          alt: 'Decisión sobre pagar material obligatorio del colegio.',

          options: [
            {
              id: 'pay',
              label: 'PAGAR',
              cost: 10,
              wellbeingDelta: 5
            },
            {
              id: 'no-pay',
              label: 'NO PAGAR',
              cost: 0,
              wellbeingDelta: -40
            }
          ],

          guidedChoice: 'pay'
        },

        feedback: [
          {
            scene: 54,
            speaker: 'brote',
            image: demoScenePath(54),
            alt: 'Brote aparece junto a los materiales escolares comprados.',
            text: '“Este gasto era importante. Por eso había que atenderlo.”'
          },
          {
            scene: 55,
            speaker: 'chispa',
            image: demoScenePath(55),
            alt: 'Chispa muestra cómo el monedero y la hucha permiten pagar el gasto.',
            text: '“Y gracias al dinero que habíamos guardado, tenemos cómo pagarlo.”'
          }
        ]
      }
    ]
  })
);

window.slides.push(
  SlideTituloClase({ titulo: 'Contenido de la demo en preparación' })
);
