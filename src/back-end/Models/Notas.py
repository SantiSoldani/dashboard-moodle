from dataclasses import dataclass

from Models.Alumno import AlumnoDto
from Models.Materia import MateriaDto
from sqlalchemy import text


@dataclass
class NotasDto:
    id: int
    dni_alumno: str
    id_materia: int
    nota: int


def post_notas(notas, db):
    notas = list(notas) # ''CASTEA'' a List
    query = text(
        """INSERT INTO "Examen" (dni_alumno, id_materia, nota) VALUES  (:dni_alumno, :id_materia, :nota)"""
    )
    db.execute(
        query,
        [
            {
                "dni_alumno": nota.dni_alumno,
                "id_materia": nota.id_materia,
                "nota": nota.nota,
            }
            for nota in notas
        ],
    )
    return db.commit()

def get_notas(db):
    query = """SELECT * FROM "Examen" """
    rows = db.execute(query).mappings().fetchall()
    return [NotasDto(**row) for row in rows]


def get_nota_by_dni(dni: str, db):
    query = """SELECT * FROM "Examen" WHERE dni_alumno = :dni"""
    rows = db.execute(query, {"dni_alumno": dni}).mappings().fetchone()
    return [NotasDto(**row) for row in rows]

def get_promedio_general(db):
    query = text("""
        SELECT AVG(promedio_alumno) FROM (
            SELECT AVG(nota) as promedio_alumno
            FROM "Examen"
            GROUP BY dni_alumno
        ) AS subquery
    """)
    row = db.execute(query).fetchone()
    return float(round(row[0], 2)) if row and row[0] is not None else 0.0

def get_promedio_materias(db):
    query = text("""
        SELECT nombre, AVG(nota) as promedio
        FROM "Examen"
        JOIN "Materia" ON "Examen".id_materia = "Materia".id
        GROUP BY nombre
    """)
    rows = db.execute(query).mappings().fetchall()
    return [{"nombre": row["nombre"], "promedio": float(round(row["promedio"], 2))} for row in rows]
    
