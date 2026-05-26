from Controllers import AlumnoController, NotasController
from Services import Data_transformer, SemaforoCalculator


def Handle_alumnos(file_path: str, db):

    # 1) limpia los dato, eliminando duplicados, campos nulos, etc y los guarda en la seccion de procesed_data
    final_path = Data_transformer.Limpiar_csv(file_path, "alumnos")
    # 2)Una vez limpios los datos paso los datos a un arreglo objetos con los atributos del alumno
    Alumnos = Data_transformer.To_object_list(final_path)
    # 3)handleo los datos del alumno al modelo de alumnos para que los guarde en la base de datos
    try:
        AlumnoController.Post_alumnos(Alumnos, db)
    except Exception as e:
        print(e)


def Handle_encuesta_cuatrimestral(file_path: str, db):

    # 1) Limpia los datos de las encuestas pasandolos a un archivo normalizado cuantitativo de con resultados de las encuestas y los guarda en la seccion de procesed_data
    final_path = Data_transformer.Limpiar_csv(
        file_path, "encuestas"
    )  # en este caso la informacion se guarda en un csv con un formato listo para hacer calculos

    # 2)opcional: Una vez los datos estan limpios genero el arreglo de objetos tipo encuesta con los resultados de las encustas si es que decidimos persistirlas
    # Encuestas = Data_transformer.To_object_List(final_path)

    # 3)paso el data set de encuestas limpias y normalizadas al modulo de calculo de semaforos, devuelve tuplas de (estado_semaforo,dni_alumno)
    estado = SemaforoCalculator.calculo_cuatrimestral(final_path)
    # 4)paso las tuplas al modelo para que modifiquen el estado en la base de datos
    AlumnoController.Actualizar_estado(estado, db)


def Handle_notas(file_path: str, db):

    # 1) leo el archivo de notas crudas y los paso por la seccion de calculo de datos para limpiarlos y normalizarlos
    final_path = Data_transformer.Limpiar_csv(file_path, "notas")
    # 2) Una vez limpios los datos paso los datos a un arreglo objetos con los atributos de las notas y los paso al modelo de notas para que los persista
    notas = Data_transformer.To_object_list(final_path)
    NotasController.post_notas(db, notas)
    # 3) paso el data set de notas limpias y normalizadas al modulo de calculo de semaforo que me devuelve tuplas de (promedio,alumno)
    resultados = SemaforoCalculator.get_states_From_notas(final_path, db)
    # print(resultados)
    # 4) paso las tuplas al modelo de alumnos para que genere el estado del alumno dentro de la base de datos     AlumnosController.Actualizar_estado(update)
    AlumnoController.Actualizar_estado(resultados, db)
