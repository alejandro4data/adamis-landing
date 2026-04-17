window.slides.push(
  SlideEncuestaOpcionMultiple({
    id: 'g_1',
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
    id: 'g_2',
    pregunta: '¿Te gusta dar clase usando el ordenador?',
    options: [
      'Sí, prefiero SÓLO ordenador',
      'No, prefiero SÓLO los libros.',
      'Me gusta usar el ordenador, pero también materiales físicos.'
    ],
    shuffle: true,            // mezcla las opciones
    required: true,           // obliga a elegir antes de continuar
    submitText: 'Continuar'
  })
);

window.slides.push(
  SlideEncuestaOpcionMultiple({
    id: 'g_3',
    pregunta: 'Cuántas veces te gustaría tener a la semana una clase de Educación Financiera.',
    options: [
      'Una vez a la semana.',
      'Dos veces a la semana.',
      'Más de dos veces a la semana.',
      'Ninguna.'
    ],
    shuffle: true,            // mezcla las opciones
    required: true,           // obliga a elegir antes de continuar
    submitText: 'Continuar'
  })
);

window.slides.push(
  SlideEncuestaEscala({
    id: 'g_4',
    pregunta: 'Del 1 al 10 ¿Cuánto crees que te servirá lo que has aprendido hoy para tu vida fuera del colegio (con tu familia, tus ahorros o tus compras)?',
    min: 1, max: 10, step: 1, initial: 5,
    labels: { min: 'Poco', max: 'Mucho' },
    required: true,
    submitText: 'Continuar'
  })
);

window.slides.push( SlideTituloClase({ titulo: '¡Muchas Gracias!' }) );