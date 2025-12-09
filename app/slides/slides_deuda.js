// ==================== SLIDES DE LA CLASE DE DEUDA ====================

window.CURRENT_CLASS = 'deuda';

window.slides.push( SlideTituloClase({ mode:'imagen', img:'../assets/instrucciones.avif' }) );

window.slides.push( SlideTituloClase({ mode:'imagen', img:'../assets/deuda/escenas/titulo-deuda.avif' }) );

window.slides.push( SlideTituloClase({ titulo: 'Introducción' }) );

// Texto abajo, imagen ~80%, efecto y narrador
window.slides.push( Slide({
  text: 'Hola! Mi nombre es Adamis.',
  img: '../assets/deuda/escenas/escena1.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'El tema de hoy es la deuda. Pero antes de nada te lanzo una pregunta... ',
  img: '../assets/deuda/escenas/escena3.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: '¿Es lo mismo prestar que donar? ',
  img: '../assets/deuda/escenas/escena2.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideTituloClase({ titulo: 'Cuadro de Reflexión' }) );


window.slides.push( SlideCuadroReflexion({
  id: 'reflex_deuda_donar_prestar',
  pregunta: "Explica con tus palabras la diferencia entre donar y prestar dinero. ",
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
  text: '¡No es lo mismo! Cuando das dinero sin esperar que te lo devuelvan, eso es un regalo o una donación.',
  img: '../assets/deuda/escenas/escena4.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({
  text: 'Pero cuando prestas dinero, esperas que la otra persona te lo devuelva en un tiempo pactado.',
  img: '../assets/deuda/escenas/escena5.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'La clave está en la promesa: Si es un regalo, no esperas nada, si es un préstamo, esperas que te lo devuelvan.',
  img: '../assets/deuda/escenas/escena6.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Teniendo clara esta diferencia...ahora sí que sí vamos a hablar de la deuda, un concepto clave en finanzas.',
  img: '../assets/deuda/escenas/escena7.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'A veces, queremos comprar algo antes de haber ahorrado suficiente dinero porque somos impacientes...',
  img: '../assets/deuda/escenas/escena8.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Podemos esperar y ahorrar...',
  img: '../assets/deuda/escenas/escena9.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));
window.slides.push( Slide({
  text: 'O pedir prestado y devolverlo más adelante cuando podamos.',
  img: '../assets/deuda/escenas/escena13.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Pero también puede darse la situación ¡al revés!',
  img: '../assets/deuda/escenas/escena10.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Por ejemplo: si tú tienes dinero ahorrado y una amiga no, puedes prestarle el dinero y esperar que te lo devuelva.',
  img: '../assets/deuda/escenas/escena11.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Así nace la ✨DEUDA✨: cuando pedimos prestado dinero con la promesa de devolverlo en el futuro.',
  img: '../assets/deuda/escenas/escena12.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'La deuda es una herramienta útil: nos permite usar dinero que no tenemos hoy... pero hay que tener cuidado.',
  img: '../assets/deuda/escenas/escena14.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideTituloClase({ titulo: 'Sección 1: \nDeuda buena vs\nDeuda mala' }) );

window.slides.push( Slide({
  text: '¿Cómo sé si una deuda es buena o mala?',
  img: '../assets/deuda/escenas/escena15.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Carlos quiere una consola de videojuegos que cuesta 500 €. No tiene dinero suficiente ahorrado, así que pide prestado y promete devolverlo en 6 meses.',
  img: '../assets/deuda/escenas/escena16.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'La consola solo la usa para divertirse. Ahora tiene que devolver el dinero poco a poco, y se queda sin margen para otros gastos importantes...',
  img: '../assets/deuda/escenas/escena17.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Esto es un ejemplo de deuda mala: los caprichos no son una buena razón para pedir dinero.',
  img: '../assets/deuda/escenas/escena18.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Otro ejemplo: Ana quiere empezar un pequeño negocio de pulseras...',
  img: '../assets/deuda/escenas/escena19.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Pide prestado 50 € para comprar materiales, hace pulseras y las vende por 100 € en total.',
  img: '../assets/deuda/escenas/escena20.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Esto es una deuda buena: pidió prestado para generar más dinero y ganó más de lo que tenía que devolver.',
  img: '../assets/deuda/escenas/escena21.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'La deuda buena te ayuda a generar más dinero. La deuda mala te quita dinero y te deja con menos opciones.',
  img: '../assets/deuda/escenas/escena22.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));


window.slides.push( Slide({ 
  text: '¿Veis la diferencia? Vamos a poner estos conocimientos en práctica con una actividad. ¡Manos a la obra!',
  img: '../assets/deuda/escenas/escena23.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( SlideTituloActividad({ actividad: '¿Cómo manejas la deuda?' }) );


window.slides.push( 

  Slide({
  text: '¡Hola! Soy Osi, y en esta actividad me vas a guiar a tomar una serie de decisiones...',
  img: '../assets/deuda/actividades/actividad1-0.1.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Osi',
  narratorColor: '#16a951ff'
}),
  
  Slide({
  text: '¿Me ayudas a gestionar mi dinero durante 8 semanas?',
  img: '../assets/deuda/actividades/actividad1-0.2.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Osi',
  narratorColor: '#16a951ff'
}));

window.slides.push( SlideExplicacionActividad({
  guiones: [

    'Osi se va a enfrentar a diferentes situaciones y vas a tener que ayudarle a tomar decisiones.',
    'Osi tiene una paga semanal de 10€ y se te mostrará su saldo actual.',
    'Osi puede optar por ahorrar dinero.',
    'Osi puede pedir prestado dinero y los préstamos aparecerán en una tabla.',
    'Si Osi pide prestado, tendrá que devolverlo en las semanas siguientes. Si no lo hace tendrá que pagar una penalización de 5€.',

    
  ],
  recompensa: 'Cuanto mejor gestiones su dinero ¡más monedas podrás ganar para el ranking!'
}));

window.slides.push( Slide({
  text: '¡¡¡¡Ojo!!!! A Osi le gusta hacer planes y cumplir con lo que debe.',
  img: '../assets/deuda/actividades/actividad1-0.3.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Osi tiene un medidor de su impaciencia.',
  img: '../assets/deuda/actividades/actividad1-0.4.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Admais',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Si Osi hace lo que se le propone la barra de impaciencia bajará.',
  img: '../assets/deuda/actividades/actividad1-0.5.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Si Osi no hace el plan, la barra de impaciencia subirá.',
  img: '../assets/deuda/actividades/actividad1-0.6.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'El objetivo es no sobrepasar el límite, mientras gestionas el dinero de Osi.',
  img: '../assets/deuda/actividades/actividad1-0.7.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Vamos a comenzar con un pequeño tutorial para que veas cómo funciona todo.',
  img: '../assets/deuda/actividades/actividad1-0.8.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push(SlideActividadDeuda11Tutorial({
  text: 'Primero, intenta rechazar la compra de algo que te apetece.',
  event: { cost: 6, weeks: 8, loanWeeks: 2 },
  tutorial: { step:'rechazar', text:'Pulsa Rechazar', block:true, autoNext:true}
}));


window.slides.push(SlideActividadDeuda11Tutorial({
  text: 'Ahora intenta pagar 2 € para comprar algo que quieres.',
  event: { cost: 2},
  tutorial: { step:'pagar', text:'Pulsa “Pagar”', block:true, autoNext:true}
}));

window.slides.push(SlideActividadDeuda11Tutorial({
  text: 'Pide un préstamo y compra algo que cuesta 5€.',
  event: { cost: 5, weeks: 8, loanWeeks: 2 },
  tutorial: {
    step:'pedir',
    text:'Pulsa “Pedir préstamo”',
    block:true,
    nextStep:'tabla',
    tablaText:'Mira cómo aparece el nuevo préstamo en la tabla',
    autoNext:true
  }
}));

window.slides.push(SlideActividadDeuda11Tutorial({
  text: 'Devuelve el préstamo que has pedido y toma una decisión (pagar o rechazar).',
  event: {},
  tutorial: {
    step: 'devolver',
    text: 'Pulsa en la fila del préstamo para devolverlo',
    block: false,          
    autoNext: true        
  }
}));

window.slides.push(SlideActividadDeuda11FinTutorial());


window.slides.push( Slide({
  text: 'Ahora si vamos con la actividad, ¡manos a la obra!',
  img: '../assets/deuda/actividades/actividad1-0.9.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));
window.slides.push( SlideTituloClase({ titulo: 'Semana 1' }) );
// Semana 1: ¿Gasto Impulsivo o Controlado?
window.slides.push(
  SlideActividadDeuda11({
    text: 'Mis amigos me proponen ir al cine. La entrada cuesta 12 €. ¿Qué hago?',
    image: '../assets/deuda/actividades/actividad1-1.1.avif',
    event: { 
      cost: 12, 
      imageAccepted: '../assets/deuda/actividades/actividad1-1.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-1.3.avif',
      impatience: {
        deltaOnPay:-20,
        deltaOnReject: +25,
        capPct: 60
      }
    },  
  }),

  SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),


  SlideActividadDeuda12({
    text: 'Recibes tu primera paga semanal.',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),

  SlideTituloClase({ titulo: 'Semana 2' }),

  // Semana 2: Gasto Obligatorio – Reparación del Móvil
  SlideActividadDeuda11({
    text: 'Se me ha roto el móvil y repararlo cuesta 20 €. ¿Qué es lo mejor que puedo hacer?',
    image: '../assets/deuda/actividades/actividad1-2.1.avif',
    event: { 
      cost: 20,
      imageAccepted: '../assets/deuda/actividades/actividad1-2.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-2.3.avif',
      impatience: {
        deltaOnPay:-20,
        deltaOnReject: +75,
        capPct: 60
      }
    } 
  }),

    SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),

  SlideActividadDeuda12({
    text: 'Recibes tu segunda paga semanal.',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),

  SlideTituloClase({ titulo: 'Semana 3' }),

  // Semana 3: Oportunidad de Negocio – Puesto de Limonadas
  SlideActividadDeuda11({
    text: 'Tengo una oportunidad de negocio: montar un puesto de limonada que cuesta 30 € y me puede dar 50 € la próxima semana.',
    image: '../assets/deuda/actividades/actividad1-3.1.avif',
    event: {
      cost: 30,
      incomeNextWeek: 50,
      imageAccepted: '../assets/deuda/actividades/actividad1-3.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-3.3.avif',
      inpatience: {
        deltaOnPay:-40,
        deltaOnReject: +35,
        capPct: 60
      }
    }
  }),

    SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),

  SlideActividadDeuda12({
    text: 'Hoy recibes tu tercera paga semanal.',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),

  SlideTituloClase({ titulo: 'Semana 4' }),

  // Semana 4: Gasto Impulsivo – Ropa de Marca
    SlideActividadDeuda11({
    text: 'He visto una sudadera exclusiva que cuesta 35€ y quiero comprarla',
    image: '../assets/deuda/actividades/actividad1-4.1.avif',
    event: {
      cost: 35,
      imageAccepted: '../assets/deuda/actividades/actividad1-4.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-4.3.avif',
      impatience: {
        deltaOnPay:-20,
        deltaOnReject: +25,
        capPct: 60
      }
    }
  }),

    SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),

  SlideActividadDeuda12({
    text: 'Hoy recibes tu tercera paga semanal.',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),



  SlideTituloClase({ titulo: 'Semana 5' }),

  SlideActividadDeuda1s({
    text: 'Un amigo te pide 15 € para una supuesta emergencia y dice que te lo devuelve en 1 semana. ¿Se lo das?',
    image: '../assets/deuda/actividades/actividad1-5.1.avif',
    event: {
      imageAccepted: '../assets/deuda/actividades/actividad1-5.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-5.3.avif',
      giveLoanAmount: 15,           
      giveLoanWeeks:  1,            
      impatience: {
        deltaOnPay:-20,
        deltaOnReject: +25,
        capPct: 60
      }
    }
  }),
       SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),

  SlideActividadDeuda12({
    text: 'La quinta paga semanal. ¡Estamos cerca del final!',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),

 SlideTituloClase({ titulo: 'Semana 6' }),

  // Semana 6: Gasto Impulsivo – Videojuego Nuevo
  SlideActividadDeuda11({
    text: 'He visto un nuevo juego que todos mis amigos tienen. Cuesta 15 € y tengo muchas ganas de jugarlo con ellos.',
    image: '../assets/deuda/actividades/actividad1-6.1.avif',
    event: { 
      cost: 15, 
      imageAccepted: '../assets/deuda/actividades/actividad1-6.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-6.3.avif',
      impatience: {
        deltaOnPay:-30,
        deltaOnReject: +45,
        capPct: 60
      }
    }
  }),

      SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),

  SlideActividadDeuda12({
    text: 'La sexta paga semanal. ¡Queda poco!',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),

  SlideTituloClase({ titulo: 'Semana 7' }),

  // Semana 7: Gasto Obligatorio – Medicinas
  SlideActividadDeuda11({
    text: 'Estás enfermo y necesitas comprar medicinas, cuestan 45€.',
    image: '../assets/deuda/actividades/actividad1-7.1.avif',
    event: { 
      cost: 45, 
      imageAccepted: '../assets/deuda/actividades/actividad1-7.2.avif',
      imageRejected: '../assets/deuda/actividades/actividad1-7.3.avif',
      impatience: {
        deltaOnPay:-40,
        deltaOnReject: +95,
        capPct: 60
      }
    }
  }),

  SlideActividadDeuda13({
    text: 'Aplicando tu decisión…',
  }),
  SlideActividadDeuda12({
    text: 'Resumen de la semana 7 y paga semanal.',
    image: '../assets/deuda/actividades/actividad1-paga.avif',
    paga: 10
  }),

SlideTituloClase({ titulo: 'Semana 8: Cierre' }),

SlideActividadDeuda14({
  event: {
    successText: '🎉 ¡Objetivo logrado! Controlaste la impaciencia y no tienes impagos.',
    successImage: '../assets/deuda/actividades/actividad1-cierre-exito.avif',
    failText: 'Te has pasado del umbral o llegaste con impagos...',
    failImage: '../assets/deuda/actividades/actividad1-cierre-fracaso.avif'
  }

} 
)
);

window.slides.push( Slide({
  text: '¡Pues aquí ha terminado la clase de hoy!',
  img: '../assets/deuda/escenas/escena24.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis',
  narratorColor: '#16a1b4'
}));

window.slides.push( Slide({
  text: 'Esperamos que te haya gustado y que hayas aprendido a usar la deuda de forma inteligente.',
  img: '../assets/deuda/escenas/escena25.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis y Osi',
  narratorColor: '#afb416ff'
}));

window.slides.push( Slide({
  text: 'Ahora contesta 5 preguntas ¡Queremos saber tu opinión de esta clase!',
  img: '../assets/deuda/escenas/escena26.avif',
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: 'Adamis y Osi',
  narratorColor: '#afb416ff'
}));

// 1) Opción múltiple (n opciones arbitrarias)
window.slides.push(
  SlideEncuestaOpcionMultiple({
    id: 'deuda_q1',
    pregunta: '¿Te gustaría aprender a usar bien la deuda?',
    options: [
      'Sí, me gustaría.',
      'No, no me interesa la deuda.',
      'Me da igual.'
    ],
    shuffle: true,            // mezcla las opciones
    required: true,           // obliga a elegir antes de continuar
    submitText: 'Continuar'
  })
);

window.slides.push(
  SlideEncuestaOpcionMultiple({
    id: 'deuda_q2',
    pregunta: '¿Te gustaría tener una asignatura para aprender a usar el dinero?',
    options: [
      'Sí, me gustaría.',
      'El dinero me da igual.'
    ],
    shuffle: true,            // mezcla las opciones
    required: true,           // obliga a elegir antes de continuar
    submitText: 'Continuar'
  })
);

window.slides.push(
  SlideEncuestaOpcionMultiple({
    id: 'deuda_q3',
    pregunta: '¿Te gustaría dar clases usando el ordenador?',
    options: [
      'Sí, me gustaría.',
      'No, prefiero los libros.'
    ],
    shuffle: true,            // mezcla las opciones
    required: true,           // obliga a elegir antes de continuar
    submitText: 'Continuar'
  })
);

// 2) Texto libre
window.slides.push(
  SlideEncuestaTexto({
    id: 'deuda_q4',
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
    id: 'deuda_q5',
    pregunta: '¿Qué es lo que MENOS te ha gustado de la clase?',
    placeholder: 'Escribe aquí tu respuesta...',
    minChars: 10,
    maxChars: 180,
    required: true,
    submitText: 'Enviar y seguir'
  })
);

// 3) Escala 1–10
window.slides.push(
  SlideEncuestaEscala({
    id: 'deuda_q6',
    pregunta: 'Del 1 al 10, ¿Cuánto crees que es de importante aprender a utilizar el dinero de forma inteligente?',
    min: 1, max: 10, step: 1, initial: 5,
    labels: { min: 'Poco', max: 'Mucho' },
    required: true,
    submitText: 'Continuar'
  })
);

window.slides.push( SlideTituloClase({ titulo: '¡Muchas Gracias!' }) );
