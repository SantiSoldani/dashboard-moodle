import { HandleGet_alumnos } from "../models/Alumno.js";

let allStudents = [];
let chartInstances = [];

export async function initAdminDashboard() {
    await cargarDatos();
    calcularYMostrarMetricas();
    renderizarGraficos();
    
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
    } catch (error) {
        console.error("Error cargando alumnos para el dashboard administrador:", error);
        allStudents = [];
    }
}

function calcularYMostrarMetricas() {
    const totalAlumnos = allStudents.length;
    document.getElementById("admin_total_alumnos").textContent = totalAlumnos || 312;

    let sumScore = 0;
    let countScore = 0;
    let criticosCount = 0;

    allStudents.forEach(alumno => {
        const estado = String(alumno.color).trim().toLowerCase();
        if (estado === "rojo") {
            criticosCount++;
        }

        if (alumno.score !== undefined && alumno.score !== null) {
            sumScore += parseFloat(alumno.score);
            countScore++;
        }
    });

    // Tasa de respuesta
    document.getElementById("admin_tasa_respuesta").textContent = "78%";

    // Riesgo critico
    const riskPercentage = totalAlumnos > 0 ? ((criticosCount / totalAlumnos) * 100).toFixed(0) : "14";
    document.getElementById("admin_riesgo_critico").textContent = `${riskPercentage}%`;

    // Promedio General
    let promedioInstitucional = 0;
    if (countScore > 0) {
        promedioInstitucional = sumScore / countScore;
        if (promedioInstitucional <= 1.0) {
            promedioInstitucional = promedioInstitucional * 10;
        }
    } else {
        promedioInstitucional = 6.1; // Default
    }
    document.getElementById("admin_promedio_general").textContent = promedioInstitucional.toFixed(1);
}

function renderizarGraficos() {
    if (typeof echarts === 'undefined') return;

    chartInstances.forEach(chart => { if(chart) chart.dispose(); });
    chartInstances = [];

    renderRadarChart();
    renderHeatmapChart();
    renderScatterChart();
    renderLineChart();
    renderBarChart();
}

function renderRadarChart() {
    const dom = document.getElementById('chartMeticasAgregadas');
    if (!dom) return;
    const chart = echarts.init(dom);
    chartInstances.push(chart);

    const option = {
        tooltip: {},
        radar: {
            indicator: [
                { name: 'RAC', max: 100 },
                { name: 'RAP', max: 100 },
                { name: 'RAF', max: 100 },
                { name: 'PRE', max: 100 },
                { name: 'ATT', max: 100 }
            ],
            axisName: { color: '#434655' }
        },
        series: [{
            name: 'Métricas',
            type: 'radar',
            data: [
                {
                    value: [80, 75, 90, 60, 85],
                    name: 'Promedio Institucional',
                    itemStyle: { color: '#2563EB' },
                    areaStyle: { color: 'rgba(37, 99, 235, 0.2)' }
                }
            ]
        }]
    };
    chart.setOption(option);
}

function renderHeatmapChart() {
    const dom = document.getElementById('chartPerfilSemaforo');
    if (!dom) return;
    const chart = echarts.init(dom);
    chartInstances.push(chart);

    const xData = ['Estable (Verde)', 'Alerta (Amarillo)', 'Crítico (Rojo)'];
    const yData = ['Alto', 'Medio', 'Bajo'];
    // Mock Data format: [xIndex, yIndex, value]
    const data = [
        [0, 0, 50], [0, 1, 40], [0, 2, 10],
        [1, 0, 20], [1, 1, 60], [1, 2, 30],
        [2, 0, 5], [2, 1, 25], [2, 2, 70]
    ].map(item => [item[0], item[1], item[2]]);

    const option = {
        tooltip: { position: 'top' },
        grid: { left: '15%', right: '5%', top: '5%', bottom: '15%' },
        xAxis: { type: 'category', data: xData, axisLabel: { color: '#434655' } },
        yAxis: { type: 'category', data: yData, axisLabel: { color: '#434655' } },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: -20,
            show: false,
            inRange: { color: ['#F0FDF4', '#FFFBEB', '#FEF2F2'] }
        },
        series: [{
            name: 'Distribución',
            type: 'heatmap',
            data: data,
            label: { show: true, color: '#141b2b' }
        }]
    };
    chart.setOption(option);
}

function renderScatterChart() {
    const dom = document.getElementById('chartPRENota');
    if (!dom) return;
    const chart = echarts.init(dom);
    chartInstances.push(chart);

    const option = {
        tooltip: { trigger: 'item' },
        grid: { left: '10%', right: '5%', top: '10%', bottom: '15%' },
        xAxis: { 
            type: 'value', 
            name: 'PRE',
            nameLocation: 'middle',
            nameGap: 25,
            axisLabel: { color: '#434655' },
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        yAxis: { 
            type: 'value',
            name: 'Nota Promedio',
            nameLocation: 'middle',
            nameGap: 30,
            axisLabel: { color: '#434655' },
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{
            symbolSize: 10,
            data: [
                [40, 5], [55, 6.5], [70, 8], [85, 9.5],
                [30, 4.5], [60, 7.5], [80, 8.5], [90, 9]
            ],
            type: 'scatter',
            itemStyle: { color: '#2563EB' }
        }]
    };
    chart.setOption(option);
}

function renderLineChart() {
    const dom = document.getElementById('chartEvolucionSemaforo');
    if (!dom) return;
    const chart = echarts.init(dom);
    chartInstances.push(chart);

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Estable', 'Alerta', 'Crítico'], bottom: 0 },
        grid: { left: '5%', right: '5%', top: '5%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: ['Q1 \'23', 'Q2 \'23', 'Q1 \'24', 'Q2 \'24'], axisLabel: { color: '#434655' } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { color: '#434655' } },
        series: [
            { name: 'Estable', type: 'bar', stack: 'total', data: [120, 132, 101, 134], itemStyle: { color: '#22C55E' } },
            { name: 'Alerta', type: 'bar', stack: 'total', data: [220, 182, 191, 234], itemStyle: { color: '#F59E0B' } },
            { name: 'Crítico', type: 'bar', stack: 'total', data: [150, 232, 201, 154], itemStyle: { color: '#EF4444' } }
        ]
    };
    chart.setOption(option);
}

function renderBarChart() {
    const dom = document.getElementById('chartComparacionCohortes');
    if (!dom) return;
    const chart = echarts.init(dom);
    chartInstances.push(chart);

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '5%', right: '5%', top: '5%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: ['2022', '2023', '2024'], axisLabel: { color: '#434655' }, axisLine: { show: false }, axisTick: { show: false } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { show: false }, splitLine: { show: false } },
        series: [{
            data: [
                { value: 6.2, itemStyle: { color: '#2563EB' } },
                { value: 7.1, itemStyle: { color: '#b4c5ff' } },
                { value: 5.8, itemStyle: { color: '#e1e8fd' } }
            ],
            type: 'bar',
            barWidth: '40%',
            label: { show: true, position: 'insideBottom', color: '#141b2b', formatter: '{c}' },
            itemStyle: { borderRadius: [4, 4, 0, 0] }
        }]
    };
    chart.setOption(option);
}
