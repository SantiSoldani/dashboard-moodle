from dataclasses import dataclass

from sqlalchemy import text


@dataclass
class MateriaDto:
    id: int
    nombre: str
    coeficiente: float
    cuatrimestre: int
    notaMinima: float


def get_materias(db) -> list[MateriaDto]:

    query = text("""SELECT * FROM "Materia" ORDER BY id""")
    rows = db.execute(query).mappings().fetchall()
    # print("filas", rows)
    devuelve = [MateriaDto(**row) for row in rows]
    # print("devuelve", devuelve)
    return devuelve
