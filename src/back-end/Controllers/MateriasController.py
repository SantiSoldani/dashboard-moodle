from types import SimpleNamespace

from Models import Materia


def get_materias(db):

    return Materia.get_materias(db)
