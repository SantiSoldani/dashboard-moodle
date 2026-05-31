import os
from types import SimpleNamespace

import pandas as pd

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))


def Limpiar_csv(file_path: str, type: str) -> str:
    """
    Limpia un CSV de alumnos:
    1. Normaliza campos numéricos (elimina espacios, convierte a tipo numérico)
    2. Elimina duplicados por DNI (mantiene el primero)
    3. Guarda el resultado en procesed_data/alumnos_limpios.csv

    Args:
        file_path (str): Ruta del archivo CSV a limpiar

    Returns:
        str: Ruta del archivo limpio guardado
    """
    try:
        # Cargar CSV
        if type == "inicial":
            df = limpiar_encuesta_inicial(file_path)
        elif type == "cuatrimestral":
            df = limpiar_encuesta_cuatrimestral(file_path)
        else:
            df = pd.read_csv(file_path)

            # 1. Normalizar campos numéricos
            # numeric_columns = df.select_dtypes(include=["float64", "int64"]).columns

            # 2. Eliminar duplicados por DNI (mantener el primero)
            if "dni" in df.columns:
                df = df.drop_duplicates(subset=["dni"], keep="first")
            else:
                print("Columna 'DNI' no encontrada. No se eliminaron duplicados")

        # 3. Crear carpeta procesed_data si no existe
        back_end_path = os.path.dirname(ROOT_PATH)  # Sube una carpeta desde Services
        procesed_data_path = os.path.join(back_end_path, "procesed_data")

        os.makedirs(procesed_data_path, exist_ok=True)

        # 4. Guardar CSV limpio
        output_file = os.path.join(procesed_data_path, f"{type}_clean.csv")
        df.to_csv(output_file, index=False, encoding="utf-8")

        return output_file

    except Exception as e:
        print(f"❌ Error al limpiar CSV: {e}")
        return "null"


def To_object_list(procesed_path: str) -> list[SimpleNamespace]:
    """
    Convierte un CSV procesado en una lista de objetos (registros)
    Genérico para cualquier tipo de CSV: alumnos, notas, encuestas, etc.

    Proceso:
    1. Lee el CSV con pandas
    2. Convierte a diccionario (orient='records')
    3. Transforma cada diccionario en un objeto SimpleNamespace

    Args:
        procesed_path (str): Ruta del archivo CSV procesado

    Returns:
        list: Lista de objetos SimpleNamespace, uno por cada fila del CSV
              Cada objeto tiene atributos dinámicos según las columnas del CSV
    """
    try:
        # Paso 1: Leer CSV
        df = pd.read_csv(procesed_path)

        # Paso 2: Convertir a diccionarios (lista de dicts, uno por fila)
        diccionarios = df.to_dict(orient="records")

        # Paso 3: Convertir cada diccionario a objeto SimpleNamespace
        objetos = []
        for i, registro_dict in enumerate(diccionarios, 1):
            # SimpleNamespace convierte dict a objeto con atributos
            registro_obj = SimpleNamespace(**registro_dict)
            objetos.append(registro_obj)
        print("lista final: ", objetos)
        return objetos

    except Exception as e:
        print(f"❌ Error al convertir CSV a objetos: {e}")
        return []


# PROXIMA FUNCION --> FUNCION QUE PASE EL RESULTADO DE LAS ENCUESTAS SUBIDAS AL FORMATO ESPERADO POR LAS FUNCIONES DE CALCULO


def limpiar_encuesta_inicial(path: str) -> pd.DataFrame:

    df = pd.read_csv(path)
    df_final = pd.DataFrame(
        columns=[
            "dni",
            "soc",
            "interrupciones",
            "met",
            "trb_base",
            "cap_fam",
            "loc",
            "dependientes",
        ]
    )
    # (dni, soc, interrupciones, met, trb_base, cap_fam, loc, dependientes) campos finales
    df_final["dni"] = df["dni"]
    df_final["soc"] = df[df.columns.__contains__("soc")].mean()
    df_final["interrupciones"] = df[df.columns.__contains__("interrupciones")].mean()
    df_final["met"] = df[df.columns.__contains__("met")].mean()
    df_final["trb_base"] = df[df.columns.__contains__("trb_base")].mean()
    df_final["cap_fam"] = df[df.columns.__contains__("cap_fam")].mean()
    df_final["loc"] = df[df.columns.__contains__("loc")].mean()
    df_final["dependientes"] = df[df.columns.__contains__("dependientes")].mean()

    return df_final


def limpiar_encuesta_cuatrimestral(path: str) -> pd.DataFrame:

    # - dni, pre_score, trb_base_norm, anios_cursados, ma_c, apr_c, cur_c, fp_c, ca_c, trb_delta, disp_c, mot_c, conf_c, tf_score

    df = pd.read_csv(path)
    df_final = pd.DataFrame(
        columns=[
            "dni",
            "pre_score",
            "trb_base_norm",
            "anios_cursados",
            "ma_c",
            "apr_c",
            "cur_c",
            "fp_c",
            "ca_c",
            "trb_delta",
            "disp_c",
            "mot_c",
            "conf_c",
            "tf_score",
        ]
    )
    for alumno in df.iterrows():
        dni = alumno[1]["dni"]
        df_final["dni"] = dni
        for campo in df.columns:
            if campo != "dni":
                datos = df.filter(like=campo)
                df_final[campo] = datos.mean(axis=1)

    return df_final
