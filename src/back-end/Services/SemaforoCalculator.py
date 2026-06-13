from types import SimpleNamespace

import pandas as pd
from Controllers import AlumnoController, MateriasController
from Models import Semaforo

# ARCHIVO DE CALCULOS DE SEMAFORO DONDE SE ALMACENA LA LOGICA DE NEGOCIO
#
# 3 TIPOS DE CALCULOS
#
#   -CALCULO INICIAL PARA LA ENCUESTA INICIAL
#   -CALCULO DE SEMAFORO CON NOTAS PARA LOS ALUMNOS DE PRIMER AÑO
#   -CALCULO CUATRIMESTRAL DE ACTUALIZACION PARA LOS ALUMNOS DE SEGUNDO AÑO EN ADELANTE


def get_states_From_notas_from_df(df: pd.DataFrame, db):
    """
    Calcula los estados del semáforo a partir de notas recibidas como DataFrame en memoria.
    """
    resultados = []
    materias_db = MateriasController.get_materias(db)

    def get_color(score):
        if score <= 0.3:
            return "rojo"
        elif score <= 0.6:
            return "amarillo"
        else:
            return "verde"

    def get_coeficiente(id_materia, materias):
        return materias[id_materia - 1].coeficiente

    for dni, grupo in df.groupby("dni_alumno"):
        indicador = 0.0

        for id_materia, subgrupo in grupo.groupby("id_materia"):
            coeficiente = get_coeficiente(hash(id_materia), materias_db)
            nota = subgrupo["nota"].values[0]
            if (
                nota is not None
                and nota >= materias_db[hash(id_materia) - 1].notaMinima
            ):
                indicador += coeficiente
            else:
                indicador += 0

        score_final = indicador
        score_inicial = Semaforo.get_score_actual(str(dni), db)
        score_final = (
            ((score_final + score_inicial) / 2)
            if score_inicial is not None
            else score_final
        )
        resultados.append(
            {"color": get_color(score_final), "dni_alumno": dni, "score": score_final}
        )
    print(resultados)
    return resultados


# Mantener compatibilidad con path (DEPRECADO)
def get_states_From_notas(path: str, db):
    """DEPRECADO: Usar get_states_From_notas_from_df() con un DataFrame."""
    df = pd.read_csv(path)
    return get_states_From_notas_from_df(df, db)


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


def calculo_inicial_from_df(df: pd.DataFrame):
    """
    Procesa la Encuesta Inicial para calcular el Perfil de Riesgo Estructural (PRE).
    Trabaja directamente con un DataFrame en memoria.
    """
    resultados = []

    df_final = pd.DataFrame(
        columns=[
            "dni",
            "nombre",
            "apellido",
            "mail",
            "fecha_inicio",
            "plan_de_estudios",
            "materias_aprobadas",
            "pre",
        ]
    )

    df_final["pre"] = (
        df["PSE"] + df["IC"] + df["PEP"] + df["CL"] + df["CV"] + df["LOC"]
    ) / 6
    df_final["dni"] = df["dni"]
    df_final["nombre"] = df["nombre"]
    df_final["apellido"] = df["apellido"]
    df_final["mail"] = df["mail"]
    df_final["fecha_inicio"] = df["fecha_inicio"]
    df_final["plan_de_estudios"] = df["plan de estudios"]
    df_final["materias_aprobadas"] = df["materias_aprobadas"]
    diccionarios = df_final.to_dict(orient="records")
    resultados = []
    print(df_final.head(10))
    try:
        for i, registro_dict in enumerate(diccionarios, 1):
            registro_obj = SimpleNamespace(**registro_dict)
            resultados.append(registro_obj)
        print("lista final: ", resultados)
        return resultados
    except Exception as e:
        print(f"❌ Error al convertir CSV a objetos: {e}")
        return []


# Mantener compatibilidad con path (DEPRECADO)
def calculo_inicial(path_csv_resultados):
    """DEPRECADO: Usar calculo_inicial_from_df() con un DataFrame."""
    df = pd.read_csv(path_csv_resultados)
    return calculo_inicial_from_df(df)


def calculo_cuatrimestral_from_df(df: pd.DataFrame, db):
    """
    Calcula el semáforo cuatrimestral a partir de un DataFrame en memoria.
    """

    def get_color(score):
        if score <= 0.33:
            return "rojo"
        elif score <= 0.66:
            return "amarillo"
        else:
            return "verde"

    resultados = []

    for index, row in df.iterrows():
        dni = row["dni"]
        alumno = AlumnoController.Get_alumno_Bydni(str(dni), db)
        pre = alumno.pre

        rac = 0.4 * row["EA"] + 0.3 * row["R"] + 0.3 * row["PDE"]
        rap = (row["EL"] + row["DT"] + row["MOT"] + row["SEG"]) / 4

        raf = (rac + rap) / 2

        score = (raf + pre) / 2

        color = get_color(score)

        resultados.append(
            {
                "dni_alumno": dni,
                "color": color,
                "score": score,
            }
        )

    return resultados


# Mantener compatibilidad con path (DEPRECADO)
def calculo_cuatrimestral(path_csv_resultados, db):
    """DEPRECADO: Usar calculo_cuatrimestral_from_df() con un DataFrame."""
    df = pd.read_csv(path_csv_resultados)
    return calculo_cuatrimestral_from_df(df, db)
