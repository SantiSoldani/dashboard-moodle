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


def post_nota(nota, db):
    print("llegue hasta aca")
    query = text(
        """INSERT INTO "Examen" (dni_alumno, id_materia, nota) VALUES  (:dni_alumno, :id_materia, :nota)"""
    )
    print(nota)
    db.execute(
        query,
        {
            "dni_alumno": nota.dni_alumno,
            "id_materia": nota.id_materia,
            "nota": nota.nota,
        },
    )
    print("termine de ejecutar")

    return


def post_notas(notas, db):
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
    query = """SELECT * FROM "Notas" """
    rows = db.execute(query).mappings().fetchall()
    return [NotasDto(**row) for row in rows]


def get_nota_by_dni(dni: str, db):
    query = """SELECT * FROM "Notas" WHERE dni = :dni"""
    row = db.execute(query, {"dni": dni}).mappings().fetchone()
    return NotasDto(**row) if row else None
