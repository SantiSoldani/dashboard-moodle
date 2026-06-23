import { HandleGet_alumnos } from "../models/Alumno.js";

let chartPercepcionInstance = null;

export async function initAlumnoStats(dniParam) {
  try {
    let alumno_dni = dniParam;
    if (!alumno_dni) {
      const params = new URLSearchParams(window.location.search);
      alumno_dni = params.get("alumno");
    }
    if (!alumno_dni) {
      console.warn("No se especificó un DNI de alumno.");
      return;
    }

    let alumno = await HandleGet_alumnos(alumno_dni, "byDNI");
    if (alumno) {
      alumno = typeof alumno === "string" ? JSON.parse(alumno) : alumno;
      const rol = localStorage.getItem("rol") || "Instructor";
      
      set_header(alumno);
      render_dashboard_by_role(alumno, rol);

      window.addEventListener('resize', () => {
        if(chartPercepcionInstance) chartPercepcionInstance.resize();
      });
    }
  } catch (error) {
    console.error("Error al cargar datos del alumno:", error);
  }
}

function set_header(alumno) {
  const headerName = document.getElementById("stats-header-name");
  if (headerName) {
    headerName.textContent = `Hola, ${alumno.nombre} ${alumno.apellido}`;
  }
  const subtitle = document.getElementById("stats-header-subtitle");
  if (subtitle) {
    subtitle.textContent = `${alumno.carrera || "Carrera"} · Cohorte ${alumno.fecha_inicio || "2022"} · última encuesta: 2do cuatrimestre 2024`;
  }
}

function render_dashboard_by_role(alumno, rol) {
  const isStudent = rol === "Learner";

  // KPIs
  const kpiGrid = document.getElementById("student-kpi-grid");
  if (kpiGrid) {
    if (isStudent) {
      kpiGrid.innerHTML = `
        <div class="kpi-card-new border-success" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #22C55E; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">MATERIAS ESTE CUATRIMESTRE</span>
                <div class="kpi-icon-badge" style="color: #22C55E; background: #F0FDF4; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">check</span></div>
            </div>
            <div class="kpi-value" style="display: flex; align-items: baseline; gap: 8px;">
                <strong style="font-size: 2rem; color: #141b2b;">4 de 4</strong>
                <span style="color: #434655; font-size: 0.9rem;">aprobadas</span>
            </div>
        </div>
        <div class="kpi-card-new border-primary" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #2563EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">FINALES PENDIENTES</span>
                <div class="kpi-icon-badge" style="color: #2563EB; background: #EFF6FF; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">calendar_today</span></div>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 2rem; color: #141b2b;">0</strong>
            </div>
        </div>
        <div class="kpi-card-new border-warning" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #F59E0B; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">RESPECTO AL PLAN</span>
                <div class="kpi-icon-badge" style="color: #F59E0B; background: #FFFBEB; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">map</span></div>
            </div>
            <div class="kpi-value" style="display: flex; flex-direction: column;">
                <strong style="font-size: 1.5rem; color: #141b2b;">+1 adelantada</strong>
                <span style="color: #434655; font-size: 0.85rem;">-1 atrasada</span>
            </div>
        </div>
        <div class="kpi-card-new border-gray" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #475569; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">ENCUESTAS RESPONDIDAS</span>
                <div class="kpi-icon-badge" style="color: #475569; background: #F1F5F9; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">assignment</span></div>
            </div>
            <div class="kpi-value" style="display: flex; align-items: baseline; gap: 8px;">
                <strong style="font-size: 2rem; color: #141b2b;">4</strong>
                <span style="color: #434655; font-size: 0.9rem;">desde que empezaste</span>
            </div>
        </div>
      `;
    } else {
      kpiGrid.innerHTML = `
        <div class="kpi-card-new border-primary" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #2563EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">NIVEL SOCIOECONÓMICO</span>
                <div class="kpi-icon-badge" style="color: #2563EB; background: #EFF6FF; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">account_balance_wallet</span></div>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">Medio-Bajo</strong>
            </div>
        </div>
        <div class="kpi-card-new border-warning" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #F59E0B; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">APOYO FAMILIAR</span>
                <div class="kpi-icon-badge" style="color: #F59E0B; background: #FFFBEB; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">family_home</span></div>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">Parcial</strong>
            </div>
        </div>
        <div class="kpi-card-new border-success" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #22C55E; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">DISTANCIA A LA SEDE</span>
                <div class="kpi-icon-badge" style="color: #22C55E; background: #F0FDF4; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">commute</span></div>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">> 2 horas</strong>
            </div>
        </div>
        <div class="kpi-card-new border-critical" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #EF4444; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">SITUACIÓN LABORAL</span>
                <div class="kpi-icon-badge" style="color: #EF4444; background: #FEF2F2; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">work</span></div>
            </div>
            <div class="kpi-value">
                <strong style="font-size: 1.5rem; color: #141b2b;">Full-time</strong>
            </div>
        </div>
      `;
    }
  }

  // Alert Box
  const alertTitle = document.getElementById("alert-title");
  const alertDesc = document.getElementById("alert-desc");
  const alertLink = document.getElementById("alert-link");
  if (alertTitle && alertDesc) {
    if (isStudent) {
      alertTitle.textContent = "Tu confianza para aprobar viene bajando hace dos cuatrimestres";
      alertDesc.textContent = "No es una alarma, es una señal para actuar. Hay tutorías de Análisis Matemático los martes y jueves, y no hace falta estar en crisis para ir.";
      alertLink.style.display = "flex";
    } else {
      alertTitle.textContent = "El alumno presenta un alto riesgo de deserción por factores económicos";
      alertDesc.textContent = "Los datos socioeconómicos indican una carga laboral full-time sumado a más de 2h de viaje. Se sugiere derivación a bienestar estudiantil.";
      alertLink.style.display = "none";
    }
  }

  // List & Chart Titles
  const metricListTitle = document.getElementById("metric-list-title");
  const metricListSubtitle = document.getElementById("metric-list-subtitle");
  const chartTitle = document.getElementById("chart-percepcion-title");
  const chartSubtitle = document.getElementById("chart-percepcion-subtitle");
  
  if (isStudent) {
    if (metricListTitle) metricListTitle.textContent = "Cómo te sentís este cuatrimestre";
    if (metricListSubtitle) metricListSubtitle.textContent = "Tus respuestas en la última encuesta";
    if (chartTitle) chartTitle.textContent = "Cómo cambió tu percepción a lo largo del tiempo";
    if (chartSubtitle) chartSubtitle.textContent = "Solo te mostramos tu propio recorrido — no hay ningún otro alumno en este gráfico";
  } else {
    if (metricListTitle) metricListTitle.textContent = "Factores Críticos de Acompañamiento";
    if (metricListSubtitle) metricListSubtitle.textContent = "Análisis del entorno y situación socio-familiar";
    if (chartTitle) chartTitle.textContent = "Evolución de Factores de Riesgo (Instructor)";
    if (chartSubtitle) chartSubtitle.textContent = "Comparativa del índice de bienestar general del alumno";
  }

  // List items
  const listContainer = document.getElementById("metrics-list-container");
  if (listContainer) {
    if (isStudent) {
      listContainer.innerHTML = `
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #475569;">psychology</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">MOTIVACIÓN PARA SEGUIR</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">Igual que el cuatrimestre anterior</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #F59E0B;">adjust</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">CONFIANZA PARA APROBAR</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">Poco seguro — viene bajando</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #EF4444;">schedule</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">TIEMPO DISPONIBLE PARA ESTUDIAR</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">Muy poco — tengo que hacer malabares</strong>
            </div>
        </div>
        <div style="display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #475569;">work_outline</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">IMPACTO DEL TRABAJO EN EL ESTUDIO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">No trabajo actualmente</strong>
            </div>
        </div>
      `;
    } else {
      listContainer.innerHTML = `
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #475569;">account_balance_wallet</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">INGRESOS DEL GRUPO FAMILIAR</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">Por debajo de la canasta básica</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #EF4444;">family_home</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">PERSONAS A CARGO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">1 menor a cargo</strong>
            </div>
        </div>
        <div style="border-bottom: 1px solid #e1e8fd; padding-bottom: 12px; display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #F59E0B;">computer</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">ACCESO A TECNOLOGÍA</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">Dispositivo compartido / Sin PC propia</strong>
            </div>
        </div>
        <div style="display: flex; gap: 16px;">
            <span class="material-symbols-outlined" style="color: #22C55E;">group_add</span>
            <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #434655;">INSERCIÓN EN GRUPOS DE ESTUDIO</span><br/>
                <strong style="color: #141b2b; font-size: 1.1rem;">Participa activamente</strong>
            </div>
        </div>
      `;
    }
  }

  // Chart
  renderChart(isStudent);
}

function renderChart(isStudent) {
  if (typeof echarts === 'undefined') return;
  const dom = document.getElementById('chartPercepcionLine');
  if (!dom) return;
  
  if (chartPercepcionInstance) {
      chartPercepcionInstance.dispose();
  }
  chartPercepcionInstance = echarts.init(dom);

  const option = isStudent ? {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Motivación', 'Confianza para aprobar'], bottom: 0 },
      grid: { left: '15%', right: '5%', top: '10%', bottom: '15%' },
      xAxis: {
          type: 'category',
          data: ['1C 2023', '2C 2023', '1C 2024', '2C 2024'],
          axisLine: { lineStyle: { color: '#dce2f7' } },
          axisLabel: { color: '#434655' }
      },
      yAxis: {
          type: 'category',
          data: ['Muy bajo', 'Algo bajo', 'Regular', 'Bien', 'Muy bien'],
          splitLine: { lineStyle: { type: 'dashed', color: '#e1e8fd' } },
          axisLine: { show: false },
          axisLabel: { color: '#434655' }
      },
      series: [
          {
              name: 'Motivación',
              type: 'line',
              data: ['Bien', 'Bien', 'Bien', 'Regular'],
              smooth: false,
              symbolSize: 8,
              itemStyle: { color: '#2563EB' },
              lineStyle: { width: 2 }
          },
          {
              name: 'Confianza para aprobar',
              type: 'line',
              data: ['Bien', 'Regular', 'Regular', 'Algo bajo'],
              smooth: false,
              symbolSize: 8,
              itemStyle: { color: '#22C55E' },
              lineStyle: { width: 2 }
          }
      ]
  } : {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Riesgo Socioeconómico', 'Riesgo Académico'], bottom: 0 },
      grid: { left: '15%', right: '5%', top: '10%', bottom: '15%' },
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
          axisLabel: { color: '#434655', formatter: '{value}%' }
      },
      series: [
          {
              name: 'Riesgo Socioeconómico',
              type: 'line',
              data: [30, 35, 60, 85],
              smooth: true,
              symbolSize: 8,
              itemStyle: { color: '#F59E0B' },
              lineStyle: { width: 2 }
          },
          {
              name: 'Riesgo Académico',
              type: 'line',
              data: [10, 15, 25, 75],
              smooth: true,
              symbolSize: 8,
              itemStyle: { color: '#EF4444' },
              lineStyle: { width: 2 }
          }
      ]
  };

  chartPercepcionInstance.setOption(option);
}
