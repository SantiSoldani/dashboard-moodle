from types import SimpleNamespace

from Models import Encuestas
from sqlalchemy.pool.base import reset_commit


def Handle_respuestas(respuestas_list: list[SimpleNamespace], db):

    resultados = []
    CAMPOS_EXCLUIR = {"Respuesta número", "ingrese su DNI"}

    for respuesta_obj in respuestas_list:
        datos = respuesta_obj.__dict__
        dni = datos["ingrese su DNI"]

        for campo, valor in datos.items():
            print(campo, " ", valor)
            if campo not in CAMPOS_EXCLUIR:
                resultados.append(
                    Encuestas.encuestasDTO(
                        dni_alumno=dni, pregunta=campo, respuesta=valor
                    )
                )

    print(resultados)
    Encuestas.Handle_respuestas(resultados, db)
    db.commit()
