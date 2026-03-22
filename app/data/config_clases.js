// data/config_clases.js
// Toggle de desarrollo: false = no bloquear deuda (dev), true = bloquear hasta completar ahorro (prod)
window.MAP_LOCK_DEUDA = false;
window.CONFIG_CLASES = {
  clases: [
    { id: "ahorro", numero: 10, activa: true },
    { id: "deuda",  numero: 11, activa: true }
    // añade aquí las demás: { id, numero(1..18), activa(true/false) }
  ]
};
