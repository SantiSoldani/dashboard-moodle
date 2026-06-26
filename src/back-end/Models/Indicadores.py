from dataclasses import dataclass
from types import SimpleNamespace

from numpy import flatnonzero
from sqlalchemy import text
from sqlalchemy.sql.selectable import elem


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


def set_indicadores_cuatrimestrales(db, objeto: SimpleNamespace):

    query = text("""
                 INSERT INTO "indicadores_cuatrimestrales" (dni, rac, rap, raf, ac) values(:dni, :rac, :raf, :ac)
                 """)
    db.execute(
        query,
        {
            "dni": objeto.dni,
            "rac": objeto.rac,
            "rap": objeto.rap,
            "ac": objeto.ac,
        },
    )

    return


def get_indicadores_cuatrimestrales(db, dni):
    try:
        query = text("""
                    SELECT ic.rap, ic.rac, ic.raf
                    FROM "indicadores_cuatrimestrales" ic
                    WHERE ic.dni_alumno = :dni
                    """)
        row = db.execute(query, {"dni": dni}).mappings().fetchone()
        if row is None:
            raise Exception("el alumno no tiene indicadores guardados")
        return SimpleNamespace(**row)
    except Exception as e:
        raise Exception(e)


def get_indicadores_iniciales(db, dni):
    try:
        query = text("""
                    SELECT i.pse, i.ic, i.pep, i.cl, i.cv, i.loc
                    FROM "Indicadores" i
                    WHERE i.dni_alumno = :dni
                    """)
        row = db.execute(query, {"dni": dni}).mappings().fetchone()
        if row is None:
            raise Exception("el alumno no tiene indicadores guardados")
        return SimpleNamespace(**row)
    except Exception as e:
        raise Exception(e)
