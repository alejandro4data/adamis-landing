(function () {
  const ENDPOINT = "/api/collect";

  function getClassIdFromUrl() {
    try {
      const u = new URL(window.location.href);
      return u.searchParams.get("clase") || "";
    } catch {
      return "";
    }
  }

  async function send(type, detail) {
    const payload = {
      ...detail,
      classId: getClassIdFromUrl(),
      url: window.location.href,
      user_agent: navigator.userAgent
    };

    try {
      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload })
      });
    } catch (e) {
      console.warn("No se pudo guardar la respuesta:", e);
    }
  }

  window.addEventListener("encuesta:submit", (e) => send("encuesta", e.detail));
  window.addEventListener("reflexion:submit", (e) => send("reflexion", e.detail));
})();
