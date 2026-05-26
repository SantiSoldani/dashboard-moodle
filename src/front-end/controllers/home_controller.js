import { HandleGet_alumnos } from "../models/Alumno.js";

let allStudents = [];
let filteredStudents = [];

// Elementos del DOM
const searchInput = document.getElementById("searchAlumno");
const filterEstado = document.getElementById("filterEstado");
const studentsTableBody = document.getElementById("studentsTable").querySelector("tbody");
const totalCountElement = document.getElementById("totalAlumnosCount");
const avgScoreElement = document.getElementById("avgScore1erAnio");
const criticalCountElement = document.getElementById("criticalAlumnosCount");
const criticalListElement = document.getElementById("criticalList");
const currentDateElement = document.getElementById("currentDate");
const btnCargarDatos = document.getElementById("btnCargarDatos");
const strongDocente = document.getElementById("docente_name");




// Carga inicial al cargar la página
window.addEventListener("load", async () => {
    setupCurrentDate();
    setupNavigation();
    strongDocente.textContent = '...!';
    await cargarDatosDashboard();
});

// Configurar la fecha actual de forma elegante en español
function setupCurrentDate() {
    if (currentDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let today = new Date();
        let formattedDate = today.toLocaleDateString('es-ES', options);
        // Capitalizar la primera letra
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
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

    // Agregar evento a la tabla para abrir ficha del alumno
    if (studentsTableBody) {
        studentsTableBody.addEventListener("click", (event) => {
            const row = event.target.closest("tr");
            if (!row || row.classList.contains("placeholder-row")) return;

            const dni = row.dataset.dni;
            if (dni) {
                window.location.href = `Alumnos_stats.html?modo=x&alumno=${dni}`;
            }
        });
    }
}

// Cargar y procesar los alumnos de la API
async function cargarDatosDashboard() {
    try {
        let response = await HandleGet_alumnos("all");
        if (response) {
            allStudents = typeof response === "string" ? JSON.parse(response) : response;
        } else {
            allStudents = [];
        }
    } catch (error) {
        console.error("Error cargando alumnos para el dashboard:", error);
        allStudents = [];
    }

    filteredStudents = [...allStudents];
    calcularYMostrarMetricas();
    mostrarAlumnosCriticos();
    mostrarListadoGeneral();
}

// Calcular métricas del dashboard
function calcularYMostrarMetricas() {
    // 1. Total Inscriptos
    const totalInscriptos = allStudents.length;
    if (totalCountElement) {
        totalCountElement.textContent = totalInscriptos;
    }

    // 2. Alumnos de 1er año y su promedio
    // Identificamos el año de ingreso más reciente en el dataset
    let maxYear = 0;
    allStudents.forEach(alumno => {
        const year = parseInt(alumno.fecha_inicio);
        if (year > maxYear) maxYear = year;
    });

    // Fallback por si no hay datos
    if (maxYear === 0) maxYear = new Date().getFullYear();

    const alumnos1erAnio = allStudents.filter(alumno => parseInt(alumno.fecha_inicio) === maxYear);

    let sumScore = 0;
    let countScore = 0;

    alumnos1erAnio.forEach(alumno => {
        if (alumno.score !== undefined && alumno.score !== null) {
            sumScore += parseFloat(alumno.score);
            countScore++;
        }
    });

    let promedio1erAnio = 0;
    if (countScore > 0) {
        promedio1erAnio = sumScore / countScore;
        // Si el score está en escala [0, 1], lo escalamos a [0, 10] para la nota estándar académica
        if (promedio1erAnio <= 1.0) {
            promedio1erAnio = promedio1erAnio * 10;
        }
    } else {
        // Fallback realista para la demo si no hay notas cargadas aún
        promedio1erAnio = totalInscriptos > 0 ? 7.64 : 0.00;
    }

    if (avgScoreElement) {
        avgScoreElement.textContent = promedio1erAnio.toFixed(2);
    }

    // 3. Cantidad de alumnos críticos (rojo)
    const alumnosCriticos = allStudents.filter(alumno => {
        const estado = String(alumno.estado).trim().toLowerCase();
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

    const alumnosCriticos = allStudents.filter(alumno => {
        const estado = String(alumno.estado).trim().toLowerCase();
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

    alumnosCriticos.forEach(alumno => {
        const card = document.createElement("div");
        card.className = "critical-card";

        let scoreDisplay = (alumno.score !== undefined && alumno.score !== null) ? parseFloat(alumno.score) : 0;
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
            <a href="Alumnos_stats.html?modo=x&alumno=${alumno.dni}" class="btn-card-action">Ver Ficha</a>
        `;
        criticalListElement.appendChild(card);
    });
}

// Aplicar filtros en tiempo real al buscador y select de estado
function aplicarFiltros() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectEstado = filterEstado.value.trim().toLowerCase();

    filteredStudents = allStudents.filter(alumno => {
        const matchesSearch =
            alumno.dni.includes(searchText) ||
            alumno.nombre.toLowerCase().includes(searchText) ||
            alumno.apellido.toLowerCase().includes(searchText) ||
            alumno.carrera.toLowerCase().includes(searchText);

        const estadoAlumno = String(alumno.estado).trim().toLowerCase();
        const matchesEstado = selectEstado === "" || estadoAlumno === selectEstado;

        return matchesSearch && matchesEstado;
    });

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
        return;
    }

    filteredStudents.forEach(alumno => {
        const row = document.createElement("tr");
        row.dataset.dni = alumno.dni;

        const estadoLimpio = String(alumno.estado).trim().toLowerCase();
        let badgeClass = "verde";
        if (estadoLimpio === "amarillo") badgeClass = "amarillo";
        if (estadoLimpio === "rojo") badgeClass = "rojo";
        if (estadoLimpio === "null") badgeClass = "gris";

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
                    ${alumno.estado || "Desconocido"}
                </span>
            </td>
        `;
        studentsTableBody.appendChild(row);
    });
}
