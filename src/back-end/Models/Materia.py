from dataclasses import dataclass


@dataclass
class MateriaDto:
    id: int
    nombre: str
    coeficiente: float
    cuatrimestre: int
    nota_minima: float


def get_materias(db):

    query = "SELECT * FROM materias"

    rows = db.execute(query).mappings().fetchall()
    return [MateriaDto(**row) for row in rows]
