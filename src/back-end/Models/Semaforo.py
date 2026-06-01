from sqlalchemy import text
from dataclasses import dataclass
from datetime import datetime, date


@dataclass
class semaforoDTO:
    dni_alumno: str
    color: str
    score: float
    created_at: datetime

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
            "created_at": datetime.now(),
        },
    )
    db.commit()