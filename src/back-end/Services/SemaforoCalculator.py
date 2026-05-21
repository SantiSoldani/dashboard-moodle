import pandas as pd
from Models import Materia

# ARCHIVO DE CALCULOS DE SEMAFORO DONDE SE ALMACENA LA LOGICA DE NEGOCIO
#
# 3 TIPOS DE CALCULOS
#
#   -CALCULO INICIAL PARA LA ENCUESTA INICIAL
#   -CALCULO DE SEMAFORO CON NOTAS PARA LOS ALUMNOS DE PRIMER AÑO
#   -CALCULO CUATRIMESTRAL DE ACTUALIZACION PARA LOS ALUMNOS DE SEGUNDO AÑO EN ADELANTE


def get_states_From_notas(path: str, db):
    """
    Calcula los estados de los alumnos a partir de sus notas, basicamente con el promedio.
    se ingresar por cuatrimestre y hay que definir el peso que se le da a cada materia, tal vez en la tabla de materias podriamos meter un campo
    de coeficiente de relevancia que valga el peso de la materia en el calculo del semaforo

    flujo de calculo:
        1. Leer el archivo CSV con las notas
        2. la base de datos trae los coeficientes de relevancia de cada materia y calcula el promedio ponderado de las notas
        3. devuelve por alumno el promedio ponderado y su dni
    Args:
        path (str): Ruta del archivo CSV con las notas.

    Returns:
        lista de tuplas (promedio, dni) para insertar en la base de datos
    """
    df = pd.read_csv(path)
    materias = Materia.get_materias(
        db
    )  # tengo una lista de materias con sus coeficientes de relevancia
    resultados = []
    aux = materias.copy()
    materias = []
    for materia in aux:
        materias.append(materia) if materia.cuatrimestre == df["cuatrimestre"].values[0]
    for index, row in df.iterrows():
        dni = row["dni"]
        aprobacion = 0

        for materia in materias:
            aprobacion+=1*materia.coeficiente if row[materia.nombre] is not None and row[materia.nombre] >= materia.nota_minima else 0
        resultados.append((aprobacion, dni))

    return resultados


def get_states_From_encuestas(path: str, type: str):
    """
        Aca ya se complica un poco mas, se verifica si es una de las encuestas de inicio de segundo año o si es una de las encuestas cuatrimestrales
        para eso se usa el parametro Type, el cual sirve como flag a ver cual es el calculo que se tiene que hacer.

        Esta funcion, formulas y calculos, se va a decidir una vez tengamos pensadas las encuestas, las escalas que vamos a usar y los Indicadores relevantes
        para el calculo del semaforo, mas informacion en la seccion de documentacion donde se puede ver las posibles formulas y parametros usados



    Returns:
        lista de tuplas (estado, dni)
    """
    df = pd.read_csv(path)
    resultados = []

    return resultados


def calculo_inicial(path: str):
    return 0


def calculo_cuatrimestral(path: str):
    return 0
