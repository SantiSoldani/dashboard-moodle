import { HandleGet_alumnos } from "../models/Alumno.js";
import { Handle_get_promedio_general, Handle_get_promedio_materias } from "../models/Notas.js";

let allStudents = [];
let chartInstances = [];
let promedioGeneral = 0;
let totalCriticos = 0;

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

    chartInstances.forEach(chart => { if(chart) chart.dispose(); });
    chartInstances = [];

    renderRadarChart();
    renderHeatmapChart();
    renderPromedioMateriasList();
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
                { name: 'PSE', max: 100 },
                { name: 'IC', max: 100 },
                { name: 'CL', max: 100 },
                { name: 'CV', max: 100 },
                { name: 'LOC', max: 100 }
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

    const xData = ['Desafiante', 'Medio-Bajo', 'Medio-Alto', 'Favorable'];
    const yData = ['Crítico', 'Alerta', 'Estable', 'Alto'];
    // Mock Data format: [xIndex, yIndex, value]
    const data = [
        [0, 0, 45], [0, 1, 30], [0, 2, 10], [0, 3, 5],
        [1, 0, 25], [1, 1, 40], [1, 2, 20], [1, 3, 10],
        [2, 0, 15], [2, 1, 25], [2, 2, 45], [2, 3, 20],
        [3, 0, 5],  [3, 1, 15], [3, 2, 30], [3, 3, 60]
    ];

    const option = {
        tooltip: { position: 'top' },
        grid: { left: '15%', right: '5%', top: '5%', bottom: '15%' },
        xAxis: { type: 'category', data: xData, axisLabel: { color: '#434655' }, name: 'PRE', nameLocation: 'middle', nameGap: 25 },
        yAxis: { type: 'category', data: yData, axisLabel: { color: '#434655' }, name: 'RAF', nameLocation: 'end' },
        visualMap: {
            min: 0,
            max: 100,
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
            data: data,
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
        const materias = await Handle_get_promedio_materias();
        if (!materias || !Array.isArray(materias)) {
            dom.innerHTML = '<p style="color: #64748b; text-align: center; margin-top: 20px;">No hay datos disponibles.</p>';
            return;
        }

        // Sort ascending (lowest averages first)
        materias.sort((a, b) => a.promedio - b.promedio);
        
        // Take top 5
        const top5 = materias.slice(0, 5);

        let html = '<div style="display: flex; flex-direction: column; gap: 12px; padding-top: 8px;">';
        
        top5.forEach((materia, index) => {
            let color = '#22C55E';
            let bgColor = '#F0FDF4';
            if (materia.promedio < 4) {
                color = '#EF4444';
                bgColor = '#FEF2F2';
            } else if (materia.promedio < 6) {
                color = '#F59E0B';
                bgColor = '#FFFBEB';
            }

            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 28px; height: 28px; border-radius: 50%; background: ${bgColor}; color: ${color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">
                            #${index + 1}
                        </div>
                        <span style="font-weight: 600; color: #1e293b; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;" title="${materia.nombre}">${materia.nombre}</span>
                    </div>
                    <div style="font-weight: 700; color: ${color}; font-size: 1.1rem;">
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
        xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025'], axisLabel: { color: '#434655' }, axisLine: { show: false }, axisTick: { show: false } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { show: false }, splitLine: { show: false } },
        series: [{
            data: [
                { value: 5.8, itemStyle: { color: '#e1e8fd' } },
                { value: 6.5, itemStyle: { color: '#b4c5ff' } },
                { value: 7.8, itemStyle: { color: '#2563EB' } },
                { value: 8.5, itemStyle: { color: '#1e3a8a' } }
            ],
            type: 'bar',
            barWidth: '40%',
            label: { show: true, position: 'insideBottom', color: '#141b2b', formatter: '{c}' },
            itemStyle: { borderRadius: [4, 4, 0, 0] }
        }]
    };
    chart.setOption(option);
}
