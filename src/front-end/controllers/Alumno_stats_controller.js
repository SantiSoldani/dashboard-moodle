import { HandleGet_alumnos, HandleGet_tutor, HandleCreate_solicitud } from "../models/Alumno.js";

let chartPercepcionInstance = null;

export async function initAlumnoStats(dniParam = null) {
  try {
    let alumno_dni = dniParam;
    if (!alumno_dni) {
      const params = new URLSearchParams(window.location.search);
      alumno_dni = params.get("alumno");
    }
    const rol = localStorage.getItem("rol") || "Instructor";
    if (!alumno_dni && rol === "Learner") {
      alumno_dni = "22669995"; // Fallback para que cargue la vista de Alumno
    }
    if (!alumno_dni) {
      console.warn("No se especificó un DNI de alumno.");
      return;
    }

    let alumno = await HandleGet_alumnos(alumno_dni, "byDNI");
    let tutor = await HandleGet_tutor(alumno_dni);

    console.log(tutor) //null
    console.log(alumno)
    console.log("PARTE 2")

    if (alumno) {
      alumno = typeof alumno === "string" ? JSON.parse(alumno) : alumno;
      const rol = localStorage.getItem("rol") || "Instructor";
      console.log("PARTE 3!")
      set_header(alumno);
      render_dashboard_by_role(alumno, rol);

      window.addEventListener('resize', () => {
        if (chartPercepcionInstance) chartPercepcionInstance.resize();
      });

      activar_solicitudes(alumno, tutor);
    }
  } catch (error) {
    console.error("Error al cargar datos del alumno:", error);
  }
}

function activar_solicitudes(alumno, tutor) {
  let dni_tutor = null;
  if (tutor == null) {
    console.log("NO TIENE TUTOR")
  } else {
    dni_tutor = tutor.dni_tutor
  }

  const btn = document.getElementById("btn_crearSolicitud");
  btn.addEventListener("click", () => {
    HandleCreate_solicitud(alumno.dni, dni_tutor);
  });
}

function set_header(alumno) {
  const headerName = document.getElementById("stats-header-name");
  if (headerName) {
    headerName.textContent = `Hola, ${alumno.nombre} ${alumno.apellido}`;
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

function render_dashboard_by_role(alumno, rol) {
  const isStudent = rol === "Learner";

  // KPIs
  const kpiGrid = document.getElementById("student-kpi-grid");
  if (kpiGrid) {
    if (isStudent) {
      kpiGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
      kpiGrid.innerHTML = `
        <div class="kpi-card-new" style="background: white; border-radius: 12px; padding: 16px 20px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #434655; text-align: left; line-height: 1.3;">MATERIAS APROBADAS TOTALES:</span>
            <strong style="font-size: 2.5rem; color: #141b2b; line-height: 1; flex-shrink: 0;">12</strong>
        </div>
        <div class="kpi-card-new" style="background: white; border-radius: 12px; padding: 16px 20px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #434655; text-align: left; line-height: 1.3;">MATERIAS RESPECTO AL PLAN:</span>
            <strong style="font-size: 2.5rem; color: #ea580c; font-weight: 900; line-height: 1; flex-shrink: 0;">+1</strong>
        </div>
        <div class="kpi-card-new" style="background: #eff6ff; border-radius: 12px; padding: 16px; border: 1px solid #bfdbfe; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <span style="font-size: 0.95rem; font-weight: 900; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">${alumno.carrera || "INGENIERIA INDUSTRIAL"}</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #2563eb; margin-top: 4px;">PLAN 2024</span>
        </div>
        <div style="display: flex; align-items: stretch; justify-content: center;">
            <button id="btn_crearSolicitud" style="background: #2563eb; color: white; border: none; border-radius: 12px; padding: 0 16px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(37,99,235,0.2); width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.background='#1d4ed8'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#2563eb'; this.style.transform='none'">
                <span class="material-symbols-outlined" style="font-size: 20px;">calendar_month</span> SOLICITAR TUTOR / ENTREVISTA
            </button>
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
                <strong style="font-size: 1.5rem; color: #141b2b;">-/10</strong>
            </div>
        </div>
        <div class="kpi-card-new border-warning" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #F59E0B; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">PERFIL EDUCATIVO PADRES</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">-/10</strong>
            </div>
        </div>
        <div class="kpi-card-new border-success" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #22C55E; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">CARGA LABORAL</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">-/10</strong>
            </div>
        </div>
        <div class="kpi-card-new border-critical" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #EF4444; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">CARGA VITAL/MOTIVACIONAL</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">-/10</strong>
            </div>
        </div>
        <div class="kpi-card-new border-gray" style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #475569; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">UBICACIÓN</span>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">-/10</strong>
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
    if (entrevistaBanner) entrevistaBanner.style.display = "block";
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
      listContainer.innerHTML = `
        <div style="border: 1px solid #e1e8fd; border-radius: 8px; padding: 20px; background: #f8fafc;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Cómo evaluás el impacto de tu situación laboral actual sobre el rendimiento de este cuatrimestre?</span>
                    <strong style="color: #141b2b; font-size: 0.95rem;">5 - Impacto muy alto</strong>
                </div>
                <div>
                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Cómo evaluás tu motivación para continuar la carrera este cuatrimestre comparado con el anterior?</span>
                    <strong style="color: #141b2b; font-size: 0.95rem;">4 - Menos motivado</strong>
                </div>
                <div>
                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Disponés del tiempo semanal necesario fuera del horario de clases para dedicarle al estudio y las entregas este cuatrimestre?</span>
                    <strong style="color: #141b2b; font-size: 0.95rem;">4 - Muy poco tiempo</strong>
                </div>
                <div>
                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Qué tan seguro te sentís de poder aprobar las materias en las que te inscribiste?</span>
                    <strong style="color: #141b2b; font-size: 0.95rem;">4 - Poco seguro</strong>
                </div>
            </div>
        </div>
      `;
    } else {
      listContainer.innerHTML = `
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #2563EB;">school</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">RENDIMIENTO ACADÉMICO FINAL</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">-</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #F59E0B;">psychology</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">RENDIMIENTO ACADÉMICO PERCIBIDO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">-</strong>
            </div>
        </div>
        <div style="display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #22C55E;">calculate</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">RENDIMIENTO ACADÉMICO CUANTITATIVO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">-</strong>
            </div>
        </div>
      `;

      if (encuestasContainer) {
        encuestasContainer.innerHTML = `
            <div style="border: 1px solid #e1e8fd; border-radius: 8px; padding: 20px; background: #f8fafc;">
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Cómo evaluás tu motivación para continuar la carrera este cuatrimestre comparado con el anterior?</span>
                        <strong style="color: #141b2b; font-size: 0.95rem;">4 - Menos motivado</strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Disponés del tiempo semanal necesario fuera del horario de clases para dedicarle al estudio?</span>
                        <strong style="color: #141b2b; font-size: 0.95rem;">4 - Muy poco tiempo</strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Qué tan seguro te sentís de poder aprobar las materias en las que te inscribiste?</span>
                        <strong style="color: #141b2b; font-size: 0.95rem;">4 - Poco seguro</strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">¿Cómo evaluás el impacto de tu situación laboral actual sobre el rendimiento de este cuatrimestre?</span>
                        <strong style="color: #141b2b; font-size: 0.95rem;">5 - Impacto muy alto</strong>
                    </div>
                </div>
            </div>
          `;
      }
    }
  }
  // Chart
  renderChart(isStudent);
}




let chartSemaforoInstance = null;

function renderChart(isStudent) {
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

  const option = isStudent ? {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', textStyle: { color: '#1e293b' } },
    grid: { left: '5%', right: '5%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1C 2022', '2C 2022', '1C 2023', '2C 2023', '1C 2024', '2C 2024'],
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
        data: [15, 35, 35, 55, 30, 65],
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
      data: ['1C 2023', '2C 2023', '1C 2024', '2C 2024'],
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
        data: [15, 30, 45, 75],
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
