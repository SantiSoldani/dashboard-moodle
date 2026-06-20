from types import SimpleNamespace

from Models import Indicadores


def post_Indicadores(indicadores: list[Indicadores.IndicadorDTO], db):

    for objeto in indicadores:
        Indicadores.set_indicadores(objeto, db)

    db.commit()


def post_indicadores_cuatrimestrales(indicadores: list[SimpleNamespace], db):

    for objeto in indicadores:
        Indicadores.set_indicadores_cuatrimestrales(objeto, db)

    db.commit()
