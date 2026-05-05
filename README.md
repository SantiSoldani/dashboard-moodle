# 🚦 Proyecto Travesía - Backend (API)

**Sistema de BI para la Retención de Estudiantes (SBIRE)**[cite: 1]

Este repositorio contiene el backend (API) del Proyecto Travesía, desarrollado para el seguimiento de trayectorias estudiantiles en el Departamento de Ingeniería Industrial de la FI-UNMdP[cite: 1]. El objetivo principal es transformar datos fríos (notas) y percepciones subjetivas (encuestas) en acciones proactivas de tutoría para prevenir la deserción temprana y tardía[cite: 1].

## 🛠️ Stack Tecnológico
*   **Lenguaje:** Python (Elegido por su potencial en manipulación de datos).
*   **Framework API:** FastAPI (Rápido, moderno y con documentación interactiva automática).
*   **Base de Datos:** PostgreSQL.
*   **ORM:** SQLModel (Para interactuar con la base de datos de forma segura e intuitiva).
*   **Procesamiento:** Pandas y OpenPyXL (Para leer archivos XLS y calcular métricas)[cite: 1].
*   **Gráficos:** Plotly (Para generar visualizaciones de Inteligencia de Negocios).

## ⚙️ Tareas Fundamentales del Backend
*   **Ingesta de Datos:** Centralizar la importación de datos académicos, como inscriptos, notas de parciales, ausentes y resultados de encuestas[cite: 1].
*   **Procesamiento Inteligente:** Procesar datos cuantitativos y cualitativos aplicando lógicas diferenciadas según el año de cursada del estudiante[cite: 1].
*   **Motor de Reglas (Semáforos):** Calcular el nivel de criticidad de cada estudiante y clasificarlo en un sistema de semáforos (Rojo, Amarillo, Verde) basado en sus porcentajes de aprobación[cite: 1].
*   **Gestión de Alertas:** Disparar estados de alerta si, por ejemplo, un estudiante omite completar encuestas obligatorias[cite: 1].

## 🔄 Interacción con Moodle y Flujo de Datos
1.  **Entrada (Input):** La API ingesta información extraída de las herramientas nativas de Moodle (como las encuestas) y permite la carga externa mediante archivos XLS de docentes, utilizando el DNI o Legajo como identificador clave[cite: 1].
2.  **Transformación:** El backend cruza todas estas fuentes de datos fragmentadas para armar el perfil de riesgo actualizado de cada estudiante[cite: 1].
3.  **Salida (Output):** Mediante librerías de visualización, el sistema exporta los tableros de control y semáforos en formato HTML[cite: 1].
4.  **Integración final:** Estos reportes gráficos se inyectan como *Iframes* dentro del Campus Virtual, permitiendo embeber contenidos personalizados según el rol del usuario (Dashboard Estudiante o Dashboard Docente)[cite: 1].
