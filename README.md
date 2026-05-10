# 🚦 Proyecto Travesía - Backend (API)

## 🚀 Guía de Inicio Rápido para el Equipo

### 🔗 Seguir estos pasos en terminal (la de vscode por ejemplo) para levantar el backend y el servidor.
1. git clone <URL_DEL_REPOSITORIO> 
2. python -m venv venv // Les debe aparecer en la terminal la palabra (venv) en verde, significa activo.
3. Si NO está activo venv:
      En Windows (PowerShell / VS Code Terminal):
      .\venv\Scripts\activate
4. pip install -r requirements.txt // Instalan todas las dependencias.
5. uvicorn main:app --reload // Levantan el servidor.

**Sistema de BI para la Retención de Estudiantes (SBIRE)** 

Este repositorio contiene el backend (API) del Proyecto Travesía, desarrollado para el seguimiento de trayectorias estudiantiles en el Departamento de Ingeniería Industrial de la FI-UNMdP . El objetivo principal es transformar datos fríos (notas) y percepciones subjetivas (encuestas) en acciones proactivas de tutoría para prevenir la deserción temprana y tardía .

## 🛠️ Stack Tecnológico
*   **Lenguaje:** Python (Elegido por su potencial en manipulación de datos).
*   **Framework API:** FastAPI (Rápido, moderno y con documentación interactiva automática).
*   **Base de Datos:** PostgreSQL.
*   **ORM:** SQLModel (Para interactuar con la base de datos a traves de python, sin sql).
*   **Procesamiento:** Pandas y OpenPyXL (Para leer archivos XLS y calcular métricas) .
*   **Gráficos:** Plotly (Para generar visualizaciones de Inteligencia de Negocios).

## ⚙️ Tareas Fundamentales del Backend
*   **Ingesta de Datos:** Centralizar la importación de datos académicos, como inscriptos, notas de parciales, ausentes y resultados de encuestas .
*   **Procesamiento Inteligente:** Procesar datos cuantitativos y cualitativos aplicando lógicas diferenciadas según el año de cursada del estudiante .
*   **Motor de Reglas (Semáforos):** Calcular el nivel de criticidad de cada estudiante y clasificarlo en un sistema de semáforos (Rojo, Amarillo, Verde) basado en sus porcentajes de aprobación .
*   **Gestión de Alertas:** Disparar estados de alerta si, por ejemplo, un estudiante omite completar encuestas obligatorias .

## 🔄 Interacción con Moodle y Flujo de Datos
1.  **Entrada (Input):** La API ingesta información extraída de las herramientas nativas de Moodle (como las encuestas) y permite la carga externa mediante archivos XLS de docentes, utilizando el DNI o Legajo como identificador clave .
2.  **Transformación:** El backend cruza todas estas fuentes de datos fragmentadas para armar el perfil de riesgo actualizado de cada estudiante .
3.  **Salida (Output):** Mediante librerías de visualización, el sistema exporta los tableros de control y semáforos en formato HTML .
4.  **Integración final:** Estos reportes gráficos se inyectan como *Iframes* dentro del Campus Virtual, permitiendo embeber contenidos personalizados según el rol del usuario (Dashboard Estudiante o Dashboard Docente) .

