from dataclasses import dataclass

from Alumno import AlumnoDto
from Materia import MateriaDto


@dataclass
class NotasDto:
    id: int
    materia_id: int
    nota: int
    alumno_dni: str


def post_nota(nota: NotasDto, db):

    query = "INSERT INTO notas (id, materia_id, nota, alumno_id) VALUES (?, ?, ?, ?)"
    db.execute(query, (nota.id, nota.materia_id, nota.nota, nota.alumno_dni))
    return db.commit().rowcount == 1


def get_notas(db):
    query = "SELECT * FROM notas"
    rows = db.execute(query).mappings().fetchall()
    return [NotasDto(**row) for row in rows]


def get_nota_by_dni(dni: str, db):
    query = "SELECT * FROM notas WHERE dni = ?"
    row = db.execute(query, (dni,)).mappings().fetchone()
    return NotasDto(**row) if row else None
