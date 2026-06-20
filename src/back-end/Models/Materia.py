from dataclasses import dataclass
from types import SimpleNamespace

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


def get_materias_del_cuatrimestre(db, cuatrimestre, plan):

    query = text(
        """SELECT cantidad_acumulada FROM "materiasXcuatrimestre" WHERE numero = :cuatrimestre AND plan = :plan"""
    )
    try:
        return SimpleNamespace ** (
            db.execute(query, {"cuatrimestre": cuatrimestre, "plan": plan})
            .mappings()
            .fetchone()
        )
    except Exception as e:
        print(e)
        return None
