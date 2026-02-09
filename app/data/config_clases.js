// data/config_clases.js
// Toggle de desarrollo: false = no bloquear clase 7 (dev), true = bloquear hasta completar clase 6 (prod)
window.MAP_LOCK_CLASS7 = false;
window.CONFIG_CLASES = {
  clases: [
    { id: "ahorro", numero: 6, activa: true },
    { id: "deuda",  numero: 7, activa: true }
    // añade aquí las demás: { id, numero(1..18), activa(true/false) }
  ]
};
