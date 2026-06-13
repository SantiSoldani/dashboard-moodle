from dataclasses import dataclass
from datetime import date, datetime

from sqlalchemy import text


@dataclass
class semaforoDTO:
    dni_alumno: str | None
    color: str | None
    score: float | None


def Post_Semaforo(semaforo: semaforoDTO, db):
    query = text(
        """INSERT INTO "Semaforo" (dni_alumno, color, score, created_at) VALUES (:dni_alumno, :color, :score, :created_at)"""
    )
    try:
        db.execute(
            query,
            {
                "dni_alumno": semaforo.dni_alumno,
                "color": semaforo.color,
                "score": semaforo.score,
                "created_at": str(datetime.now()),
            },
        )
        db.commit()
    except Exception as e:
        print(e)


def get_score_actual(dni: str, db):
    query = text(
        """SELECT score FROM "Semaforo" WHERE dni_alumno = :dni_alumno ORDER BY created_at DESC LIMIT 1"""
    )
    result = db.execute(query, {"dni_alumno": dni})
    return result.fetchone()
