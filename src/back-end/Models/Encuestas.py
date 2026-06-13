from dataclasses import dataclass
from datetime import date, datetime

from sqlalchemy import text


@dataclass
class encuestasDTO:
    dni_alumno: str
    pregunta: str
    respuesta: str


def Handle_respuestas(encuestas: list, db):

    query = text(
        """INSERT INTO "Respuestas" (dni_alumno, pregunta, respuesta) VALUES (:dni_alumno, :pregunta, :respuesta)"""
    )
    try:
        for encuesta in encuestas:
            print(encuesta)
            db.execute(
                query,
                {
                    "dni_alumno": encuesta.dni_alumno,
                    "pregunta": encuesta.pregunta,
                    "respuesta": encuesta.respuesta,
                },
            )
    except Exception as e:
        db.rollback()
        print(e)
