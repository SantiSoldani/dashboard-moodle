import { HandleGet_alumnos } from "../models/Alumno.js";
import {
  Handle_get_Nota_Alumno,
  Handle_get_stats,
  Handle_get_Notas,
  Handle_get_promedio_general
} from "../models/Notas.js";
import {
  HandleGet_solicitudes,
  HandleGet_solicitudes_tutor,
  HandleMarcar_leida
} from "../models/Solicitudes.js";

let allStudents = [];
let filteredStudents = [];

// Elementos del DOM
let searchInput;
let filterEstado;
let studentsTableBody;
let totalCountElement;
let avgScoreElement;
let criticalCountElement;
let criticalListElement;
let currentDateElement;
let btnCargarDatos;

let currentPage = 1;
const itemsPerPage = 20;
let btnPrevPage;
let btnNextPage;
let pageIndicator;

export async function initHome() {
  searchInput = document.getElementById("searchAlumno");
  filterEstado = document.getElementById("filterEstado");
  const table = document.getElementById("studentsTable");
  if (table) studentsTableBody = table.querySelector("tbody");
  totalCountElement = document.getElementById("totalAlumnosCount");
  avgScoreElement = document.getElementById("avgScore1erAnio");
  criticalCountElement = document.getElementById("criticalAlumnosCount");
  criticalListElement = document.getElementById("criticalList");
  currentDateElement = document.getElementById("currentDate");
  btnCargarDatos = document.getElementById("btnCargarDatos");

  btnPrevPage = document.getElementById("btnPrevPage");
  btnNextPage = document.getElementById("btnNextPage");
  pageIndicator = document.getElementById("pageIndicator");

  setupCurrentDate();
  setupNavigation();
  await cargarDatosDashboard();
  loadSolicitudesHome();
}

async function loadSolicitudesHome() {
  const listContainer = document.getElementById('home-solicitudes-list');
  if (!listContainer) return;

  listContainer.innerHTML = '<div class="alert-empty"><p style="color: #92400e;">Cargando solicitudes...</p></div>';

  try {
    const rol = localStorage.getItem("rol");
    let solicitudes = [];

    if (rol === "Tutor") {
      const dni = localStorage.getItem("dni"); // O desde donde guardemos el DNI del usuario logueado
      if (dni) {
        solicitudes = await HandleGet_solicitudes_tutor(dni);
      } else {
        solicitudes = [];
        console.warn("No se encontró el DNI del tutor en localStorage");
      }
    } else {
      // Es Instructor/Docente general, ve todas
      solicitudes = await HandleGet_solicitudes();
    }

    // Mostrar solo las no leídas
    const unread = solicitudes.filter(s => s.leida === false);

    if (unread.length === 0) {
      listContainer.innerHTML = '<div class="alert-empty"><p style="color: #059669; font-weight: bold;"><span class="material-symbols-outlined" style="vertical-align: middle;">check_circle</span> No hay notificaciones pendientes</p></div>';
      return;
    }

    listContainer.innerHTML = '';
    unread.forEach(sol => {
      const div = document.createElement('div');
      div.style.cssText = 'background: white; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);';

      const date = new Date(sol.created_at).toLocaleDateString();
      const tutorText = sol.dni_tutor ? `<span style="font-size: 0.75rem; color: #64748b;">Tutor: ${sol.dni_tutor}</span>` : `<span style="font-size: 0.75rem; color: #f59e0b; font-weight: bold;">Sin Tutor</span>`;

      div.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <strong style="color: #92400e; font-size: 0.95rem;">Solicitud de Alumno: ${sol.dni_alumno}</strong>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <span style="font-size: 0.75rem; color: #94a3b8;">${date}</span>
                        ${tutorText}
                    </div>
                </div>
                <button class="btn-marcar-leida" data-sol-id="${sol.id}" title="Marcar como leída" style="background: transparent; border: none; cursor: pointer; color: #10b981; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 4px; transition: background 0.2s;">
                    <span class="material-symbols-outlined" style="font-size: 24px;">check_circle</span>
                </button>
            `;
      listContainer.appendChild(div);
    });

    // Event listeners para marcar leida
    listContainer.querySelectorAll('.btn-marcar-leida').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const btnElem = e.currentTarget;
        const id = btnElem.getAttribute('data-sol-id');
        btnElem.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>';
        try {
          await HandleMarcar_leida(id);
          // Recargar notificaciones
          loadSolicitudesHome();
        } catch (error) {
          console.error(error);
          alert("Error al marcar la notificación como leída.");
          btnElem.innerHTML = '<span class="material-symbols-outlined" style="font-size: 24px;">check_circle</span>';
        }
      });
    });

  } catch (error) {
    console.error(error);
    listContainer.innerHTML = '<div class="alert-empty"><p style="color: #ef4444;">Error al cargar solicitudes</p></div>';
  }
}

// Configurar la fecha actual de forma elegante en español
function setupCurrentDate() {
  if (currentDateElement) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    let today = new Date();
    let formattedDate = today.toLocaleDateString("es-ES", options);
    // Capitalizar la primera letra
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    currentDateElement.textContent = formattedDate;
  }
}

// Configuración de navegación
function setupNavigation() {
  if (btnCargarDatos) {
    btnCargarDatos.addEventListener("click", () => {
      window.location.href = "data_entry.html";
    });
  }

  // Configuración del buscador y filtros
  if (searchInput) {
    searchInput.addEventListener("input", aplicarFiltros);
  }
  if (filterEstado) {
    filterEstado.addEventListener("change", aplicarFiltros);
  }

  if (btnPrevPage) {
    btnPrevPage.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        mostrarListadoGeneral();
      }
    });
  }

  if (btnNextPage) {
    btnNextPage.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        mostrarListadoGeneral();
      }
    });
  }

  // Agregar evento a la tabla para abrir ficha del alumno en el modal
  if (studentsTableBody) {
    studentsTableBody.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (!row || row.classList.contains("placeholder-row")) return;

      const dni = row.dataset.dni;
      if (dni) {
        window.abrirModalAlumnoStats(dni);
      }
    });
  }
}

// Cargar y procesar los alumnos de la API
async function cargarDatosDashboard() {
  try {
    let response = await HandleGet_alumnos(null, "stats");
    if (response) {
      allStudents = response;
    } else {
      allStudents = [];
    }
  } catch (error) {
    console.error("Error cargando alumnos para el dashboard:", error);
    allStudents = [];
  }

  filteredStudents = [...allStudents];

  await calcularYMostrarMetricas();
  mostrarAlumnosCriticos();
  mostrarListadoGeneral();
}

// Calcular métricas del dashboard
async function calcularYMostrarMetricas() {
  // 1. Total Inscriptos
  const totalInscriptos = allStudents.length;
  if (totalCountElement) {
    totalCountElement.textContent = totalInscriptos;
  }

  // 2. Alumnos de 1er año y su promedio
  let promedio1erAnio = null;
  try {
      const promResponse = await Handle_get_promedio_general();
      if (promResponse !== undefined && promResponse !== null) {
          promedio1erAnio = typeof promResponse === 'string' ? parseFloat(promResponse) : promResponse;
      }
  } catch (error) {
      console.error("Error al obtener promedio general:", error);
  }

  if (avgScoreElement) {
    if (promedio1erAnio !== null) {
      avgScoreElement.textContent = promedio1erAnio.toFixed(2);
    } else {
      avgScoreElement.textContent = "--";
    }
  }

  // 3. Cantidad de alumnos críticos (rojo)
  const alumnosCriticos = allStudents.filter((alumno) => {
    const estado = String(alumno.color).trim().toLowerCase();
    return estado === "rojo";
  });

  if (criticalCountElement) {
    criticalCountElement.textContent = alumnosCriticos.length;
  }
}

// Renderizar sección de alumnos críticos en riesgo
function mostrarAlumnosCriticos() {
  if (!criticalListElement) return;

  criticalListElement.innerHTML = "";

  const alumnosCriticos = allStudents.filter((alumno) => {
    const estado = String(alumno.color).trim().toLowerCase();
    return estado === "rojo";
  });

  if (alumnosCriticos.length === 0) {
    criticalListElement.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #047857; background: #ecfdf5; border: 1px solid #d1fae5; padding: 24px; border-radius: 12px; font-weight: 600;">
                🎉 ¡Excelente! No hay alumnos en estado crítico actualmente.
            </div>
        `;
    return;
  }

  alumnosCriticos.forEach((alumno) => {
    const card = document.createElement("div");
    card.className = "critical-card";

    let scoreDisplay =
      alumno.score !== undefined && alumno.score !== null
        ? parseFloat(alumno.score)
        : 0;
    if (scoreDisplay <= 1.0) scoreDisplay = scoreDisplay * 10;
    if (scoreDisplay === 0) scoreDisplay = 3.5; // placeholder realista si no se ha calculado notas

    card.innerHTML = `
            <div class="critical-card-info">
                <span class="critical-name">${alumno.nombre} ${alumno.apellido}</span>
                <span class="critical-career">${alumno.carrera}</span>
                <div class="critical-badge-row">
                    <span>DNI: ${alumno.dni}</span>
                    <span class="score-badge">Índice: ${scoreDisplay.toFixed(1)}/10</span>
                </div>
            </div>
            <button onclick="abrirModalAlumnoStats('${alumno.dni}')" class="btn-card-action" style="outline: none; border: 1px solid #e5e7eb; font-family: inherit;">Ver Ficha</button>
        `;
    criticalListElement.appendChild(card);
  });
}

// Aplicar filtros en tiempo real al buscador y select de estado
function aplicarFiltros() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectEstado = filterEstado.value.trim().toLowerCase();

  filteredStudents = allStudents.filter((alumno) => {
    const matchesSearch =
      alumno.dni.includes(searchText) ||
      alumno.nombre.toLowerCase().includes(searchText) ||
      alumno.apellido.toLowerCase().includes(searchText) ||
      alumno.carrera.toLowerCase().includes(searchText);

    const estadoAlumno = String(alumno.color).trim().toLowerCase();
    const matchesEstado = selectEstado === "" || estadoAlumno === selectEstado;

    return matchesSearch && matchesEstado;
  });

  currentPage = 1;
  mostrarListadoGeneral();
}

// Renderizar el listado general en la tabla
function mostrarListadoGeneral() {
  if (!studentsTableBody) return;

  studentsTableBody.innerHTML = "";

  if (filteredStudents.length === 0) {
    const row = document.createElement("tr");
    row.className = "placeholder-row";
    row.innerHTML = `<td colspan="7">No se encontraron alumnos para la búsqueda o filtro aplicado.</td>`;
    studentsTableBody.appendChild(row);

    if (pageIndicator) pageIndicator.textContent = `Página 1 de 1`;
    if (btnPrevPage) btnPrevPage.disabled = true;
    if (btnNextPage) btnNextPage.disabled = true;
    return;
  }

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  if (pageIndicator) pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
  if (btnPrevPage) btnPrevPage.disabled = currentPage === 1;
  if (btnNextPage) btnNextPage.disabled = currentPage === totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const studentsToDisplay = filteredStudents.slice(startIndex, endIndex);

  studentsToDisplay.forEach((alumno) => {
    const row = document.createElement("tr");
    row.dataset.dni = alumno.dni;

    const estadoLimpio = String(alumno.color).trim().toLowerCase();
    let badgeClass = "verde";
    if (estadoLimpio === "amarillo") badgeClass = "amarillo";
    if (estadoLimpio === "rojo") badgeClass = "rojo";
    if (estadoLimpio === "gris") badgeClass = "gris";

    // Mapear fecha de ingreso como "año" académico para mayor realismo (ej. 2024 = 1er año, 2023 = 2do año, etc. o mostrar el año de ingreso directo)
    const yearIngreso = parseInt(alumno.fecha_inicio);
    const currentYear = new Date().getFullYear();
    let cursoText = alumno.curso || `${alumno.fecha_inicio}`; // Fallback si no viene seteado

    row.innerHTML = `
            <td><strong>${alumno.dni}</strong></td>
            <td>${alumno.nombre}</td>
            <td>${alumno.apellido}</td>
            <td>${alumno.email}</td>
            <td>${alumno.carrera}</td>
            <td><span style="font-weight: 600; color: #4b5563;">${cursoText}</span></td>
            <td>
                <span class="status-badge-pill ${badgeClass}">
                    ${alumno.color || "Pendiente"}
                </span>
            </td>
        `;
    studentsTableBody.appendChild(row);
  });
}

// ==========================================================================
// MODAL DE ESTADÍSTICAS DEL ALUMNO - CONTROLADORES GLOBALES
// ==========================================================================

window.abrirModalAlumnoStats = function (dni) {
  const modal = document.getElementById("modalAlumnoStats");
  if (!modal) return;

  const statsComponent = modal.querySelector("modal-alumnostats");
  if (statsComponent) {
    statsComponent.setAttribute("alumno-dni", dni);
  }

  // Show the modal
  modal.style.display = "flex";
  // Force browser reflow to enable transition
  modal.offsetHeight;
  modal.classList.add("active");

  // Disable body scrolling
  document.body.style.overflow = "hidden";

  console.log(`Abriendo ficha del alumno con DNI: ${dni}`);
};

window.cerrarModalAlumnoStats = function () {
  const modal = document.getElementById("modalAlumnoStats");
  if (!modal) return;

  modal.classList.remove("active");

  // Wait for transition to complete
  setTimeout(() => {
    if (!modal.classList.contains("active")) {
      modal.style.display = "none";
      const statsComponent = modal.querySelector("modal-alumnostats");
      if (statsComponent) {
        statsComponent.removeAttribute("alumno-dni"); // Reset iframe
      }
      // Restore body scroll
      document.body.style.overflow = "";
    }
  }, 350);

  console.log("Cerrando ficha del alumno");
};
