from dataclasses import dataclass
from datetime import date, datetime
from types import SimpleNamespace

from sqlalchemy import text
from sqlalchemy.orm.strategies import query


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


def get_color_actual(dni: str, db):
    query = text(
        """SELECT color FROM "Semaforo" WHERE dni_alumno = :dni_alumno ORDER BY created_at DESC LIMIT 1"""
    )
    result = db.execute(query, {"dni_alumno": dni})
    return result.fetchone()


def get_evolucion(db, valor, piso, techo):

    fecha_piso = datetime.strptime(piso, "%d-%m-%Y")
    fecha_techo = datetime.strptime(techo, "%d-%m-%Y")

    try:
        query = text("""
            SELECT
                fecha,
                color,
                COUNT(*) AS cantidad
            FROM (
                SELECT DISTINCT ON (s.dni_alumno, DATE(s.created_at))
                    s.dni_alumno,
                    DATE(s.created_at) AS fecha,
                    s.color
                FROM "Semaforo" s
                JOIN "Alumnos" a
                    ON a.dni = s.dni_alumno
                WHERE a.fecha_inicio = :valor
                  AND s.created_at BETWEEN :fecha_piso AND :fecha_techo
                ORDER BY s.dni_alumno, DATE(s.created_at), s.created_at DESC
            ) t
            GROUP BY fecha, color
            ORDER BY fecha, color;

                    """)
        rows = (
            db.execute(
                query,
                {
                    "valor": valor,
                    "fecha_piso": fecha_piso,
                    "fecha_techo": fecha_techo,
                },
            )
            .mappings()
            .all()
        )
        return [SimpleNamespace(**row) for row in rows]
    except Exception as e:
        print(e)
        return []


def get_criticos(db, tutor_dni=None):
    if tutor_dni:
        query = text(
            """
            SELECT s.dni_alumno, s.color, s.score FROM (
                SELECT dni_alumno, color, score, ROW_NUMBER() OVER(PARTITION BY dni_alumno ORDER BY created_at DESC) as rn
                FROM "Semaforo"
            ) AS s
            INNER JOIN "Tutor-Alumno" ta ON s.dni_alumno = ta.dni_alumno
            WHERE s.rn = 1 AND s.color = 'rojo' AND ta.dni_tutor = :tutor_dni
            """
        )
        rows = db.execute(query, {"tutor_dni": tutor_dni}).mappings().all()
    else:
        query = text(
            """
            SELECT dni_alumno, color, score FROM (
                SELECT dni_alumno, color, score, ROW_NUMBER() OVER(PARTITION BY dni_alumno ORDER BY created_at DESC) as rn
                FROM "Semaforo"
            ) AS subquery
            WHERE rn = 1 AND color = 'rojo'
            """
        )
        rows = db.execute(query).mappings().all()
    return [semaforoDTO(**row) for row in rows]
