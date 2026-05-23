import csv
from webbrowser import get

import pandas as pd
from Controllers import AlumnoController, MateriasController
from Models import Materia
from sqlalchemy.util.langhelpers import ro_memoized_property

# ARCHIVO DE CALCULOS DE SEMAFORO DONDE SE ALMACENA LA LOGICA DE NEGOCIO
#
# 3 TIPOS DE CALCULOS
#
#   -CALCULO INICIAL PARA LA ENCUESTA INICIAL
#   -CALCULO DE SEMAFORO CON NOTAS PARA LOS ALUMNOS DE PRIMER AÑO
#   -CALCULO CUATRIMESTRAL DE ACTUALIZACION PARA LOS ALUMNOS DE SEGUNDO AÑO EN ADELANTE


def get_states_From_notas(path: str, db):
    resultados = []
    materias_db = MateriasController.get_materias(db)
    # mapa_coeficientes = {m.id: m.coeficiente for m in materias_db}

    df = pd.read_csv(path)

    def get_color(score):
        if score < 0.2:
            return "rojo"
        elif score < 0.6:
            return "amarillo"
        else:
            return "verde"

    def get_coeficiente(id_materia, materias):
        return materias[id_materia - 1].coeficiente

    for dni, grupo in df.groupby("dni_alumno"):
        cursadas = 0
        indicador = 0.0
        # print("dni", dni)

        for id_materia, subgrupo in grupo.groupby("id_materia"):
            cursadas += 1
            # print("valor del hash", hash(id_materia))
            # id_materia es escalar en groupby, no array
            coeficiente = get_coeficiente(hash(id_materia), materias_db)
            # print("valor del coeficiente", coeficiente)

            notas = subgrupo["nota"].values
            nota_1 = notas[0] if len(notas) > 0 else None
            nota_2 = notas[1] if len(notas) > 1 else None
            # print("notas", nota_1, nota_2)
            # Ambas notas deben existir y ser >= 4 para considerar materia aprobada
            if (
                nota_1 is not None
                and nota_2 is not None
                and nota_1 >= materias_db[hash(id_materia) - 1].notaMinima
                and nota_2 >= materias_db[hash(id_materia) - 1].notaMinima
            ):
                indicador += coeficiente
            else:
                indicador += 0  # No suma al indicador si no aprobó
            # print("indicador", indicador)

        # print("indicador", indicador)
        score_final = indicador / cursadas if cursadas > 0 else 0
        score_inicial = AlumnoController.get_score(str(hash(dni)), db)
        # print(score_inicial)
        # print(type(score_inicial))
        score_final = (
            ((score_final + score_inicial) / 2)
            if score_inicial is not None
            else score_final
        )
        # print("color obtenido", score_final)
        resultados.append((get_color(score_final), dni, score_final))
    print(resultados)
    return resultados


# SECCION DE CALCULOS PARA LOS ALUMNOS A PARTIR DE 2DO AÑO
def obtener_color_semaforo(score):
    """Mapea el score final al color del semáforo institucional."""
    if score <= 0.25:
        return "Verde"
    elif score <= 0.50:
        return "Amarillo"
    elif score <= 0.75:
        return "Naranja"
    else:
        return "Rojo"


def calculo_inicial(path_csv_resultados):
    """
    Procesa la Encuesta Inicial para calcular el Perfil de Riesgo Estructural (PRE).

    Preguntas de encuesta asociadas:
    - ¿Cómo calificarías tu situación económica actual? [soc] -> Valores: 1 (Holgada) a 5 (Muy difícil) [cite: 62, 66]
    - ¿Tuviste alguna interrupción en la carrera? [interrupciones] -> Valores: 0 (No), 1 (1 vez), 2 (2 o más veces) [cite: 62, 67]
    - ¿Qué tan importante es para vos obtener el título? [met] -> Valores: 1 (Fundamental) a 5 (No prioritario) [cite: 62, 68]
    - ¿Trabajás actualmente? [trb_base] -> Valores: 0 (No), 1 (Part-time <20h), 2 (Part-time 20-35h), 3 (Full-time >35h) [cite: 62, 69]
    - ¿Tus padres o tutores completaron estudios universitarios? [cap_fam] -> Valores: 0 (Ambos), 1 (Uno), 2 (Ninguno) [cite: 62, 70]
    - ¿Vivís en Mar del Plata o en otra localidad? [loc] -> Valores: 0 (Reside en MDP), 1 (Viaja), 2 (Vive lejos) [cite: 71]
    - ¿Tenés personas a cargo? (hijos, familiares, etc.) [dependientes] -> Valores: 0 (No), 1 (Sí) [cite: 62, 71]

    Columnas esperadas en el CSV:
    - dni, soc, interrupciones, met, trb_base, cap_fam, loc, dependientes
    """
    resultados = []

    # Mapeos de normalización según documentación
    map_trb = {0: 0.0, 1: 0.2, 2: 0.6, 3: 1.0}
    map_cap = {0: 0.0, 1: 0.4, 2: 1.0}
    map_loc = {0: 0.0, 1: 0.5, 2: 1.0}

    with open(path_csv_resultados, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            dni = row["dni"]

            # Normalización continua
            soc_norm = (int(row["soc"]) - 1) / 4.0
            met_norm = (int(row["met"]) - 1) / 4.0

            # Normalización categórica/discreta
            interrupciones = int(row["interrupciones"])
            int_norm = (
                0.0 if interrupciones == 0 else (0.5 if interrupciones == 1 else 1.0)
            )

            trb_base_norm = map_trb[int(row["trb_base"])]
            cap_fam_norm = map_cap[int(row["cap_fam"])]
            loc_norm = map_loc[int(row["loc"])]
            dependientes_norm = 1.0 if int(row["dependientes"]) == 1 else 0.0

            # Ecuación PRE
            pre = (
                (0.25 * soc_norm)
                + (0.20 * int_norm)
                + (0.20 * met_norm)
                + (0.15 * trb_base_norm)
                + (0.10 * cap_fam_norm)
                + (0.05 * loc_norm)
                + (0.05 * dependientes_norm)
            )

            semaforo = obtener_color_semaforo(pre)
            resultados.append((dni, round(pre, 4), semaforo))

    return resultados


def calculo_cuatrimestral(path_csv_resultados):
    """
    Procesa la Encuesta Cuatrimestral y calcula el SCORE_FINAL dinámico.
    paso previo:
        -fetch años transcurridos desde el ingreso del alumno
        -fetch materias aprobadas totales historicas del alumno
    Preguntas de encuesta asociadas:
    - (Datos sacado de la tabla de alumnos) Años transcurridos desde el ingreso [anios_cursados] -> Valores: Numérico continuo (ej. 0.5, 3.0, 6.0) [cite: 104]
    - (Dato que se realiza en al pregunta inicial y se persiste en la tabla de alumnos) Materias aprobadas totales históricas [ma_c] -> Valores: Numérico entero (ej. 0 a 40) [cite: 103, 105]
    - ¿Cuántas materias aprobaste ESTE cuatrimestre (con final)? [apr_c] -> Valores: Numérico entero (≥ 0) [cite: 84, 87]
    - ¿Cuántas materias cursaste este cuatrimestre? [cur_c] -> Valores: Numérico entero (≥ 0) [cite: 84, 87]
    - ¿Cuántas materias tenés con final pendiente (cursada aprobada)? [fp_c] -> Valores: Numérico entero (≥ 0) [cite: 111]
    - ¿Cuántas materias estás cursando activamente ahora? [ca_c] -> Valores: Numérico entero (≥ 0) [cite: 111]
    - ¿Cambió tu situación laboral respecto al cuatrimestre anterior? [trb_delta] -> Valores: 0.0 (Igual), +0.2 (Más horas), -0.2 (Menos horas), +0.3 (Empezó a trabajar), -0.3 (Dejó de trabajar) [cite: 93]
    - ¿Cómo calificarías tu disponibilidad de tiempo para el cursado? [disp_c] -> Valores: Escala 1 (Mucha/Holgada) a 5 (Escasa/Nula) [cite: 96, 169]
    - "Este cuatrimestre avancé como esperaba" [mot_c] -> Valores: Escala Likert 1 (Totalmente) a 5 (Nada) [cite: 96, 170]
    - "Siento que estoy en riesgo de demorarme en terminar" [conf_c] -> Valores: Escala Likert 1 (Nada de riesgo) a 5 (Riesgo total/Incierta) [cite: 96, 171]
    - ¿En qué etapa está tu Trabajo Final? [tf_score] -> Valores: 0.0 (Graduado/Sin pendientes), 0.1 (Tema aprobado y en escritura), 0.5 (Tema asignado sin iniciar), 0.7 (Sin tema, próximo a iniciar), 1.0 (Sin definición ni planificación) [cite: 126, 127, 128, 129, 130, 131]

    Columnas esperadas en el CSV:
    - dni, pre_score, trb_base_norm, anios_cursados, ma_c, apr_c, cur_c, fp_c, ca_c, trb_delta, disp_c, mot_c, conf_c, tf_score
    """
    resultados = []

    TOTAL_PLAN = 40.0
    DURACION_TEORICA = 5.0

    with open(path_csv_resultados, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            dni = row["dni"]
            pre = float(row["pre_score"])

            # --- 1. Sub-índice de Avance Cuatrimestral (SAC) ---
            apr_c = float(row["apr_c"])
            cur_c = max(float(row["cur_c"]), 1.0)
            eficiencia_c = apr_c / cur_c
            sac = 1.0 - eficiencia_c

            # --- 2. Sub-índice de Contexto Cuatrimestral (SCC) ---
            trb_c_ajustado = max(
                0.0, min(1.0, float(row["trb_base_norm"]) + float(row["trb_delta"]))
            )
            disp_c_norm = (float(row["disp_c"]) - 1) / 4.0
            mot_c_norm = (float(row["mot_c"]) - 1) / 4.0
            conf_c_norm = (float(row["conf_c"]) - 1) / 4.0

            scc = (
                (0.35 * disp_c_norm)
                + (0.30 * trb_c_ajustado)
                + (0.20 * mot_c_norm)
                + (0.15 * conf_c_norm)
            )

            # --- 3. Desvío de Progreso Normalizado (DP_norm) ---
            ma_c = float(row["ma_c"])
            anios_cursados = float(row["anios_cursados"])

            pn_real_c = ma_c / TOTAL_PLAN
            pn_esperado_c = min(anios_cursados / DURACION_TEORICA, 1.0)
            dp_c = pn_real_c - pn_esperado_c
            dp_norm_c = min(max(-dp_c, 0.0), 0.40) / 0.40

            # --- 4. Índice de Bloqueo Académico (IBA) ---
            fp_c = float(row["fp_c"])
            ca_c = float(row["ca_c"])
            s8_c = ca_c + fp_c
            iba_c = (0.50 * (fp_c / 8.0)) + (0.50 * (s8_c / 8.0))

            # --- 5. Índice de Riesgo de Ralentización (IRR) ---
            irr_c = (
                (0.35 * dp_norm_c)
                + (0.25 * iba_c)
                + (0.20 * scc)
                + (0.10 * sac)
                + (0.10 * pre)
            )

            # --- 6. Función de Decisión Final ---
            condicion_tramo_avanzado = (pn_real_c > 0.50) or (anios_cursados >= 4.0)

            if condicion_tramo_avanzado:
                tf_score_c = float(row["tf_score"])
                irdt_c = (
                    (0.30 * tf_score_c)
                    + (0.20 * iba_c)
                    + (0.20 * scc)
                    + (0.15 * dp_norm_c)
                    + (0.10 * mot_c_norm)
                    + (0.05 * pre)
                )

                score_final = (0.65 * irdt_c) + (0.35 * irr_c)
            else:
                score_final = irr_c

            semaforo = obtener_color_semaforo(score_final)
            resultados.append((dni, round(score_final, 4), semaforo))

    return resultados
