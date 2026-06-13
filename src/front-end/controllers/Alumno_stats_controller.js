/**
 * ARCHIVO CONTROLADOR DEL MODULO DE ESTADISTICAS EMBEBIDAS DEL ALUMNO
 *
 * A TRAVES DE LOS PARAMETROS DE LA URL LLAMADA LA IDEA ES FILTRAR POR SI EL QUE LE LLAMA ES UN ALUMNO O UN PROFESOR APRA PROTEGER INFORMACION SENSIBLE
 *
 * ADEMAS USAMOS LOS URL PARAMS PARA AVERIGUAR CUAL ES EL ALUMNO DEL CUAL SE QUIERA VER LA INFORMACION
 *
 */

import { HandleGet_alumnos } from "../models/Alumno.js";


export async function initAlumnoStats(dniParam) {
  try {
    let alumno_dni = dniParam;
    if (!alumno_dni) {
      const params = new URLSearchParams(window.location.search);
      alumno_dni = params.get("alumno");
    }
    if (!alumno_dni) {
      console.warn("No se especificó un DNI de alumno. Mostrando datos hardcodeados.");
      return;
    }

    let alumno = await HandleGet_alumnos(alumno_dni);
    if (alumno) {
      alumno = typeof alumno === 'string' ? JSON.parse(alumno) : alumno;
      console.log(alumno);
      set_state_panel(alumno);
      set_info_panel(alumno);
      set_dashboard(alumno);
    }
  } catch (error) {
    console.error("Error al cargar datos del alumno (posiblemente endpoint no implementado). Mostrando datos hardcodeados:", error);
  }
}

function set_state_panel(alumno) {
  const headerName = document.getElementById("stats-header-name");
  if (headerName) {
    headerName.textContent = `Hola, ${alumno.nombre} ${alumno.apellido}`;
  }
}

function set_info_panel(alumno) {
  const info_panel = document.querySelectorAll("#info-panel .info-item-new");

  info_panel.forEach((panel) => {
    const label = panel.querySelector(".info-label-new");
    const val = panel.querySelector(".info-val-new");
    if (!label || !val) return;

    switch (label.textContent) {
      case "NOMBRE COMPLETO":
        val.textContent = alumno.nombre + " " + alumno.apellido;
        break;

      case "DOCUMENTO":
        val.textContent = alumno.dni;
        break;

      case "CARRERA":
        val.textContent = alumno.carrera;
        break;

      case "CURSO ACTUAL":
        val.textContent = alumno.fecha_inicio;
        break;

      case "CORREO ELECTRÓNICO INSTITUCIONAL":
        val.textContent = alumno.email;
        break;

      case "TELÉFONO DE CONTACTO":
        val.textContent = alumno.telefono || "+54 11 5555 1234"; // Fake si no existe
        break;

      default:
        break;
    }
  });
}

function set_dashboard(alumno) {
  console.log("set dashboard");
  const kpiPromedio = document.getElementById("kpi-promedio");
  if (kpiPromedio && alumno.score) {
    let scoreDisplay = parseFloat(alumno.score);
    // Si el score viene de 0 a 1, escalarlo a 10
    if (scoreDisplay <= 1.0 && scoreDisplay > 0) scoreDisplay = scoreDisplay * 10;
    kpiPromedio.textContent = scoreDisplay.toFixed(1);
  }
}
