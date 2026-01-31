
window.slides = window.slides || [];

// ---------- COMPAT: misma API que ya usas ----------
function Slide(opts = {}){
  const {
    text = '',
    img = '', alt = '',
    textPosition = 'right',
    imageFraction,
    textFraction,
    typewriter,
    typeSpeed,
    narrator,
    narratorColor,
    recompensa, reward, premio
  } = opts;

  const slide = { tipo:'explicacion-bocadillo', text, textPosition };

  if (img){
    slide.img = (typeof img === 'string') ? img : { src: img?.src || '', alt: img?.alt || alt || '' };
  }
  if (imageFraction != null) slide.imageFraction = imageFraction;
  if (textFraction  != null) slide.textFraction  = textFraction;
  if (typewriter !== undefined) slide.typewriter = typewriter;
  if (typeSpeed  !== undefined) slide.typeSpeed  = typeSpeed;

  if (narrator) slide.narrator = narrator;
  if (narratorColor) slide.narratorColor = narratorColor;

  if (recompensa ?? reward ?? premio) slide.recompensa = recompensa ?? reward ?? premio;

  return slide;
}

// ---------- NUEVA: Título de actividad ----------
function SlideTituloActividad({ actividad, nombre, name } = {}){
  return { tipo: 'titulo-actividad', actividad: actividad ?? nombre ?? name ?? '' };
}

// ---------- NUEVA: Explicación de actividad (1–5 guiones) ----------
function SlideExplicacionActividad({ guiones = [], bullets, puntos, recompensa, reward, premio, noLock } = {}){
  const arr = Array.isArray(guiones) ? guiones
           : Array.isArray(bullets) ? bullets
           : Array.isArray(puntos)  ? puntos
           : [];
  return {
    tipo: 'explicacion-actividad',
    guiones: arr.slice(0, 5).map(x => String(x ?? '').trim()).filter(Boolean),
    recompensa: recompensa ?? reward ?? premio ?? '',
    noLock: !!noLock
  };
}

// ---------- NUEVA: Dinámica de actividad ----------
function SlideDinamicaActividad({ img, imagen, alt, descripcion, description, icons, iconos, onSelect, onChoice, btnBajoText, btnMedioText, btnAltoText } = {}){
  const normalizedImg = img ?? imagen ?? '';
  const normalizedIcons = Array.isArray(iconos) ? iconos : (Array.isArray(icons) ? icons : []);
  return {
    tipo: 'dinamica-actividad',
    img: normalizedImg ? (typeof normalizedImg === 'string' ? normalizedImg : { src: normalizedImg.src || '', alt: normalizedImg.alt || alt || '' }) : '',
    alt: alt || '',
    descripcion: descripcion ?? description ?? '',
    iconos: normalizedIcons,
    onSelect, onChoice,
    btnBajoText, btnMedioText, btnAltoText
  };
}

// ---------- NUEVA: Título de clase (texto o imagen) ----------
function SlideTituloClase({ titulo, title, text, modo, variant, mode, imgTitulo, img, imagen, image, alt } = {}){
  return {
    tipo: 'titulo-clase',
    // Texto del título (si quieres letras animadas)
    titulo: titulo ?? title ?? text ?? '',
    // Imagen del título (si prefieres usar un gráfico)
    imgTitulo: imgTitulo ?? img ?? imagen ?? image ?? '',
    alt: alt || 'Título visual',
    // Fuerza el modo: 'texto' | 'imagen' (si no pones nada, auto-decide)
    mode: mode ?? variant ?? modo
  };
}

// ---------- NUEVA: Cuadro de reflexión ----------
// Uso base:
//   SlideCuadroReflexion({
//     pregunta: "¿Qué es el interés compuesto?",
//     placeholder: "Escribe aquí tu idea principal…",
//     minChars: 40,
//     maxChars: 400,
//     allowSkip: true,
//     advanceOnSubmit: true,
//     autoFocus: true,
//     // OPCIONAL: eval. por callback (ej. LLM)
//     onEvaluate: async ({ question, answer, meta }) => {
//       // devuelve lo que quieras; se guardará en window.SLIDE_LAST_REFLEXION_RESULT
//       return { ok: true, feedback: "Correcto y bien explicado." };
//     },
//     // OPCIONAL: eval. por API REST (si prefieres fetch):
//     // apiEvaluate: { url: "/api/eval", method: "POST", headers: { "Authorization": "Bearer ..." } }
//   })
function SlideCuadroReflexion({
  pregunta, question, prompt,
  placeholder,
  minChars, maxChars,
  allowSkip = true,
  advanceOnSubmit = true,
  autoFocus = true,
  onEvaluate, onResult,
  apiEvaluate,
  id, value, evalText, skipText
} = {}) {
  return {
    tipo: 'cuadro-reflexion',
    pregunta: String(pregunta ?? question ?? prompt ?? '').trim(),
    placeholder: placeholder ?? 'Escribe aquí tu idea principal…',
    minChars: (typeof minChars === 'number' && minChars > 0) ? minChars : 0,
    maxChars: (typeof maxChars === 'number' && maxChars > 0) ? maxChars : 0,
    allowSkip: !!allowSkip,
    advanceOnSubmit: !!advanceOnSubmit,
    autoFocus: !!autoFocus,
    onEvaluate, onResult,
    apiEvaluate, id, value,
    evalText, skipText
  };
}

// Uso: window.slides.push(SlideActividadAhorro11({...}));
function SlideActividadAhorro11({
  text, image, alt,
  coins, happiness,
  setpoints,        // { sp1, sp2, sp3 }
  zoneIcons,        // { red, orange, green }
  coinIcon,         // override del icono de moneda
  left, right,      // { dCoins, dHappy, label, icon, color }
  autoAdvance = true,
  showGoal,
  goal,
  goalAmount,
  objetivo
} = {}){
  return {
    tipo: 'actividad-ahorro-1-1',
    text, image, alt, coins, happiness, setpoints, zoneIcons, coinIcon,
    left, right, autoAdvance,
    showGoal,
    goal: goal ?? goalAmount ?? objetivo
  };
}

function SlideActividadAhorro12({
  text, image, alt,
  duration = 900, advanceAfter = 0,
  showGoal, goal, goalAmount, objetivo,
  showContinueButton, continueText
} = {}){
  return {
    tipo: 'actividad-ahorro-1-2',
    text, image, alt,
    duration, advanceAfter,
    showGoal,
    goal: goal ?? goalAmount ?? objetivo,
    showContinueButton,
    continueText
  };
}

function SlideActividadAhorro13({ text, image, alt, paga = 0, duration = 800, advanceAfter = 0, showGoal, goal, goalAmount, objetivo } = {}){
  return { tipo: 'actividad-ahorro-1-3', text, image, alt, paga, duration, advanceAfter, showGoal, goal: goal ?? goalAmount ?? objetivo };
}

function SlideActividadAhorro14({
  textOk, textKo, text1, text2, okText, koText,
  price, precio,
  image, alt,
  left, right,
  showGoal, goal, goalAmount, objetivo
} = {}){
  return {
    tipo: 'actividad-ahorro-1-4',
    textOk: textOk ?? text1 ?? okText,
    textKo: textKo ?? text2 ?? koText,
    price: price ?? precio ?? 0,
    image, alt,
    left, right,
    showGoal,
    goal: goal ?? goalAmount ?? objetivo
  };
}

function SlideActividadDeuda11({ text, image, alt, event } = {}){
  return { tipo: 'actividad-deuda-1-1', text, image, alt, event };
}
function SlideActividadDeuda12({ text, image, alt, paga = 10 } = {}){
  return { tipo: 'actividad-deuda-1-2', text, image, alt, paga };
}

function SlideActividadDeuda13({ text, image, alt } = {}){
  return { tipo: 'actividad-deuda-1-3', text, image, alt };
}

function SlideActividadDeuda1s({ text, image, alt, event } = {}){
  return { tipo: 'actividad-deuda-1s', text, image, alt, event };
}

function SlideActividadDeuda14({ text, image, alt, event, showContinueButton, continueText } = {}){
  return { tipo: 'actividad-deuda-1-4', text, image, alt, event, showContinueButton, continueText };
}

function SlideActividadDeuda11TutorialV2({ text, image, alt, event, tutorial } = {}) {
  return {
    tipo: 'actividad-deuda-1-1-tutorial-v2',
    text, image, alt, event, tutorial
  };
}
// ---------- NUEVA: Slide de introducción de término ----------
function SlideTerminoIntro({
  text = '',
  img = '', alt = '',
  narrator, narratorColor,
  typewriter, typeSpeed,
  term = '', termino,     // alias
  meaning = '', definicion, definition, // alias
  goldGradient, // opcional: override del degradado dorado (CSS)
} = {}) {
  return {
    tipo: 'termino-intro',
    text, img: img || '', alt,
    narrator, narratorColor,
    typewriter, typeSpeed,
    term: term || termino || '',
    meaning: meaning || definicion || definition || '',
    goldGradient
  };
}


// ---------- NUEVA: Encuesta (genérica) ----------
function SlideEncuesta({
  id,
  mode, modo, tipoEncuesta,
  pregunta, question, prompt,
  opciones, options,
  shuffle,
  required = true,
  allowSkip = false,
  advanceOnSubmit = true,
  placeholder,
  minChars, minLength,
  maxChars, maxLength,
  min = 1, max = 10, step = 1, initial,
  labels, submitText, skipText,
  onSubmit
} = {}){
  return {
    tipo: 'encuesta',
    id,
    mode: mode ?? modo ?? tipoEncuesta,
    pregunta: String(pregunta ?? question ?? prompt ?? ''),
    opciones: opciones ?? options,
    shuffle: !!shuffle,
    required: !!required,
    allowSkip: !!allowSkip,
    advanceOnSubmit: !!advanceOnSubmit,
    placeholder,
    minChars, minLength, maxChars, maxLength,
    min, max, step, initial,
    labels, submitText, skipText,
    onSubmit
  };
}

// ---------- NUEVA: Botón único centrado ----------
// Uso: window.slides.push(SlideBotonUnico({ texto:'Volver al menú', action:'menu' }));
// action: 'menu' | 'next' (default)
function SlideBotonUnico({ texto, text, label, action, comportamiento } = {}){
  return {
    tipo: 'boton-unico',
    label: label ?? texto ?? text ?? '',
    action: action ?? comportamiento ?? 'next'
  };
}

function SlideEncuestaOpcionMultiple({ id, pregunta, options, opciones, shuffle, required = true, allowSkip = false, advanceOnSubmit = true, submitText, skipText, onSubmit } = {}){
  return SlideEncuesta({ id, mode: 'choice', pregunta, options: options ?? opciones, shuffle, required, allowSkip, advanceOnSubmit, submitText, skipText, onSubmit });
}
function SlideEncuestaTexto({ id, pregunta, placeholder = 'Escribe aquí tu respuesta…', minChars, maxChars, required = true, allowSkip = false, advanceOnSubmit = true, submitText, skipText, onSubmit } = {}){
  return SlideEncuesta({ id, mode: 'text', pregunta, placeholder, minChars, maxChars, required, allowSkip, advanceOnSubmit, submitText, skipText, onSubmit });
}
function SlideEncuestaEscala({ id, pregunta, min = 1, max = 10, step = 1, initial, labels = { min: 'Bajo', max: 'Alto' }, required = true, allowSkip = false, advanceOnSubmit = true, submitText, skipText, onSubmit } = {}){
  return SlideEncuesta({ id, mode: 'scale', pregunta, min, max, step, initial, labels, required, allowSkip, advanceOnSubmit, submitText, skipText, onSubmit });
}
