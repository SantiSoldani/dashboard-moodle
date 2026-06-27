from types import SimpleNamespace

import server
from Controllers import ConfigController
from fastapi import APIRouter, Depends, Request
from pydantic.dataclasses import dataclass
from sqlmodel import Session
from starlette.exceptions import HTTPException

router = APIRouter(prefix="/config")


@dataclass
class Config_iniciales:
    pse: float
    ic: float
    pep: float
    cv: float
    cl: float
    loc: float


@dataclass
class Config_cuatrimestrales:
    rac: float
    rap: float


@dataclass
class config_materias:
    mate1: float
    mate2: float
    algebra1: float
    algebra2: float
    fdlq: float
    fdlp: float
    fisica: float


@router.post("/post/indicadores/iniciales", status_code=200)
async def post_iniciales(
    iniciales: Config_iniciales, db: Session = Depends(server.get_db)
):

    try:
        ConfigController.new_pesos_iniciales(
            db, SimpleNamespace(**(iniciales.__dict__))
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/post/indicadores/cuatrimestrales", status_code=200)
async def post_cuatrimestrales(
    iniciales: Config_cuatrimestrales, db: Session = Depends(server.get_db)
):

    try:
        ConfigController.new_pesos_cuatrimestrales(
            db, SimpleNamespace(**(iniciales.__dict__))
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/post/pesos/materias", status_code=200)
async def post_pesos_materias(
    pesos: config_materias, db: Session = Depends(server.get_db)
):

    try:
        ConfigController.new_pesos_materias(db, SimpleNamespace(**(pesos.__dict__)))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
