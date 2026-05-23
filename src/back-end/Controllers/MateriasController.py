from Models import Materia
from Models.Materia import MateriaDto


def get_materias(db):
    materias: list[MateriaDto] = Materia.get_materias(db)
    # print("las materias", materias)
    return materias
