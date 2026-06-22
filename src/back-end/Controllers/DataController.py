from io import IOBase
from typing import BinaryIO

import pandas as pd
from Controllers import (
    AlumnoController,
    EncuestaController,
    IndicadoresController,
    NotasController,
)
from Models import Encuestas, Semaforo
from Models.Indicadores import IndicadorDTO
from pandas.core.strings.accessor import AlignJoin
from Services import Data_transformer, SemaforoCalculator


def Handle_alumnos(file: BinaryIO, db):
    """
    Procesa un archivo CSV de alumnos directamente desde un file-like object en memoria.
    """
    # 1) Limpia los datos: elimina duplicados, campos nulos, etc.
    #    Devuelve un DataFrame limpio en lugar de un path
    df_clean = Data_transformer.Limpiar_csv(file, "alumnos", db)

    # 2) Convierte el DataFrame limpio a una lista de objetos
    Alumnos = Data_transformer.To_object_list_from_df(df_clean)

    # 3) Persiste los alumnos en la base de datos
    try:
        AlumnoController.Post_alumnos(Alumnos, db)
    except Exception as e:
        print(e)


def Handle_encuesta_cuatrimestral(file: BinaryIO, db):
    """
    Procesa un archivo CSV de encuestas cuatrimestrales desde un file-like object en memoria.
    """
    # 1) Limpia y normaliza los datos de la encuesta. Devuelve un DataFrame limpio.
    df_clean = Data_transformer.Limpiar_csv(file, "cuatrimestral", db)
    file.seek(0)
    # 2) Para las respuestas, necesitamos los datos originales del archivo.
    #    Rebobinamos el file y leemos de nuevo para obtener los objetos de respuesta.
    #
    #   # 3) Calcula el estado del semáforo desde el DataFrame limpio
    resultados = SemaforoCalculator.calculo_cuatrimestral_from_df(df_clean, db)

    # print(resultados)
    # 4) Persiste los estados del semáforo
    for estado in resultados:
        Semaforo.Post_Semaforo(
            Semaforo.semaforoDTO(
                dni_alumno=estado["dni_alumno"],
                color=estado["color"],
                score=estado["score"],
            ),
            db,
        )

    respuestas = Data_transformer.To_object_list_from_df(pd.read_csv(file))
    EncuestaController.Handle_respuestas(respuestas, db)
    AlumnoController.actualizar_Cuatrimestre(db)


def Handle_notas(file: BinaryIO, db):
    """
    Procesa un archivo CSV de notas desde un file-like object en memoria.
    """
    # 1) Limpia y normaliza las notas. Devuelve un DataFrame limpio.
    df_clean = Data_transformer.Limpiar_csv(file, "notas", db)

    # 2) Convierte el DataFrame limpio a lista de objetos y persiste
    notas = Data_transformer.To_object_list_from_df(df_clean)
    NotasController.post_notas(db, notas)

    # 3) Calcula el estado del semáforo desde el DataFrame limpio
    resultados = SemaforoCalculator.get_states_From_notas_from_df(df_clean, db)
    for estado in resultados:
        Semaforo.Post_Semaforo(Semaforo.semaforoDTO(**estado), db)


def Handle_encuesta_inicial(file: BinaryIO, db):
    """
    Procesa un archivo CSV de encuesta inicial desde un file-like object en memoria.
    """
    # 1) Limpia la encuesta y la transforma a indicadores cuantitativos
    df_clean = Data_transformer.Limpiar_csv(file, "inicial", db)

    # 2) Calcula el PRE y devuelve los resultados como lista de objetos
    # resultados = SemaforoCalculator.calculo_inicial_from_df(df_clean)
    indicadores = Data_transformer.To_object_list_from_df(df_clean)
    persistibles = []
    for objeto in indicadores:
        persistibles.append(
            IndicadorDTO(
                dni=objeto.dni,
                ic=objeto.IC,
                pse=objeto.PSE,
                pep=objeto.PEP,
                cl=objeto.CL,
                cv=objeto.CV,
                loc=objeto.LOC,
            )
        )
    # 3) Persiste cada alumno con su PRE calculado
    # for resultado in resultados:
    #   AlumnoController.Post_alumnos_FromEncuesta(
    #      resultado,
    #    db,
    # )
    IndicadoresController.post_Indicadores(persistibles, db)
