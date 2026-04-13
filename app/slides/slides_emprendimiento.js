// ==================== SLIDES DE LA CLASE DE EMPRENDIMIENTO ====================

window.CURRENT_CLASS = 'emprendimiento';

const EMP_NARRATOR = 'Adamis';
const EMP_NARRATOR_COLOR = '#16a1b4';
const EMP_BASE_SCENE = {
  textPosition: 'bottom',
  imageFraction: '80%',
  typeSpeed: 44,
  narrator: EMP_NARRATOR,
  narratorColor: EMP_NARRATOR_COLOR
};

// Rellena aquí las rutas de imagen cuando las tengas listas.
const EMP_IMG = {
  emprender_palabra: '',
  empresa_pregunta: '',
  empresa_personas: '',
  empresa_objetivos: '',
  empresa_actividad: '',
  empresa_resuelve_problema: '',
  vender_productos: '',
  vender_servicios: '',

  crear_empresa: '',
  ensenar_crearla: '',
  pensar_problema: '',
  mejorar_solucion: '',
  patios_caos: '',
  patio_caos_general: '',
  idea_torneos: '',
  servicio_torneos: '',
  publico_objetivo_termino: '',
  publico_objetivo_clientes: '',
  publico_objetivo_pregunta: '',
  publico_objetivo_respuesta: '',
  por_que_pagarian: '',
  ofrecer_premios: '',
  elige_premios: '',
  pagar_monedas: '',
  materiales_necesarios: '',
  ahorros_no_suficiente: '',
  inversores: '',
  posibles_inversores: '',
  manos_a_la_obra: '',
  dinero_inversores: '',
  no_caprichos: '',
  materiales_buenos: '',
  enterarse_torneo: '',
  mas_gente_mas_dinero: '',
  publicidad: '',
  carteles: '',
  correos: '',
  mejor_cartel: '',
  esperar_clientes: '',
  exito: '',
  volver_participar: '',
  devolver_y_disfrutar: '',
  cosas_positivas: '',
  libertad: '',
  independiente: '',
  pasion_empresa: '',
  vender_cuadros: '',
  por_que_no_intentarlo: '',

  pasos_1: '',
  pasos_2: '',
  pasos_3: '',
  pasos_4: '',
  pasos_5: '',

  muy_bien: '',
  algo_especial: '',
  dividir_grupos: '',
  primera_empresa: '',
  vamos_alla: ''
};

function pushEmpScene(text, imageKey, extra = {}) {
  window.slides.push(
    Slide({
      text,
      img: EMP_IMG[imageKey] || '',
      ...EMP_BASE_SCENE,
      ...extra
    })
  );
}

window.slides.push(
  SlideTituloClase({ titulo: 'Clase 16 - Formas de invertir II – Emprendimiento - DEMO' })
);

window.slides.push(
  SlideTituloClase({ titulo: 'Explicación General - Inversión en empresas' })
);

// (Aparece Adamis señalando una palabra grande “EMPRENDER”, con gesto alegre y pose de presentador)
pushEmpScene(
  '“¡Holaa! Mi nombre es Adamis y hoy vamos a aprender a EMPRENDER…”',
  'emprender_palabra'
);

// (Aparece Adamis con cara curiosa, señalando un bocadillo con un interrogante y, al fondo, pequeños dibujos de una panadería, una tienda y una oficina)
pushEmpScene(
  '“Antes de nada, ¿Sabes qué es una EMPRESA?".',
  'empresa_pregunta'
);

// (Aparecen varias personas juntas alrededor de una mesa, colaborando, mientras Adamis las señala como si las estuviera presentando)
pushEmpScene(
  '“Una empresa es un grupo de personas…”',
  'empresa_personas'
);

// (Se ve al mismo grupo trabajando en equipo: una persona fabrica, otra atiende y otra cuenta monedas)
pushEmpScene(
  '“Que trabajan juntas para lograr objetivos y ganar dinero…”',
  'empresa_objetivos'
);

// (Aparece Adamis invitando al alumno a empezar una mini actividad)
pushEmpScene(
  '“Veamos ejemplos de esto con una pequeña actividad.”',
  'empresa_actividad'
);

// Mini Actividad – Empareja empresa con su objetivo
// Aparecen dos columnas. Una columna será un tipo de empresa y la otra columna serán los objetivos de las empresas. El alumno deberá unir la empresa con su objetivo
// Empresa – Objetivo
// Panadería – Hacer pan y venderlo.
// Peluquería – Cortar el pelo y cuidar el peinado de las personas.
// Supermercado – Vender comida y productos del día a día.
// Empresa de videojuegos – Crear videojuegos para que las personas jueguen y los compren.
// Empresa de reparto de paquetes – Llevar paquetes y pedidos de un lugar a otro.
// Empresa de telefonía - Ofrecer llamadas, mensajes e internet a los clientes.

// (Aparece Adamis delante de varias personas con necesidades distintas: una necesita pan, otra un corte de pelo y otra enviar un paquete)
pushEmpScene(
  '“¡Muy bien! El objetivo final de una empresa siempre es resolver un problema…”',
  'empresa_resuelve_problema'
);

// (Se ve una panadería con barras de pan en el mostrador, una persona comprando y el panadero recibiendo monedas)
pushEmpScene(
  '“Y poder ganar dinero a través de vender productos como el pan de la panadería…”',
  'vender_productos'
);

// (Se ve una peluquería con una persona cortando el pelo a un cliente mientras Adamis señala que eso también es un servicio)
pushEmpScene(
  '“O vender servicios como el que te da el peluquero cuando te corta el pelo.”',
  'vender_servicios'
);

window.slides.push(
  SlideTituloClase({ titulo: 'Explicación General – Crear tú empresa (emprendimiento)' })
);

// (Aparece Adamis señalando al alumno con entusiasmo, mientras detrás hay una bombilla encendida y un pequeño puesto montado por niños)
pushEmpScene(
  '“¿Sabías que tú puedes crear una empresa?”',
  'crear_empresa'
);

// (Aparece Adamis con un mapa visual de pasos sencillos flotando a su lado)
pushEmpScene(
  '“Te voy a enseñar todo lo que debes saber para crearla.”',
  'ensenar_crearla'
);

// (Aparece Adamis pensando con una mano en la barbilla, mientras observa una situación problemática sin resolver)
pushEmpScene(
  '“Lo primero que tienes que hacer es pensar en un problema que nadie ha solucionado.”',
  'pensar_problema'
);

// (Aparecen dos versiones de una misma idea: una simple y otra mejorada, con Adamis señalando la versión mejor)
pushEmpScene(
  '“O a lo mejor está solucionado, pero tú puedes mejorar la solución.”',
  'mejorar_solucion'
);

// (Aparece un patio escolar con varios grupos dispersos, choques, balones por todas partes y niños desorganizados)
pushEmpScene(
  '“Por ejemplo, un grupo de compañeros  y compañeras y tú detectáis que en tu cole los patios son un caos…”',
  'patios_caos'
);

// (Se ve el patio desde arriba, con niños corriendo en distintas direcciones y actividades mezcladas sin orden)
pushEmpScene(
  '“Cada grupo en el patio hace cosas diferentes y se vuelve un caos…”',
  'patio_caos_general'
);

// (Aparece un grupo de niños reunido con Adamis, señalando una pizarra donde pone “Torneos”, con iconos de fútbol, baloncesto y tenis)
pushEmpScene(
  '“Y pensáis… ¿Y si organizamos torneos de diferentes deportes para que todo el mundo esté contento?”',
  'idea_torneos'
);

// (Aparece el texto “Servicio de Torneos” grande y claro)
pushEmpScene(
  '“En este caso lo que ofrecéis es un Servicio de Torneos.”',
  'servicio_torneos'
);

// (TÉRMINO) !!
// (Aparece Adamis con una lupa enfocando a un grupo concreto de niños)
pushEmpScene(
  '“Una vez detectado el problema, lo siguiente es definir el público objetivo…”',
  'publico_objetivo_termino'
);

// (Se ve a Adamis separando visualmente a un grupo de niños del resto con un círculo brillante, como diciendo “estos son los clientes”)
pushEmpScene(
  '“El público objetivo es el grupo de personas al que va dirigido vuestro producto o servicio, son ¡vuestros clientes!”',
  'publico_objetivo_clientes'
);

// (Aparece Adamis con expresión de pregunta, mirando a un grupo de compañeros del colegio junto a una cancha)
pushEmpScene(
  '“En este caso… ¿Quién sería vuestro público objetivo?”',
  'publico_objetivo_pregunta'
);

// (Se ve a varios compañeros sonriendo, señalando el cartel del torneo y preparándose para jugar)
pushEmpScene(
  '“Pues serían vuestros compañeros y compañeras, que son los que van a disfrutar del Torneo.”',
  'publico_objetivo_respuesta'
);

// (Aparecen muchos alumnos viendo una caja misteriosa)
pushEmpScene(
  '“Ahora tenéis que pensar por qué pagarían las personas por vuestro servicio.”',
  'por_que_pagarian'
);

// (Aparece Adamis señalando una mesa con trofeos brillantes)
pushEmpScene(
  '“En este caso, además de mejorar la organización en los patios… ¡Podéis ofrecer premios a quienes ganen!”',
  'ofrecer_premios'
);

// (Aparece Adamis con los brazos abiertos frente a varias tarjetas de premios para que el alumno escoja)
pushEmpScene(
  '“¡Elige tú los premios!”',
  'elige_premios'
);

// Mini Actividad – Elige los premios
// Aparecen una serie de premios y el alumno debe elegir cuáles son acordes a sus edades y cuáles son realistas.
// Coche → No es realista y no es acorde a su edad
// Una raqueta de tenis o padel o pin pon → Sí, para el torneo respectivo
// Una tablet → Sí, podría ser el premio estrella
// Una tarjeta de regalo → Sí, muy correcto porque así cada uno puede comprarse lo que quiera
// Trofeos → Si, se dan junto al resto de premios

// (Se ve a un niño entregando una o dos monedas para apuntarse, mientras otro recibe una pulsera o ticket de participación)
pushEmpScene(
  '“Entonces para que cualquier niño o niña pueda participar en el torneo, pagará una o dos monedas.”',
  'pagar_monedas'
);

// (Adamis sale con cara de pillín imaginando muchas monedas)
pushEmpScene(
  '“Ahora necesitáis dinero para comprar los materiales necesarios para el torneo y empezar a ganar dinerito…”',
  'materiales_necesarios'
);

// (Aparece una hucha abierta con pocas monedas, mientras Adamis mira la cantidad con gesto de “esto no llega”)
pushEmpScene(
  '“Podéis usar vuestros ahorros, pero si no es suficiente…”',
  'ahorros_no_suficiente'
);

// (Aparece Adamis señalando a varias personas adultas que entregan monedas o billetes con confianza)
pushEmpScene(
  '“Necesitáis a gente que os deje dinero, también llamados … INVERSORES”',
  'inversores'
);

// (Se ve a una madre, un profesor y la directora del colegio escuchando la idea del torneo mientras Adamis los presenta)
pushEmpScene(
  '“Podría ser vuestra familia, el profesorado o el director o directora del colegio.”',
  'posibles_inversores'
);

// (Aparece el grupo de amigos dándose ánimos)
pushEmpScene(
  '“Una vez tengáis el dinero de los inversores, os toca poneros manos a la obra.”',
  'manos_a_la_obra'
);

// (Aparece Adamis serio, con un cartel de advertencia, mientras protege una caja con monedas etiquetada “Dinero de la empresa”)
pushEmpScene(
  '“¡Pero cuidado! El dinero de los inversores, NO es vuestro dinero.”',
  'dinero_inversores'
);

// (Se ve una comparación: en un lado materiales del torneo aprobados y en el otro caprichos como chuches o juguetes tachados)
pushEmpScene(
  '“Ese dinero lo tenéis que usar para poner la empresa en marcha, no para caprichos vuestros.”',
  'no_caprichos'
);

// Mini Actividad – ¿Qué le dirías a los inversores?
// Se proponen una serie de frases, y el alumno decide cuál sería el mejor approach
// Si inviertes en nosotros, te daremos 10 veces lo que nos has dado. → Incorrecto, poco realista
// Invierte en nosotros y si por algún casual ganamos dinero te lo devolveremos. → Incorrecto, no generas confianza
// Si inviertes en nosotros, te lo devolveremos con un  pequeño extra por confiar en nosotros. → Correcto, genera confianza y da un extra realista.

// (Aparece una mesa con materiales deportivos bien colocados y Adamis muestra un pulgar arriba de que eso sí es una buena inversión)
pushEmpScene(
  '“Con ese dinero compraréis los materiales como petos para hacer los equipos, balones de voley, pelotas de tenis…”',
  'materiales_buenos'
);

// (Aparece Adamis mirando alrededor y viendo que casi nadie sabe que existe el torneo)
pushEmpScene(
  '“Pero… el resto del cole se tiene que enterar del torneo.”',
  'enterarse_torneo'
);

// (Se ve una fila de niños creciendo poco a poco junto a una flecha ascendente de participantes y monedas)
pushEmpScene(
  '“Cuanta más gente lo conozca y se apunte… ¡más dinero podréis ganar!”',
  'mas_gente_mas_dinero'
);

// (término)
// (Aparece la palabra “PUBLICIDAD” en grande, decorada como un cartel llamativo, mientras Adamis sujeta el cartel con entusiasmo)
pushEmpScene(
  '“Necesitáis hacer PUBLICIDAD.”',
  'publicidad'
);

// (Se ven varios carteles pegados por el colegio anunciando el torneo, con colores claros y la información bien visible)
pushEmpScene(
  '“Una forma de hacerlo es con carteles.”',
  'carteles'
);

// (Aparece una pantalla con un correo sencillo sobre el torneo, mientras Adamis señala el botón de enviar)
pushEmpScene(
  '“También podéis mandar correos electrónicos a vuestros compañeros y compañeras para informarles…”',
  'correos'
);

// (Aparece Adamis junto a cuatro carteles distintos, invitando a observarlos y compararlos)
pushEmpScene(
  '“Te propongo una pequeña actividad: ¿Cuál crees que es el mejor cartel para promocionar los torneos?”',
  'mejor_cartel'
);

// Mini actividad – Elige el mejor cartel
// Aparecen 4 carteles y tienen que decidir cuál es el mejor.
// 1 cartel demasiado saturado, demasiada información y muy agresivo
// 1 cartel sin información importante como el precio, cuando será
// 1 cartel muy simple que no llama la atención. Letras negras sobre blanco
// 1 cartel bien equilibrado
// El alumno decidirá cuál es el mejor cartel, y deberá elegir la etiqueta que clasifique correctamente a cada cartel. Las etiquetas serán:
// “Demasiada información.”
// “No es llamativo.”
// “Falta información.”
// “El cartel perfecto.”

// (Aparece Adamis mirando un reloj y una pantalla con inscripciones, esperando con ilusión a que entren los primeros apuntados)
pushEmpScene(
  '“Una vez hecho todo el trabajo, hay que esperar a que empiecen a llegar los clientes…”',
  'esperar_clientes'
);

// Mini Actividad – Atiende a los clientes
// Aparecen dos iconos, uno de teléfono y otro de correo. Ambos con muchas notificaciones.
// Tiene que ir entrando a cada notificación y respondiendo a cada mensaje.
// La frase está ya pre-escrita, simplemente tiene que darle al botón de enviar.
// Con esto enseñamos que es importante la atención al cliente.
// PANTALLA DE SIMULACIÓN DE NIÑOS JUGANDO EL TORNEO (NIÑOS SON PUNTOS, VISTA AÉREA)

// (Aparece una vista aérea del patio lleno de niños jugando los torneos, con ambiente ordenado, alegre y Adamis celebrándolo)
pushEmpScene(
  '“Y… ¡Ha sido un éxito!”',
  'exito'
);

// (Se ve a muchos niños sonriendo, levantando la mano y hablando entre ellos con entusiasmo después del torneo)
pushEmpScene(
  '“Se apuntaron un montón de compañeros y compañeras y dijeron que les encantaría volver a participar en el futuro.”',
  'volver_participar'
);

// (Aparece el grupo devolviendo el dinero a los inversores con una pequeña recompensa, mientras todos sonríen satisfechos)
pushEmpScene(
  '“Después de devolver a quienes invirtieron y darles el extra, toca repartir todo y… ¡Disfrutar!”',
  'devolver_y_disfrutar'
);

// (Aparece Adamis señalando varias ventajas flotando a su alrededor como libertad, ideas, dinero y aprendizaje)
pushEmpScene(
  '“Crear tu propia empresa tiene un montón de cosas positivas…”',
  'cosas_positivas'
);

// (Aparece un niño organizando su propio puesto o actividad, tomando decisiones mientras Adamis observa con aprobación)
pushEmpScene(
  '“Te da completa libertad de elegir cómo trabajas…”',
  'libertad'
);

// (Aparece un niño contando monedas ganadas con esfuerzo propio, con gesto de orgullo y autonomía)
pushEmpScene(
  '“Eres independiente y aprendes a generar dinero por tí mismo.”',
  'independiente'
);

// (Aparece Adamis señalando distintos hobbies: pintar, cocinar, videojuegos, deporte, música)
pushEmpScene(
  '“Muchas veces tu pasión se puede convertir en tu empresa.”',
  'pasion_empresa'
);

// (Aparece un joven artista mostrando varios cuadros en un pequeño puesto, mientras una persona compra uno)
pushEmpScene(
  '“Si tu pasión es pintar y te conviertes en un experto o experta… Puedes vivir vendiendo tus cuadros.”',
  'vender_cuadros'
);

// (Aparece Adamis tendiendo la mano al alumno con una sonrisa retadora y motivadora, junto a una bombilla encendida)
pushEmpScene(
  '“Así que… ¿Por qué no intentarlo?”',
  'por_que_no_intentarlo'
);

// (Aparece Adamis junto a varias tarjetas con pasos escritos, preparadas para ordenarse)
pushEmpScene(
  '“Ahora que has entendido qué es lo que tienes que hacer para crear una empresa…”',
  'pasos_1'
);

// (Aparece Adamis sonriendo y señalando un tablero tipo puzle con huecos para colocar pasos)
pushEmpScene(
  '“Te propongo un minijuego.”',
  'pasos_2'
);

// (Se ven todas las tarjetas de pasos desordenadas sobre una mesa o panel)
pushEmpScene(
  '“Te voy a plantear los pasos que hay que seguir para crear una empresa.”',
  'pasos_3'
);

// (Aparecen las tarjetas mezcladas y Adamis llevándose las manos a la cabeza con gesto divertido)
pushEmpScene(
  '“¡Pero están desordenadas!”',
  'pasos_4'
);

// (Aparece Adamis señalando el primer hueco vacío del tablero, animando al alumno a empezar)
pushEmpScene(
  '“Necesito que me ayudes a ordenarlas…”',
  'pasos_5'
);

// Mini Actividad - Pasos para crear una empresa
// Aparecen actividades:
// Detectar un problema y pensar en una solución.
// Conocer quién va a comprar tu solución.
// Decidir cómo vas a ganar dinero con tu solución.
// Conseguir dinero (ahorro o inversores).
// Crear la solución.
// Colgar carteles o enviar correos para que la gente conozca la solución.
// Conseguir clientes.
// Pagar a los inversores.
// Pistas infinitas → Cada pista pone correctamente una sección que no está correcta

window.slides.push(
  SlideTituloClase({ titulo: 'Conclusión de la clase 16 – Formas de invertir II – Emprendimiento' })
);

// (Aparece Adamis felicitando al alumno con gesto orgulloso y una pequeña estrella o sello de “superado”)
pushEmpScene(
  '“¡Muy bien [Nombre]! Ya has visto los pasos que seguir para crear una empresa.”',
  'muy_bien'
);

// (Aparece Adamis con una sonrisa misteriosa, como si fuera a revelar una sorpresa)
pushEmpScene(
  '“Ahora vamos a hacer algo especial…”',
  'algo_especial'
);

// (Aparece el aula separándose visualmente en pequeños equipos de alumnos)
pushEmpScene(
  '“Vamos a dividir la clase en grupos y…”',
  'dividir_grupos'
);

// (Aparece cada grupo de alumnos con una bombilla encendida con intensidad sobre la cabeza, empezando a pensar su idea de empresa con emoción)
pushEmpScene(
  '“Váis a crear vuestra ¡PRIMERA EMPRESA!”',
  'primera_empresa'
);

// (Aparece Adamis en pose épica señalando hacia delante, invitando a comenzar la actividad)
pushEmpScene(
  '“¡Vamos allá!”',
  'vamos_alla'
);
