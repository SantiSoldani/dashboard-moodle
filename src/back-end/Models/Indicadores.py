from dataclasses import dataclass

from numpy import flatnonzero
from sqlalchemy import text


@dataclass
class IndicadorDTO:
    dni: str
    ic: float
    pse: float
    pep: float
    cl: float
    cv: float
    loc: float


def set_indicadores(indicador_dto: IndicadorDTO, db):

    query = text("""
        INSERT INTO "Indicadores" (dni, ic, pse, pep, cl, cv, loc)
        VALUES (:dni, :ic, :pse, :pep, :cl, :cv, :loc)
    """)
    try:
        db.execute(
            query,
            {
                "dni": indicador_dto.dni,
                "ic": indicador_dto.ic,
                "pse": indicador_dto.pse,
                "pep": indicador_dto.pep,
                "cl": indicador_dto.cl,
                "cv": indicador_dto.cv,
                "loc": indicador_dto.loc,
            },
        )
    except Exception as e:
        print(e)
