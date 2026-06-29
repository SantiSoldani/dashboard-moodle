from Models import Materia
from Models.Materia import MateriaDto


def get_materias(db):
    materias: list[MateriaDto] = Materia.get_materias(db)
    # print("las materias", materias)
    return materias


def get_cant_materias_acumulada(db, cuatrimestre, plan):

    obj = Materia.get_materias_del_cuatrimestre(db, cuatrimestre, plan)
    return obj.cantidad_acumulada if obj is not None else 1
