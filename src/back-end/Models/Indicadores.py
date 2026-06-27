from dataclasses import dataclass
from types import SimpleNamespace

from numpy import flatnonzero
from sqlalchemy import text
from sqlalchemy.orm import query_expression
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
            return None
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
            return None
        return SimpleNamespace(**row)
    except Exception as e:
        raise Exception(e)


def new_config_iniciales(db, config):

    try:
        query = text(
            """INSERT INTO "Config_indicadores_iniciales" (pse, ic, pep, cl, cv, loc) VALUES(:pse, :ic, :pep, :cl, :cv, :loc) """
        )
        db.execute(query, config.__dict__)
        db.commit()

    except Exception as e:
        print(e)


def new_config_cuatrimestrales(db, config):

    try:
        query = text(
            """INSERT INTO "Config_indicadores_cuatrimestrales" (rac, rap) VALUES(:rac, :rap) """
        )

        db.execute(query, config.__dict__)
        db.commit()

    except Exception as e:
        print(e)


def get_pesos_iniciales(db):

    try:
        query = text(
            """SELECT pse, ic, pep, cl, cv, loc FROM "Config_indicadores_iniciales"
                ORDER BY created_at DESC
                LIMIT 1"""
        )

        pesos = db.execute(query).mappings().fetchone()
        return SimpleNamespace(**pesos)

    except Exception as e:
        print(e)


def get_pesos_cuatrimestrales(db):

    try:
        query = text(
            """SELECT rac, rap FROM "Config_indicadores_cuatrimestrales"
                ORDER BY created_at DESC
                LIMIT 1"""
        )

        pesos = db.execute(query).mappings().fetchone()
        return SimpleNamespace(**pesos)

    except Exception as e:
        print(e)
