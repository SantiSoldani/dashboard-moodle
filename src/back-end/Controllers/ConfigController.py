from types import SimpleNamespace

from Models import Datos, Indicadores, Materia


def new_pesos_iniciales(db, pesos):
    Indicadores.new_config_iniciales(db, pesos)


def new_pesos_cuatrimestrales(db, pesos):
    Indicadores.new_config_cuatrimestrales(db, pesos)


def new_pesos_materias(db, pesos):
    Materia.set_pesos(db, pesos)


def export_db(db):
    return Datos.export_db(db)
