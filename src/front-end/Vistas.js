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
                    <p class="label">Cantidad de Alumnos</p>
                    <h2 id="totalAlumnosCount">0</h2>
                </div>
            </article>

            <article class="kpi-card success average">
                <div class="kpi-icon-wrap">
                    <span class="material-symbols-outlined">monitoring</span>
                </div>
                <div class="kpi-details">
                    <p class="label">Promedio 1er Año</p>
                    <h2 id="avgScore1erAnio">0.00</h2>
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

        <!-- ALUMNOS EN RIESGO DE DESERCION Y SOLICITUDES -->
        <section class="alert-panel" style="display: flex; gap: 24px; padding: 0; background: transparent; border: none; box-shadow: none;">
            <div style="flex: 1; min-width: 300px; background: #fff5f5; border: 1px solid #fecaca; border-radius: 12px; padding: 24px;">
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
            </div>

            <div style="flex: 1; min-width: 300px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px;">
                <div class="alert-header" style="border-bottom: 2px solid #fcd34d; padding-bottom: 12px; margin-bottom: 0;">
                    <div class="alert-title-wrap">
                        <span class="material-symbols-outlined" style="color: #d97706;">notifications_active</span>
                        <h3 style="color: #92400e; margin: 0; font-size: 1.1rem; font-weight: 700;">Solicitudes Pendientes</h3>
                    </div>
                </div>
                <div id="home-solicitudes-list" class="alert-content" style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
                    <div class="alert-empty">
                        <div class="alert-empty-icon">
                            <span class="material-symbols-outlined" style="color:#d97706; font-size: 32px;">hourglass_empty</span>
                        </div>
                        <p style="color: #92400e;">Cargando solicitudes...</p>
                    </div>
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
    <div class="container new-design stats-page" style="padding-top: 0; position: relative; overflow: hidden; border-radius: 12px; background: #f8fafc; max-width: 1100px; margin: 0 auto;">
        <div id="stats-color-ribbon" style="height: 8px; width: 100%; position: absolute; top: 0; left: 0; background-color: #dce2f7;"></div>

        <div style="padding: 32px;">
            <header class="page-header" style="margin-bottom: 32px;">
                <div>
                    <h1 id="stats-header-name">Cargando datos...</h1>
                </div>
            </header>

            <section class="kpi-section" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;" id="student-kpi-grid">
                <!-- Loaded dynamically -->
            </section>


            <div id="instructor-chart-row" style="display: none; margin-top: 32px;">
                <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 24px;">
                        <h2 style="font-size: 1.25rem; color: #141b2b; margin: 0 0 4px 0;">Evolución del Score</h2>
                        <p class="subtitle" style="color: #434655; font-size: 0.9rem; margin: 0;">Histórico del semáforo del alumno</p>
                    </div>
                    <div id="chartSemaforoLine" style="width: 100%; height: 300px;"></div>
                </div>
            </div>

            <div class="charts-grid" id="main-charts-grid" style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px; margin-top: 32px;">
                <div id="metrics-column-wrapper" style="display: flex; flex-direction: column; gap: 24px;">
                    <div id="entrevista-pendiente-banner" style="display: none; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; border-left: 4px solid #3b82f6;">
                        <span style="font-size: 0.8rem; font-weight: 700; color: #1e293b;">ENTREVISTA PENDIENTE | DIA: 15/11/2024 10:00 | TUTOR: Prof. Roberto Sánchez</span>
                    </div>
                    <div class="metrics-list-panel card-panel" style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="margin-bottom: 24px;">
                            <h2 id="metric-list-title" style="font-size: 1.25rem; color: #141b2b; margin: 0 0 4px 0;"> </h2>
                            <p class="subtitle" id="metric-list-subtitle" style="color: #434655; font-size: 0.9rem; margin: 0;"> </p>
                        </div>
                        <div id="metrics-list-container" style="display: flex; flex-direction: column; gap: 20px;">
                            <!-- Loaded dynamically -->
                        </div>
                    </div>
                </div>

                <div class="chart-panel card-panel" id="right-panel-container" style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h2 id="chart-percepcion-title" style="font-size: 1.25rem; color: #141b2b; margin: 0 0 4px 0;"> </h2>
                            <p class="subtitle" id="chart-percepcion-subtitle" style="color: #434655; font-size: 0.9rem; margin: 0;"> </p>
                        </div>
                        <select id="encuesta-period-selector" style="display: none; padding: 6px 10px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc; cursor: pointer; font-weight: 500;">
                            <option value="2025 C1">2025 C1</option>
                            <option value="2024 C2">2024 C2</option>
                            <option value="2024 C1">2024 C1</option>
                        </select>
                    </div>
                    <div id="chartPercepcionLine" style="width: 100%; height: 350px;"></div>
                    <div id="encuestas-container" style="display: none; flex-direction: column; gap: 16px;">
                        <!-- Encuestas dinamicas -->
                    </div>
                </div>
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
        <div class="kpi_contadores_div">
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
            <div class="kpi-card-tutor" style="border-left: 4px solid #f59e0b; flex-grow: 1; flex-basis: 300px; display: flex; flex-direction: column; align-items: stretch; background: #fffbeb; padding: 16px;">
                <div class="kpi-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; border-bottom: 1px solid #fde68a; padding-bottom: 8px;">
                    <span class="material-symbols-outlined" style="color: #d97706;">notifications_active</span>
                    <h3 style="margin: 0; font-size: 1.1rem; color: #92400e; font-weight: 700;">Solicitudes / Notificaciones</h3>
                </div>
                <div id="admin-solicitudes-list" style="overflow-y: auto; max-height: 150px; flex-grow: 1; display: flex; flex-direction: column; gap: 8px; padding-right: 4px;">
                    <div style="font-size: 0.85rem; color: #d97706; padding: 4px; text-align: center;">Cargando...</div>
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

            <section class="table-section" style="margin-top: 16px; border: none; padding: 0;">
                <div class="table-header">
                    <h3>Seleccionar Alumnos</h3>
                    <div class="table-controls">
                        <div class="search-wrap">
                            <span class="material-symbols-outlined">search</span>
                            <input id="searchAlumnoAsignacion" type="search" placeholder="Buscar por DNI o nombre...">
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table id="asignacionStudentsTable">
                        <thead>
                            <tr>
                                <th style="width: 50px; text-align: center;">✓</th>
                                <th>DNI Alumno</th>
                                <th>Nombre y Apellido</th>
                                <th>Email</th>
                                <th>DNI Tutor</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody id="asignacionStudentsTbody">
                            <tr class="placeholder-row">
                                <td colspan="6">
                                    <div class="placeholder-content">
                                        <div class="placeholder-icon">
                                            <span class="material-symbols-outlined" style="font-size: 32px;">folder_open</span>
                                        </div>
                                        <p>Los alumnos sin tutor se cargarán aquí...</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- CONTROLES DE PAGINACIÓN -->
                <div class="pagination-controls" id="asignacionPaginationControls">
                    <button id="btnPrevPageAsignacion" class="btn-pagination" disabled>
                        <span class="material-symbols-outlined">chevron_left</span> Anterior
                    </button>
                    <span id="pageIndicatorAsignacion" class="page-indicator">Página 1 de 1</span>
                    <button id="btnNextPageAsignacion" class="btn-pagination" disabled>
                        Siguiente <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </section>

            <div class="selection-summary-t" style="text-align: right; margin-top: 16px;">
                <span id="selected-alumnos-count" style="font-weight: 600; color: #475569;">0 alumnos seleccionados</span>
            </div>
            <div class="asignacion-footer-t" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 12px;">
                <button id="btnCancelarAsignacion" class="btn-secondary-t">Cancelar</button>
                <button class="btn-primary-large-t"><span class="material-symbols-outlined">assignment_ind</span> Confirmar Asignación</button>
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
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 10px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">pentagon</span>
                        <div>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Distribución del PRE</h2>
                        <h5>Perfil de Riesgo Estructural</h5> 
                        </div>
                        <select id="selectDistribucionPRE" class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>  
                    
                    </div>
                    
                    
                </div>
                
                <div id="chartMeticasAgregadas" style="width: 100%; height: 250px;"></div>
            </div>
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">grid_view</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">PRE vs Puntaje</h2>
                    </div>
                    <select id="selectPerfilSemaforo" class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
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
                    <select id="selectFechaTechoSemaforo" class="period-selector" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #434655; background-color: #f8fafc;">
                        <option value="2027">2027</option>
                        <option value="2026" selected>2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
                <div id="chartEvolucionSemaforo" style="width: 100%; height: 250px;"></div>
            </div>
            <div class="chart-panel card-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="panel-header-flex" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="panel-header-t" style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined icon-blue" style="color: #434655;">compare_arrows</span>
                        <h2 style="font-size: 1.1rem; color: #141b2b; margin: 0;">Puntaje por Cohorte</h2>
                    </div>
                    <!-- Select removed because Score x Cohorte brings all cohorts at once -->
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

            <!-- CONFIGURACION COEFICIENTES INICIALES -->
            <div class="tool-panel card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">settings_accessibility</span>
                        <h2>Coeficientes Iniciales</h2>
                    </div>
                </div>
                <p style="color: #64748b; margin-bottom: 16px; font-size: 0.9rem;">
                    Ajuste los pesos relativos de los factores iniciales. La suma total debe ser exactamente 6.
                </p>
                <form id="formCoefIniciales" class="admin-form">
                    <div class="coeficientes-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label>Perfil Socioeconómico</label>
                            <input type="number" class="coef-input-iniciales" id="coefSocioeconomico" min="0" max="6" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Interrupción Carrera</label>
                            <input type="number" class="coef-input-iniciales" id="coefInterrupcion" min="0" max="6" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Perfil Educativo Padres</label>
                            <input type="number" class="coef-input-iniciales" id="coefEducacionPadres" min="0" max="6" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Carga Vital</label>
                            <input type="number" class="coef-input-iniciales" id="coefCargaVital" min="0" max="6" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Carga Laboral</label>
                            <input type="number" class="coef-input-iniciales" id="coefCargaLaboral" min="0" max="6" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Localización</label>
                            <input type="number" class="coef-input-iniciales" id="coefLocalizacion" min="0" max="6" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                    </div>
                    <div style="margin-top: 12px; font-weight: bold; color: #1e293b;" id="sumaInicialesDisplay">Suma Total: 6.00 / 6</div>
                    <div id="errorIniciales" style="color: #ef4444; font-size: 0.85rem; display: none;">La suma de los coeficientes debe ser igual a 6.</div>
                    <button type="submit" class="btn-primary-large-t" id="btnGuardarIniciales" style="margin-top: 16px; width: 100%;">
                        <span class="material-symbols-outlined">save</span> Guardar Iniciales
                    </button>
                    <div id="msgIniciales" class="msg-feedback hidden" style="margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
                </form>
            </div>

            <!-- CONFIGURACION COEFICIENTES CUATRIMESTRALES -->
            <div class="tool-panel card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">bar_chart</span>
                        <h2>Coeficientes Cuatrimestrales</h2>
                    </div>
                </div>
                <p style="color: #64748b; margin-bottom: 16px; font-size: 0.9rem;">
                    Ajuste los pesos del rendimiento cuatrimestral. La suma total debe ser exactamente 2.
                </p>
                <form id="formCoefCuatri" class="admin-form">
                    <div class="coeficientes-grid" style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="form-group">
                            <label>Rendimiento Académico Percibido</label>
                            <input type="number" class="coef-input-cuatri" id="coefRendPercibido" min="0" max="2" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Rendimiento Académico Cuantitativo</label>
                            <input type="number" class="coef-input-cuatri" id="coefRendCuantitativo" min="0" max="2" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                    </div>
                    <div style="margin-top: 12px; font-weight: bold; color: #1e293b;" id="sumaCuatriDisplay">Suma Total: 2.00 / 2</div>
                    <div id="errorCuatri" style="color: #ef4444; font-size: 0.85rem; display: none;">La suma de los coeficientes debe ser igual a 2.</div>
                    <button type="submit" class="btn-primary-large-t" id="btnGuardarCuatri" style="margin-top: 16px; width: 100%;">
                        <span class="material-symbols-outlined">save</span> Guardar Cuatrimestrales
                    </button>
                    <div id="msgCuatri" class="msg-feedback hidden" style="margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
                </form>
            </div>

            <!-- CONFIGURACION PESOS DE MATERIAS -->
            <div class="tool-panel card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">book</span>
                        <h2>Pesos de Materias</h2>
                    </div>
                </div>
                <p style="color: #64748b; margin-bottom: 16px; font-size: 0.9rem;">
                    Ajuste los pesos por materia. Grupo 1 debe sumar 3. Grupo 2 debe sumar 4.
                </p>
                <form id="formPesosMaterias" class="admin-form">
                    <h3 style="font-size: 1rem; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Grupo 1 (Suma = 3)</h3>
                    <div class="coeficientes-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label>Análisis Matemático 1</label>
                            <input type="number" class="coef-input-mat1" id="pesoMat1" min="0" max="3" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Álgebra 1-B</label>
                            <input type="number" class="coef-input-mat1" id="pesoAlg1b" min="0" max="3" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Fund. de la Química</label>
                            <input type="number" class="coef-input-mat1" id="pesoFundQuimica" min="0" max="3" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                    </div>
                    <div style="margin-bottom: 24px; font-weight: bold; color: #1e293b;" id="sumaMat1Display">Suma Grupo 1: 3.00 / 3</div>
                    <div id="errorMat1" style="color: #ef4444; font-size: 0.85rem; display: none; margin-top: -16px; margin-bottom: 24px;">La suma del Grupo 1 debe ser igual a 3.</div>

                    <h3 style="font-size: 1rem; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Grupo 2 (Suma = 4)</h3>
                    <div class="coeficientes-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div class="form-group">
                            <label>Análisis Matemático 2</label>
                            <input type="number" class="coef-input-mat2" id="pesoMat2" min="0" max="4" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Álgebra 2</label>
                            <input type="number" class="coef-input-mat2" id="pesoAlg2" min="0" max="4" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Fund. Programación</label>
                            <input type="number" class="coef-input-mat2" id="pesoFundProg" min="0" max="4" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                        <div class="form-group">
                            <label>Física A</label>
                            <input type="number" class="coef-input-mat2" id="pesoFisicaA" min="0" max="4" step="0.1" value="1.0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px;">
                        </div>
                    </div>
                    <div style="font-weight: bold; color: #1e293b;" id="sumaMat2Display">Suma Grupo 2: 4.00 / 4</div>
                    <div id="errorMat2" style="color: #ef4444; font-size: 0.85rem; display: none;">La suma del Grupo 2 debe ser igual a 4.</div>

                    <button type="submit" class="btn-primary-large-t" id="btnGuardarMaterias" style="margin-top: 16px; width: 100%;">
                        <span class="material-symbols-outlined">save</span> Guardar Pesos
                    </button>
                    <div id="msgMaterias" class="msg-feedback hidden" style="margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
                </form>
            </div>

            <!-- DESCARGAR BASE DE DATOS -->
            <div class="tool-panel card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">download</span>
                        <h2>Descarga de Base de Datos</h2>
                    </div>
                </div>
                <p style="color: #64748b; margin-bottom: 16px; font-size: 0.9rem;">
                    Exporte toda la base de datos actual en formato CSV para copias de seguridad o análisis externos.
                </p>
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 0;">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: #94a3b8; margin-bottom: 16px;">storage</span>
                    <button class="btn-primary-large-t" id="btnDescargarDB" style="width: 100%;">
                        <span class="material-symbols-outlined">cloud_download</span> Descargar CSV
                    </button>
                    <div id="msgDescargaDB" class="msg-feedback hidden" style="margin-top: 10px; padding: 10px; border-radius: 4px;"></div>
                </div>
            </div>
        </div>
    </div>
`;

export const VISTA_ENTREVISTA = `
    <div class="container new-design entrevista-page">
        <component-navbar></component-navbar>

        <header class="page-header" style="margin-bottom: 24px;">
            <h1>Entrevista</h1>
            <p class="subtitle">Registro y consulta del puntaje de entrevista de los alumnos.</p>
        </header>

        <div class="entrevista-grid">

            <div class="card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">assignment</span>
                        <h2>Registrar Entrevista</h2>
                    </div>
                </div>

                <form id="formRegistrarEntrevista" class="entrevista-form">
                    <div class="form-group">
                        <label for="entrevista-dni-alumno">DNI del Alumno</label>
                        <input type="text" id="entrevista-dni-alumno" placeholder="Ingrese el DNI del alumno" autocomplete="off">
                    </div>

                    <div id="entrevista-likert-container"></div>

                    <button type="submit" class="btn-primary-large-t" id = "btn_enviar" style="width: 100%; margin-top: 8px; justify-content: center;">
                        <span class="material-symbols-outlined">save</span> Guardar Entrevista
                    </button>
                </form>
            </div>

            <div class="card-panel">
                <div class="panel-header-flex">
                    <div class="panel-header-t">
                        <span class="material-symbols-outlined icon-blue">grade</span>
                        <h2>Puntaje de Entrevista</h2>
                    </div>
                </div>

                <div class="score-panel">

                    <div class="score-block">
                        <p class="score-block-title">
                            <span class="material-symbols-outlined">search</span>
                            Consultar Puntaje
                        </p>
                        <div style="margin-bottom: 12px;">
                            <label for="consulta-dni-alumno" style="display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">Ingrese DNI</label>
                            <input type="text" id="consulta-dni-alumno" placeholder="Ingrese el DNI del alumno" autocomplete="off" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; color: #334155; background: #ffffff; outline: none; font-family: 'Inter', sans-serif;">
                        </div>
                        <button id="btn-consultar-puntaje" class="btn-primary-small" style="width: 100%; justify-content: center;">
                            <span class="material-symbols-outlined">manage_search</span> Consultar
                        </button>
                        <div class="score-result-area" id="score-result-area">
                            <span class="score-result-label">Puntaje de entrevista:</span>
                            <span class="score-result-value placeholder" id="score-result-value">— Sin consultar —</span>
                        </div>
                    </div>

                    <div class="score-block">
                        <p class="score-block-title">
                            <span class="material-symbols-outlined">edit_note</span>
                            Actualizar Puntaje
                        </p>
                        <div style="margin-bottom: 12px;">
                            <label for="actualizar-dni-alumno" style="display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">Ingrese DNI</label>
                            <input type="text" id="actualizar-dni-alumno" placeholder="Ingrese el DNI del alumno" autocomplete="off" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; color: #334155; background: #ffffff; outline: none; font-family: 'Inter', sans-serif;">
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label for="actualizar-puntaje-input" style="display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">Nuevo Puntaje</label>
                            <input type="number" id="actualizar-puntaje-input" placeholder="Ej: 7.45" min="0" max="10" step="0.01" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; color: #334155; background: #ffffff; outline: none; font-family: 'Inter', sans-serif;">
                        </div>
                        <button id="btn-actualizar-puntaje" class="btn-primary-large-t" style="width: 100%; justify-content: center;">
                            <span class="material-symbols-outlined">update</span> Actualizar Puntaje
                        </button>
                    </div>

                </div>
            </div>

        </div>
    </div>
`;
