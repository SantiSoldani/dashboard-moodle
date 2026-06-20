from dataclasses import dataclass
from datetime import date, datetime
from types import SimpleNamespace

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


def get_encuesta(db, dni: str) -> list[SimpleNamespace]:

    query = text("""SELECT *
                FROM "Respuestas"
                WHERE dni_alumno = :dni
                AND created_at = (
                    SELECT MAX(created_at)
                    FROM "Respuestas"
                    WHERE dni_alumno= :dni
                )
                """)
    try:
        rows = (
            db.execute(
                query,
                {"dni": dni},
            )
            .mappings()
            .all()
        )
        encuestas = [SimpleNamespace(**row) for row in rows]
        return encuestas
    except Exception as e:
        print(e)
        return []
