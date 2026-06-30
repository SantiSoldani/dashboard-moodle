import {
  HandleGet_alumnos,
  HandleGet_tutor,
  HandleCreate_solicitud,
  HandleGet_indicadores_Bydni,
  HandleGet_encuesta_ByDni,
  HandleGet_evolucion_semaforos,
  HandleGet_rendimiento_academico,
  HandleGet_agenda_pendiente,
  HandleGet_usuario_by_dni,
  HandleGet_solicitud_pendiente,
  HandleGet_esTutor,
  HandlePut_Rol
} from "../models/Alumno.js";

let chartPercepcionInstance = null;

export async function initAlumnoStats(dniParam = null) {
  try {
    let alumno_dni = dniParam;
    if (!alumno_dni) {
      const params = new URLSearchParams(window.location.search);
      alumno_dni = params.get("dni_moodle");
    }

    const rol = localStorage.getItem("rol") || "Instructor";
    if (!alumno_dni && rol === "Learner") {
      alumno_dni = "47231265"; // Fallback para que cargue la vista de Alumno
    }
    if (!alumno_dni) {
      console.warn("No se especificó un DNI de alumno.");
      return;
    }

    let alumno = await HandleGet_alumnos(alumno_dni, "byDNI");

    if (!alumno || (Array.isArray(alumno) && alumno.length === 0) || alumno.error || alumno.detail) {
      console.warn("No se encontró el alumno o DNI inválido, redirigiendo a la ruta base.");
      window.location.href = window.location.origin + window.location.pathname;
      return;
    }

    let tutor = await HandleGet_tutor(alumno_dni);

    let tipo = "iniciales"
    let indicadores = await HandleGet_indicadores_Bydni(tipo, alumno_dni);
    tipo = "cuatrimestrales"
    let indicadoresCuatrimestrales = await HandleGet_indicadores_Bydni(tipo, alumno_dni);
    let encuesta = await HandleGet_encuesta_ByDni(alumno_dni);
    let evolucionSemaforos = await HandleGet_evolucion_semaforos(alumno_dni);
    let rendimientoAcademico = await HandleGet_rendimiento_academico(alumno_dni);

    let entrevistaPendienteData = null;
    let solicitudPendiente = null;
    if (rol === "Learner") {
      let agendaPendiente = await HandleGet_agenda_pendiente(alumno_dni);
      if (agendaPendiente) {
        let entrevistador = await HandleGet_usuario_by_dni(agendaPendiente.dni_entrevistador);
        if (entrevistador) {
          entrevistaPendienteData = {
            fecha: agendaPendiente.fecha_agendada,
            tutor: `${entrevistador.nombre} ${entrevistador.apellido}`
          };
        }
      }
      solicitudPendiente = await HandleGet_solicitud_pendiente(alumno_dni);
    }

    if (alumno) {
      alumno = typeof alumno === "string" ? JSON.parse(alumno) : alumno;
      const rol = localStorage.getItem("rol") || "Instructor";

      set_header(alumno, rol);
      render_dashboard_by_role(alumno, rol, indicadores, tutor, indicadoresCuatrimestrales, encuesta, evolucionSemaforos, rendimientoAcademico, entrevistaPendienteData, solicitudPendiente);

      window.addEventListener('resize', () => {
        if (chartPercepcionInstance) chartPercepcionInstance.resize();
      });

      if (rol === "Learner" && !solicitudPendiente) {
        activar_solicitudes(alumno, tutor);
      }

      // Renderizar el boton flotante de cambio de rol si aplica
      await renderRoleToggleComponent();
    }
  } catch (error) {
    console.error("Error al cargar datos del alumno:", error);
  }
}

function activar_solicitudes(alumno, tutor) {
  let dni_tutor = null;
  if (tutor != null)
    dni_tutor = tutor.dni_tutor
  const btn = document.getElementById("btn_crearSolicitud");
  btn.addEventListener("click", () => {
    HandleCreate_solicitud(alumno.dni, dni_tutor);
  });
}

function set_header(alumno, rol) {
  const headerName = document.getElementById("stats-header-name");
  if (headerName) {
    if (rol === "Learner") {
      headerName.textContent = `Hola, ${alumno.nombre} ${alumno.apellido}`;
    } else {
      headerName.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            <span>${alumno.nombre} ${alumno.apellido}</span>
            ${renderAgendarEntrevistaComponent(rol)}
        </div>
      `;

      const btn = document.getElementById("btn_agendarEntrevista");
      if (btn) {
        btn.addEventListener("click", () => {
          abrir_modal_agenda(alumno);
        });
      }
    }
  }

  const ribbon = document.getElementById("stats-color-ribbon");
  if (ribbon) {
    let colorHex = "#dce2f7";
    const c = (alumno.color || "").toLowerCase();
    if (c.includes("rojo")) colorHex = "#EF4444";
    else if (c.includes("amarillo")) colorHex = "#F59E0B";
    else if (c.includes("verde")) colorHex = "#22C55E";
    ribbon.style.backgroundColor = colorHex;
  }
}

function abrir_modal_agenda(alumno) {
  let modal = document.getElementById("modal_agenda");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal_agenda";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(15, 23, 42, 0.5)"; // overlay color matches theme
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "99999";
    modal.style.backdropFilter = "blur(4px)";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 12px; width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 1px solid #cbd5e1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-symbols-outlined" style="color: #2563eb; font-size: 28px;">edit_calendar</span>
                <h3 style="margin: 0; color: #1e293b; font-size: 1.25rem;">Agendar Entrevista</h3>
            </div>
            <p style="margin-top: 0; margin-bottom: 20px; color: #475569; font-size: 0.95rem;">
                Establecé una fecha y hora para la entrevista con <strong>${alumno.nombre} ${alumno.apellido}</strong>.
            </p>
            <div style="margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 700; font-size: 0.85rem; color: #334155;">FECHA Y HORA</label>
                <input type="datetime-local" id="input_fecha_agenda" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; font-family: inherit; font-size: 1rem; color: #1e293b; background: #f8fafc;" />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                <button id="btn_cancelar_agenda" style="background: white; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #475569; font-weight: 700; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">Cancelar</button>
                <button id="btn_confirmar_agenda" style="background: #2563eb; color: white; border: none; padding: 8px 24px; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.2s; box-shadow: 0 4px 6px rgba(37,99,235,0.2);" onmouseover="this.style.background='#1d4ed8'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#2563eb'; this.style.transform='none'">Agendar</button>
            </div>
        </div>
    `;

  document.getElementById("btn_cancelar_agenda").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("btn_confirmar_agenda").addEventListener("click", async () => {
    const fecha = document.getElementById("input_fecha_agenda").value;
    if (!fecha) {
      alert("Por favor, seleccioná una fecha válida.");
      return;
    }

    const dni_entrevistador = localStorage.getItem("dni") || "0";

    // Dynamic import to avoid circular dependencies if any, but better to import at top
    const { HandleCreate_agenda } = await import('../models/Alumno.js');
    const res = await HandleCreate_agenda(alumno.dni, dni_entrevistador, fecha);

    if (res) {
      modal.remove();
      // Refresh to show banner
      window.location.reload();
    } else {
      alert("Error al agendar entrevista. Por favor, intentá nuevamente.");
    }
  });
}

function render_dashboard_by_role(alumno, rol, indicadores = null, tutor = null, indicadoresCuatrimestrales = null, encuesta = null, evolucionSemaforos = null, rendimientoAcademico = null, entrevistaPendienteData = null, solicitudPendiente = null) {
  const isStudent = rol === "Learner";
  const formatKpi = (val) => val !== undefined && val !== null ? `${(val * 10).toFixed(1).replace(/\\.0$/, '')}/10` : "-/10";

  let encuestasHTML = "";
  if (encuesta && Array.isArray(encuesta)) {
    const encuestasFiltradas = encuesta.filter(e => isNaN(Number(e.respuesta)));
    if (encuestasFiltradas.length > 0) {
      encuestasHTML = `
        <div style="border: 1px solid #e1e8fd; border-radius: 8px; padding: 20px; background: #f8fafc;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${encuestasFiltradas.map(e => `
                    <div>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">${e.pregunta}</span>
                        <strong style="color: #141b2b; font-size: 0.95rem;">${e.respuesta}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
      `;
    } else {
      encuestasHTML = `<div style="padding: 20px; text-align: center; color: #64748b; font-weight: 600; border: 1px solid #e1e8fd; border-radius: 8px; background: #f8fafc;">No hay respuestas cualitativas disponibles.</div>`;
    }
  } else {
    encuestasHTML = `<div style="padding: 20px; text-align: center; color: #64748b; font-weight: 600; border: 1px solid #e1e8fd; border-radius: 8px; background: #f8fafc;">No hay respuestas de encuesta disponibles.</div>`;
  }

  // KPIs
  const kpiGrid = document.getElementById("student-kpi-grid");
  if (kpiGrid) {
    if (isStudent) {
      let matAprobadas = alumno.materias_aprobadas !== undefined && alumno.materias_aprobadas !== null ? alumno.materias_aprobadas : '-';
      let respectoAlPlanText = '-';
      let respectoAlPlanColor = '#141b2b';

      if (encuesta && Array.isArray(encuesta)) {
        const qAtrasado = encuesta.find(q => q.pregunta.toLowerCase().includes("atrasado"));
        const qAdelantado = encuesta.find(q => q.pregunta.toLowerCase().includes("adelantaste"));

        let atrasadoVal = qAtrasado ? parseInt(qAtrasado.respuesta) : 0;
        let adelantadoVal = qAdelantado ? parseInt(qAdelantado.respuesta) : 0;

        if (isNaN(atrasadoVal)) atrasadoVal = 0;
        if (isNaN(adelantadoVal)) adelantadoVal = 0;

        if (atrasadoVal > 0) {
          respectoAlPlanText = `-${atrasadoVal}`;
          respectoAlPlanColor = '#ef4444'; // Red
        } else if (adelantadoVal > 0) {
          respectoAlPlanText = `+${adelantadoVal}`;
          respectoAlPlanColor = '#22c55e'; // Green
        } else {
          respectoAlPlanText = `0`;
          respectoAlPlanColor = '#64748b'; // Gray
        }
      }

      let btnHTML = "";
      if (solicitudPendiente) {
        btnHTML = `
          <button id="btn_crearSolicitud" disabled style="background: #94a3b8; color: white; border: none; border-radius: 12px; padding: 0 16px; font-weight: 700; font-size: 0.85rem; cursor: not-allowed; box-shadow: 0 4px 6px rgba(148,163,184,0.2); width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">check_circle</span> ENTREVISTA/TUTOR YA SOLICITADO
          </button>
        `;
      } else {
        btnHTML = `
          <button id="btn_crearSolicitud" style="background: #2563eb; color: white; border: none; border-radius: 12px; padding: 0 16px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(37,99,235,0.2); width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.background='#1d4ed8'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#2563eb'; this.style.transform='none'">
              <span class="material-symbols-outlined" style="font-size: 20px;">calendar_month</span> SOLICITAR TUTOR / ENTREVISTA
          </button>
        `;
      }

      kpiGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
      kpiGrid.innerHTML = `
        <div class="kpi-card-new" style="background: white; border-radius: 12px; padding: 16px 20px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #434655; text-align: left; line-height: 1.3;">MATERIAS APROBADAS TOTALES:</span>
            <strong style="font-size: 2.5rem; color: #141b2b; line-height: 1; flex-shrink: 0;">${matAprobadas}</strong>
        </div>
        <div class="kpi-card-new" style="background: white; border-radius: 12px; padding: 16px 20px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #434655; text-align: left; line-height: 1.3;">MATERIAS RESPECTO AL PLAN:</span>
            <strong style="font-size: 2.5rem; color: ${respectoAlPlanColor}; font-weight: 900; line-height: 1; flex-shrink: 0;">${respectoAlPlanText}</strong>
        </div>
        <div class="kpi-card-new" style="background: #eff6ff; border-radius: 12px; padding: 16px; border: 1px solid #bfdbfe; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <span style="font-size: 0.95rem; font-weight: 900; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">${alumno.carrera ? alumno.carrera.toUpperCase() : "INGENIERIA INDUSTRIAL"}</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #2563eb; margin-top: 4px;">PLAN ${alumno.plan_de_estudios || "2024"}</span>
        </div>
        <div style="display: flex; align-items: stretch; justify-content: center;">
            ${btnHTML}
        </div>
      `;
    } else {
      kpiGrid.style.gridTemplateColumns = "repeat(5, 1fr)";

      kpiGrid.innerHTML = `
        <div class="kpi-card-new border-primary" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #2563EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">PERFIL SOCIOECONÓMICO</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">${indicadores ? formatKpi(indicadores.pse) : '-/10'}</strong>
            </div>
        </div>
        <div class="kpi-card-new border-warning" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #F59E0B; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">PERFIL EDUCATIVO PADRES</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">${indicadores ? formatKpi(indicadores.pep) : '-/10'}</strong>
            </div>
        </div>
        <div class="kpi-card-new border-success" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #22C55E; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">CARGA LABORAL</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">${indicadores ? formatKpi(indicadores.cl) : '-/10'}</strong>
            </div>
        </div>
        <div class="kpi-card-new border-critical" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #EF4444; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">CARGA VITAL/MOTIVACIONAL</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">${indicadores ? formatKpi(indicadores.cv) : '-/10'}</strong>
            </div>
        </div>
        <div class="kpi-card-new border-gray" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #475569; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">UBICACIÓN</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">${indicadores ? formatKpi(indicadores.loc) : '-/10'}</strong>
            </div>
        </div>
      `;
    }
  }



  // List & Chart Titles
  const metricListTitle = document.getElementById("metric-list-title");
  const metricListSubtitle = document.getElementById("metric-list-subtitle");
  const chartTitle = document.getElementById("chart-percepcion-title");
  const chartSubtitle = document.getElementById("chart-percepcion-subtitle");

  const instructorChartRow = document.getElementById("instructor-chart-row");
  const mainChartsGrid = document.getElementById("main-charts-grid");
  const encuestasContainer = document.getElementById("encuestas-container");
  const chartPercepcionLine = document.getElementById("chartPercepcionLine");

  const periodSelector = document.getElementById("encuesta-period-selector");
  const rightPanelContainer = document.getElementById("right-panel-container");
  const metricsListPanel = document.getElementById("metrics-column-wrapper") || document.querySelector(".metrics-list-panel");
  const entrevistaBanner = document.getElementById("entrevista-pendiente-banner");

  if (isStudent) {
    if (instructorChartRow) instructorChartRow.style.display = "none";
    if (mainChartsGrid) mainChartsGrid.style.gridTemplateColumns = "1fr 1fr";
    if (rightPanelContainer) rightPanelContainer.style.order = "-1";
    if (metricsListPanel) metricsListPanel.style.order = "1";
    if (entrevistaBanner) {
      if (entrevistaPendienteData) {
        entrevistaBanner.style.display = "flex";
        entrevistaBanner.style.justifyContent = "space-between";
        entrevistaBanner.style.alignItems = "center";

        let dateObj = new Date(entrevistaPendienteData.fecha);
        let formattedDate = !isNaN(dateObj)
          ? `${dateObj.toLocaleDateString('es-AR')} ${dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
          : entrevistaPendienteData.fecha;

        entrevistaBanner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: #3b82f6; font-size: 20px;">info</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1e293b; letter-spacing: 0.5px;">ENTREVISTA PENDIENTE</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px; color: #475569;">event</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">DÍA: ${formattedDate}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px; color: #475569;">person</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">TUTOR: ${entrevistaPendienteData.tutor}</span>
          </div>
        `;
      } else {
        entrevistaBanner.style.display = "none";
      }
    }
    if (encuestasContainer) encuestasContainer.style.display = "none";
    if (chartPercepcionLine) chartPercepcionLine.style.display = "block";
    if (periodSelector) periodSelector.style.display = "none";

    if (metricListTitle) metricListTitle.textContent = "Resultados de la última encuesta";
    if (metricListSubtitle) metricListSubtitle.style.display = "none";
    if (chartTitle) chartTitle.textContent = "Rendimiento Académico Histórico";
    if (chartSubtitle) {
      chartSubtitle.style.display = "none";
    }
  } else {
    if (instructorChartRow) instructorChartRow.style.display = "block";
    if (mainChartsGrid) mainChartsGrid.style.gridTemplateColumns = "1fr 3fr";
    if (rightPanelContainer) rightPanelContainer.style.order = "1";
    if (metricsListPanel) metricsListPanel.style.order = "-1";
    if (entrevistaBanner) entrevistaBanner.style.display = "none";
    if (encuestasContainer) encuestasContainer.style.display = "flex";
    if (chartPercepcionLine) chartPercepcionLine.style.display = "none";
    if (periodSelector) periodSelector.style.display = "block";

    if (metricListTitle) metricListTitle.textContent = "Indicadores Cuatrimestrales";
    if (metricListSubtitle) {
      metricListSubtitle.style.display = "block";
      metricListSubtitle.textContent = "Resumen del periodo actual";
    }
    if (chartTitle) chartTitle.textContent = "Encuestas Cuatrimestrales";
    if (chartSubtitle) chartSubtitle.style.display = "none";
  }

  // List items
  const listContainer = document.getElementById("metrics-list-container");
  if (listContainer) {
    if (isStudent) {
      listContainer.innerHTML = encuestasHTML;
    } else {
      listContainer.innerHTML = `
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #2563EB;">school</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">RENDIMIENTO ACADÉMICO FINAL</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">${indicadoresCuatrimestrales ? formatKpi(indicadoresCuatrimestrales.raf) : '-'}</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #F59E0B;">psychology</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">RENDIMIENTO ACADÉMICO PERCIBIDO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">${indicadoresCuatrimestrales ? formatKpi(indicadoresCuatrimestrales.rap) : '-'}</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #22C55E;">calculate</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">RENDIMIENTO ACADÉMICO CUANTITATIVO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">${indicadoresCuatrimestrales ? formatKpi(indicadoresCuatrimestrales.rac) : '-'}</strong>
            </div>
        </div>
        <div style="display: flex; gap: 16px; padding-top: 12px;">
            <span class="material-symbols-outlined" style="color: #EF4444;">history</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">COEFICIENTE DE ATRASO DE LA CARRERA</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">${indicadoresCuatrimestrales ? formatKpi(indicadoresCuatrimestrales.ac) : '-'}</strong>
            </div>
        </div>
      `;

      if (encuestasContainer) {
        encuestasContainer.innerHTML = encuestasHTML;
      }
    }
  }
  // Chart
  renderChart(isStudent, evolucionSemaforos, rendimientoAcademico);
}




let chartSemaforoInstance = null;

function renderChart(isStudent, evolucionSemaforos = null, rendimientoAcademico = null) {
  if (typeof echarts === 'undefined') return;

  if (isStudent) {
    const dom = document.getElementById('chartPercepcionLine');
    if (!dom) return;

    if (chartPercepcionInstance) {
      chartPercepcionInstance.dispose();
    }
    chartPercepcionInstance = echarts.init(dom);
  } else {
    const dom = document.getElementById('chartSemaforoLine');
    if (!dom) return;

    if (chartSemaforoInstance) {
      chartSemaforoInstance.dispose();
    }
    chartSemaforoInstance = echarts.init(dom);
  }

  let xAxisDataSemaforo = ['1C 2023', '2C 2023', '1C 2024', '2C 2024'];
  let seriesDataSemaforo = [15, 30, 45, 75];

  if (evolucionSemaforos && evolucionSemaforos.length > 0) {
    const ultimosSemaforos = evolucionSemaforos.slice(-8);
    xAxisDataSemaforo = ultimosSemaforos.map(e => e.fecha);
    seriesDataSemaforo = ultimosSemaforos.map(e => (e.score * 100).toFixed(1));
  }

  let xAxisDataPercepcion = ['1C 2022', '2C 2022', '1C 2023', '2C 2023', '1C 2024', '2C 2024'];
  let seriesDataPercepcion = [15, 35, 35, 55, 30, 65];

  if (isStudent && rendimientoAcademico && rendimientoAcademico.length > 0) {
    const ultimosRendimientos = rendimientoAcademico.slice(-5);
    xAxisDataPercepcion = ultimosRendimientos.map(r => r.fecha);
    seriesDataPercepcion = ultimosRendimientos.map(r => (r.score * 100).toFixed(1));
  }

  const option = isStudent ? {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', textStyle: { color: '#1e293b' } },
    grid: { left: '5%', right: '5%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisDataPercepcion,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontWeight: '500' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
      axisLine: { show: false },
      axisLabel: { color: '#64748b' }
    },
    series: [
      {
        name: 'Rendimiento',
        type: 'line',
        data: seriesDataPercepcion,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#2563eb' },
        lineStyle: { width: 3, color: '#2563eb' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37,99,235,0.2)' },
            { offset: 1, color: 'rgba(37,99,235,0.0)' }
          ])
        }
      }
    ],
    backgroundColor: 'transparent'
  } : {
    tooltip: { trigger: 'axis' },
    visualMap: {
      show: false,
      pieces: [
        { gt: 0, lte: 33, color: '#22C55E' },
        { gt: 33, lte: 66, color: '#F59E0B' },
        { gt: 66, lte: 100, color: '#EF4444' }
      ]
    },
    grid: { left: '5%', right: '5%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisDataSemaforo,
      axisLine: { lineStyle: { color: '#dce2f7' } },
      axisLabel: { color: '#434655' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { type: 'dashed', color: '#e1e8fd' } },
      axisLine: { show: false },
      axisLabel: { color: '#434655', formatter: '{value}' }
    },
    series: [
      {
        name: 'Score de Riesgo',
        type: 'line',
        data: seriesDataSemaforo,
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 3 }
      }
    ]
  };

  if (isStudent) {
    chartPercepcionInstance.setOption(option);
  } else {
    chartSemaforoInstance.setOption(option);
  }
}

// --- Componentes ---

export function renderAgendarEntrevistaComponent(currentUserRole) {
  if (currentUserRole === "Learner") {
    return ""; // Estudiantes no pueden ver este boton
  }
  return `
        <button id="btn_agendarEntrevista" style="background: #2563eb; color: white; border: none; border-radius: 8px; padding: 6px 12px; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(37,99,235,0.2); display: flex; align-items: center; gap: 6px;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
            <span class="material-symbols-outlined" style="font-size: 16px;">calendar_month</span> Agendar Entrevista
        </button>
    `;
}

export async function renderRoleToggleComponent() {
  const rol = localStorage.getItem("rol") || "Learner";
  const dni = localStorage.getItem("dni");

  if (!dni) return;

  let isTutor = false;
  if (rol === "Tutor") {
    isTutor = true;
  } else {
    isTutor = await HandleGet_esTutor(dni);
  }

  if (isTutor) {
    if (document.getElementById("btn_role_toggle")) return; // Ya existe

    const btn = document.createElement("button");
    btn.id = "btn_role_toggle";
    btn.style = "position: fixed; bottom: 24px; right: 24px; z-index: 99999; background: #1e293b; color: white; border: none; border-radius: 50px; padding: 12px 24px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; transition: all 0.2s ease-in-out;";

    btn.onmouseover = () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    };
    btn.onmouseout = () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };

    if (rol === "Tutor") {
      btn.innerHTML = `<span class="material-symbols-outlined">school</span> Cambiar a Vista Alumno`;
      btn.onclick = async () => {
        btn.disabled = true;
        btn.style.background = "#475569";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Cambiando rol...`;
        await HandlePut_Rol(dni, "Learner");
        localStorage.setItem("rol", "Learner");
        window.location.href = window.location.origin + window.location.pathname;
      };
    } else {
      btn.innerHTML = `<span class="material-symbols-outlined">admin_panel_settings</span> Cambiar a Vista Tutor`;
      btn.onclick = async () => {
        btn.disabled = true;
        btn.style.background = "#475569";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Cambiando rol...`;
        await HandlePut_Rol(dni, "Tutor");
        localStorage.setItem("rol", "Tutor");
        window.location.href = window.location.origin + window.location.pathname;
      };
    }

    document.body.appendChild(btn);
  }
}
