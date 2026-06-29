import io
from types import SimpleNamespace
from typing import BinaryIO, Union

import pandas as pd
from Controllers import AlumnoController, MateriasController
from fastapi.openapi.models import SchemaOrBool
from numpy._core import int64
from sqlalchemy.pool.base import reset_commit


def read_csv_from_file(file: Union[BinaryIO, io.BytesIO]) -> pd.DataFrame:
    """
    Lee un CSV desde un file-like object (BinaryIO).
    Rebobina el archivo al inicio antes de leer para asegurar lectura completa.

    Args:
        file: File-like object (ej: UploadFile.file, BytesIO)

    Returns:
        pd.DataFrame con los datos del CSV
    """
    file.seek(0)
    return pd.read_csv(file)


def Limpiar_csv(file: BinaryIO, type: str, db) -> pd.DataFrame:
    """
    Limpia un CSV recibido como file-like object en memoria:
    1. Lee el archivo directamente del objeto file sin guardarlo a disco
    2. Normaliza campos numéricos y elimina duplicados
    3. Devuelve un DataFrame limpio (sin guardar a disco)

    Args:
        file (BinaryIO): File-like object del CSV a limpiar
        type (str): Tipo de datos ('alumnos', 'notas', 'cuatrimestral', 'inicial')
        db: Sesión de base de datos

    Returns:
        pd.DataFrame: DataFrame limpio y procesado
    """
    try:
        if type == "inicial":
            df = limpiar_encuesta_inicial(file)
            print("sali")
        elif type == "cuatrimestral":
            df = limpiar_encuesta_cuatrimestral(file, db)
        elif type == "notas":
            df = limpiar_notas(file, db)
        else:
            df = read_csv_from_file(file)

            # Eliminar duplicados por DNI (mantener el primero)
            if "dni" in df.columns:
                df = df.drop_duplicates(subset=["dni"], keep="first")
            else:
                print("Columna 'DNI' no encontrada. No se eliminaron duplicados")

        return df

    except Exception as e:
        print(f"❌ Error al limpiar CSV: {e}")
        return pd.DataFrame()


def To_object_list_from_df(df: pd.DataFrame) -> list[SimpleNamespace]:
    """
    Convierte un DataFrame en una lista de objetos SimpleNamespace.
    Trabaja directamente con el DataFrame en memoria sin necesidad de leer desde disco.

    Args:
        df (pd.DataFrame): DataFrame con los datos a convertir

    Returns:
        list[SimpleNamespace]: Lista de objetos, uno por cada fila del DataFrame
    """
    try:
        diccionarios = df.to_dict(orient="records")

        objetos = []
        for i, registro_dict in enumerate(diccionarios, 1):
            registro_obj = SimpleNamespace(**registro_dict)
            objetos.append(registro_obj)
        # print("lista final: ", objetos)
        return objetos

    except Exception as e:
        print(f"❌ Error al convertir DataFrame a objetos: {e}")
        return []


# Mantener compatibilidad: To_object_list con path por si algún módulo lo usa
def To_object_list(procesed_path: str) -> list[SimpleNamespace]:
    """
    Convierte un CSV procesado en una lista de objetos (registros).
    DEPRECADO: Usar To_object_list_from_df() con un DataFrame en su lugar.

    Args:
        procesed_path (str): Ruta del archivo CSV procesado

    Returns:
        list[SimpleNamespace]: Lista de objetos SimpleNamespace
    """
    try:
        df = pd.read_csv(procesed_path)
        return To_object_list_from_df(df)
    except Exception as e:
        print(f"❌ Error al convertir CSV a objetos: {e}")
        return []


def limpiar_encuesta_inicial(file: BinaryIO) -> pd.DataFrame:
    """
    Limpia y normaliza una encuesta inicial desde un file-like object.
    """
    df = read_csv_from_file(file)
    df_final = pd.DataFrame(
        columns=[
            "dni",
            "nombre",
            "apellido",
            "mail",
            "fecha_inicio",
            "materias_aprobadas",
            "plan de estudios",
            "PSE",
            "IC",
            "PEP",
            "CL",
            "CV",
            "LOC",
        ]
    )
    print(df["Nombre"])
    df_final["nombre"] = df["Nombre"]
    df_final["apellido"] = df["Apellido"]
    df_final["dni"] = df["DNI"]
    df_final["mail"] = df["Direccion de mail"]
    df_final["fecha_inicio"] = df["Año que ingreso a la facultad"]
    df_final["materias_aprobadas"] = df[
        "¿Cuantas materias aprobadas tenes hasta ahora?"
    ]
    df_final["cuatrimestre"] = df[
        "¿En que cuatrimestre de la carrera te encontras actualmente? (1 - 10)"
    ]
    df_final["plan de estudios"] = df["Plan de estudio actual"]
    # df_final["carrera"] = df["Carrera"]
    # Definir grupos
    grupo_PSE = df.iloc[:, 8:12]
    grupo_IC = df.iloc[:, 12:15]
    grupo_PEP = df.iloc[:, 15:19]
    grupo_CL = df.iloc[:, 19:22]
    grupo_CV = df.iloc[:, 22:26]
    grupo_LOC = df.iloc[:, 26:29]

    grupos = {
        "PSE": grupo_PSE,
        "IC": grupo_IC,
        "PEP": grupo_PEP,
        "CL": grupo_CL,
        "CV": grupo_CV,
        "LOC": grupo_LOC,
    }

    # Procesar cada grupo
    for nombre_grupo, grupo in grupos.items():
        # Extraer número (ej: "1 - texto" → 1)
        # numeros = grupo.str.extract(r"(\d+)")[0].astype(int)
        numeros = grupo.astype(str).apply(
            lambda col: col.str.extract(r"(\d+)")[0].astype(int)
        )

        # Promedio POR FILA (cada estudiante)
        promedio_por_fila = numeros.mean(axis=1)

        # Normalizar: (dato - 1) / 4
        normalizado = (promedio_por_fila - 1) / 4
        print(
            f"promedio_por_fila: {promedio_por_fila.head()}",
            f"normalizado: {normalizado.head()}",
        )
        # Guardar en columna nueva
        df_final[nombre_grupo] = normalizado

    # Ver resultado
    """print(
        df_final[
            [
                "nombre",
                "PSE",
                "IC",
                "PEP",
                "CL",
                "CV",
                "LOC",
            ]
        ].head(10)
    )
    """
    print(df_final.head(10))
    return df_final


def limpiar_encuesta_cuatrimestral(file: BinaryIO, db) -> pd.DataFrame:
    """
    Limpia y normaliza una encuesta cuatrimestral desde un file-like object.
    """
    df = read_csv_from_file(file)
    df_final = pd.DataFrame(
        columns=[
            "dni",
            "EA",
            "R",
            "PDE",
            "EL",
            "DT",
            "MOT",
            "SEG",
            "MATERIAS_APROBADAS",
        ]
    )
    print("df ", df)
    df_final["dni"] = df["Ingrese su DNI"].astype(str)
    df_final["EA"] = (
        df["¿Cuantas de las materias que cursaste aprobaste su cursada?"]
        / df["¿Cuantas materias cursaste este cuatrimestre?"]
    )
    df_final["MATERIAS_APROBADAS"] = df[
        "¿Cuantas materias cursaste este cuatrimestre?"
    ]  # cantidad de materias aprobadas / cantidad de materias que deberia haber aprobado
    # para calcular la regularidad tengo que traerme todas las materias aprobadas de todos los alumnos
    alumnos = AlumnoController.Get_alumnos(db)
    for alumno in alumnos:
        rowdf = df[df["Ingrese su DNI"].astype(str) == alumno.dni]
        print("compruebpo la flag", rowdf.empty)
        if rowdf.empty:
            continue

        rowdf = rowdf.iloc[0]
        print(rowdf)
        mask = df_final["dni"].astype(str) == alumno.dni

        numerador = (
            int(rowdf["¿Cuantas de las materias que cursaste aprobaste su cursada?"])
            + alumno.materias_aprobadas
            - int(rowdf["¿Cuántos finales pendientes tenes?"])
        )
        print("numerador", numerador)
        denominador = (
            int(rowdf["¿Cuantas de las materias que cursaste aprobaste su cursada?"])
            + alumno.materias_aprobadas
        )

        print("denominador", denominador)
        if denominador != 0:
            df_final.loc[mask, "R"] = numerador / denominador
        else:
            df_final.loc[mask, "R"] = 0  # o np.nan si prefieres
        print("TEXTO PARA DARME CUENTA", df_final.loc[mask, "R"])

    df_final["PDE"] = (
        1
        - abs(
            df[
                "¿Cuantas materias adelantaste respecto del plan de estudios este cuatrimestre?"
            ]
            - df["¿Cuantas materias estas atrasado respecto del plan de estudios?"]
        )
    ) / 36
    print(df_final["EL"])
    df_final["EL"] = (
        df[
            "¿Como evaluas el impacto de tu situacion laboral actual sobre el rendimiento de este cuatrimestre?"
        ]
        .str.extract(r"(\d+)")
        .astype(int)
    )
    print(df_final["EL"])
    df_final["DT"] = (
        df[
            "¿Has dispuesto del tiempo semanal necesario fuera del horario de clases para dedicarle al estudio y las entregas este cuatrimestre?"
        ]
        .str.extract(r"(\d+)")
        .astype(int)
    )
    print(df_final["DT"])

    df_final["MOT"] = (
        df[
            "¿Como evaluas tu motivacion para continuar la carrera luego de este cuatrimestre?"
        ]
        .str.extract(r"(\d+)")
        .astype(int)
    )
    print(df_final["MOT"])

    df_final["SEG"] = (
        df[
            "¿Que tan seguro te sentías de poder aprobar las materias en las que te inscribiste?"
        ]
        .str.extract(r"(\d+)")
        .astype(int)
    )
    print(df_final["SEG"])

    return df_final


def limpiar_notas(file: BinaryIO, db) -> pd.DataFrame:
    """
    Limpia un CSV de notas desde un file-like object.
    """

    def nombreToid(nombre: str) -> int:
        for materia in materias:
            if materia.nombre == nombre:
                return materia.id
        return -1

    df = read_csv_from_file(file)
    materias = MateriasController.get_materias(db)

    df["id_materia"] = df["materia"].apply(nombreToid)
    return df
