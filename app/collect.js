(function () {
  const ENDPOINT = "/api/collect";

  function classIdFromUrl() {
    try {
      const u = new URL(window.location.href);
      return u.searchParams.get("clase") || "";
    } catch {
      return "";
    }
  }

  function getSessionData() {
    if (window.AdamisEvents && typeof window.AdamisEvents.getSessionData === "function") {
      const data = window.AdamisEvents.getSessionData();
      return {
        session_uuid: data.session_uuid || null,
        student_uuid: data.student_uuid || null,
        current_user: data.current_user || null,
        centro: data.centro || null
      };
    }

    try {
      return {
        session_uuid: sessionStorage.getItem("session_uuid") || null,
        student_uuid: sessionStorage.getItem("student_uuid") || null,
        current_user: localStorage.getItem("currentUser") || null,
        centro: sessionStorage.getItem("centro") || null
      };
    } catch {
      return { session_uuid: null, student_uuid: null, current_user: null, centro: null };
    }
  }

  async function send(type, detail) {
    const session = getSessionData();

    const payload = {
      id: detail?.id ?? null,
      respuesta: detail?.respuesta ?? null,
      clase: classIdFromUrl(),
      session_uuid: session.session_uuid,
      student_uuid: session.student_uuid,
      current_user: session.current_user,
      centro: session.centro,
      fecha_gmt: new Date().toISOString()
    };


    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload })
      });

      if (!r.ok) {
        const t = await r.text();
        console.warn("Collector respondió error:", r.status, t);
      }
    } catch (e) {
      console.warn("No se pudo guardar la respuesta:", e);
    }
  }

  window.addEventListener("encuesta:submit", (e) => send("encuesta", e.detail));
  window.addEventListener("reflexion:submit", (e) => send("reflexion", e.detail));
})();
