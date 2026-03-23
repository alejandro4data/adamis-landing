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
