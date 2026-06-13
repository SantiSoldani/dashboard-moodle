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
        "INSERT INTO encuestas (dni_alumno, pregunta, respuesta) VALUES (:dni_alumno, :pregunta, :respuesta)"
    )
    for encuesta in encuestas:
        db.execute(
            query,
            {
                "dni_alumno": encuesta.dni_alumno,
                "pregunta": encuesta.pregunta,
                "respuesta": encuesta.respuesta,
            },
        )
    db.commit()
