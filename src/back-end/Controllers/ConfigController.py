from types import SimpleNamespace

from Models import Indicadores, Materia


def new_pesos_iniciales(db, pesos):
    Indicadores.new_config_iniciales(db, pesos)


def new_pesos_cuatrimestrales(db, pesos):
    Indicadores.new_config_cuatrimestrales(db, pesos)


def new_pesos_materias(db, pesos):
    Materia.set_pesos(db, pesos)
