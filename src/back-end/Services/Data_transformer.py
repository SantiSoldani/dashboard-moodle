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

        return objetos

    except Exception as e:
        print(f"❌ Error al convertir CSV a objetos: {e}")
        return []
