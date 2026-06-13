from dataclasses import dataclass
from datetime import date, datetime

from sqlalchemy import text


@dataclass
class semaforoDTO:
    dni_alumno: str
    color: str
    score: float
<<<<<<< HEAD

=======
    created_at: str
>>>>>>> fb2d52edf94134dd126ae34c17a9cd699003391a

def Post_Semaforo(semaforo: semaforoDTO, db):
    query = text(
        """INSERT INTO "Semaforo" (dni_alumno, color, score, created_at) VALUES (:dni_alumno, :color, :score, :created_at)"""
    )
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


def get_score_actual(dni: str, db):
    query = text(
        """SELECT score FROM "Semaforo" WHERE dni_alumno = :dni_alumno ORDER BY created_at DESC LIMIT 1"""
    )
    result = db.execute(query, {"dni_alumno": dni})
    return result.fetchone()
