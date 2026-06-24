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


def get_evolucion(db, filtro, valor, piso, techo):
    COLUMNAS_PERMITIDAS = [
        "plan_de_estudios",
        "materias_aprobadas",
        "cuatrimestre",
        "fecha_inicio",
    ]

    if filtro != -1 and filtro not in COLUMNAS_PERMITIDAS:
        raise ValueError("no existe la columna a la que se quiere acceder")
    if piso != -1 and techo != -1:
        fecha_piso = datetime.strptime(piso, "%d-%m-%Y")
        fecha_techo = datetime.strptime(techo, "%d-%m-%Y")
    else:
        fecha_piso = None
        fecha_techo = None

    filtro_clause = f"a.{filtro}" if filtro != -1 else "NULL"
    group_by_clause = f"a.{filtro}, s.created_at" if filtro != -1 else "s.created_at"

    try:
        query = text(f"""
            SELECT
                AVG(s.score) AS "score promedio",
                s.created_at AS "fecha",
                {filtro_clause} AS "filtro"
            FROM "Semaforo" s
            JOIN "Alumnos" a ON a.dni = s.dni_alumno
            WHERE (:valor = -1 OR a.{filtro} = :valor)
            AND (:fecha_piso IS NULL OR :fecha_techo IS NULL OR s.created_at BETWEEN :fecha_piso AND :fecha_techo)
            GROUP BY {group_by_clause}
            ORDER BY s.created_at
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

def get_criticos(db):
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