// data/frases.js
// Frases por idioma para la actividad de snake.
window.FRASES_BY_LANG = {
  es: [
    'Gasta menos de lo que ganas',
    'Ahorra primero gasta despues',
    'Tu fondo de emergencia es tu escudo',
    'Evita las deudas caras',
    'Cada moneda cuenta',
    'Invertir es un maraton no un sprint'
  ],
  en: [
    'Spend less than you earn',
    'Save first spend later',
    'Your emergency fund is your shield',
    'Avoid expensive debt',
    'Every coin counts',
    'Investing is a marathon not a sprint'
  ]
};

// Backward compatibility
window.FRASES = window.FRASES_BY_LANG.es.slice();
