from types import SimpleNamespace

from Models import Indicadores


def post_Indicadores(indicadores: list[Indicadores.IndicadorDTO], db):

    for objeto in indicadores:
        Indicadores.set_indicadores(objeto, db)

    db.commit()
