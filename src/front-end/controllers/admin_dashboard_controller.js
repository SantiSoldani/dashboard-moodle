import { HandleGet_alumnos, HandleGet_indicadores_iniciales, HandleGet_semaforosXpre, HandleGet_scoreXcohorte, HandleGet_conteo_semaforos } from "../models/Alumno.js";
import { Handle_get_promedio_general, Handle_get_promedio_materias } from "../models/Notas.js";

let allStudents = [];
let chartInstances = [];
let promedioGeneral = 0;
let totalCriticos = 0;

export async function initAdminDashboard() {
    await cargarDatos();
    calcularYMostrarMetricas();
    renderizarGraficos();

    const selectPRE = document.getElementById('selectDistribucionPRE');
    if (selectPRE) {
        selectPRE.addEventListener('change', renderRadarChart);
    }

    const selectPerfilSemaforo = document.getElementById('selectPerfilSemaforo');
    if (selectPerfilSemaforo) {
        selectPerfilSemaforo.addEventListener('change', renderHeatmapChart);
    }

    const selectFechaTechoSemaforo = document.getElementById('selectFechaTechoSemaforo');
    if (selectFechaTechoSemaforo) {
        selectFechaTechoSemaforo.addEventListener('change', () => renderLineChart());
    }

    window.addEventListener('resize', () => {
        chartInstances.forEach(chart => {
            if (chart) chart.resize();
        });
    });
}

async function cargarDatos() {
    try {
        let response = await HandleGet_alumnos(null, "stats");
        if (response) {
            allStudents = response;
        } else {
            allStudents = [];
        }

        let promResponse = await Handle_get_promedio_general();
        if (promResponse !== undefined && promResponse !== null) {
            promedioGeneral = typeof promResponse === 'string' ? parseFloat(promResponse) : promResponse;
        }

        let criticosResponse = await HandleGet_alumnos(null, "criticos");
        if (criticosResponse && Array.isArray(criticosResponse)) {
            totalCriticos = criticosResponse.length;
        } else {
            totalCriticos = 0;
        }
    } catch (error) {
        console.error("Error cargando alumnos para el dashboard administrador:", error);
        allStudents = [];
        totalCriticos = 0;
    }
}

function calcularYMostrarMetricas() {
    const totalAlumnos = allStudents.length;
    document.getElementById("admin_total_alumnos").textContent = totalAlumnos || 312;

    // Riesgo critico
    const riskPercentage = totalAlumnos > 0 ? ((totalCriticos / totalAlumnos) * 100).toFixed(0) : "14";
    document.getElementById("admin_riesgo_critico").textContent = `${riskPercentage}%`;

    // Promedio General
    if (promedioGeneral > 0) {
        document.getElementById("admin_promedio_general").textContent = promedioGeneral.toFixed(1);
    } else {
        document.getElementById("admin_promedio_general").textContent = "--";
    }
}

function renderizarGraficos() {
    if (typeof echarts === 'undefined') return;

    chartInstances.forEach(chart => { if (chart) chart.dispose(); });
    chartInstances = [];

    renderRadarChart();
    renderHeatmapChart();
    renderPromedioMateriasList();
    renderLineChart();
    renderBarChart();
}

async function renderRadarChart() {
    const dom = document.getElementById('chartMeticasAgregadas');
    if (!dom) return;

    let chart = echarts.getInstanceByDom(dom);
    if (!chart) {
        chart = echarts.init(dom);
        chartInstances.push(chart);
    }

    chart.showLoading();

    const selectPRE = document.getElementById('selectDistribucionPRE');
    const anio = selectPRE ? selectPRE.value : "2024";
    let tipo = "iniciales";
    let filtro = "fecha_inicio"
    const dataFromApi = await HandleGet_indicadores_iniciales(tipo, filtro, anio);
    chart.hideLoading();
    let radarData = [0, 0, 0, 0, 0, 0];

    let dataObj = null;
    if (dataFromApi) {
        if (Array.isArray(dataFromApi)) {
            dataObj = dataFromApi.length > 0 ? dataFromApi[0] : null;
        } else {
            dataObj = dataFromApi;
        }
    }

    if (dataObj) {
        const round3 = val => parseFloat((val || 0).toFixed(3));
        radarData = [
            round3(dataObj["perfil socio-economico"]),
            round3(dataObj["interrupcion de la carrera"]),
            round3(dataObj["perfil educativo de los padres/tutores"]),
            round3(dataObj["carga vital"]),
            round3(dataObj["carga laboral"]),
            round3(dataObj["localidad"])
        ];
    }

    const option = {
        tooltip: {},
        radar: {
            indicator: [
                { name: 'PSE', max: 1 },
                { name: 'IC', max: 1 },
                { name: 'PEP', max: 1 },
                { name: 'CV', max: 1 },
                { name: 'CL', max: 1 },
                { name: 'LOC', max: 1 }
            ],
            axisName: { color: '#434655' }
        },
        series: [{
            name: 'Métricas',
            type: 'radar',
            data: [
                {
                    value: radarData,
                    name: `Promedio Institucional ${anio}`,
                    itemStyle: { color: '#2563EB' },
                    areaStyle: { color: 'rgba(37, 99, 235, 0.2)' }
                }
            ]
        }]
    };
    chart.setOption(option);
}

async function renderHeatmapChart() {
    const dom = document.getElementById('chartPerfilSemaforo');
    if (!dom) return;

    let chart = echarts.getInstanceByDom(dom);
    if (!chart) {
        chart = echarts.init(dom);
        chartInstances.push(chart);
    }

    chart.showLoading();

    const selectPerfilSemaforo = document.getElementById('selectPerfilSemaforo');
    const anio = selectPerfilSemaforo ? selectPerfilSemaforo.value : "2024";

    const dataFromApi = await HandleGet_semaforosXpre(anio);

    chart.hideLoading();

    const xData = ['Favorable', 'Medio-Favorable', 'Medio-Desafiante', 'Desafiante'];
    const yData = ['Estable', 'Alerta', 'Riesgo', 'Crítico'];

    const matrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    function getIndex(val) {
        if (val < 0.25) return 0;
        if (val < 0.5) return 1;
        if (val < 0.75) return 2;
        return 3;
    }

    if (dataFromApi && Array.isArray(dataFromApi)) {
        dataFromApi.forEach(item => {
            const pre = parseFloat(item.perfil);
            const score = parseFloat(item.score);
            if (!isNaN(pre) && !isNaN(score)) {
                let x = getIndex(pre);
                let y = getIndex(score);
                matrix[x][y]++;
            }
        });
    }

    let heatmapData = [];
    let maxVal = 0;
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            let val = matrix[x][y];
            heatmapData.push([x, y, val]);
            if (val > maxVal) maxVal = val;
        }
    }

    if (maxVal === 0) maxVal = 10;

    const option = {
        tooltip: { position: 'top' },
        grid: { left: '15%', right: '12%', top: '5%', bottom: '15%' },
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: {
                color: '#434655',
                interval: 0,
                showMaxLabel: true,
                formatter: function (value) {
                    return (value === 'Favorable' || value === 'Desafiante') ? value : '';
                }
            },
            name: 'PRE',
            nameLocation: 'middle',
            nameGap: 25
        },
        yAxis: {
            type: 'category',
            data: yData,
            axisLabel: {
                color: '#434655',
                formatter: function (value) {
                    return (value === 'Estable' || value === 'Crítico') ? value : '';
                }
            },
            name: 'Puntaje',
            nameLocation: 'end'
        },
        visualMap: {
            min: 0,
            max: maxVal,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: -20,
            show: false,
            inRange: { color: ['#86efac', '#fcd34d', '#fca5a5'] }
        },
        series: [{
            name: 'Distribución',
            type: 'heatmap',
            data: heatmapData,
            label: { show: true, color: '#141b2b' }
        }]
    };
    chart.setOption(option);
}

async function renderPromedioMateriasList() {
    const dom = document.getElementById('listPromedioMaterias');
    if (!dom) return;

    dom.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%;"><span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span></div>';

    try {
        let rawMaterias = await Handle_get_promedio_materias();
        if (!rawMaterias || !Array.isArray(rawMaterias)) {
            rawMaterias = [];
        }

        const subjectMap = {
            'mate1': 'Análisis Matemático 1',
            'algebra1': 'Álgebra 1',
            'fdlq': 'Fund. de la Química',
            'mate2': 'Análisis Matemático 2',
            'algebra2': 'Álgebra 2',
            'fisica': 'Física A',
            'fdlp': 'Fund. de Programación'
        };

        const dbNameMap = {
            'mate1': ['analisis matematico 1', 'mate1', 'Análisis Matemático 1'],
            'algebra1': ['algebra 1', 'algebra1', 'Álgebra 1'],
            'fdlq': ['fundamentos de la quimica', 'fdlq', 'Fund. de la Química'],
            'mate2': ['analisis matematico 2', 'mate2', 'Análisis Matemático 2'],
            'algebra2': ['algebra 2', 'algebra2', 'Álgebra 2'],
            'fisica': ['fisica a', 'fisica', 'Física A'],
            'fdlp': ['fundamentos de la programacion', 'fdlp', 'Fund. de Programación']
        };

        const defaultKeys = Object.keys(subjectMap);
        let materias = defaultKeys.map(key => {
            let found = rawMaterias.find(m =>
                m.nombre && dbNameMap[key].some(validName => validName.toLowerCase() === m.nombre.toLowerCase())
            );
            return {
                nombre: subjectMap[key],
                promedio: found && found.promedio ? parseFloat(found.promedio) : 0
            };
        });

        // Sort descending (highest averages first, as it's a "top de materias")
        materias.sort((a, b) => b.promedio - a.promedio);

        let html = '<div style="display: flex; flex-direction: column; gap: 12px; padding-top: 8px;">';

        materias.forEach((materia, index) => {
            let color = '#475569';
            let bgColor = '#f1f5f9';
            let iconCode = '';

            if (index === 0) {
                color = '#a16207'; bgColor = '#fef08a'; iconCode = '🥇'; // Gold
            } else if (index === 1) {
                color = '#334155'; bgColor = '#e2e8f0'; iconCode = '🥈'; // Silver
            } else if (index === 2) {
                color = '#9a3412'; bgColor = '#ffedd5'; iconCode = '🥉'; // Bronze
            }

            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${bgColor}; color: ${color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.95rem;">
                            ${iconCode ? iconCode : '#' + (index + 1)}
                        </div>
                        <span style="font-weight: 600; color: #1e293b; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;" title="${materia.nombre}">${materia.nombre}</span>
                    </div>
                    <div style="font-weight: 700; color: ${color}; font-size: 1.1rem; background: ${bgColor}; padding: 4px 10px; border-radius: 6px;">
                        ${materia.promedio.toFixed(2)}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        dom.innerHTML = html;

    } catch (error) {
        console.error("Error rendering materias list:", error);
        dom.innerHTML = '<p style="color: #EF4444; text-align: center; margin-top: 20px;">Error al cargar datos.</p>';
    }
}

async function renderLineChart() {
    const dom = document.getElementById('chartEvolucionSemaforo');
    if (!dom) return;
    const chart = echarts.init(dom);
    chartInstances.push(chart);

    chart.showLoading();

    // techo expects a year string because in backend: fecha_techo = date(int(techo), 11, 30)
    const selectSemaforo = document.getElementById('selectFechaTechoSemaforo');
    const techoYear = selectSemaforo ? selectSemaforo.value : new Date().getFullYear().toString();
    const dataFromApi = await HandleGet_conteo_semaforos(techoYear);
    chart.hideLoading();

    let xAxisData = [];
    let estableData = [];
    let alertaData = [];
    let criticoData = [];

    // Assuming we group data manually if backend returns a flat list of {fecha, color, cantidad}
    if (dataFromApi && Array.isArray(dataFromApi)) {
        // Group by fecha
        const dateGroups = {};
        dataFromApi.forEach(item => {
            const fechaStr = item.fecha || 'Sin fecha';
            if (!dateGroups[fechaStr]) {
                dateGroups[fechaStr] = { verde: 0, amarillo: 0, rojo: 0 };
            }
            if (item.color) {
                // map colors safely
                const c = item.color.toLowerCase();
                if (c === 'verde' || c === 'estable') dateGroups[fechaStr].verde += item.cantidad;
                if (c === 'amarillo' || c === 'alerta') dateGroups[fechaStr].amarillo += item.cantidad;
                if (c === 'rojo' || c === 'critico' || c === 'crítico') dateGroups[fechaStr].rojo += item.cantidad;
            }
        });

        // Sort dates chronologically
        const sortedDates = Object.keys(dateGroups).sort((a, b) => new Date(a) - new Date(b));

        // Take up to 4 latest dates to match "las ultimas 4 encuestas"
        const last4Dates = sortedDates.slice(-4);

        last4Dates.forEach(date => {
            xAxisData.push(date);
            estableData.push(dateGroups[date].verde);
            alertaData.push(dateGroups[date].amarillo);
            criticoData.push(dateGroups[date].rojo);
        });
    }

    if (xAxisData.length === 0) {
        chart.clear();
        chart.setOption({
            title: {
                text: 'Sin datos para este período',
                left: 'center',
                top: 'middle',
                textStyle: { color: '#64748b', fontSize: 14, fontWeight: 'normal' }
            }
        }, true);
        return;
    }

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Estable', 'Alerta', 'Crítico'], bottom: 0 },
        grid: { left: '5%', right: '5%', top: '5%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: xAxisData, axisLabel: { color: '#434655' } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { color: '#434655' }, minInterval: 1 },
        series: [
            { name: 'Estable', type: 'bar', stack: 'total', data: estableData, itemStyle: { color: '#22C55E' } },
            { name: 'Alerta', type: 'bar', stack: 'total', data: alertaData, itemStyle: { color: '#F59E0B' } },
            { name: 'Crítico', type: 'bar', stack: 'total', data: criticoData, itemStyle: { color: '#EF4444' } }
        ]
    };
    chart.setOption(option, true);
}

async function renderBarChart() {
    const dom = document.getElementById('chartComparacionCohortes');
    if (!dom) return;

    let chart = echarts.getInstanceByDom(dom);
    if (!chart) {
        chart = echarts.init(dom);
        chartInstances.push(chart);
    }

    chart.showLoading();
    const dataFromApi = await HandleGet_scoreXcohorte();
    chart.hideLoading();

    let xAxisData = [];
    let seriesData = [];

    if (dataFromApi && Array.isArray(dataFromApi)) {
        const validCohortes = dataFromApi.filter(item => item.cohorte !== -1);

        validCohortes.sort((a, b) => a.cohorte - b.cohorte);

        validCohortes.forEach((item, index) => {
            xAxisData.push(String(item.cohorte));

            let val = parseFloat(item.promedio_score);
            if (isNaN(val)) val = 0;

            val = parseFloat(val.toFixed(2));

            // Assign varying shades of blue based on index for aesthetics
            const colors = ['#e1e8fd', '#b4c5ff', '#60a5fa', '#3b82f6', '#2563EB', '#1d4ed8', '#1e3a8a'];
            const color = colors[index % colors.length];

            seriesData.push({
                value: val,
                itemStyle: { color: color }
            });
        });
    }

    if (xAxisData.length === 0) {
        xAxisData = ['Sin Datos'];
        seriesData = [0];
    }

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '5%', right: '5%', top: '5%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: xAxisData, axisLabel: { color: '#434655' }, axisLine: { show: false }, axisTick: { show: false } },
        yAxis: { type: 'value', axisLabel: { show: false }, splitLine: { show: false } },
        series: [{
            data: seriesData,
            type: 'bar',
            barWidth: '40%',
            label: { show: true, position: 'insideBottom', color: '#141b2b', formatter: '{c}' },
            itemStyle: { borderRadius: [4, 4, 0, 0] }
        }]
    };
    chart.setOption(option);
}
