const historyData = [
  {
    title: "Clase 1 · ¿Que es Educacion Financiera? Motivaciones.",
    description: "Introduccion al valor de la educacion financiera y a su utilidad en la vida cotidiana."
  },
  {
    title: "Clase 2 · Historia del dinero: El dinero en la antiguedad",
    description: "Origen historico del dinero y primeras formas de intercambio."
  },
  {
    title: "Clase 3 · Historia del dinero: El dinero en la Actualidad",
    description: "Del efectivo a los pagos digitales y medios de pago actuales."
  },
  {
    title: "Clase 4 · ¿Como diferenciar necesidades y deseos?",
    description: "Priorizacion de decisiones de consumo y organizacion de compras."
  },
  {
    title: "Clase 5 · ¿Que es el precio?",
    description: "Comprender el precio como referencia economica basica."
  },
  {
    title: "Clase 6 · ¿Que factores influyen en el precio?",
    description: "Oferta, demanda y contexto como variables que alteran precios."
  },
  {
    title: "Clase 7 · ¿Que derechos y responsabilidades tiene el consumidor?",
    description: "Consumo responsable, informacion y derechos del consumidor."
  },
  {
    title: "Clase 8 · ¿Que son y como se obtienen ingresos?",
    description: "Origen de los ingresos y distintas formas de obtenerlos."
  },
  {
    title: "Clase 9 · ¿Que son los gastos?",
    description: "Identificacion de salidas de dinero y su impacto en el equilibrio financiero."
  }
];

const upcomingData = [
  {
    title: "Clase 11 · ¿Que es la deuda?",
    description: "Introduccion a la deuda y a su uso responsable."
  },
  {
    title: "Clase 12 · ¿Que es el interes?",
    description: "El precio del dinero prestado y su efecto en el coste total."
  },
  {
    title: "Clase 13 · Introduccion a la inversion",
    description: "Primeras ideas sobre invertir y hacer crecer el dinero."
  },
  {
    title: "Clase 14 · El riesgo en la inversion",
    description: "Relacion entre riesgo, rentabilidad y diversificacion."
  },
  {
    title: "Clase 15 · Formas de invertir I",
    description: "Primer bloque de alternativas y formatos de inversion."
  },
  {
    title: "Clase 16 · Formas de invertir II - Inversion en Empresas",
    description: "Como funciona la inversion en empresas y su analisis basico."
  }
];

const studentsData = [
  ["Lucia Martin", "Completada", "Hace 12 min"],
  ["Alvaro Ruiz", "Completada", "Hace 18 min"],
  ["Sara Lopez", "En progreso", "Hace 4 min"],
  ["Pablo Moreno", "Completada", "Hace 20 min"],
  ["Marta Diaz", "Completada", "Hace 9 min"],
  ["Iker Alonso", "En progreso", "Hace 2 min"],
  ["Carmen Vega", "Completada", "Hace 14 min"],
  ["Daniel Torres", "En progreso", "Hace 1 min"],
  ["Noa Serrano", "Completada", "Hace 22 min"],
  ["Hugo Navarro", "Completada", "Hace 16 min"],
  ["Valeria Castro", "Completada", "Hace 13 min"],
  ["Adrian Gil", "En progreso", "Hace 6 min"],
  ["Elena Romero", "Completada", "Hace 15 min"],
  ["Marcos Ortega", "Completada", "Hace 10 min"],
  ["Julia Leon", "En progreso", "Hace 7 min"],
  ["Nicolas Pena", "Completada", "Hace 11 min"],
  ["Paula Soto", "Completada", "Hace 8 min"],
  ["Diego Herrero", "En progreso", "Hace 3 min"]
];

const cohortData = [
  ["Lucia Martin", 184, 9, "11 h 20 min", "6 dias", "Hoy · 09:12"],
  ["Alvaro Ruiz", 176, 9, "10 h 48 min", "5 dias", "Hoy · 08:55"],
  ["Sara Lopez", 169, 8, "9 h 31 min", "4 dias", "Hoy · 09:24"],
  ["Pablo Moreno", 162, 9, "10 h 06 min", "5 dias", "Hoy · 08:41"],
  ["Marta Diaz", 158, 9, "9 h 44 min", "3 dias", "Hoy · 08:58"],
  ["Iker Alonso", 149, 8, "8 h 57 min", "4 dias", "Hoy · 09:27"],
  ["Carmen Vega", 145, 9, "9 h 11 min", "6 dias", "Hoy · 08:36"],
  ["Daniel Torres", 140, 8, "8 h 32 min", "2 dias", "Hoy · 09:29"],
  ["Noa Serrano", 138, 9, "8 h 46 min", "5 dias", "Ayer · 18:22"],
  ["Hugo Navarro", 132, 9, "8 h 08 min", "4 dias", "Ayer · 18:05"],
  ["Valeria Castro", 129, 8, "7 h 54 min", "3 dias", "Ayer · 17:48"],
  ["Adrian Gil", 124, 8, "7 h 36 min", "3 dias", "Ayer · 17:31"],
  ["Elena Romero", 118, 9, "7 h 58 min", "4 dias", "Ayer · 17:12"],
  ["Marcos Ortega", 114, 8, "7 h 20 min", "2 dias", "Ayer · 16:56"],
  ["Julia Leon", 111, 8, "7 h 05 min", "3 dias", "Ayer · 16:42"],
  ["Nicolas Pena", 106, 9, "6 h 51 min", "4 dias", "Ayer · 16:20"],
  ["Paula Soto", 101, 8, "6 h 33 min", "2 dias", "Ayer · 15:58"],
  ["Diego Herrero", 96, 8, "6 h 14 min", "2 dias", "Ayer · 15:40"]
];

const cohortDashboardData = {
  "Lucia Martin": makeStudentDashboard({
    coins: 184,
    totalCoins: 260,
    completedClasses: 9,
    usageTime: "11 h 20 min",
    streak: "6 dias",
    lastActivity: "Hoy · 09:12",
    averageReflection: 8.7,
    averageQuiz: 84,
    activitiesPassed: 21,
    totalActivities: 26,
    classes: [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    rewardsTrend: [18,24,29,34,38,41],
    quizScores: [82,86,88,0,0,0,0,0,0]
  }),
  "Alvaro Ruiz": makeStudentDashboard({
    coins: 176, totalCoins: 260, completedClasses: 9, usageTime: "10 h 48 min", streak: "5 dias", lastActivity: "Hoy · 08:55",
    averageReflection: 8.4, averageQuiz: 81, activitiesPassed: 20, totalActivities: 26,
    classes: [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    rewardsTrend: [16,22,27,31,36,44], quizScores: [80,83,81,0,0,0,0,0,0]
  }),
  "Sara Lopez": makeStudentDashboard({
    coins: 169, totalCoins: 260, completedClasses: 8, usageTime: "9 h 31 min", streak: "4 dias", lastActivity: "Hoy · 09:24",
    averageReflection: 8.2, averageQuiz: 78, activitiesPassed: 18, totalActivities: 26,
    classes: [1,1,1,1,1,1,1,0.6,0,0,0,0,0,0,0,0,0,0,0],
    rewardsTrend: [15,19,25,30,34,39], quizScores: [77,80,0,0,0,0,0,0,0]
  })
};

let selectedStudentName = null;

const CURRENT_CLASS_NUMBER = 10;

function createClassItem(number, title, intro, term, resumen, explicacion, actividad, reflexion, launchUrl, previewImageUrl = "") {
  return {
    number,
    title,
    intro,
    term,
    launchUrl,
    previewImageUrl,
    sections: {
      resumen: [
        { label: "Intro", value: intro },
        { label: "Resumen", value: resumen }
      ],
      explicacion: [
        { label: "Exp general", value: explicacion },
        { label: "Competencias", value: "Comprender ideas clave, relacionarlas con decisiones cotidianas y comunicar conclusiones con criterio." }
      ],
      actividad: [
        { label: "Actividad", value: actividad },
        { label: "Objetivo", value: "Aplicar los contenidos de la clase en una dinamica interactiva guiada." }
      ],
      reflexion: [
        { label: "Reflexion", value: reflexion },
        { label: "Termino clave", value: term }
      ]
    }
  };
}

const contentBlocks = [
  {
    id: "bloque-1",
    title: "Bloque I",
    subtitle: "El dinero y su funcion en la vida cotidiana",
    rangeLabel: "Clases 1, 2 y 3",
    classes: [
      createClassItem(1, "¿Que es Educacion Financiera? Motivaciones.", "Introduccion al sentido de la educacion financiera", "Educacion financiera", "La clase introduce por que la educacion financiera es util desde edades tempranas.", "Se presentan sus objetivos, su impacto cotidiano y las motivaciones para aprenderla.", "Dinamica inicial para detectar situaciones reales donde usamos decisiones financieras.", "Reflexion sobre por que aprender finanzas mejora la autonomia personal.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(2, "Historia del dinero: El dinero en la antiguedad", "Origen historico del dinero y primeras formas de intercambio", "Dinero", "La clase explora como surge el dinero en contextos antiguos y por que facilita la vida cotidiana.", "Comparacion entre trueque, moneda primitiva y primeras formas de valor compartido.", "Linea temporal interactiva sobre la evolucion del dinero en la antiguedad.", "Preguntas guiadas sobre el valor social del dinero a lo largo del tiempo.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(3, "Historia del dinero: El dinero en la Actualidad", "Del efectivo a los pagos digitales", "Pago", "Se presentan las formas actuales del dinero y su impacto en la gestion diaria.", "Ventajas y limites de efectivo, tarjeta, banca digital y pago movil.", "Mini dinamica para elegir el medio de pago adecuado segun el contexto.", "Reflexion sobre seguridad y control al pagar hoy.", "/app/pages/clase.html?clase=ahorro")
    ]
  },
  {
    id: "bloque-2",
    title: "Bloque II",
    subtitle: "Necesidades, deseos y consumo responsable",
    rangeLabel: "Clases 4, 5, 6 y 7",
    classes: [
      createClassItem(4, "¿Como diferenciar necesidades y deseos?", "Distinguir prioridades de consumo", "Consumo", "La clase ayuda a distinguir entre necesidades reales y deseos impulsivos.", "Ejemplos cotidianos para priorizar decisiones de compra y ordenar prioridades.", "Actividad para seleccionar compras prioritarias en distintos contextos.", "Reflexion sobre decisiones de consumo en casa y en el entorno cercano.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(5, "¿Que es el precio?", "Comprender que expresa el precio de un bien o servicio", "Precio", "Se introduce el concepto de precio como referencia economica basica.", "Se explica que informacion aporta el precio y como orienta las decisiones de compra.", "Analisis de precios de productos cotidianos y comparacion entre alternativas.", "Reflexion sobre como interpretamos el precio al comprar.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(6, "¿Que factores influyen en el precio?", "Elementos que modifican el valor de mercado", "Mercado", "Se analizan los factores que hacen subir o bajar un precio.", "Oferta, demanda, escasez, costes y contexto en la formacion de precios.", "Actividad para relacionar situaciones del mercado con cambios de precio.", "Reflexion sobre por que un mismo producto no siempre cuesta lo mismo.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(7, "¿Que derechos y responsabilidades tiene el consumidor?", "Consumo responsable y proteccion del consumidor", "Consumidor", "Se presentan derechos y responsabilidades basicas del consumidor.", "Informacion, reclamacion, comparacion y compra responsable.", "Actividad de resolucion de situaciones de compra con derechos del consumidor.", "Reflexion sobre comprar con criterio y responsabilidad.", "/app/pages/clase.html?clase=ahorro")
    ]
  },
  {
    id: "bloque-3",
    title: "Bloque III",
    subtitle: "Ingresos, gastos y ahorro",
    rangeLabel: "Clases 8, 9 y 10",
    classes: [
      createClassItem(8, "¿Que son y como se obtienen ingresos?", "Origen y tipos de ingresos", "Ingresos", "La clase presenta que son los ingresos y de donde proceden.", "Se explican distintas formas de obtener ingresos y su relacion con el esfuerzo, el trabajo y el valor aportado.", "Actividad practica para clasificar distintas fuentes de ingresos.", "Reflexion sobre la importancia de generar ingresos de forma responsable.", "/app/pages/clase.html?clase=deuda"),
      createClassItem(9, "¿Que son los gastos?", "Identificar salidas de dinero y su impacto", "Gastos", "La clase define que son los gastos y como afectan al equilibrio financiero.", "Clasificacion de gastos fijos, variables y pequenos gastos cotidianos.", "Actividad practica para ordenar gastos y reconocer cuales pesan mas.", "Reflexion sobre como controlar mejor el dinero que sale.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(10, "Ahorro y presupuestos", "Planificar el uso del dinero con objetivos", "Ahorro", "Se construye un plan basico de ahorro a partir de un presupuesto sencillo.", "Objetivos, plazos, prioridades y seguimiento del ahorro personal.", "Dinamica para crear un presupuesto y fijar metas realistas.", "Reflexion sobre constancia, previsibilidad y decisiones utiles.", "/app/pages/clase.html?clase=ahorro", "../app/assets/ahorro/escenas/titulo-ahorro2.avif")
    ]
  },
  {
    id: "bloque-4",
    title: "Bloque IV",
    subtitle: "Deuda e interes",
    rangeLabel: "Clases 11 y 12",
    classes: [
      createClassItem(11, "¿Que es la deuda?", "Cuando pedir dinero prestado puede ayudar o complicar", "Deuda", "Se analiza que es una deuda y en que contextos aparece.", "Coste, necesidad y sostenibilidad de una deuda en decisiones cotidianas.", "Comparacion entre casos de endeudamiento responsable e irresponsable.", "Reflexion sobre pedir dinero prestado y asumir compromisos.", "/app/pages/clase.html?clase=deuda"),
      createClassItem(12, "¿Que es el interes?", "El precio del dinero prestado", "Interes", "La clase explica de forma sencilla que es el interes y por que existe.", "Interes, cuota y coste total de un prestamo o de una deuda.", "Simulacion de cuotas con distintos intereses y plazos.", "Reflexion sobre el tiempo y el coste real de endeudarse.", "/app/pages/clase.html?clase=deuda")
    ]
  },
  {
    id: "bloque-5",
    title: "Bloque V",
    subtitle: "Inversion y gestion del riesgo",
    rangeLabel: "Clases 13 y 14",
    classes: [
      createClassItem(13, "Introduccion a la inversion", "Primeras ideas sobre invertir y hacer crecer el dinero", "Inversion", "Se introduce la idea de invertir para hacer crecer el dinero con criterio.", "Rentabilidad, plazo y objetivos financieros como base de la inversion.", "Actividad para vincular objetivos con horizontes de inversion.", "Reflexion sobre riesgo, paciencia y vision de largo plazo.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(14, "El riesgo en la inversion", "Riesgo, diversificacion y decisiones", "Riesgo", "Se trabaja la relacion entre riesgo y rentabilidad en las inversiones.", "Diversificacion, incertidumbre y tolerancia al riesgo.", "Simulacion de carteras con distinto nivel de riesgo.", "Reflexion sobre decidir con informacion suficiente.", "/app/pages/clase.html?clase=ahorro")
    ]
  },
  {
    id: "bloque-6",
    title: "Bloque VI",
    subtitle: "Formas de invertir y emprendimiento",
    rangeLabel: "Clases 15 y 16",
    classes: [
      createClassItem(15, "Formas de invertir I", "Primer bloque de alternativas de inversion", "Opciones", "Se presentan distintas alternativas de inversion de forma introductoria.", "Ahorro, productos sencillos y primeras categorias de inversion.", "Actividad de comparacion entre alternativas segun objetivo y plazo.", "Reflexion sobre elegir segun perfil y necesidad.", "/app/pages/clase.html?clase=ahorro"),
      createClassItem(16, "Formas de invertir II - Inversion en Empresas", "Como funciona invertir en empresas", "Empresas", "Se introduce la idea de invertir en empresas y participar en su crecimiento.", "Valor, participacion, riesgo y expectativas al invertir en empresas.", "Mini reto para comparar distintas empresas ficticias y decidir.", "Reflexion sobre iniciativa, analisis y responsabilidad.", "/app/pages/clase.html?clase=ahorro")
    ]
  },
  {
    id: "bloque-7",
    title: "Bloque VII",
    subtitle: "Psicologia economica y toma de decisiones",
    rangeLabel: "Clase 17",
    classes: [
      createClassItem(17, "Factores que influyen en las decisiones financieras", "Emociones, contexto y sesgos al decidir", "Psicologia", "La clase relaciona emociones, sesgos y decisiones economicas.", "Impulso, miedo, confianza y factores sociales que alteran una decision financiera.", "Casos practicos para detectar sesgos y factores externos.", "Reflexion sobre como decidir con calma y criterio.", "/app/pages/clase.html?clase=ahorro")
    ]
  },
  {
    id: "bloque-8",
    title: "Bloque VIII",
    subtitle: "Riesgos, estafas y proteccion de la informacion financiera",
    rangeLabel: "Clase 18",
    classes: [
      createClassItem(18, "Informacion financiera: Estafas y proteccion de datos financieros", "Fraudes, estafas y seguridad digital", "Seguridad", "Se presentan riesgos digitales frecuentes y habitos de prevencion.", "Phishing, contraseñas, datos sensibles y proteccion de la informacion financiera.", "Simulacion de deteccion de mensajes fraudulentos y decisiones de seguridad.", "Reflexion sobre seguridad en internet y cuidado de los datos.", "/app/pages/clase.html?clase=ahorro")
    ]
  },
  {
    id: "bloque-9",
    title: "Bloque IX",
    subtitle: "Cierre y consolidacion de aprendizajes",
    rangeLabel: "Clase 19",
    classes: [
      createClassItem(19, "Clase de cierre", "Sintesis y aplicacion del recorrido", "Cierre", "La clase final integra todo lo aprendido en un caso practico global.", "Repaso de ideas clave y transferencia a la vida cotidiana.", "Actividad final de aplicacion integral de todo el curso.", "Reflexion final sobre progreso personal y aprendizajes consolidados.", "/app/pages/clase.html?clase=ahorro")
    ]
  }
];

const contentSections = [
  { id: "resumen", label: "Resumen" },
  { id: "explicacion", label: "Explicacion general" },
  { id: "actividad", label: "Actividad interactiva" },
  { id: "reflexion", label: "Cuadro de reflexion" }
];

const contentState = {
  selectedBlockId: null,
  selectedClassNumber: null,
  selectedSection: "resumen"
};

const managementModules = [
  { id: "programacion", label: "Programacion", description: "Calendario y ritmo del grupo" },
  { id: "accesos", label: "Accesos", description: "Permisos y desbloqueos por alumno" },
  { id: "reintentos", label: "Reintentos", description: "Reaperturas y permisos especiales" },
  { id: "ia", label: "IA y revision", description: "Validacion de contenidos generados" },
  { id: "ajustes", label: "Ajustes del grupo", description: "Opciones globales del grupo" },
  { id: "historial", label: "Historial", description: "Trazabilidad de acciones" }
];

const managementState = {
  context: {
    currentClass: "6o Primaria A",
    tutor: "Maria Lopez",
    scheduleMode: "weekly",
    schedulePreset: "actual"
  },
  programming: {
    mode: "weekly",
    unlockDay: "Lunes",
    unlockHour: "16:00",
    availability: "Hasta el fin de semana",
    intervalDays: "7",
    manualOpen: false
  },
  ui: {
    activeModule: "programacion",
    accessQuery: "",
    accessClassFilter: "all",
    accessOnlyIncidents: false,
    accessOnlyModified: false,
    selectedAccessStudent: null,
    selectedStudent: cohortData[0]?.[0] || null,
    feedback: "Los cambios quedan preparados para guardarse y conectarse al backend mas adelante."
  },
  accessStudents: cohortData.map(([name, , completedClasses, , , lastActivity], index) => ({
    id: `student-${index + 1}`,
    name,
    classLabel: completedClasses >= 9 ? "Clase 10" : `Clase ${completedClasses + 1}`,
    accessStatus: completedClasses >= 9 ? "Acceso normal" : completedClasses >= 8 ? "Acceso en progreso" : "Acceso limitado",
    specialStatus: index % 5 === 0 ? "Recuperacion abierta" : index % 4 === 0 ? "Incidencia de acceso" : "Sin cambios",
    hasIncident: index % 4 === 0,
    modified: index % 3 === 0,
    lastActivity,
    frozen: index === 7,
    justifiedAbsence: index === 10
  })),
  retryForm: {
    student: cohortData[2]?.[0] || "",
    classLabel: "Clase 8",
    block: "Actividad principal",
    contentType: "Actividad interactiva",
    permissionType: "Nuevo intento"
  },
  retryHistory: [
    { when: "Hoy · 09:12", action: "Reabrir actividad con recompensa", student: "Sara Lopez", target: "Clase 8 · Actividad principal" },
    { when: "Ayer · 17:40", action: "Reabrir cuadro de reflexion", student: "Lucia Martin", target: "Clase 7 · Reflexion final" },
    { when: "Ayer · 16:05", action: "Restablecer estado de actividad", student: "Daniel Torres", target: "Clase 6 · Minijuego" }
  ],
  aiReviewItems: [
    { id: "ai-1", student: "Sara Lopez", type: "Refuerzo", topic: "Ahorro y presupuesto", status: "Pendiente de revision" },
    { id: "ai-2", student: "Iker Alonso", type: "Ampliacion", topic: "Oferta y demanda", status: "Pendiente de publicacion" },
    { id: "ai-3", student: "Julia Leon", type: "Refuerzo", topic: "Diferenciar necesidades y deseos", status: "Pendiente de aprobacion" }
  ],
  aiRecommendations: [
    { title: "Recomendar refuerzo a 4 alumnos", copy: "Se detecta caida repetida en quiz de gastos y presupuesto en el grupo actual." },
    { title: "Ajustar el ritmo del grupo", copy: "El 38% del grupo mantiene la clase 9 en progreso. Conviene aplazar el siguiente desbloqueo 2 dias." },
    { title: "Activar recuperacion grupal", copy: "Hay 3 alumnos con bloqueos consecutivos en la misma actividad y una ausencia justificada reciente." }
  ],
  groupSettings: {
    rankingEnabled: true,
    anonymizeRanking: false,
    shopEnabled: true,
    autoReinforcement: true,
    autoExtension: true,
    tutorOnly: false
  },
  historyEntries: [
    { when: "Hoy · 09:30", action: "Se cambio la frecuencia del grupo", student: "Grupo completo", target: "Semanal automatico" },
    { when: "Hoy · 08:55", action: "Se otorgo acceso manual a una clase", student: "Sara Lopez", target: "Clase 8" },
    { when: "Ayer · 17:40", action: "Se aprobo un refuerzo generado", student: "Iker Alonso", target: "Oferta y demanda" },
    { when: "Ayer · 16:50", action: "Se congelo temporalmente el progreso", student: "Daniel Torres", target: "Clase 7" }
  ]
};

managementState.studentProfiles = cohortData.map(([name, coins, completedClasses, usageTime, streak, lastActivity], index) => ({
  id: `profile-${index + 1}`,
  name,
  group: managementState.context.currentClass,
  progress: `${completedClasses}/19 clases`,
  coins,
  shields: 2 + (index % 3),
  pendingClasses: Math.max(0, 19 - completedClasses),
  pendingReinforcements: index % 4,
  lastIncident: index % 5 === 0 ? "Acceso modificado manualmente" : index % 6 === 0 ? "Ausencia justificada" : "Sin incidencias recientes",
  lastConnection: lastActivity,
  note: index % 3 === 0 ? "Revisar si necesita recuperacion del bloque anterior." : "Seguimiento ordinario."
}));

const managementSchedulePreview = [
  { label: "Semana 1", classLabel: "Clase 10", status: "complete", note: "Completada" },
  { label: "Semana 2", classLabel: "Clase 11", status: "current", note: "Actual" },
  { label: "Semana 3", classLabel: "Clase 12", status: "future", note: "Programada" },
  { label: "Semana 4", classLabel: "Clase 13", status: "future", note: "Futura" },
  { label: "Semana 5", classLabel: "Clase 14", status: "blocked", note: "Bloqueada" }
];

const supportState = {
  ui: {
    search: "",
    activeView: "chat",
    selectedThreadId: "thread-1",
    selectedTicketId: null,
    ticketDrawerOpen: false,
    messageDraft: ""
  },
  stats: [
    { label: "Tickets abiertos", value: "2", meta: "2 casos en seguimiento activo" },
    { label: "Resueltos recientemente", value: "3", meta: "Ultimos 7 dias" },
    { label: "Ultima respuesta", value: "Ayer · 17:22", meta: "Soporte tecnico" },
    { label: "Estado del sistema", value: "Todo en orden", meta: "Sin incidencias generales activas" }
  ],
  quickPrompts: [
    "Un alumno no puede acceder a la clase",
    "Una actividad no da monedas",
    "No veo a un alumno en el grupo",
    "Quiero reportar un fallo tecnico",
    "La reflexion no se ha guardado",
    "No se desbloquea la clase semanal"
  ],
  quickCategories: [
    "Acceso a clases",
    "Actividades",
    "Recompensas",
    "Reflexiones",
    "Ranking y tienda",
    "Problemas tecnicos"
  ],
  threads: [
    {
      id: "thread-1",
      title: "Alumno sin acceso a clase",
      time: "Hace 10 min",
      type: "Consulta abierta",
      conversationLabel: "Conversacion activa",
      escalationSuggested: true,
      linkedStudent: "Sara Lopez",
      linkedClass: "Clase 8",
      messages: [
        {
          role: "assistant",
          text: "Asistente de ayuda activo. Describe la incidencia y te ayudare a revisarla paso a paso.",
          meta: "Bienvenida",
          quickActions: []
        },
        {
          role: "user",
          text: "Un alumno no puede acceder a la clase 8 y el grupo dice que sigue bloqueada.",
          meta: "Ahora"
        },
        {
          role: "assistant",
          text: "He entendido el caso. Primero conviene revisar si el alumno tiene acceso suspendido temporalmente o si la clase sigue en programacion futura.",
          meta: "Asistente",
          quickActions: ["Ir a Gestion", "Revisar accesos", "Ver alumno", "Crear ticket"]
        }
      ]
    },
    {
      id: "thread-2",
      title: "Actividad no da recompensa",
      time: "Ayer",
      type: "Seguimiento",
      conversationLabel: "Actividad 6 · recompensa",
      escalationSuggested: false,
      linkedStudent: "Lucia Martin",
      linkedClass: "Clase 6",
      messages: [
        { role: "assistant", text: "Revisamos el caso de recompensa no asignada.", meta: "Asistente" },
        { role: "user", text: "La actividad se completa pero no suma monedas.", meta: "Ayer" },
        {
          role: "assistant",
          text: "Comprueba si la actividad se reabrio sin recompensa o si el alumno ya habia consumido el intento premiado.",
          meta: "Asistente",
          quickActions: ["Ir a Gestion", "Ver alumno"]
        }
      ]
    },
    {
      id: "thread-3",
      title: "No aparece el grupo",
      time: "Hace 3 dias",
      type: "Resuelta",
      conversationLabel: "Grupo no visible",
      escalationSuggested: false,
      linkedStudent: "",
      linkedClass: "",
      messages: [
        { role: "assistant", text: "Se resolvio tras refrescar la asignacion del tutor principal.", meta: "Cerrada" }
      ]
    },
    {
      id: "thread-4",
      title: "Problema con reflexion",
      time: "Hace 5 dias",
      type: "Consulta",
      conversationLabel: "Reflexion no guardada",
      escalationSuggested: true,
      linkedStudent: "Daniel Torres",
      linkedClass: "Clase 7",
      messages: [
        { role: "user", text: "La reflexion no se ha guardado despues de enviar.", meta: "Hace 5 dias" },
        {
          role: "assistant",
          text: "Si sigue fallando tras reintentar, conviene escalarlo a soporte tecnico con el contexto de la sesion.",
          meta: "Asistente",
          quickActions: ["Crear ticket", "Seguir con el asistente"]
        }
      ]
    }
  ],
  tickets: [
    { id: "T-142", title: "Error en actividad semanal", category: "Tecnica", date: "Hoy · 09:14", status: "En revision", updatedAt: "Hace 12 min" },
    { id: "T-133", title: "Alumno sin acceso", category: "Acceso", date: "Ayer · 16:48", status: "Abierto", updatedAt: "Ayer · 17:22" },
    { id: "T-128", title: "Reflexion no registrada", category: "Progreso", date: "Hace 3 dias", status: "Pendiente de respuesta", updatedAt: "Hace 1 dia" },
    { id: "T-120", title: "Incidencia resuelta en ranking", category: "Ranking y tienda", date: "Hace 7 dias", status: "Resuelto", updatedAt: "Hace 6 dias" }
  ],
  ticketForm: {
    title: "",
    type: "tecnica",
    description: "",
    student: "",
    lesson: "",
    priority: "media",
    includeConversation: true
  },
  latestTicketRef: null
};

function renderList(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = items.map((item) => `
    <article class="list-item">
      <strong>${item.title}</strong>
      <span>${item.description}</span>
    </article>
  `).join("");
}

function getManagementSummaryCards() {
  const changedStudents = managementState.accessStudents.filter((student) => student.modified || student.frozen || student.justifiedAbsence).length;
  const openPermissions = managementState.retryHistory.length;
  const pendingReviews = managementState.aiReviewItems.filter((item) => item.status.toLowerCase().includes("pendiente")).length;
  const modeLabels = {
    manual: "Manual por profesor",
    weekly: "Semanal automatico",
    interval: `Cada ${managementState.programming.intervalDays} dias`,
    calendar: "Calendario personalizado"
  };

  return [
    { label: "Clase actual", value: "Clase 10", meta: managementState.context.currentClass },
    { label: "Frecuencia activa", value: modeLabels[managementState.programming.mode] || "Sin definir", meta: `${managementState.programming.unlockDay} · ${managementState.programming.unlockHour}` },
    { label: "Cambios activos", value: `${changedStudents} alumnos`, meta: "Accesos, bloqueos o congelaciones" },
    { label: "Permisos especiales", value: `${openPermissions} abiertos`, meta: "Reintentos y reaperturas" },
    { label: "Revision IA", value: `${pendingReviews} pendientes`, meta: "Contenidos por validar" }
  ];
}

function setManagementFeedback(message, muted = false) {
  managementState.ui.feedback = message;
  const feedback = document.getElementById("managementFeedback");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.toggle("is-muted", muted);
}

function addManagementHistory(action, student, target) {
  managementState.historyEntries.unshift({
    when: "Ahora",
    action,
    student: student || "Grupo completo",
    target: target || "-"
  });
}

function getManagementStudentProfile(name) {
  return managementState.studentProfiles.find((profile) => profile.name === name) || managementState.studentProfiles[0];
}

function getAccessStateTone(student) {
  if (student.frozen) return "is-alert";
  if (student.modified || student.justifiedAbsence) return "is-success";
  return "is-muted";
}

function getFilteredAccessStudents() {
  return managementState.accessStudents.filter((student) => {
    const matchesQuery = !managementState.ui.accessQuery || student.name.toLowerCase().includes(managementState.ui.accessQuery.toLowerCase());
    const matchesClass = managementState.ui.accessClassFilter === "all" || student.classLabel === managementState.ui.accessClassFilter;
    const matchesIncident = !managementState.ui.accessOnlyIncidents || student.hasIncident;
    const matchesModified = !managementState.ui.accessOnlyModified || student.modified || student.frozen || student.justifiedAbsence;
    return matchesQuery && matchesClass && matchesIncident && matchesModified;
  });
}

function renderManagementSummary() {
  const target = document.getElementById("managementSummaryGrid");
  if (!target) return;

  target.innerHTML = getManagementSummaryCards().map((item) => `
    <article class="management-stat-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.meta}</small>
    </article>
  `).join("");
}

function renderManagementModuleNav() {
  const target = document.getElementById("managementModuleNav");
  if (!target) return;

  target.innerHTML = managementModules.map((module) => `
    <button type="button" class="management-nav-button ${module.id === managementState.ui.activeModule ? "is-active" : ""}" data-management-module="${module.id}">
      <strong>${module.label}</strong>
      <span>${module.description}</span>
    </button>
  `).join("");
}

function getSupportSelectedThread() {
  return supportState.threads.find((thread) => thread.id === supportState.ui.selectedThreadId) || supportState.threads[0];
}

function getSupportSelectedTicket() {
  return supportState.tickets.find((ticket) => ticket.id === supportState.ui.selectedTicketId) || null;
}

function getSupportStatusClass(status) {
  const value = status.toLowerCase();
  if (value.includes("resuelto")) return "is-success";
  if (value.includes("revision")) return "is-review";
  if (value.includes("pendiente")) return "is-pending";
  return "is-open";
}

function getFilteredSupportThreads() {
  const query = supportState.ui.search.trim().toLowerCase();
  if (!query) return supportState.threads;
  return supportState.threads.filter((thread) => {
    return thread.title.toLowerCase().includes(query) || thread.type.toLowerCase().includes(query);
  });
}

function getFilteredSupportTickets(openOnly = false) {
  const query = supportState.ui.search.trim().toLowerCase();
  return supportState.tickets.filter((ticket) => {
    const matchesOpen = !openOnly || ticket.status !== "Resuelto";
    const matchesQuery = !query || `${ticket.id} ${ticket.title} ${ticket.category} ${ticket.status}`.toLowerCase().includes(query);
    return matchesOpen && matchesQuery;
  });
}

function renderSupportSummary() {
  const target = document.getElementById("supportSummaryGrid");
  if (!target) return;
  const openCount = supportState.tickets.filter((ticket) => ticket.status !== "Resuelto").length;
  const resolvedCount = supportState.tickets.filter((ticket) => ticket.status === "Resuelto").length;
  supportState.stats[0].value = String(openCount);
  supportState.stats[1].value = String(resolvedCount);
  target.innerHTML = supportState.stats.map((item) => `
    <article class="support-stat-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.meta}</small>
    </article>
  `).join("");
}

function renderSupportSidebar() {
  const recentThreads = document.getElementById("supportRecentThreads");
  const openTickets = document.getElementById("supportOpenTickets");
  const quickCategories = document.getElementById("supportQuickCategories");
  const quickPrompts = document.getElementById("supportQuickPrompts");
  const caseActions = document.getElementById("supportCaseActions");
  if (!recentThreads || !openTickets || !quickCategories || !quickPrompts || !caseActions) return;

  const filteredThreads = getFilteredSupportThreads();
  const filteredTickets = getFilteredSupportTickets(true);
  const selectedThread = getSupportSelectedThread();
  const latestQuickActions = [...selectedThread.messages]
    .reverse()
    .find((message) => Array.isArray(message.quickActions) && message.quickActions.length)?.quickActions || [];

  recentThreads.innerHTML = filteredThreads.length ? filteredThreads.map((thread) => `
    <button type="button" class="support-thread-item ${thread.id === supportState.ui.selectedThreadId && supportState.ui.activeView === "chat" ? "is-active" : ""}" data-support-thread="${thread.id}">
      <strong>${thread.title}</strong>
      <div class="support-item-meta">
        <span>${thread.time}</span>
        <small class="support-status-pill ${thread.type.toLowerCase().includes("resuelta") ? "is-success" : thread.type.toLowerCase().includes("seguimiento") ? "is-review" : "is-open"}">${thread.type}</small>
      </div>
    </button>
  `).join("") : `
    <div class="support-empty">
      <strong>Sin conversaciones</strong>
      <span>No hay hilos que coincidan con la busqueda.</span>
    </div>
  `;

  openTickets.innerHTML = filteredTickets.length ? filteredTickets.map((ticket) => `
    <button type="button" class="support-ticket-item" data-support-ticket="${ticket.id}">
      <div class="support-ticket-copy">
        <strong>${ticket.id}</strong>
        <span>${ticket.title}</span>
      </div>
      <small class="support-status-pill ${getSupportStatusClass(ticket.status)}">${ticket.status}</small>
    </button>
  `).join("") : `
    <div class="support-empty">
      <strong>Sin tickets activos</strong>
      <span>No hay casos abiertos ahora mismo.</span>
    </div>
  `;

  quickPrompts.innerHTML = supportState.quickPrompts.map((prompt) => `
    <button type="button" class="support-quick-item" data-support-prompt="${prompt}">
      <span class="support-quick-item__label">${prompt}</span>
      <span class="support-quick-item__hint">Iniciar consulta</span>
    </button>
  `).join("");

  caseActions.innerHTML = `
    ${latestQuickActions.map((action) => `
      <button type="button" class="support-quick-item support-quick-item--action" data-support-context-action="${action}">
        <span class="support-quick-item__label">${action}</span>
        <span class="support-quick-item__hint">Accion contextual</span>
      </button>
    `).join("")}
    ${selectedThread.escalationSuggested ? `
      <button type="button" class="support-quick-item support-quick-item--action" data-support-action="continue-assistant">
        <span class="support-quick-item__label">Seguir con el asistente</span>
        <span class="support-quick-item__hint">Mantener conversacion</span>
      </button>
      <button type="button" class="support-quick-item support-quick-item--action is-primary" data-support-action="open-ticket">
        <span class="support-quick-item__label">Crear ticket</span>
        <span class="support-quick-item__hint">Escalar a soporte</span>
      </button>
    ` : ""}
    ${!latestQuickActions.length && !selectedThread.escalationSuggested ? `
      <div class="support-empty">
        <strong>Sin acciones contextuales</strong>
        <span>Cuando el asistente detecte pasos utiles apareceran aqui.</span>
      </div>
    ` : ""}
  `;

  quickCategories.innerHTML = supportState.quickCategories.map((category) => `
    <button type="button" class="support-quick-item" data-support-prompt="${category}">
      <span class="support-quick-item__label">${category}</span>
      <span class="support-quick-item__hint">Ayuda frecuente</span>
    </button>
  `).join("");
}

function renderSupportChatView() {
  const thread = getSupportSelectedThread();
  const messages = (thread?.messages || []).filter((message) => message.meta !== "Bienvenida");

  return `
    <section class="support-chat-shell">
      <div class="support-chat-header">
        <div>
          <p class="content-kicker">Asistente operativo</p>
          <h3>Asistente de ayuda</h3>
          <p class="support-chat-copy">Describe tu duda o incidencia y te ayudare a revisarla dentro del panel. Tambien puedes usar las consultas rápidas del lateral para iniciar el caso.</p>
        </div>
        <div class="support-chat-meta">
          <span class="support-status-pill is-open">${thread?.conversationLabel || "Nueva conversacion"}</span>
          <button type="button" class="secondary-button" data-support-action="open-ticket">Escalar a soporte</button>
        </div>
      </div>

      <div class="support-chat-messages" id="supportChatMessages">
        ${messages.length ? messages.map((message) => `
          <article class="support-message support-message--${message.role}">
            <div class="support-message-bubble">
              <p>${message.text}</p>
              <span>${message.meta || ""}</span>
            </div>
          </article>
        `).join("") : `
          <div class="support-empty support-empty--large">
            <strong>Empieza una conversacion</strong>
            <span>Selecciona una sugerencia o escribe tu incidencia para recibir ayuda.</span>
          </div>
        `}
      </div>

      <div class="support-chat-footer">
        ${supportState.latestTicketRef ? `
          <div class="support-confirm-card">
            <strong>Ticket creado: ${supportState.latestTicketRef}</strong>
            <span>El caso se ha enviado a soporte con prioridad ${supportState.ticketForm.priority}.</span>
          </div>
        ` : ""}

        <div class="support-composer">
          <div class="support-composer-tools">
            <span>Adjuntos</span>
            <button type="button" class="support-ghost-button" disabled>Captura</button>
            <button type="button" class="support-ghost-button" disabled>Archivo</button>
          </div>
          <div class="support-composer-row">
            <textarea id="supportMessageInput" placeholder="Escribe tu mensaje o describe la incidencia...">${supportState.ui.messageDraft}</textarea>
            <button type="button" class="primary-button support-send-button" id="supportSendButton">Enviar</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSupportTicketsView() {
  const tickets = getFilteredSupportTickets(false);
  return `
    <section class="support-tickets-shell">
      <div class="support-chat-header">
        <div>
          <p class="content-kicker">Vista de tickets</p>
          <h3>Tickets del profesor</h3>
          <p class="support-chat-copy">Consulta el estado de cada caso y reabre tickets si el problema persiste.</p>
        </div>
        <div class="support-chat-meta">
          <button type="button" class="secondary-button" data-support-action="back-chat">Volver al asistente</button>
        </div>
      </div>
      <div class="support-ticket-filters">
        <button type="button" class="support-chip-button" data-support-ticket-filter="all">Todos</button>
        <button type="button" class="support-chip-button" data-support-ticket-filter="Abierto">Abiertos</button>
        <button type="button" class="support-chip-button" data-support-ticket-filter="En revision">En revision</button>
        <button type="button" class="support-chip-button" data-support-ticket-filter="Pendiente de respuesta">Pendientes</button>
        <button type="button" class="support-chip-button" data-support-ticket-filter="Resuelto">Resueltos</button>
      </div>
      <div class="support-ticket-table-shell">
        <table class="support-ticket-table">
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Ultima actualizacion</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.length ? tickets.map((ticket) => `
              <tr>
                <td>${ticket.id}</td>
                <td>${ticket.title}</td>
                <td>${ticket.category}</td>
                <td>${ticket.date}</td>
                <td><span class="support-status-pill ${getSupportStatusClass(ticket.status)}">${ticket.status}</span></td>
                <td>${ticket.updatedAt}</td>
                <td><button type="button" class="support-link-button" data-support-ticket="${ticket.id}">Ver detalle</button></td>
              </tr>
            `).join("") : `
              <tr>
                <td colspan="7">
                  <div class="support-empty support-empty--large">
                    <strong>Sin tickets</strong>
                    <span>No hay tickets que coincidan con el filtro actual.</span>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSupportMain() {
  const target = document.getElementById("supportMainContent");
  if (!target) return;
  target.innerHTML = supportState.ui.activeView === "tickets" ? renderSupportTicketsView() : renderSupportChatView();
}

function hydrateSupportTicketFormFromContext() {
  const thread = getSupportSelectedThread();
  if (!thread) return;
  supportState.ticketForm.title = supportState.ticketForm.title || thread.title;
  supportState.ticketForm.description = supportState.ticketForm.description || thread.messages.map((message) => message.text).join("\n");
  supportState.ticketForm.student = supportState.ticketForm.student || thread.linkedStudent || "";
  supportState.ticketForm.lesson = supportState.ticketForm.lesson || thread.linkedClass || "";
}

function renderSupportTicketDrawer() {
  const drawer = document.getElementById("supportTicketDrawer");
  const body = document.getElementById("supportTicketPanelBody");
  if (!drawer || !body) return;

  if (!supportState.ui.ticketDrawerOpen) {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    body.innerHTML = "";
    return;
  }

  hydrateSupportTicketFormFromContext();
  const ticket = getSupportSelectedTicket();
  if (ticket) {
    body.innerHTML = `
      <div class="support-ticket-head">
        <div>
          <p class="content-kicker">Detalle del ticket</p>
          <h2>${ticket.id}</h2>
          <p class="support-hero-copy">${ticket.title}</p>
        </div>
        <span class="support-status-pill ${getSupportStatusClass(ticket.status)}">${ticket.status}</span>
      </div>
      <div class="support-ticket-detail-grid">
        <article class="support-detail-card"><span>Categoria</span><strong>${ticket.category}</strong></article>
        <article class="support-detail-card"><span>Fecha</span><strong>${ticket.date}</strong></article>
        <article class="support-detail-card"><span>Ultima actualizacion</span><strong>${ticket.updatedAt}</strong></article>
        <article class="support-detail-card"><span>Grupo</span><strong>${managementState.context.currentClass}</strong></article>
      </div>
      <div class="support-ticket-detail-actions">
        <button type="button" class="secondary-button" data-support-action="reopen-ticket">Reabrir ticket</button>
        <button type="button" class="secondary-button" data-support-action="comment-ticket">Anadir comentario</button>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div class="support-ticket-head">
        <div>
          <p class="content-kicker">Escalado a soporte</p>
          <h2>Nuevo ticket</h2>
          <p class="support-hero-copy">El caso se enviara con el contexto de la conversacion actual y los datos del grupo activo.</p>
        </div>
      </div>
      <form class="support-ticket-form" id="supportTicketForm">
        <label class="support-field">
          <span>Titulo del problema</span>
          <input type="text" data-support-ticket-field="title" value="${supportState.ticketForm.title}">
        </label>
        <label class="support-field">
          <span>Tipo de incidencia</span>
          <select data-support-ticket-field="type">
            ${[
              ["tecnica", "Tecnica"],
              ["acceso", "Acceso"],
              ["progreso", "Progreso"],
              ["recompensas", "Recompensas"],
              ["contenidos", "Contenidos"],
              ["alumnado", "Alumnado/cuenta"],
              ["otra", "Otra"]
            ].map(([value, label]) => `<option value="${value}" ${supportState.ticketForm.type === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <label class="support-field support-field--full">
          <span>Descripcion</span>
          <textarea data-support-ticket-field="description">${supportState.ticketForm.description}</textarea>
        </label>
        <label class="support-field">
          <span>Alumno afectado</span>
          <input type="text" data-support-ticket-field="student" value="${supportState.ticketForm.student}">
        </label>
        <label class="support-field">
          <span>Clase o actividad afectada</span>
          <input type="text" data-support-ticket-field="lesson" value="${supportState.ticketForm.lesson}">
        </label>
        <label class="support-field">
          <span>Prioridad</span>
          <select data-support-ticket-field="priority">
            ${["baja", "media", "alta"].map((value) => `<option value="${value}" ${supportState.ticketForm.priority === value ? "selected" : ""}>${value[0].toUpperCase()}${value.slice(1)}</option>`).join("")}
          </select>
        </label>
        <label class="support-checkbox">
          <input type="checkbox" data-support-ticket-field="includeConversation" ${supportState.ticketForm.includeConversation ? "checked" : ""}>
          <span>Incluir contexto de la conversacion, grupo actual, fecha y profesor</span>
        </label>
        <div class="support-ticket-context">
          <small>Grupo: ${managementState.context.currentClass}</small>
          <small>Profesor: ${managementState.context.tutor}</small>
          <small>Fecha: Hoy</small>
        </div>
        <div class="support-ticket-actions">
          <button type="button" class="secondary-button" data-support-ticket-close>Cancelar</button>
          <button type="button" class="primary-button" data-support-action="submit-ticket">Enviar ticket</button>
        </div>
      </form>
    `;
  }

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function renderSupport() {
  renderSupportSummary();
  renderSupportSidebar();
  renderSupportMain();
  renderSupportTicketDrawer();
  const searchInput = document.getElementById("supportSearchInput");
  if (searchInput) searchInput.value = supportState.ui.search;
}

function addSupportMessage(role, text, meta = "Ahora", quickActions = []) {
  const thread = getSupportSelectedThread();
  if (!thread) return;
  thread.messages.push({ role, text, meta, quickActions });
}

function sendSupportMessage(message) {
  const content = message.trim();
  if (!content) return;
  addSupportMessage("user", content, "Ahora");
  const lower = content.toLowerCase();
  const shouldEscalate = lower.includes("sigue") || lower.includes("falla") || lower.includes("varios alumnos") || lower.includes("bloque");
  const reply = shouldEscalate
    ? "El caso parece requerir revision tecnica o afecta al uso normal. Te recomiendo crear un ticket con el contexto de esta conversacion."
    : "He registrado tu consulta. Revisa primero accesos, programacion del grupo y actividad afectada; si no se resuelve, puedes escalarla a soporte.";
  addSupportMessage("assistant", reply, "Asistente", shouldEscalate ? ["Crear ticket", "Seguir con el asistente", "Ir a Gestion"] : ["Revisar accesos", "Ver alumno", "Esto no ha funcionado"]);
  getSupportSelectedThread().escalationSuggested = shouldEscalate;
  supportState.ui.messageDraft = "";
  renderSupport();
}

function createSupportTicket() {
  const ref = `T-${100 + supportState.tickets.length + 1}`;
  supportState.tickets.unshift({
    id: ref,
    title: supportState.ticketForm.title || "Nuevo caso de soporte",
    category: supportState.ticketForm.type,
    date: "Ahora",
    status: "Abierto",
    updatedAt: "Ahora"
  });
  supportState.latestTicketRef = ref;
  supportState.ticketForm = {
    title: "",
    type: "tecnica",
    description: "",
    student: "",
    lesson: "",
    priority: "media",
    includeConversation: true
  };
  supportState.ui.ticketDrawerOpen = false;
  supportState.ui.selectedTicketId = null;
  renderSupport();
}

function renderManagementProgrammingModule() {
  const state = managementState.programming;
  const modeLabel = {
    manual: "Manual por profesor",
    weekly: "Semanal automatico",
    interval: "Cada X dias",
    calendar: "Calendario personalizado"
  };

  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">Programacion</h3>
          <p class="management-panel-copy">Define cuando se desbloquean las clases y como se aplican los cambios al grupo actual.</p>
        </div>
        <span class="management-chip">${modeLabel[state.mode]}</span>
      </div>

      <article class="management-card management-card--accent">
        <div class="management-card-head">
          <div>
            <h3>Frecuencia de las clases</h3>
            <p>Configura el avance del curso y deja preparada la estructura para datos reales.</p>
          </div>
          <button type="button" class="primary-button" data-management-action="apply-group-programming">Aplicar a ${managementState.context.currentClass}</button>
        </div>
        <div class="management-form-grid">
          <label class="management-inline-field">
            <span>Modo de avance</span>
            <select data-management-field="programming.mode">
              <option value="manual" ${state.mode === "manual" ? "selected" : ""}>Manual por profesor</option>
              <option value="weekly" ${state.mode === "weekly" ? "selected" : ""}>Semanal automatico</option>
              <option value="interval" ${state.mode === "interval" ? "selected" : ""}>Cada X dias</option>
              <option value="calendar" ${state.mode === "calendar" ? "selected" : ""}>Calendario personalizado</option>
            </select>
          </label>
          <label class="management-inline-field">
            <span>Dia de desbloqueo</span>
            <select data-management-field="programming.unlockDay">
              ${["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"].map((day) => `<option value="${day}" ${state.unlockDay === day ? "selected" : ""}>${day}</option>`).join("")}
            </select>
          </label>
          <label class="management-inline-field">
            <span>Hora de apertura</span>
            <input type="time" value="${state.unlockHour}" data-management-field="programming.unlockHour">
          </label>
          <label class="management-inline-field">
            <span>Duracion disponible</span>
            <select data-management-field="programming.availability">
              ${["24 horas", "48 horas", "Hasta el fin de semana", "Hasta siguiente sesion"].map((item) => `<option value="${item}" ${state.availability === item ? "selected" : ""}>${item}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="management-form-grid management-form-grid--compact">
          <label class="management-inline-field">
            <span>Cada X dias</span>
            <input type="number" min="1" max="30" value="${state.intervalDays}" data-management-field="programming.intervalDays">
          </label>
          <div class="management-switch-row">
            <button type="button" class="management-switch ${state.manualOpen ? "is-on" : ""}" data-management-toggle="programming.manualOpen" aria-pressed="${state.manualOpen ? "true" : "false"}"></button>
            <div class="management-toggle-copy">
              <span>Apertura manual o automatica</span>
              <strong>${state.manualOpen ? "Apertura manual activa" : "Apertura automatica activa"}</strong>
              <p class="management-inline-copy">Los cambios afectan a proximas aperturas, no a clases ya completadas.</p>
            </div>
          </div>
        </div>
      </article>

      <article class="management-card">
        <div class="management-card-head">
          <div>
            <h3>Vista previa del cronograma</h3>
            <p>Representacion simple de varias sesiones con estados listos para logica futura.</p>
          </div>
        </div>
        <div class="management-chronogram">
          ${managementSchedulePreview.map((item) => `
            <article class="management-chronogram-card">
              <span class="management-chip-label">${item.label}</span>
              <strong>${item.classLabel}</strong>
              <span class="management-status-pill is-${item.status}">${item.note}</span>
            </article>
          `).join("")}
        </div>
        <p class="management-footnote">El modo actual es ${modeLabel[state.mode]}. La apertura ${state.manualOpen ? "manual" : "automatica"} queda registrada al guardar cambios.</p>
      </article>
    </section>
  `;
}

function renderManagementAccessModule() {
  const filtered = getFilteredAccessStudents();

  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">Accesos</h3>
          <p class="management-panel-copy">Controla accesos, permisos especiales y excepciones por alumno sin romper el flujo del aula.</p>
        </div>
        <span class="management-chip">${filtered.length} visibles</span>
      </div>

      <article class="management-card">
        <div class="management-table-toolbar">
          <div class="management-filters">
            <input class="management-filter-input" type="search" placeholder="Buscar alumno" value="${managementState.ui.accessQuery}" data-management-filter="accessQuery">
            <select class="management-filter-select" data-management-filter="accessClassFilter">
              <option value="all">Todas las clases</option>
              ${["Clase 9", "Clase 10", "Clase 11"].map((item) => `<option value="${item}" ${managementState.ui.accessClassFilter === item ? "selected" : ""}>${item}</option>`).join("")}
            </select>
            <select class="management-filter-select" data-management-filter="accessOnlyIncidents">
              <option value="false" ${!managementState.ui.accessOnlyIncidents ? "selected" : ""}>Todos los estados</option>
              <option value="true" ${managementState.ui.accessOnlyIncidents ? "selected" : ""}>Solo incidencias</option>
            </select>
            <select class="management-filter-select" data-management-filter="accessOnlyModified">
              <option value="false" ${!managementState.ui.accessOnlyModified ? "selected" : ""}>Todos los accesos</option>
              <option value="true" ${managementState.ui.accessOnlyModified ? "selected" : ""}>Solo modificados</option>
            </select>
          </div>
        </div>
        <div class="management-table-shell">
          <table class="management-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Clase actual</th>
                <th>Estado de acceso</th>
                <th>Estado especial</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length ? filtered.map((student) => `
                <tr>
                  <td>
                    <strong>${student.name}</strong>
                    <div class="management-meta">${student.lastActivity}</div>
                  </td>
                  <td>${student.classLabel}</td>
                  <td><span class="management-chip ${student.modified ? "is-success" : ""}">${student.accessStatus}</span></td>
                  <td><span class="management-chip ${getAccessStateTone(student)}">${student.specialStatus}</span></td>
                  <td><button type="button" class="management-link-button" data-management-edit-access="${student.id}">Editar</button></td>
                </tr>
              `).join("") : `
                <tr>
                  <td colspan="5">
                    <div class="management-empty">
                      <strong>Sin resultados</strong>
                      <span>Ajusta filtros o busca otro alumno para continuar.</span>
                    </div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderManagementRetryModule() {
  const form = managementState.retryForm;
  const studentOptions = managementState.studentProfiles.map((profile) => `<option value="${profile.name}" ${form.student === profile.name ? "selected" : ""}>${profile.name}</option>`).join("");

  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">Reintentos</h3>
          <p class="management-panel-copy">Reabre actividades, concede nuevas oportunidades y registra permisos especiales con contexto.</p>
        </div>
      </div>

      <article class="management-card management-card--accent">
        <div class="management-card-head">
          <div>
            <h3>Formulario de reapertura</h3>
            <p>La accion queda anotada en el historial local para futura conexion con backend.</p>
          </div>
        </div>
        <div class="management-form-grid">
          <label class="management-inline-field">
            <span>Alumno</span>
            <select data-management-field="retry.student">${studentOptions}</select>
          </label>
          <label class="management-inline-field">
            <span>Clase</span>
            <select data-management-field="retry.classLabel">
              ${["Clase 7", "Clase 8", "Clase 9", "Clase 10"].map((item) => `<option value="${item}" ${form.classLabel === item ? "selected" : ""}>${item}</option>`).join("")}
            </select>
          </label>
          <label class="management-inline-field">
            <span>Sub-seccion o bloque</span>
            <select data-management-field="retry.block">
              ${["Actividad principal", "Minijuego", "Quiz final", "Reflexion"].map((item) => `<option value="${item}" ${form.block === item ? "selected" : ""}>${item}</option>`).join("")}
            </select>
          </label>
          <label class="management-inline-field">
            <span>Tipo de contenido</span>
            <select data-management-field="retry.contentType">
              ${["Actividad interactiva", "Cuadro de reflexion", "Quiz", "Refuerzo"].map((item) => `<option value="${item}" ${form.contentType === item ? "selected" : ""}>${item}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="management-form-grid management-form-grid--compact">
          <section class="management-permission-card">
            <div class="management-card-head management-card-head--compact">
              <div>
                <h3>Modalidad del permiso</h3>
                <p>Selecciona el tipo de reapertura o recuperacion que vas a aplicar.</p>
              </div>
            </div>
            <label class="management-inline-field">
              <span>Tipo de permiso</span>
              <select data-management-field="retry.permissionType">
                ${["Nuevo intento", "Recuperacion", "Reapertura temporal", "Revision manual"].map((item) => `<option value="${item}" ${form.permissionType === item ? "selected" : ""}>${item}</option>`).join("")}
              </select>
            </label>
          </section>
          <section class="management-retry-actions-card">
            <div class="management-card-head management-card-head--compact">
              <div>
                <h3>Acciones disponibles</h3>
                <p>Selecciona la intervencion concreta que quieres aplicar sobre el contenido.</p>
              </div>
            </div>
            <div class="management-retry-actions-grid">
              <button type="button" class="secondary-button" data-management-action="retry:sin-recompensa">Reabrir sin recompensa</button>
              <button type="button" class="secondary-button" data-management-action="retry:con-recompensa">Reabrir con recompensa</button>
              <button type="button" class="secondary-button" data-management-action="retry:nuevo-intento">Permitir nuevo intento</button>
              <button type="button" class="secondary-button" data-management-action="retry:reflexion">Reabrir reflexion</button>
            </div>
            <button type="button" class="primary-button management-retry-primary" data-management-action="retry:restablecer">Restablecer actividad</button>
          </section>
        </div>
      </article>

      <article class="management-list-card">
        <div class="management-card-head">
          <div>
            <h3>Historial reciente de permisos especiales</h3>
            <p>Listado local de reaperturas y excepciones aplicadas recientemente.</p>
          </div>
        </div>
        <div class="management-log-list">
          ${managementState.retryHistory.map((item) => `
            <article class="management-log-item">
              <strong>${item.action}</strong>
              <span>${item.student} · ${item.target}</span>
              <div class="management-meta">${item.when}</div>
            </article>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderManagementStudentsModule() {
  const selected = getManagementStudentProfile(managementState.ui.selectedStudent);

  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">Alumnado</h3>
          <p class="management-panel-copy">Gestion individual del alumno desde una ficha operativa pensada para intervenciones directas.</p>
        </div>
      </div>

      <div class="management-student-module">
        <aside class="management-student-list">
          <div class="management-card-head">
            <div>
              <h3>Listado de alumnos</h3>
              <p>Cambia de alumno sin abandonar el modulo.</p>
            </div>
          </div>
          <div class="management-student-list-items">
            ${managementState.studentProfiles.map((profile) => `
              <button type="button" class="management-student-list-button ${selected?.name === profile.name ? "is-active" : ""}" data-management-select-student="${profile.name}">
                <strong>${profile.name}</strong>
                <span>${profile.progress} · ${profile.lastIncident}</span>
              </button>
            `).join("")}
          </div>
        </aside>

        <article class="management-student-detail">
          <div class="management-card-head">
            <div>
              <p class="content-kicker">Ficha del alumno</p>
              <h3>${selected.name}</h3>
            </div>
            <span class="management-chip">${selected.group}</span>
          </div>

          <div class="management-metrics-grid">
            <article class="management-mini-card"><span>Progreso general</span><strong>${selected.progress}</strong></article>
            <article class="management-mini-card"><span>Monedas</span><strong>${selected.coins}</strong></article>
            <article class="management-mini-card"><span>Escudos</span><strong>${selected.shields}</strong></article>
            <article class="management-mini-card"><span>Clases pendientes</span><strong>${selected.pendingClasses}</strong></article>
            <article class="management-mini-card"><span>Refuerzos pendientes</span><strong>${selected.pendingReinforcements}</strong></article>
            <article class="management-mini-card"><span>Ultima incidencia</span><strong>${selected.lastIncident}</strong></article>
            <article class="management-mini-card"><span>Ultima conexion</span><strong>${selected.lastConnection}</strong></article>
            <article class="management-mini-card"><span>Nota operativa</span><strong>${selected.note}</strong></article>
          </div>

          <div class="management-actions-grid">
            <button type="button" class="secondary-button" data-management-student-action="dar acceso a clase">Dar acceso a clase</button>
            <button type="button" class="secondary-button" data-management-student-action="reabrir actividad">Reabrir actividad</button>
            <button type="button" class="secondary-button" data-management-student-action="asignar recuperacion">Asignar recuperacion</button>
            <button type="button" class="secondary-button" data-management-student-action="conceder escudo manual">Conceder escudo manual</button>
            <button type="button" class="secondary-button" data-management-student-action="anadir nota interna">Anadir nota interna</button>
            <button type="button" class="primary-button" data-management-student-action="marcar incidencia">Marcar incidencia</button>
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderManagementAiModule() {
  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">IA y revision</h3>
          <p class="management-panel-copy">Bandeja operativa para revisar contenido generado y recomendaciones del sistema.</p>
        </div>
      </div>

      <div class="management-review-grid">
        <article class="management-list-card">
          <div class="management-card-head">
            <div>
              <h3>Contenidos pendientes de revision</h3>
              <p>Intervencion humana antes de publicar o rechazar propuestas generadas automaticamente.</p>
            </div>
          </div>
          <div class="management-review-list">
            ${managementState.aiReviewItems.map((item) => `
              <article class="management-review-item">
                <div>
                  <strong>${item.student}</strong>
                  <span>${item.type} · ${item.topic}</span>
                  <div class="management-meta">${item.status}</div>
                </div>
                <div class="management-inline-actions">
                  <button type="button" class="management-link-button" data-management-ai-action="ver" data-management-ai-id="${item.id}">Ver</button>
                  <button type="button" class="management-link-button" data-management-ai-action="aprobar" data-management-ai-id="${item.id}">Aprobar</button>
                  <button type="button" class="management-link-button" data-management-ai-action="rechazar" data-management-ai-id="${item.id}">Rechazar</button>
                  <button type="button" class="management-link-button" data-management-ai-action="editar" data-management-ai-id="${item.id}">Editar</button>
                </div>
              </article>
            `).join("")}
          </div>
        </article>

        <article class="management-list-card">
          <div class="management-card-head">
            <div>
              <h3>Recomendaciones automaticas</h3>
              <p>Sugerencias del sistema diferenciadas de lo que aun necesita revision.</p>
            </div>
          </div>
          <div class="management-recommendation-list">
            ${managementState.aiRecommendations.map((item) => `
              <article class="management-recommendation-item">
                <strong>${item.title}</strong>
                <span>${item.copy}</span>
              </article>
            `).join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderManagementSettingsModule() {
  const settings = [
    ["rankingEnabled", "Activar ranking", "Permite mostrar el ranking del grupo dentro del aula."],
    ["anonymizeRanking", "Anonimizar nombres en ranking", "Sustituye nombres por alias cuando se muestre la clasificacion."],
    ["shopEnabled", "Activar tienda", "Habilita la tienda de recompensas del alumnado."],
    ["autoReinforcement", "Activar refuerzo automatico", "Genera refuerzos cuando el sistema detecta necesidad recurrente."],
    ["autoExtension", "Activar ampliacion automatica", "Ofrece ampliacion a alumnado que termina antes de tiempo."],
    ["tutorOnly", "Permitir modificaciones solo al tutor principal", "Restringe cambios sensibles a la persona tutora principal."]
  ];

  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">Ajustes del grupo</h3>
          <p class="management-panel-copy">Configuracion general del grupo sin necesidad de entrar alumno por alumno.</p>
        </div>
      </div>

      <article class="management-settings-card">
        <div class="management-settings-list">
          ${settings.map(([key, label, copy]) => `
            <div class="management-setting-row">
              <div class="management-toggle-copy">
                <span>Ajuste global</span>
                <strong>${label}</strong>
                <p class="management-inline-copy">${copy}</p>
              </div>
              <button type="button" class="management-switch ${managementState.groupSettings[key] ? "is-on" : ""}" data-management-toggle="setting.${key}" aria-pressed="${managementState.groupSettings[key] ? "true" : "false"}"></button>
            </div>
          `).join("")}
        </div>
        <div class="management-inline-actions">
          <button type="button" class="secondary-button" data-management-action="restaurar-permisos">Restaurar permisos por defecto</button>
          <button type="button" class="primary-button" data-management-action="restore-defaults">Restaurar configuracion por defecto</button>
        </div>
      </article>
    </section>
  `;
}

function renderManagementHistoryModule() {
  return `
    <section class="management-module">
      <div class="management-header-row">
        <div>
          <p class="content-kicker">Modulo activo</p>
          <h3 class="management-panel-title">Historial</h3>
          <p class="management-panel-copy">Trazabilidad cronologica de cambios realizados dentro de la pestana de gestion.</p>
        </div>
      </div>

      <article class="management-list-card">
        <div class="management-history-list">
          ${managementState.historyEntries.map((item) => `
            <div class="management-history-row">
              <div>
                <strong>${item.action}</strong>
                <span>${item.student} · ${item.target}</span>
              </div>
              <span class="management-chip">${item.when}</span>
            </div>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderManagementModuleContent() {
  const target = document.getElementById("managementModuleContent");
  if (!target) return;

  const views = {
    programacion: renderManagementProgrammingModule,
    accesos: renderManagementAccessModule,
    reintentos: renderManagementRetryModule,
    ia: renderManagementAiModule,
    ajustes: renderManagementSettingsModule,
    historial: renderManagementHistoryModule
  };

  const renderView = views[managementState.ui.activeModule];
  target.innerHTML = renderView ? renderView() : `
    <div class="management-loading">
      <strong>Modulo en preparacion</strong>
      <span>La estructura base ya esta lista para ampliarse.</span>
    </div>
  `;
}

function renderManagementDrawer() {
  const drawer = document.getElementById("managementAccessDrawer");
  const body = document.getElementById("managementAccessDrawerBody");
  if (!drawer || !body) return;

  const student = managementState.accessStudents.find((item) => item.id === managementState.ui.selectedAccessStudent);
  if (!student) {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    body.innerHTML = "";
    return;
  }

  body.innerHTML = `
    <div class="management-drawer-top">
      <div>
        <p class="content-kicker">Edicion de acceso</p>
        <h2>${student.name}</h2>
        <p class="management-hero-copy">${student.classLabel} · ${student.accessStatus}</p>
      </div>
      <span class="management-chip ${getAccessStateTone(student)}">${student.specialStatus}</span>
    </div>

    <section class="management-drawer-section">
      <h3>Acciones de acceso</h3>
      <div class="management-drawer-actions">
        <button type="button" class="secondary-button" data-management-access-action="dar acceso a una clase">Dar acceso a una clase</button>
        <button type="button" class="secondary-button" data-management-access-action="quitar acceso a una clase">Quitar acceso a una clase</button>
        <button type="button" class="secondary-button" data-management-access-action="permitir recuperar una clase anterior">Permitir recuperar una clase anterior</button>
        <button type="button" class="secondary-button" data-management-access-action="saltar a la siguiente clase">Saltar a la siguiente clase</button>
        <button type="button" class="primary-button" data-management-access-action="restaurar progresion normal">Restaurar progresion normal</button>
      </div>
    </section>

    <section class="management-drawer-section">
      <h3>Acciones extra preparadas</h3>
      <div class="management-drawer-actions">
        <button type="button" class="secondary-button" data-management-access-action="marcar ausencia justificada">Marcar ausencia justificada</button>
        <button type="button" class="secondary-button" data-management-access-action="congelar temporalmente progreso">Congelar temporalmente progreso</button>
        <button type="button" class="secondary-button" data-management-access-action="bloquear temporalmente contenido">Bloquear temporalmente contenido</button>
        <button type="button" class="secondary-button" data-management-access-action="conceder escudo manual por incidencia">Conceder escudo manual por incidencia</button>
      </div>
      <p class="management-note">Estas acciones quedan contempladas en la interfaz para conectarse a confirmaciones posteriores.</p>
    </section>
  `;

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function renderManagement() {
  renderManagementSummary();
  renderManagementModuleNav();
  renderManagementModuleContent();
  renderManagementDrawer();
  const groupSelect = document.getElementById("managementGroupSelect");
  const teacherSelect = document.getElementById("managementTeacherSelect");
  const modeSelect = document.getElementById("managementModeSelect");
  const presetSelect = document.getElementById("managementSchedulePreset");
  if (groupSelect) groupSelect.value = managementState.context.currentClass;
  if (teacherSelect) teacherSelect.value = managementState.context.tutor;
  if (modeSelect) modeSelect.value = managementState.context.scheduleMode;
  if (presetSelect) presetSelect.value = managementState.context.schedulePreset;
}

function saveManagementChanges() {
  addManagementHistory("Se guardaron cambios de gestion", "Grupo completo", managementState.context.currentClass);
  setManagementFeedback(`Cambios preparados para ${managementState.context.currentClass}. Quedan listos para persistencia real.`, false);
  renderManagementSummary();
}

function handleManagementFieldChange(path, value) {
  const [scope, key] = path.split(".");
  if (scope === "programming") {
    managementState.programming[key] = value;
    if (key === "mode") managementState.context.scheduleMode = value;
  }
  if (scope === "retry") {
    managementState.retryForm[key] = value;
  }
  setManagementFeedback("Hay cambios locales pendientes de guardar.", true);
  renderManagement();
}

function handleManagementToggle(path) {
  const [scope, key] = path.split(".");
  if (scope === "programming") {
    managementState.programming[key] = !managementState.programming[key];
  }
  if (scope === "setting") {
    managementState.groupSettings[key] = !managementState.groupSettings[key];
    addManagementHistory("Se actualizo un ajuste del grupo", "Grupo completo", key);
  }
  setManagementFeedback("Estado actualizado localmente. Puedes seguir ajustando antes de guardar.", true);
  renderManagement();
}

function handleManagementAction(action) {
  const retryTarget = `${managementState.retryForm.classLabel} · ${managementState.retryForm.block}`;
  if (action === "apply-group-programming") {
    addManagementHistory("Se aplico una programacion al grupo", "Grupo completo", managementState.context.currentClass);
    setManagementFeedback(`Programacion aplicada a ${managementState.context.currentClass}.`, false);
    renderManagement();
    return;
  }
  if (action.startsWith("retry:")) {
    const actionMap = {
      "retry:sin-recompensa": "Se reabrio actividad sin recompensa",
      "retry:con-recompensa": "Se reabrio actividad con recompensa",
      "retry:nuevo-intento": "Se permitio un nuevo intento",
      "retry:reflexion": "Se reabrio el cuadro de reflexion",
      "retry:restablecer": "Se restablecio el estado de actividad"
    };
    const title = actionMap[action];
    managementState.retryHistory.unshift({
      when: "Ahora",
      action: title,
      student: managementState.retryForm.student,
      target: retryTarget
    });
    addManagementHistory(title, managementState.retryForm.student, retryTarget);
    setManagementFeedback(`${title} para ${managementState.retryForm.student}.`, false);
    renderManagement();
    return;
  }
  if (action === "restore-defaults") {
    managementState.groupSettings = {
      rankingEnabled: true,
      anonymizeRanking: false,
      shopEnabled: true,
      autoReinforcement: true,
      autoExtension: true,
      tutorOnly: false
    };
    addManagementHistory("Se restauraron los ajustes por defecto", "Grupo completo", managementState.context.currentClass);
    setManagementFeedback("Configuracion general restaurada al estado por defecto.", false);
    renderManagement();
    return;
  }
  if (action === "restaurar-permisos") {
    addManagementHistory("Se restauraron permisos por defecto", "Grupo completo", managementState.context.currentClass);
    setManagementFeedback("Los permisos base quedan restaurados localmente.", false);
  }
}

function handleManagementStudentAction(action) {
  const student = managementState.ui.selectedStudent;
  if (!student) return;
  addManagementHistory(`Se ejecuto la accion: ${action}`, student, managementState.context.currentClass);
  setManagementFeedback(`Accion registrada para ${student}: ${action}.`, false);
}

function handleManagementAiAction(action, id) {
  const item = managementState.aiReviewItems.find((entry) => entry.id === id);
  if (!item) return;
  if (action === "aprobar") item.status = "Aprobado";
  if (action === "rechazar") item.status = "Rechazado";
  if (action === "editar") item.status = "Pendiente de edicion";
  addManagementHistory(`IA y revision: ${action}`, item.student, item.topic);
  setManagementFeedback(`Accion "${action}" registrada sobre ${item.student}.`, false);
  renderManagement();
}

function handleManagementAccessAction(action) {
  const student = managementState.accessStudents.find((entry) => entry.id === managementState.ui.selectedAccessStudent);
  if (!student) return;

  student.modified = true;
  if (action === "marcar ausencia justificada") {
    student.justifiedAbsence = true;
    student.specialStatus = "Ausencia justificada";
  } else if (action === "congelar temporalmente progreso") {
    student.frozen = true;
    student.specialStatus = "Progreso congelado";
  } else if (action === "restaurar progresion normal") {
    student.frozen = false;
    student.justifiedAbsence = false;
    student.specialStatus = "Sin cambios";
  } else if (action === "bloquear temporalmente contenido") {
    student.specialStatus = "Contenido bloqueado";
  } else if (action === "conceder escudo manual por incidencia") {
    student.specialStatus = "Escudo concedido";
  } else {
    student.specialStatus = action;
  }

  addManagementHistory(`Acceso: ${action}`, student.name, student.classLabel);
  setManagementFeedback(`Accion de acceso aplicada a ${student.name}.`, false);
  renderManagement();
}

function renderStudents() {
  const target = document.getElementById("studentsTableBody");
  if (!target) return;

  target.innerHTML = studentsData.map(([name, status, updatedAt]) => `
    <tr>
      <td>${name}</td>
      <td><span class="status-pill ${status === "Completada" ? "is-complete" : "is-progress"}">${status}</span></td>
      <td>${updatedAt}</td>
    </tr>
  `).join("");
}

function renderCohortTable() {
  const target = document.getElementById("cohortTableBody");
  if (!target) return;

  target.innerHTML = cohortData.map(([name, coins, completedClasses, usageTime, streak, lastActivity]) => `
    <tr class="cohort-row" data-student-name="${name}">
      <td><button type="button" class="student-name-button" data-student-name="${name}">${name}</button></td>
      <td>${coins}</td>
      <td>${completedClasses}</td>
      <td>${usageTime}</td>
      <td>${streak}</td>
      <td>${lastActivity}</td>
    </tr>
  `).join("");

  target.querySelectorAll(".cohort-row").forEach((row) => {
    row.addEventListener("click", () => {
      openStudentConfirmModal(row.dataset.studentName);
    });
  });

  target.querySelectorAll(".student-name-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openStudentConfirmModal(button.dataset.studentName);
    });
  });
}

function makeStudentDashboard(data) {
  return data;
}

function getStudentDashboard(name) {
  return cohortDashboardData[name] || makeStudentDashboard({
    coins: 120,
    totalCoins: 260,
    completedClasses: 8,
    usageTime: "7 h 30 min",
    streak: "3 dias",
    lastActivity: "Ayer · 17:00",
    averageReflection: 7.8,
    averageQuiz: 74,
    activitiesPassed: 17,
    totalActivities: 26,
    classes: [1,1,1,1,1,1,1,0.4,0,0,0,0,0,0,0,0,0,0,0],
    rewardsTrend: [12,18,24,27,31,35],
    quizScores: [72,76,74,0,0,0,0,0,0]
  });
}

function openStudentConfirmModal(name) {
  selectedStudentName = name;
  const copy = document.getElementById("studentConfirmCopy");
  if (copy) {
    copy.textContent = `¿Desea ver estadisticas del alumno: ${name}?`;
  }
  const modal = document.getElementById("studentConfirmModal");
  if (modal) openModal(modal);
}

function setStudentsView(viewId) {
  document.querySelectorAll(".students-view").forEach((view) => {
    view.classList.toggle("is-active", view.id === viewId);
  });
}

function renderStudentDashboard(name) {
  const data = getStudentDashboard(name);
  const classesPercent = Math.round((data.completedClasses / 19) * 100);
  const coinsPercent = Math.round((data.coins / data.totalCoins) * 100);
  const activitiesPercent = Math.round((data.activitiesPassed / data.totalActivities) * 100);

  const dashboardTitle = document.getElementById("studentDashboardTitle");
  const heroName = document.getElementById("studentHeroName");
  const lastSeen = document.getElementById("studentHeroLastSeen");
  const mainMetrics = document.getElementById("studentMainMetrics");
  const classesSummary = document.getElementById("studentClassesSummary");
  const classesFill = document.getElementById("studentClassesFill");
  const classProgress = document.getElementById("studentClassProgress");
  const coinsSummary = document.getElementById("studentCoinsSummary");
  const coinsFill = document.getElementById("studentCoinsFill");
  const coinsMeta = document.getElementById("studentCoinsMeta");
  const activitiesSummary = document.getElementById("studentActivitiesSummary");
  const activitiesFill = document.getElementById("studentActivitiesFill");
  const activitiesMeta = document.getElementById("studentActivitiesMeta");
  const reflectionSummary = document.getElementById("studentReflectionSummary");
  const reflectionMeta = document.getElementById("studentReflectionMeta");
  const rewardChart = document.getElementById("studentRewardChart");
  const quizChart = document.getElementById("studentQuizChart");

  if (dashboardTitle) dashboardTitle.textContent = `Dashboard de ${name}`;
  if (heroName) heroName.textContent = name;
  if (lastSeen) lastSeen.textContent = data.lastActivity;

  if (mainMetrics) {
    mainMetrics.innerHTML = `
      <article class="student-metric-card">
        <span>Monedas</span>
        <strong>${data.coins}</strong>
      </article>
      <article class="student-metric-card">
        <span>Clases completadas</span>
        <strong>${data.completedClasses}/19</strong>
      </article>
      <article class="student-metric-card">
        <span>Tiempo de uso</span>
        <strong>${data.usageTime}</strong>
      </article>
      <article class="student-metric-card">
        <span>Racha</span>
        <strong>${data.streak}</strong>
      </article>
    `;
  }

  if (classesSummary) classesSummary.textContent = `${data.completedClasses}/19 · ${classesPercent}%`;
  if (classesFill) classesFill.style.width = `${classesPercent}%`;
  if (classProgress) {
    classProgress.innerHTML = data.classes.map((value, index) => {
      const status = value >= 1 ? "is-complete" : value > 0 ? "is-progress" : "is-pending";
      return `<span class="class-progress-dot ${status}">C${index + 1}</span>`;
    }).join("");
  }

  if (coinsSummary) coinsSummary.textContent = `${data.coins}/${data.totalCoins} · ${coinsPercent}%`;
  if (coinsFill) coinsFill.style.width = `${coinsPercent}%`;
  if (coinsMeta) {
    coinsMeta.innerHTML = `
      <div><span>Monedas por clase</span><strong>${(data.coins / Math.max(data.completedClasses, 1)).toFixed(1)}</strong></div>
      <div><span>Potencial restante</span><strong>${data.totalCoins - data.coins}</strong></div>
    `;
  }

  if (activitiesSummary) activitiesSummary.textContent = `${data.activitiesPassed}/${data.totalActivities} · ${activitiesPercent}%`;
  if (activitiesFill) activitiesFill.style.width = `${activitiesPercent}%`;
  if (activitiesMeta) {
    activitiesMeta.innerHTML = `
      <div><span>Exito en actividades</span><strong>${activitiesPercent}%</strong></div>
      <div><span>Intentos utiles</span><strong>${data.activitiesPassed}</strong></div>
    `;
  }

  if (reflectionSummary) reflectionSummary.textContent = `${data.averageReflection}/10`;
  if (reflectionMeta) {
    reflectionMeta.innerHTML = `
      <div><span>Puntuacion media reflexion</span><strong>${data.averageReflection}/10</strong></div>
      <div><span>Media quizzes</span><strong>${data.averageQuiz}%</strong></div>
    `;
  }

  if (rewardChart) {
    rewardChart.innerHTML = data.rewardsTrend.map((value, index) => `
      <div class="chart-bar-col">
        <div class="chart-bar" style="height:${Math.max(18, value * 2)}px"></div>
        <strong>${value}</strong>
        <span>S${index + 1}</span>
      </div>
    `).join("");
  }

  if (quizChart) {
    quizChart.innerHTML = data.quizScores.map((value, index) => `
      <div class="quiz-row">
        <span>Bloque ${index + 1}</span>
        <div class="quiz-row-track">
          <div class="quiz-row-fill" style="width:${value}%"></div>
        </div>
        <strong>${value ? `${value}%` : "Pendiente"}</strong>
      </div>
    `).join("");
  }
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function getBlockStatus(block) {
  const numbers = block.classes.map((item) => item.number);
  const minClass = Math.min(...numbers);
  const maxClass = Math.max(...numbers);
  if (maxClass < CURRENT_CLASS_NUMBER) return "complete";
  if (minClass <= CURRENT_CLASS_NUMBER && maxClass >= CURRENT_CLASS_NUMBER) return "progress";
  return "pending";
}

function getClassStatus(classItem) {
  if (classItem.number < CURRENT_CLASS_NUMBER) return "complete";
  if (classItem.number === CURRENT_CLASS_NUMBER) return "progress";
  return "pending";
}

function getStatusLabel(status) {
  if (status === "complete") return "Completado";
  if (status === "progress") return "En progreso";
  return "No iniciado";
}

function getSelectedBlock() {
  return contentBlocks.find((block) => block.id === contentState.selectedBlockId) || null;
}

function getSelectedClass() {
  const block = getSelectedBlock();
  if (!block) return null;
  return block.classes.find((item) => item.number === contentState.selectedClassNumber) || null;
}

function setContentScreen(screenId) {
  document.querySelectorAll(".content-screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === screenId);
  });
}

function renderContentBlocks() {
  const target = document.getElementById("contentBlocksGrid");
  if (!target) return;

  target.innerHTML = contentBlocks.map((block) => {
    const status = getBlockStatus(block);
    const classesPreview = block.classes.map((item) => `Clase ${item.number}: ${item.title}`).join(" · ");
    return `
      <button type="button" class="content-block-card is-${status}" data-block-id="${block.id}">
        <span class="content-card-label">${block.title}</span>
        <strong>${block.subtitle}</strong>
        <span class="content-card-meta">${block.rangeLabel}</span>
        <span class="content-card-classes">${classesPreview}</span>
        <span class="content-card-status">${getStatusLabel(status)}</span>
      </button>
    `;
  }).join("");

  target.querySelectorAll("[data-block-id]").forEach((button) => {
    button.addEventListener("click", () => {
      contentState.selectedBlockId = button.dataset.blockId;
      contentState.selectedClassNumber = null;
      renderContentBlockDetail();
      setContentScreen("contentsBlockDetail");
    });
  });
}

function renderContentBlockDetail() {
  const block = getSelectedBlock();
  const title = document.getElementById("contentBlockTitle");
  const target = document.getElementById("contentClassesList");
  if (!block || !title || !target) return;

  title.textContent = `${block.title}. ${block.subtitle}`;
  target.innerHTML = block.classes.map((classItem) => {
    const status = getClassStatus(classItem);
    return `
      <button type="button" class="content-class-card is-${status}" data-class-number="${classItem.number}">
        <div>
          <strong>Clase ${classItem.number} - ${classItem.title}</strong>
          <span>${classItem.intro}</span>
        </div>
        <span class="content-class-status">${getStatusLabel(status)}</span>
      </button>
    `;
  }).join("");

  target.querySelectorAll("[data-class-number]").forEach((button) => {
    button.addEventListener("click", () => {
      contentState.selectedClassNumber = Number(button.dataset.classNumber);
      contentState.selectedSection = "resumen";
      renderContentClassDetail();
      setContentScreen("contentsClassDetail");
    });
  });
}

function renderContentClassDetail() {
  const classItem = getSelectedClass();
  const title = document.getElementById("contentClassTitle");
  const tabs = document.getElementById("lessonSectionTabs");
  const grid = document.getElementById("lessonInfoGrid");
  const previewTitle = document.getElementById("lessonPreviewTitle");
  const previewImage = document.getElementById("lessonPreviewImage");
  const startButton = document.getElementById("lessonStartButton");

  if (!classItem || !title || !tabs || !grid || !previewTitle || !previewImage || !startButton) return;

  title.textContent = `Clase ${classItem.number}. ${classItem.title}`;
  previewTitle.textContent = classItem.title;
  previewImage.className = `lesson-preview-image is-${getClassStatus(classItem)}`;
  previewImage.style.backgroundImage = "";

  if (classItem.previewImageUrl) {
    previewImage.classList.add("has-asset");
    previewImage.style.backgroundImage = `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18)), url("${classItem.previewImageUrl}")`;
  }

  tabs.innerHTML = contentSections.map((section) => `
    <button type="button" class="lesson-section-tab ${section.id === contentState.selectedSection ? "is-active" : ""}" data-section-id="${section.id}">
      ${section.label}
    </button>
  `).join("");

  tabs.querySelectorAll("[data-section-id]").forEach((button) => {
    button.addEventListener("click", () => {
      contentState.selectedSection = button.dataset.sectionId;
      renderContentClassDetail();
    });
  });

  const rows = classItem.sections[contentState.selectedSection] || [];
  grid.innerHTML = rows.map((row) => `
    <article class="lesson-info-row">
      <span>${row.label}</span>
      <strong>${row.value}</strong>
    </article>
  `).join("");

  startButton.onclick = () => {
    window.location.href = classItem.launchUrl;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  renderList("historyList", historyData);
  renderList("upcomingList", upcomingData);
  renderStudents();
  renderCohortTable();
  renderContentBlocks();
  renderManagement();
  renderSupport();
  setManagementFeedback(managementState.ui.feedback, true);

  const managementGroupSelect = document.getElementById("managementGroupSelect");
  const managementTeacherSelect = document.getElementById("managementTeacherSelect");
  const managementModeSelect = document.getElementById("managementModeSelect");
  const managementSchedulePreset = document.getElementById("managementSchedulePreset");
  const managementHistoryButton = document.getElementById("managementHistoryButton");
  const managementSaveButton = document.getElementById("managementSaveButton");
  const managementModuleNav = document.getElementById("managementModuleNav");
  const managementModuleContent = document.getElementById("managementModuleContent");
  const managementDrawer = document.getElementById("managementAccessDrawer");
  const supportSearchInput = document.getElementById("supportSearchInput");
  const supportMainContent = document.getElementById("supportMainContent");
  const supportSidebar = document.querySelector(".support-sidebar");
  const supportTicketDrawer = document.getElementById("supportTicketDrawer");
  const supportViewTicketsButton = document.getElementById("supportViewTicketsButton");
  const supportNewTicketButton = document.getElementById("supportNewTicketButton");

  if (managementGroupSelect) managementGroupSelect.value = managementState.context.currentClass;
  if (managementTeacherSelect) managementTeacherSelect.value = managementState.context.tutor;
  if (managementModeSelect) managementModeSelect.value = managementState.context.scheduleMode;
  if (managementSchedulePreset) managementSchedulePreset.value = managementState.context.schedulePreset;

  managementGroupSelect?.addEventListener("change", (event) => {
    managementState.context.currentClass = event.target.value;
    managementState.studentProfiles.forEach((profile) => {
      profile.group = event.target.value;
    });
    setManagementFeedback(`Grupo activo actualizado a ${event.target.value}.`, true);
    renderManagement();
  });

  managementTeacherSelect?.addEventListener("change", (event) => {
    managementState.context.tutor = event.target.value;
    setManagementFeedback(`Tutor responsable actualizado a ${event.target.value}.`, true);
  });

  managementModeSelect?.addEventListener("change", (event) => {
    managementState.context.scheduleMode = event.target.value;
    managementState.programming.mode = event.target.value;
    setManagementFeedback("Modo de programacion actualizado localmente.", true);
    renderManagement();
  });

  managementSchedulePreset?.addEventListener("change", (event) => {
    managementState.context.schedulePreset = event.target.value;
    setManagementFeedback("Escenario de programacion actualizado.", true);
  });

  managementHistoryButton?.addEventListener("click", () => {
    managementState.ui.activeModule = "historial";
    managementState.ui.selectedAccessStudent = null;
    renderManagement();
  });

  managementSaveButton?.addEventListener("click", () => {
    saveManagementChanges();
  });

  managementModuleNav?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-management-module]");
    if (!button) return;
    managementState.ui.activeModule = button.dataset.managementModule;
    managementState.ui.selectedAccessStudent = null;
    renderManagement();
  });

  managementModuleContent?.addEventListener("change", (event) => {
    const target = event.target;
    const field = target.dataset.managementField;
    const filter = target.dataset.managementFilter;
    if (field) {
      handleManagementFieldChange(field, target.value);
      return;
    }
    if (filter) {
      if (filter === "accessOnlyIncidents" || filter === "accessOnlyModified") {
        managementState.ui[filter] = target.value === "true";
      } else {
        managementState.ui[filter] = target.value;
      }
      managementState.ui.selectedAccessStudent = null;
      renderManagement();
    }
  });

  managementModuleContent?.addEventListener("input", (event) => {
    const target = event.target;
    const filter = target.dataset.managementFilter;
    if (!filter) return;
    managementState.ui[filter] = target.value;
    managementState.ui.selectedAccessStudent = null;
    renderManagement();
  });

  managementModuleContent?.addEventListener("click", (event) => {
    const moduleButton = event.target.closest("[data-management-action]");
    const toggleButton = event.target.closest("[data-management-toggle]");
    const editAccessButton = event.target.closest("[data-management-edit-access]");
    const selectStudentButton = event.target.closest("[data-management-select-student]");
    const studentActionButton = event.target.closest("[data-management-student-action]");
    const aiActionButton = event.target.closest("[data-management-ai-action]");

    if (moduleButton) {
      handleManagementAction(moduleButton.dataset.managementAction);
      return;
    }
    if (toggleButton) {
      handleManagementToggle(toggleButton.dataset.managementToggle);
      return;
    }
    if (editAccessButton) {
      managementState.ui.selectedAccessStudent = editAccessButton.dataset.managementEditAccess;
      renderManagementDrawer();
      return;
    }
    if (selectStudentButton) {
      managementState.ui.selectedStudent = selectStudentButton.dataset.managementSelectStudent;
      renderManagement();
      return;
    }
    if (studentActionButton) {
      handleManagementStudentAction(studentActionButton.dataset.managementStudentAction);
      return;
    }
    if (aiActionButton) {
      handleManagementAiAction(aiActionButton.dataset.managementAiAction, aiActionButton.dataset.managementAiId);
    }
  });

  managementDrawer?.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-management-drawer-close]");
    const accessActionButton = event.target.closest("[data-management-access-action]");
    if (closeButton) {
      managementState.ui.selectedAccessStudent = null;
      renderManagementDrawer();
      return;
    }
    if (accessActionButton) {
      handleManagementAccessAction(accessActionButton.dataset.managementAccessAction);
    }
  });

  supportSearchInput?.addEventListener("input", (event) => {
    supportState.ui.search = event.target.value;
    renderSupport();
  });

  supportViewTicketsButton?.addEventListener("click", () => {
    supportState.ui.activeView = "tickets";
    renderSupport();
  });

  supportNewTicketButton?.addEventListener("click", () => {
    supportState.ui.selectedTicketId = null;
    supportState.ui.ticketDrawerOpen = true;
    renderSupportTicketDrawer();
  });

  supportSidebar?.addEventListener("click", (event) => {
    const threadButton = event.target.closest("[data-support-thread]");
    const ticketButton = event.target.closest("[data-support-ticket]");
    const promptButton = event.target.closest("[data-support-prompt]");

    if (threadButton) {
      supportState.ui.selectedThreadId = threadButton.dataset.supportThread;
      supportState.ui.activeView = "chat";
      renderSupport();
      return;
    }
    if (ticketButton) {
      supportState.ui.selectedTicketId = ticketButton.dataset.supportTicket;
      supportState.ui.ticketDrawerOpen = true;
      renderSupportTicketDrawer();
      return;
    }
    if (promptButton) {
      supportState.ui.activeView = "chat";
      supportState.ui.messageDraft = promptButton.dataset.supportPrompt;
      renderSupport();
    }
  });

  supportMainContent?.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-support-action]");
    const promptButton = event.target.closest("[data-support-prompt]");
    const contextActionButton = event.target.closest("[data-support-context-action]");
    const ticketButton = event.target.closest("[data-support-ticket]");
    const filterButton = event.target.closest("[data-support-ticket-filter]");

    if (actionButton) {
      const action = actionButton.dataset.supportAction;
      if (action === "open-ticket") {
        supportState.ui.selectedTicketId = null;
        supportState.ui.ticketDrawerOpen = true;
        renderSupportTicketDrawer();
        return;
      }
      if (action === "back-chat" || action === "continue-assistant") {
        supportState.ui.activeView = "chat";
        renderSupport();
        return;
      }
      if (action === "submit-ticket") {
        createSupportTicket();
        return;
      }
      if (action === "reopen-ticket") {
        const ticket = getSupportSelectedTicket();
        if (ticket) {
          ticket.status = "Abierto";
          ticket.updatedAt = "Ahora";
          renderSupportTicketDrawer();
          renderSupport();
        }
        return;
      }
      if (action === "comment-ticket") {
        supportState.ui.activeView = "chat";
        supportState.ui.ticketDrawerOpen = false;
        supportState.ui.messageDraft = "Quiero anadir un comentario al ticket seleccionado.";
        renderSupport();
      }
    }

    if (promptButton) {
      supportState.ui.activeView = "chat";
      sendSupportMessage(promptButton.dataset.supportPrompt);
      return;
    }

    if (contextActionButton) {
      const label = contextActionButton.dataset.supportContextAction;
      if (label === "Crear ticket") {
        supportState.ui.ticketDrawerOpen = true;
        supportState.ui.selectedTicketId = null;
        renderSupportTicketDrawer();
        return;
      }
      if (label === "Esto no ha funcionado") {
        sendSupportMessage("Sigue fallando y necesito mas ayuda.");
        return;
      }
      supportState.ui.messageDraft = label;
      renderSupport();
      return;
    }

    if (ticketButton) {
      supportState.ui.selectedTicketId = ticketButton.dataset.supportTicket;
      supportState.ui.ticketDrawerOpen = true;
      renderSupportTicketDrawer();
      return;
    }

    if (filterButton) {
      const filter = filterButton.dataset.supportTicketFilter;
      supportState.ui.search = filter === "all" ? "" : filter;
      renderSupport();
    }
  });

  supportMainContent?.addEventListener("input", (event) => {
    const target = event.target;
    const ticketField = target.dataset.supportTicketField;
    if (ticketField) {
      supportState.ticketForm[ticketField] = target.type === "checkbox" ? target.checked : target.value;
      return;
    }
    if (target.id === "supportMessageInput") {
      supportState.ui.messageDraft = target.value;
    }
  });

  supportMainContent?.addEventListener("keydown", (event) => {
    if (event.target.id === "supportMessageInput" && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendSupportMessage(event.target.value);
    }
  });

  supportMainContent?.addEventListener("click", (event) => {
    if (event.target.id === "supportSendButton") {
      const input = document.getElementById("supportMessageInput");
      sendSupportMessage(input?.value || "");
    }
  });

  supportTicketDrawer?.addEventListener("click", (event) => {
    if (event.target.closest("[data-support-ticket-close]")) {
      supportState.ui.ticketDrawerOpen = false;
      supportState.ui.selectedTicketId = null;
      renderSupportTicketDrawer();
    }
  });

  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === target));
    });
  });

  document.querySelectorAll("[data-modal-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.modalTarget);
      if (modal) openModal(modal);
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-close-modal")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".modal.is-open").forEach(closeModal);
  });

  document.getElementById("backToBlocks")?.addEventListener("click", () => {
    contentState.selectedClassNumber = null;
    setContentScreen("contentsOverview");
  });

  document.getElementById("backToBlock")?.addEventListener("click", () => {
    setContentScreen("contentsBlockDetail");
  });

  document.getElementById("cancelStudentStats")?.addEventListener("click", () => {
    const modal = document.getElementById("studentConfirmModal");
    if (modal) closeModal(modal);
  });

  document.getElementById("confirmStudentStats")?.addEventListener("click", () => {
    const modal = document.getElementById("studentConfirmModal");
    if (modal) closeModal(modal);
    if (!selectedStudentName) return;
    renderStudentDashboard(selectedStudentName);
    setStudentsView("studentDetailView");
  });

  document.getElementById("backToStudents")?.addEventListener("click", () => {
    setStudentsView("studentsOverview");
  });

  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.addEventListener("click", () => {
    try {
      sessionStorage.clear();
    } catch (_) {}

    document.cookie = "acceso_adamis_profesor=; Path=/; Max-Age=0; SameSite=Lax";
    window.location.href = "/splash.html";
  });
});
