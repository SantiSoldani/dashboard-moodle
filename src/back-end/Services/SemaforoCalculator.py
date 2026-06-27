from types import SimpleNamespace

import numpy as np
import pandas as pd
from Controllers import AlumnoController, IndicadoresController, MateriasController
from Models import Indicadores, Semaforo

# from numpy._core import astype, float128

# Habia una incompatibilidad en el import entre Windows y Linux. Esto lo soluciona
try:
    # Intenta importar como lo hizo tu compañero (funciona en su Linux)
    from numpy._core import astype, float128
except ImportError:
    # Si falla (como en tu Windows), hace el fallback
    from numpy._core import astype

    float128 = np.float64  # Usamos la máxima precisión disponible en Windows


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
        cursadas = 0
        for id_materia, subgrupo in grupo.groupby("id_materia"):
            coeficiente = get_coeficiente(hash(id_materia), materias_db)
            cursadas += 1
            nota = subgrupo["nota"].values[0]
            if (
                nota is not None
                and nota >= materias_db[hash(id_materia) - 1].notaMinima
            ):
                indicador += coeficiente
            else:
                indicador += 0

        score_final = indicador / cursadas
        score_inicial = Semaforo.get_score_actual(str(dni), db)
        score_final = (
            ((score_final + score_inicial) / 2)
            if score_inicial is not None
            else score_final
        )
        resultados.append(
            {"color": get_color(score_final), "dni_alumno": dni, "score": score_final}
        )
    return resultados


# Mantener compatibilidad con path (DEPRECADO)
def get_states_From_notas(path: str, db):
    """DEPRECADO: Usar get_states_From_notas_from_df() con un DataFrame."""
    df = pd.read_csv(path)
    return get_states_From_notas_from_df(df, db)


def calculo_inicial_from_df(df: pd.DataFrame, db):
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
    pesos = Indicadores.get_pesos_iniciales(db)
    if pesos is not None:
        df_final["pre"] = (
            pesos.pse * df["PSE"]
            + pesos.ic * df["IC"]
            + pesos.pep * df["PEP"]
            + pesos.cl * df["CL"]
            + pesos.cv * df["CV"]
            + pesos.loc * df["LOC"]
        ) / 6
    else:
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
# def calculo_inicial(path_csv_resultados):
#    """DEPRECADO: Usar calculo_inicial_from_df() con un DataFrame."""
#    df = pd.read_csv(path_csv_resultados)
#    return calculo_inicial_from_df(df)


def calculo_cuatrimestral_from_df(df: pd.DataFrame, db):
    """
    Calcula el semáforo cuatrimestral a partir de un DataFrame en memoria.
    """

    def get_color(score):
        if score <= 0.33:
            return "verde"
        elif score <= 0.66:
            return "amarillo"
        else:
            return "rojo"

    resultados = []
    print(df)
    print(df.columns)
    columnas_numericas = ["EA", "R", "PDE", "EL", "DT", "MOT", "SEG"]
    for col in columnas_numericas:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["RAC"] = 0.4 * df["EA"] + 0.3 * df["R"] + 0.3 * df["PDE"]
    df["RAP"] = (
        (df["EL"] - 1) / 4
        + (df["DT"] - 1) / 4
        + (df["MOT"] - 1) / 4
        + (df["SEG"] - 1) / 4
    ) / 4
    pesos = Indicadores.get_pesos_cuatrimestrales(db)
    if pesos is None:
        df["RAF"] = (df["RAC"] + df["RAP"]) / 2
    else:
        df["RAF"] = (pesos.rac * df["RAC"] + pesos.raf * df["RAP"]) / 2
    # Luego iterar solo para obtener datos del alumno
    resultados = []
    indicadores_persistibles = []
    for index, row in df.iterrows():
        try:
            dni = row["dni"]
            alumno = AlumnoController.Get_alumno_Bydni(str(dni), db)
            cantidad_acumulada = MateriasController.get_cant_materias_acumulada(
                db, alumno.cuatrimestre, alumno.plan_de_estudios
            )
            pre = float(alumno.pre) if alumno.pre else 0
            ac = (
                row["MATERIAS_APROBADAS"] + alumno.materias_aprobadas
            ) / cantidad_acumulada
            score = (row["RAF"] + pre) / 2
            objeto = {
                "dni": dni,
                "rac": row["RAC"],
                "rap": row["RAP"],
                "raf": row["RAF"],
                "ac": ac,
            }
            if pd.isna(score):
                continue

            color = get_color(score)
            resultados.append(
                {
                    "dni_alumno": dni,
                    "color": color,
                    "score": float(score),
                }
            )
            indicadores_persistibles.append(SimpleNamespace(**objeto))
        except Exception as e:
            print(f"❌ Error en DNI {row['dni']}: {e}")
            continue
    IndicadoresController.post_indicadores_cuatrimestrales(db, indicadores_persistibles)
    return resultados


# Mantener compatibilidad con path (DEPRECADO)
def calculo_cuatrimestral(path_csv_resultados, db):
    """DEPRECADO: Usar calculo_cuatrimestral_from_df() con un DataFrame."""
    df = pd.read_csv(path_csv_resultados)
    return calculo_cuatrimestral_from_df(df, db)
