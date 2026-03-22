const historyData = [
  {
    title: "Historia del Dinero",
    description: "Origen del dinero, evolución de los intercambios y aparición de los bancos."
  },
  {
    title: "Ingresos y Gastos",
    description: "Identificación de ingresos fijos y variables y control del gasto cotidiano."
  },
  {
    title: "El Ahorro",
    description: "Objetivos de ahorro, fondo de emergencia y hábitos financieros sostenibles."
  }
];

const upcomingData = [
  {
    title: "Fundamentos de Inversion",
    description: "Que significa invertir, horizonte temporal y perfil básico del inversor."
  },
  {
    title: "Riesgo en las Inversiones",
    description: "Relación entre riesgo y rentabilidad, y cómo diversificar decisiones."
  },
  {
    title: "Informacion Financiera",
    description: "Cómo leer datos financieros básicos y detectar información relevante."
  },
  {
    title: "Ciberdelincuencia",
    description: "Prevención de fraudes digitales, phishing y protección de datos."
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

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

document.addEventListener("DOMContentLoaded", () => {
  renderList("historyList", historyData);
  renderList("upcomingList", upcomingData);
  renderStudents();

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

  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.addEventListener("click", () => {
    try {
      sessionStorage.clear();
    } catch (_) {}

    document.cookie = "acceso_adamis_profesor=; Path=/; Max-Age=0; SameSite=Lax";
    window.location.href = "/splash.html";
  });
});
