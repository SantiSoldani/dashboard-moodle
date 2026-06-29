import {
  post_entrevistaForm,
  get_puntajeEntrevista,
  put_puntajeEntrevista,
} from "../models/Entrevista.js";

const LIKERT_QUESTIONS = [
  {
    id: "pse",
    text: "¿Qué puntaje le asignaría al perfil sociocultural del alumno?",
    labelMin: "Favorable",
    labelMax: "Vulnerable",
  },
  {
    id: "ic",
    text: "¿Qué puntaje le asignaría a la continuidad esperada de la carrera del alumno?",
    labelMin: "Alta Probabilidad",
    labelMax: "Riesgo de Abandono",
  },
  {
    id: "pep",
    text: "¿Qué puntaje le asignaría al perfil educativo de los padres del alumno?",
    labelMin: "Nivel Educativo Alto",
    labelMax: "Baja Escolaridad",
  },
  {
    id: "cl",
    text: "¿Qué puntaje le asignaría a la carga laboral del alumno?",
    labelMin: "Sin Carga",
    labelMax: "Alta Carga Laboral",
  },
  {
    id: "cv",
    text: "¿Qué puntaje le asignaría a la carga vital del alumno?",
    labelMin: "Mínima",
    labelMax: "Muy Alta / Crítica",
  },
  {
    id: "loc",
    text: "¿Qué puntaje le asignaría a la localización del alumno respecto de la facultad?",
    labelMin: "Cercana",
    labelMax: "Muy Distante / Difícil",
  },
  {
    id: "ra",
    text: "¿Qué puntaje le asignaría al rendimiento académico del alumno durante el último cuatrimestre?",
    labelMin: "Excelente",
    labelMax: "Crítico",
  },
];

export function initEntrevista() {
  console.log("se ejecuta ;al entrevista");
  renderLikertQuestions();
  setupFormRegistrar();
  setupConsultarPuntaje();
  setupActualizarPuntaje();
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderLikertQuestions() {
  const container = document.getElementById("entrevista-likert-container");
  if (!container) return;

  container.innerHTML = LIKERT_QUESTIONS.map(
    (q, index) => `
      <div class="likert-question" data-qid="${q.id}">
        <p class="likert-question-text">${index + 1}. ${q.text}</p>
        <div class="likert-options" role="group" aria-label="${q.text}">
          ${[1, 2, 3, 4, 5]
        .map(
          (val) => `
            <button
              type="button"
              class="likert-btn"
              data-question="${q.id}"
              data-value="${val}"
              aria-label="Puntaje ${val}"
            >${val}</button>
          `,
        )
        .join("")}
        </div>
        <div class="likert-labels" style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-top: 8px; padding: 0 4px; font-weight: 500;">
           <span>1 - ${q.labelMin}</span>
           <span>5 - ${q.labelMax}</span>
        </div>
      </div>
    `,
  ).join("");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".likert-btn");
    if (!btn) return;

    const questionId = btn.dataset.question;
    const questionEl = container.querySelector(`[data-qid="${questionId}"]`);

    container
      .querySelectorAll(`.likert-btn[data-question="${questionId}"]`)
      .forEach((b) => b.classList.remove("selected"));

    btn.classList.add("selected");

    if (questionEl) questionEl.classList.remove("likert-question--error");
  });
}

// ─── Validación ───────────────────────────────────────────────────────────────

function validateRegistrar() {
  const errors = [];

  const dni = document.getElementById("entrevista-dni-alumno")?.value.trim();
  if (!dni) {
    errors.push("El DNI del alumno es obligatorio.");
    document
      .getElementById("entrevista-dni-alumno")
      ?.classList.add("input--error");
  } else {
    document
      .getElementById("entrevista-dni-alumno")
      ?.classList.remove("input--error");
  }

  const container = document.getElementById("entrevista-likert-container");
  LIKERT_QUESTIONS.forEach((q) => {
    const selected = container?.querySelector(
      `.likert-btn.selected[data-question="${q.id}"]`,
    );
    if (!selected) {
      errors.push(`Pregunta sin responder: "${q.text}"`);
      container
        ?.querySelector(`[data-qid="${q.id}"]`)
        ?.classList.add("likert-question--error");
    }
  });

  return errors;
}

function validateConsultar() {
  const dni = document.getElementById("consulta-dni-alumno")?.value.trim();
  if (!dni) {
    document
      .getElementById("consulta-dni-alumno")
      ?.classList.add("input--error");
    return ["El DNI es obligatorio para consultar el puntaje."];
  }
  document
    .getElementById("consulta-dni-alumno")
    ?.classList.remove("input--error");
  return [];
}

function validateActualizar() {
  const errors = [];

  const dni = document.getElementById("actualizar-dni-alumno")?.value.trim();
  if (!dni) {
    errors.push("El DNI del alumno es obligatorio.");
    document
      .getElementById("actualizar-dni-alumno")
      ?.classList.add("input--error");
  } else {
    document
      .getElementById("actualizar-dni-alumno")
      ?.classList.remove("input--error");
  }

  const puntaje = document.getElementById("actualizar-puntaje-input")?.value;
  if (puntaje === "" || puntaje === null || puntaje === undefined) {
    errors.push("El nuevo puntaje es obligatorio.");
    document
      .getElementById("actualizar-puntaje-input")
      ?.classList.add("input--error");
  } else {
    document
      .getElementById("actualizar-puntaje-input")
      ?.classList.remove("input--error");
  }

  return errors;
}

// ─── Toast / Feedback ─────────────────────────────────────────────────────────

function mostrarToast(mensaje, tipo = "error") {
  let toast = document.getElementById("entrevista-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "entrevista-toast";
    document.body.appendChild(toast);
  }

  toast.className = `entrevista-toast entrevista-toast--${tipo}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined">${tipo === "success" ? "check_circle" : "error"}</span>
    <span>${mensaje}</span>
  `;
  toast.classList.add("entrevista-toast--visible");

  clearTimeout(toast._hideTimeout);
  toast._hideTimeout = setTimeout(() => {
    toast.classList.remove("entrevista-toast--visible");
  }, 4000);
}

// ─── Obtener valores del formulario ──────────────────────────────────────────

function getFormValues() {
  const dni =
    document.getElementById("entrevista-dni-alumno")?.value.trim() ?? "";

  const respuestas = {};
  LIKERT_QUESTIONS.forEach((q) => {
    const selected = document.querySelector(
      `.likert-btn.selected[data-question="${q.id}"]`,
    );
    respuestas[q.id] = selected ? parseInt(selected.dataset.value, 10) : null;
  });
  console.log({ dni, respuestas });
  return { dni, respuestas };
}

// ─── Formulario: Registrar Entrevista ────────────────────────────────────────

function setupFormRegistrar() {
  const form = document.getElementById("formRegistrarEntrevista");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    console.log("submit capturado");
    e.preventDefault();

    const errors = validateRegistrar();
    if (errors.length > 0) {
      mostrarToast(
        errors.length === 1
          ? errors[0]
          : `Hay ${errors.length} campos sin completar. Revisá el formulario.`,
        "error",
      );
      return;
    }

    await onGuardarEntrevista(getFormValues());
  });
}

async function onGuardarEntrevista(payload) {
  const btn = document.getElementById("btn_enviar");
  const originalHTML = btn?.innerHTML;

  if (btn) {
    btn.innerHTML =
      '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Guardando...';
    btn.disabled = true;
  }
  console.log(payload);
  const result = await post_entrevistaForm(payload);

  if (btn) {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }

  if (result.ok) {
    try {
      const { HandleGet_agenda_pendiente, HandleMarcar_agenda } = await import('../models/Alumno.js');
      const agenda = await HandleGet_agenda_pendiente(payload.dni);
      if (agenda && agenda.id) {
        await HandleMarcar_agenda(agenda.id);
      }
    } catch (e) {
      console.error("Error al marcar la entrevista en agendas", e);
    }

    mostrarToast("Entrevista guardada correctamente.", "success");
    document.getElementById("formRegistrarEntrevista")?.reset();
    document
      .querySelectorAll(".likert-btn.selected")
      .forEach((b) => b.classList.remove("selected"));
  } else {
    mostrarToast(
      "Error al guardar la entrevista. Intente nuevamente.",
      "error",
    );
  }
}

// ─── Consultar Puntaje ───────────────────────────────────────────────────────

function setupConsultarPuntaje() {
  const btn = document.getElementById("btn-consultar-puntaje");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const errors = validateConsultar();
    if (errors.length > 0) {
      mostrarToast(errors[0], "error");
      return;
    }

    const dni =
      document.getElementById("consulta-dni-alumno")?.value.trim() ?? "";
    await onConsultarPuntaje(dni);
  });
}

async function onConsultarPuntaje(dni) {
  const btn = document.getElementById("btn-consultar-puntaje");
  const resultEl = document.getElementById("score-result-value");
  const originalHTML = btn?.innerHTML;

  if (btn) {
    btn.innerHTML =
      '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Consultando...';
    btn.disabled = true;
  }

  if (resultEl) {
    resultEl.textContent = "Consultando...";
    resultEl.className = "score-result-value placeholder";
  }

  const result = await get_puntajeEntrevista(dni);

  if (btn) {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }

  if (result.ok) {
    const puntaje = result.data?.score ?? result.data;
    if (resultEl) {
      resultEl.textContent = puntaje;
      resultEl.className = "score-result-value";
    }
  } else {
    if (resultEl) {
      resultEl.textContent = "— Sin datos —";
      resultEl.className = "score-result-value placeholder";
    }
    mostrarToast(
      "No se pudo obtener el puntaje. Verificá el DNI ingresado.",
      "error",
    );
  }
}

// ─── Actualizar Puntaje ───────────────────────────────────────────────────────

function setupActualizarPuntaje() {
  const btn = document.getElementById("btn-actualizar-puntaje");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const errors = validateActualizar();
    if (errors.length > 0) {
      mostrarToast(
        errors.length === 1
          ? errors[0]
          : "Completá todos los campos requeridos.",
        "error",
      );
      return;
    }

    const dni =
      document.getElementById("actualizar-dni-alumno")?.value.trim() ?? "";
    const puntaje =
      document.getElementById("actualizar-puntaje-input")?.value ?? "";

    await onActualizarPuntaje(dni, puntaje);
  });
}

async function onActualizarPuntaje(dni, puntaje) {
  const btn = document.getElementById("btn-actualizar-puntaje");
  const originalHTML = btn?.innerHTML;

  if (btn) {
    btn.innerHTML =
      '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Actualizando...';
    btn.disabled = true;
  }

  const result = await put_puntajeEntrevista(dni, puntaje);

  if (btn) {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }

  if (result.ok) {
    mostrarToast("Puntaje actualizado correctamente.", "success");
    document.getElementById("actualizar-dni-alumno").value = "";
    document.getElementById("actualizar-puntaje-input").value = "";
  } else {
    mostrarToast(
      "Error al actualizar el puntaje. Intente nuevamente.",
      "error",
    );
  }
}
