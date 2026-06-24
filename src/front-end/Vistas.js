export const VISTA_HOME = `
    <div class="container">
        <component-navbar></component-navbar>
        <!-- CABECERA PRINCIPAL -->
        <header class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; margin-bottom: 24px;">
            <div>
                <h1>Panel del Instructor</h1>
                <p class="subtitle">Visualizador de Datos de Alumnos</p>
                <p id="currentDate" style="font-weight: 600; color: #3b82f6; margin-top: 6px; font-size: 0.92rem;"></p>
            </div>
        </header>

        <!-- GRID DE MÉTRICAS -->
        <section class="kpi-grid">
            <article class="kpi-card total">
                <div class="kpi-icon-wrap">
                    <span class="material-symbols-outlined">person</span>
                </div>
                <div class="kpi-details">
                    <p class="label">Alumnos Inscriptos</p>
                    <h2 id="totalAlumnosCount">0</h2>
                    <p class="subtext">Total en el sistema</p>
                </div>
            </article>

            <article class="kpi-card success average">
                <div class="kpi-icon-wrap">
                    <span class="material-symbols-outlined">monitoring</span>
                </div>
                <div class="kpi-details">
                    <p class="label">Promedio 1er Año</p>
                    <h2 id="avgScore1erAnio">0.00</h2>
                    <p class="subtext">Cohorte de Ingreso</p>
                </div>
            </article>

            <article class="kpi-card critical">
                <div class="kpi-icon-wrap">
                    <span class="material-symbols-outlined">report_problem</span>
                </div>
                <div class="kpi-details">
                    <p class="label">En Riesgo Crítico</p>
                    <h2 id="criticalAlumnosCount">0</h2>
                    <p class="subtext">Semáforo en Rojo</p>
                </div>
            </article>
        </section>

        <!-- ALUMNOS EN RIESGO DE DESERCION -->
        <section class="alert-panel">
            <div class="alert-header">
                <div class="alert-title-wrap">
                    <span class="material-symbols-outlined">notification_important</span>
                    <h3>Riesgo Inminente</h3>
                </div>
                <span class="alert-badge">Prioridad de Acompañamiento</span>
            </div>

            <div id="criticalList" class="alert-content critical-list">
                <!-- Se cargará dinámicamente -->
                <div class="alert-empty">
                    <div class="alert-empty-icon">
                        <span class="material-symbols-outlined"
                            style="color:var(--critical); font-size: 32px;">hourglass_empty</span>
                    </div>
                    <p>Cargando alertas de riesgo...</p>
                </div>
            </div>
        </section>

        <!-- LISTADO GENERAL Y FILTRADO -->
        <section class="table-section">
            <div class="table-header">
                <h3>Listado Completo de Estudiantes</h3>

                <div class="table-controls">
                    <div class="search-wrap">
                        <span class="material-symbols-outlined">search</span>
                        <input id="searchAlumno" type="search" placeholder="Buscar por DNI o nombre...">
                    </div>

                    <select id="filterEstado" class="filter-select">
                        <option value="">Todos los Estados</option>
                        <option value="verde">Verde (Estable)</option>
                        <option value="amarillo">Amarillo (Alerta)</option>
                        <option value="rojo">Rojo (Crítico)</option>
                        <option value="gris">Pendiente</option>
                    </select>
                </div>
            </div>

            <div class="table-container">
                <table id="studentsTable">
                    <thead>
                        <tr>
                            <th>DNI / ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Carrera</th>
                            <th>Curso / Cohorte</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="placeholder-row">
                            <td colspan="7">
                                <div class="placeholder-content">
                                    <div class="placeholder-icon">
                                        <span class="material-symbols-outlined"
                                            style="font-size: 32px;">folder_open</span>
                                    </div>
                                    <p>Los alumnos se cargarán aquí automáticamente.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- CONTROLES DE PAGINACIÓN -->
            <div class="pagination-controls" id="paginationControls">
                <button id="btnPrevPage" class="btn-pagination" disabled>
                    <span class="material-symbols-outlined">chevron_left</span> Anterior
                </button>
                <span id="pageIndicator" class="page-indicator">Página 1 de 1</span>
                <button id="btnNextPage" class="btn-pagination" disabled>
                    Siguiente <span class="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </section>
    </div>

    <!-- MODAL DE ESTADÍSTICAS DEL ALUMNO -->
    <div id="modalAlumnoStats" class="modal">
        <div class="modal-content-wrapper">
            <button class="modal-close-btn" onclick="cerrarModalAlumnoStats()" title="Cerrar Ficha">
                <span class="material-symbols-outlined">close</span>
            </button>
            <modal-alumnostats></modal-alumnostats>
        </div>
    </div>
`;

export const VISTA_DATA_ENTRY = `
    <div id="container" class="container" style="display: flex; flex-direction: column; min-height: 100vh;">
        <component-navbar></component-navbar>

        <!-- CABECERA PRINCIPAL -->
        <header class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; margin-bottom: 24px;">
            <div>
                <h1>Gestor de Datos</h1>
                <p class="subtitle">Subí los archivos .CSV para actualizar el panel de control.</p>
            </div>
        </header>

        <div class="compact-upload-zone" id="uploadZone">
            <input type="file" id="mainFileInput" accept=".csv" style="display: none;" />
            <div class="upload-info-group">
                <div class="upload-icon-container">
                    <span class="material-symbols-outlined">cloud_upload</span>
                </div>
                <div class="upload-text-container">
                    <span class="title" id="uploadZoneText">Arrastrá o hacé clic para buscar un archivo CSV</span>
                    <span class="subtitle">Formatos aceptados: .CSV</span>
                </div>
            </div>
            <div class="upload-controls-group" onclick="event.stopPropagation();">
                <select id="selectFileType" class="select-file-type" value="TIPO DE ARCHIVO">
                    <option disabled selected>Seleccionar Clase</option>
                    <option value="alumnos">Alumnos</option>
                    <option value="notas">Notas</option>
                    <option value="encuestaInicial">Encuesta Inicial</option>
                    <option value="encuestaPeriodica">Encuesta Cuatrimestral</option>
                    <option value="entrevista">Entrevista</option>
                </select>
                <button id="btnClearFile" class="btn-limpiar hidden"
                    style="position: static; transform: none; display: flex; margin-right: 8px;">✕</button>
                <button id="x" class="btn-upload-compact" style="background: var(--primary);">
                    <span class="material-symbols-outlined">publish</span> Subir Archivo
                </button>
            </div>
        </div>

        <div id="mensaje"
            style="margin: 4px 0; text-align: center; min-height: 24px; display: flex; align-items: center; justify-content: center;">
        </div>

        <section class="preview-section" style="flex: 1; display: flex; flex-direction: column; margin-bottom: 24px;">
            <div class="preview-header">
                <h2>Previsualización de Datos</h2>
            </div>

            <div class="table-container" style="flex: 1; min-height: 300px;">
                <div id="emptyMessage" class="empty-state">
                    <div class="empty-icon">
                        <span class="material-symbols-outlined" style="font-size: 28px;">data_exploration</span>
                    </div>
                    <h3>Ningún archivo seleccionado</h3>
                    <p>Selecciona un archivo CSV en el panel superior para previsualizar los datos aquí.</p>
                </div>
                <table id="tablaResultados" style="display: none;">
                    <thead>
                        <tr id="headerRow">
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Filas dinámicas -->
                    </tbody>
                </table>
            </div>

            <div class="pagination-controls" id="paginationControls"
                style="display: none; justify-content: center; align-items: center; gap: 15px; margin-top: 15px;">
                <button id="btnPrevPage" class="btn-pagination" disabled>
                    <span class="material-symbols-outlined">chevron_left</span> Anterior
                </button>
                <span id="pageIndicator" class="page-indicator">Página 1 de 1</span>
                <button id="btnNextPage" class="btn-pagination" disabled>
                    Siguiente <span class="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </section>
    </div>
`;

export const VISTA_ALUMNO_STATS = `
    <div class="container new-design stats-page">

        <header class="page-header" style="margin-bottom: 24px;">
            <h1 id="stats-header-name">Hola, ...</h1>
            <p class="subtitle" id="stats-header-subtitle">Ing. Industrial · Cohorte 2022 · última encuesta: 2do cuatrimestre 2024</p>
        </header>

        <section class="kpi-section" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;" id="student-kpi-grid">
            <!-- Loaded dynamically -->
        </section>

        <section id="student-alert-box" class="alert-panel" style="margin-top: 24px; background-color: #f1f3ff; border: 1px solid #dce2f7; border-radius: 12px; padding: 24px; display: flex; gap: 16px;">
            <div style="background-color: #2563eb; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <span class="material-symbols-outlined">emoji_objects</span>
            </div>
            <div>
                <h3 id="alert-title" style="color: #003ea8; margin: 0 0 8px 0; font-size: 1.1rem;">Tu confianza para aprobar viene bajando hace dos cuatrimestres</h3>
                <p id="alert-desc" style="color: #434655; margin: 0 0 12px 0;">No es una alarma, es una señal para actuar. Hay tutorías de Análisis Matemático los martes y jueves, y no hace falta estar en crisis para ir.</p>
                <a href="#" id="alert-link" style="color: #2563eb; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 4px;">Ver horarios de tutorías <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span></a>
            </div>
        </section>

        <div class="charts-grid" style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-top: 24px;">
            <div class="metrics-list-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="margin-bottom: 24px;">
                    <h2 id="metric-list-title" style="font-size: 1.25rem; color: #141b2b; margin: 0 0 4px 0;">Cómo te sentís este cuatrimestre</h2>
                    <p class="subtitle" id="metric-list-subtitle" style="color: #434655; font-size: 0.9rem; margin: 0;">Tus respuestas en la última encuesta</p>
                </div>
                <div id="metrics-list-container" style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Loaded dynamically -->
                </div>
            </div>
            
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="margin-bottom: 24px;">
                    <h2 id="chart-percepcion-title" style="font-size: 1.25rem; color: #141b2b; margin: 0 0 4px 0;">Cómo cambió tu percepción a lo largo del tiempo</h2>
                    <p class="subtitle" id="chart-percepcion-subtitle" style="color: #434655; font-size: 0.9rem; margin: 0;">Solo te mostramos tu propio recorrido — no hay ningún otro alumno en este gráfico</p>
                </div>
                <div id="chartPercepcionLine" style="width: 100%; height: 350px;"></div>
            </div>
        </div>
    </div>
`;

export const VISTA_TUTORES = `
    <div class="container new-design tutores-page">
        <component-navbar></component-navbar>

        <!-- CABECERA PRINCIPAL -->
        <header class="page-header" style="margin-bottom: 24px;">
            <h1>Gestión de Tutores</h1>
            <p class="subtitle">Administre el registro y asignación de tutores a estudiantes.</p>
        </header>

        <!-- KPIS -->
        <div class="tutores-kpi-row">
            <div class="kpi-card-tutor blue-kpi">
                <div class="kpi-icon-container"><span class="material-symbols-outlined">group</span></div>
                <div class="kpi-info">
                    <span class="kpi-title">Cantidad de Tutores</span>
                    <strong class="kpi-value" id= "tutores_counter">--</strong>
                </div>
            </div>
            <div class="kpi-card-tutor green-kpi">
                <div class="kpi-icon-container"><span class="material-symbols-outlined">school</span></div>
                <div class="kpi-info">
                    <span class="kpi-title">Cantidad de Alumnos</span>
                    <strong class="kpi-value" id="alumnos_counter">--.---</strong>
                </div>
            </div>
        </div>

        <!-- LISTADO DE TUTORES -->
        <div class="listado-tutor-panel card-panel full-width-panel" style="margin-bottom: 24px;">
            <div class="panel-header-flex">
                <div class="panel-header-t">
                    <span class="material-symbols-outlined icon-blue">view_list</span>
                    <h2>Listado de Tutores</h2>
                </div>
                <div class="header-actions" style="display: flex; gap: 16px; align-items: center;">
                    <div class="search-wrap-t">
                        <span class="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Buscar...">
                    </div>
                    
                    <button id="btnAltaTutor" class="btn-primary-small"><span class="material-symbols-outlined">person_add</span> Dar de Alta Tutor</button>
                    
                    <div id="inlineAltaForm" style="display: none; align-items: center; gap: 8px; background: #eff6ff; padding: 4px 8px; border-radius: 8px; border: 1px solid #bfdbfe;">
                        <span class="material-symbols-outlined" style="color: #2563eb; font-size: 20px; margin-left: 4px;">badge</span>
                        <input type="text" id="inputDniAlta" placeholder="DNI del Tutor" style="border: none; background: transparent; outline: none; width: 130px; font-size: 0.9rem; color: #1e3a8a;">
                        <button id="btnConfirmarAlta" class="btn-icon" style="color: #059669; padding: 4px;" title="Confirmar"><span class="material-symbols-outlined">check_circle</span></button>
                        <button id="btnCancelarAlta" class="btn-icon" style="color: #dc2626; padding: 4px;" title="Cancelar"><span class="material-symbols-outlined">cancel</span></button>
                    </div>
                </div>
            </div>
            <div class="table-wrapper-t">
                <table class="table-t">
                    <thead>
                        <tr>
                            <th>NOMBRE COMPLETO</th>
                            <th>DNI</th>
                            <th>EMAIL</th>
                            <th>ALUMNOS</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </div>

        <!-- PANEL DE ASIGNACIÓN (OCULTO POR DEFECTO) -->
        <div id="panelAsignacion" class="asignacion-panel card-panel full-width-panel" style="display: none;">
            <div class="panel-header-flex">
                <div class="panel-header-t">
                    <span class="material-symbols-outlined icon-blue">link</span>
                    <h2>Asignar Alumnos a: <span id="tutorAsignadoName" style="color: #2563eb;"></span></h2>
                </div>
                <button id="btnCerrarAsignacion" class="btn-icon" style="color: #64748b;"><span class="material-symbols-outlined">close</span></button>
            </div>
            <p class="panel-desc mb-4">Marque los alumnos que desea asignarle a este tutor.</p>
            
            <div class="list-container-t" style="max-width: 600px; margin: 0 auto;">
                <div class="list-header-flex-t">
                    <h3>Seleccionar Alumnos</h3>
                    <div class="search-mini-t">
                        <span class="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Buscar alumno...">
                    </div>
                </div>
                <div class="list-box-t alumno-list">
                    <label class="list-item-t check-item-t">
                        <input type="checkbox">
                        <div class="item-details-t">
                            <strong>Mateo González</strong>
                            <span>Ingeniería Civil - DNI: 44.322.111</span>
                        </div>
                    </label>
                    <label class="list-item-t check-item-t">
                        <input type="checkbox">
                        <div class="item-details-t">
                            <strong>Laura Martínez</strong>
                            <span>Arquitectura - DNI: 43.111.222</span>
                        </div>
                    </label>
                    <label class="list-item-t check-item-t">
                        <input type="checkbox">
                        <div class="item-details-t">
                            <strong>Juan Pérez</strong>
                            <span>Ingeniería Civil - DNI: 42.555.777</span>
                        </div>
                    </label>
                </div>
                <div class="selection-summary-t">
                    <span id="selected-alumnos-count">0 alumnos seleccionados</span>
                </div>
                <div class="asignacion-footer-t" style="margin-top: 20px;">
                    <button id="btnCancelarAsignacion" class="btn-secondary-t">Cancelar</button>
                    <button class="btn-primary-large-t"><span class="material-symbols-outlined">assignment_ind</span> Confirmar Asignación</button>
                </div>
            </div>
        </div>
    </div>
`;

export const VISTA_ADMIN_DASHBOARD = `
    <div class="container new-design admin-page">
        <component-navbar></component-navbar>

        <header class="page-header" style="margin-bottom: 24px;">
            <h1>Dashboard Institucional - Vista Global</h1>
            <p class="subtitle">Análisis de indicadores clave, cohortes y métricas de rendimiento académico (RAC, RAP, RAF, PRE).</p>
        </header>

        <!-- KPIS Institucionales -->
        <div class="admin-kpi-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px;">
            <div class="kpi-card-new border-critical" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #EF4444; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">ALUMNOS EN RIESGO CRÍTICO</span>
                    <div class="kpi-icon-badge" style="color: #EF4444; background: #FEF2F2; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">warning</span></div>
                </div>
                <div class="kpi-value" style="display: flex; align-items: baseline; gap: 8px;">
                    <strong id="admin_riesgo_critico" style="font-size: 2rem; color: #141b2b;">--%</strong>
                    
                </div>
            </div>
            <div class="kpi-card-new border-primary" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #2563EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">PROMEDIO GENERAL 1ER AÑO</span>
                    <div class="kpi-icon-badge" style="color: #2563EB; background: #EFF6FF; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">functions</span></div>
                </div>
                <div class="kpi-value" style="display: flex; align-items: baseline; gap: 4px;">
                    <strong id="admin_promedio_general" style="font-size: 2rem; color: #141b2b;">--</strong> <span class="kpi-unit" style="color: #434655;">/ 10</span>
                </div>
            </div>
            <div class="kpi-card-new border-gray" style="background: white; border-radius: 12px; padding: 16px; border-left: 4px solid #475569; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="kpi-top" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span class="kpi-label" style="font-size: 0.75rem; font-weight: 700; color: #434655;">TOTAL ALUMNOS ACTIVOS</span>
                    <div class="kpi-icon-badge" style="color: #475569; background: #F1F5F9; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"><span class="material-symbols-outlined" style="font-size: 16px;">group</span></div>
                </div>
                <div class="kpi-value">
                    <strong id="admin_total_alumnos" style="font-size: 2rem; color: #141b2b;">--</strong>
                </div>
            </div>
        </div>

        <!-- CHARTS GRID -->
        <div class="charts-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">pentagon</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Distribución del PRE</h2>
                    </div>
                    <select class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025 C1">2025 C1</option>
                        <option value="2024 C2">2024 C2</option>
                    </select>
                </div>
                <div id="chartMeticasAgregadas" style="width: 100%; height: 250px;"></div>
            </div>
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">grid_view</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Perfil Económico vs Semáforo</h2>
                    </div>
                    <select class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025 C1">2025 C1</option>
                        <option value="2024 C2">2024 C2</option>
                    </select>
                </div>
                <div id="chartPerfilSemaforo" style="width: 100%; height: 250px;"></div>
            </div>
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">format_list_numbered</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Promedios por Materias</h2>
                    </div>
                    <select class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025 C1">2025 C1</option>
                        <option value="2024 C2">2024 C2</option>
                    </select>
                </div>
                <div id="listPromedioMaterias" style="width: 100%; height: 250px; overflow-y: auto;">
                    <!-- Se carga dinámicamente -->
                </div>
            </div>
        </div>
        
        <div class="charts-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">bar_chart</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Evolución del Semáforo por Cuatrimestre</h2>
                    </div>
                    <select class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025 C1">2025 C1</option>
                        <option value="2024 C2">2024 C2</option>
                    </select>
                </div>
                <div id="chartEvolucionSemaforo" style="width: 100%; height: 250px;"></div>
            </div>
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">compare_arrows</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Score x Cohorte</h2>
                    </div>
                    <select class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025 C1">2025 C1</option>
                        <option value="2024 C2">2024 C2</option>
                    </select>
                </div>
                <div id="chartComparacionCohortes" style="width: 100%; height: 250px;"></div>
            </div>
        </div>
    </div>
`;

export const VISTA_ADMIN_TOOLS = `
    <div class="container new-design admin-page">
        <component-navbar></component-navbar>

        <!-- CABECERA PRINCIPAL -->
        <header class="page-header" style="margin-bottom: 24px;">
            <h1>Herramientas del Administrador</h1>
            <p class="subtitle">Gestión de usuarios y configuración de parámetros del sistema.</p>
        </header>

        <div class="tools-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <!-- FORMULARIO ALTA ADMIN -->
            <div class="tool-panel card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">admin_panel_settings</span>
                        <h2>Alta de Administradores</h2>
                    </div>
                </div>
                <form id="formAltaAdmin" class="admin-form">
                    <div class="form-group">
                        <label>DNI del Administrador</label>
                        <input type="text" id="adminDni" placeholder="Ej. 25654321" required>
                    </div>
                    <button type="submit" class="btn-primary-large-t" style="width: 100%; margin-top: 16px;">
                        <span class="material-symbols-outlined">save</span> Registrar Administrador
                    </button>
                    <div id="msgAdmin" class="msg-feedback hidden" style="margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
                </form>
            </div>
            
            <!-- CONFIGURACION COEFICIENTES -->
            <div class="tool-panel card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">settings</span>
                        <h2>Configuración de Coeficientes de Riesgo</h2>
                    </div>
                </div>
                <p style="color: #64748b; margin-bottom: 16px; font-size: 0.9rem;">
                    Ajuste los pesos relativos de cada variable para el cálculo del índice de riesgo de los estudiantes. El valor base es 1.0. Si aumenta un coeficiente, los demás disminuirán para mantener el balance.
                </p>
                <form id="formCoeficientes" class="admin-form">
                    <div class="coeficientes-grid" style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="form-group">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Coeficiente Asistencia</span>
                                <span id="valAsistencia" style="color: #3b82f6; font-weight: bold;">1.0</span>
                            </label>
                            <input type="range" class="coef-slider" id="coefAsistencia" min="0" max="3" step="0.1" value="1.0" style="width: 100%; cursor: pointer;">
                        </div>
                        <div class="form-group">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Coeficiente Tareas</span>
                                <span id="valTareas" style="color: #3b82f6; font-weight: bold;">1.0</span>
                            </label>
                            <input type="range" class="coef-slider" id="coefTareas" min="0" max="3" step="0.1" value="1.0" style="width: 100%; cursor: pointer;">
                        </div>
                        <div class="form-group">
                            <label style="display: flex; justify-content: space-between;">
                                <span>Coeficiente Exámenes</span>
                                <span id="valExamenes" style="color: #3b82f6; font-weight: bold;">1.0</span>
                            </label>
                            <input type="range" class="coef-slider" id="coefExamenes" min="0" max="3" step="0.1" value="1.0" style="width: 100%; cursor: pointer;">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary-large-t" style="margin-top: 16px;">
                        <span class="material-symbols-outlined">tune</span> Guardar Configuración
                    </button>
                    <div id="msgCoef" class="msg-feedback hidden" style="margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
                </form>
            </div>
        </div>
    </div>
`;
