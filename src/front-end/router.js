import {
  VISTA_HOME,
  VISTA_DATA_ENTRY,
  VISTA_ALUMNO_STATS,
  VISTA_TUTORES,
  VISTA_ADMIN_DASHBOARD,
  VISTA_ADMIN_TOOLS,
} from "./Vistas.js";
import { initHome } from "./controllers/home_controller.js";
import { initDataEntry } from "./controllers/data_entry_controller.js";
import { initAlumnoStats } from "./controllers/Alumno_stats_controller.js";
import { initTutores } from "./controllers/tutores_controller.js";
import { initAdminDashboard } from "./controllers/admin_dashboard_controller.js";
import { initAdminTools } from "./controllers/admin_tools_controller.js";

window.addEventListener("load", () => {
  // Determine current route from hash or default to home
  const hash = window.location.hash.replace("#", "") || "home";
  navegar(hash);
});

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#", "") || "home";
  navegar(hash);
});

export function navegar(nombreVista) {
  const rol = localStorage.getItem("rol") || "Instructor"; // Por defecto Instructor para la demo
  const root = document.getElementById("root");

  // Control de Acceso Estudiante
  if (rol === "Learner" && nombreVista !== "alumno_stats") {
    window.location.hash = "#alumno_stats";
    return;
  }

  if (nombreVista === "home") {
    root.innerHTML = VISTA_HOME;
    initHome();
  } else if (nombreVista === "data_entry") {
    root.innerHTML = VISTA_DATA_ENTRY;
    initDataEntry();
  } else if (nombreVista === "alumno_stats") {
    root.innerHTML = VISTA_ALUMNO_STATS;
    // Para estudiante obtenemos el dni del localStorage o si pasamos ?alumno=DNI en URL
    const params = new URLSearchParams(window.location.search);
    let dni = params.get("alumno") || localStorage.getItem("estudianteDNI");
    initAlumnoStats(dni);
  } else if (nombreVista === "tutores") {
    if (rol !== "Administrador") {
      window.location.hash = "#home";
      return;
    }
    root.innerHTML = VISTA_TUTORES;
    initTutores();
  } else if (nombreVista === "admin_dashboard") {
    root.innerHTML = VISTA_ADMIN_DASHBOARD;
    initAdminDashboard();
  } else if (nombreVista === "admin_tools") {
    root.innerHTML = VISTA_ADMIN_TOOLS;
    initAdminTools();
  } else {
    // Fallback
    root.innerHTML = "<h2>Vista no encontrada</h2>";
  }

  // Disparamos un evento custom para que navbar.js pueda actualizar el tab activo
  window.dispatchEvent(new Event("route-changed"));
}

// Hacemos navegar global para que pueda ser llamado desde cualquier lugar si es necesario
window.navegar = navegar;
